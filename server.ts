import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function createAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add your API key in the Settings > Secrets panel."
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const STROKE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    d: {
      type: Type.STRING,
      description:
        "Valid SVG path d attribute within viewBox 0 0 400 280 (coordinates inside x: 30..370, y: 24..256). Use concise integer M, L, C, Q, A, Z commands.",
    },
    color: {
      type: Type.STRING,
      enum: ["black", "accent", "muted"],
      description:
        "Marker ink role: 'black' for main contours, 'accent' for iconic color highlights or arrows, 'muted' for subtle shading.",
    },
    strokeWidth: {
      type: Type.NUMBER,
      description: "Stroke thickness from 2 to 6.",
    },
    annotation: {
      type: Type.BOOLEAN,
      description:
        "True if this stroke is a directional arrow, highlight circle, underline, or emphasis mark.",
    },
  },
  required: ["d", "color", "strokeWidth"],
};

const CLUE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    index: { type: Type.INTEGER },
    header: {
      type: Type.STRING,
      description:
        "Short whiteboard clue label like 'Clue 1: The Iconic Prop' (max 34 chars, never reveal the title).",
    },
    caption: {
      type: Type.STRING,
      description:
        "Punchy handwritten clue sentence shown below the drawing (max 70 chars). Must NOT contain the movie/series title.",
    },
    symbolBadge: {
      type: Type.STRING,
      enum: [
        "question",
        "lightning",
        "star",
        "heart",
        "clock",
        "eye",
        "film",
        "skull",
        "crown",
        "key",
        "fire",
        "music",
      ],
    },
    accentColor: {
      type: Type.STRING,
      enum: ["orange", "blue", "red", "green", "amber"],
    },
    calloutLabel: {
      type: Type.STRING,
      description:
        "Optional short 1-3 word marker note next to the sketch (e.g., '1985', 'Pure Blue', 'Never stops').",
    },
    calloutX: {
      type: Type.NUMBER,
      description: "X coordinate (50..350) for calloutLabel inside 400x280 box.",
    },
    calloutY: {
      type: Type.NUMBER,
      description: "Y coordinate (35..245) for calloutLabel inside 400x280 box.",
    },
    strokes: {
      type: Type.ARRAY,
      items: STROKE_SCHEMA,
      description:
        "5 to 8 clean, recognizable SVG path strokes forming a hand-drawn whiteboard illustration for this clue.",
    },
  },
  required: [
    "index",
    "header",
    "caption",
    "symbolBadge",
    "accentColor",
    "strokes",
  ],
};

const STORYBOARD_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    canonicalTitle: {
      type: Type.STRING,
      description: "Properly capitalized official title of the Movie or TV Series.",
    },
    hookHeadline: {
      type: Type.STRING,
      description:
        "Short-form intro hook like 'Can You Guess This Movie?' (max 36 chars).",
    },
    hookSubline: {
      type: Type.STRING,
      description:
        "Short subtitle under hook, e.g., '5 visual clues · Medium mode' (max 42 chars).",
    },
    releaseYear: {
      type: Type.STRING,
      description: "Release year or run years, e.g. '2010' or '2008–2013'.",
    },
    creatorOrDirector: {
      type: Type.STRING,
      description: "Director (for Movie) or Creator/Showrunner (for TV Series).",
    },
    genreLabel: {
      type: Type.STRING,
      description: "Concise 1-2 word genre like 'Sci-Fi Thriller' or 'Crime Drama'.",
    },
    revealFact: {
      type: Type.STRING,
      description:
        "One crisp fun trivia line shown on the final answer reveal card (max 80 chars).",
    },
    clues: {
      type: Type.ARRAY,
      items: CLUE_SCHEMA,
    },
  },
  required: [
    "canonicalTitle",
    "hookHeadline",
    "hookSubline",
    "releaseYear",
    "creatorOrDirector",
    "genreLabel",
    "revealFact",
    "clues",
  ],
};

function extractCleanErrorMessage(error: any): string {
  const raw = typeof error?.message === "string" ? error.message : String(error || "");
  try {
    const outer = JSON.parse(raw);
    const innerMsg = outer?.error?.message;
    if (typeof innerMsg === "string") {
      try {
        const inner = JSON.parse(innerMsg);
        if (inner?.error?.message) return String(inner.error.message);
      } catch {
        return innerMsg;
      }
    }
    if (outer?.error?.message) return String(outer.error.message);
  } catch {
    // not JSON
  }
  return raw || "Failed to generate whiteboard storyboard. Please verify your setup and retry.";
}

function isTransientHighDemandError(error: any): boolean {
  const status = Number(error?.status || error?.code || 0);
  const msg = String(error?.message || "").toLowerCase();
  return (
    status === 503 ||
    status === 502 ||
    status === 504 ||
    msg.includes("503") ||
    msg.includes("unavailable") ||
    msg.includes("high demand") ||
    msg.includes("overloaded")
  );
}

async function generateWithFallbackStream(
  ai: GoogleGenAI,
  contents: string,
  systemInstruction: string,
  schema: any,
  onStatus?: (msg: string) => void
): Promise<string> {
  const attempts: Array<{ model: string; thinkingLevel: ThinkingLevel; firstTokenMs: number }> = [
    { model: "gemini-4-hydrogen", thinkingLevel: ThinkingLevel.LOW, firstTokenMs: 10000 },
    { model: "gemini-3.1-flash-lite", thinkingLevel: ThinkingLevel.MINIMAL, firstTokenMs: 25000 },
  ];

  let lastError: any = null;

  for (let i = 0; i < attempts.length; i++) {
    const attempt = attempts[i];
    const controller = new AbortController();
    let gotFirstToken = false;
    const firstTokenTimer = setTimeout(() => {
      if (!gotFirstToken) {
        controller.abort(new Error("Model response timed out under high demand."));
      }
    }, attempt.firstTokenMs);

    try {
      let rawText = "";
      let lastClueProgress = 0;
      const stream = await ai.models.generateContentStream({
        model: attempt.model,
        contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: schema,
          thinkingConfig: { thinkingLevel: attempt.thinkingLevel },
          abortSignal: controller.signal,
        },
      });

      for await (const chunk of stream) {
        if (!gotFirstToken) {
          gotFirstToken = true;
          clearTimeout(firstTokenTimer);
        }
        rawText += chunk.text ?? "";
        if (onStatus) {
          const clueMatches = rawText.match(/"header"\s*:/g)?.length ?? 0;
          if (clueMatches > lastClueProgress) {
            lastClueProgress = clueMatches;
            onStatus(`Sketching clue ${clueMatches}...`);
          }
        }
      }

      clearTimeout(firstTokenTimer);

      if (rawText.trim()) {
        return rawText.trim();
      }
      throw new Error("Model returned an empty response.");
    } catch (err: any) {
      clearTimeout(firstTokenTimer);
      lastError = err;
      const isTimeout =
        err?.name === "AbortError" ||
        String(err?.message || "").toLowerCase().includes("timed out") ||
        String(err?.message || "").toLowerCase().includes("abort");
      if (i < attempts.length - 1 && (isTransientHighDemandError(err) || isTimeout)) {
        onStatus?.("Primary model busy, switching to fast storyboard model...");
        continue;
      }
      throw err;
    }
  }

  throw lastError;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, hasApiKey: Boolean(process.env.GEMINI_API_KEY) });
  });

  app.post("/api/generate-storyboard", async (req, res) => {
    const { title, contentType, difficulty, duration, clueCount } = req.body ?? {};
    const cleanTitle = typeof title === "string" ? title.trim() : "";

    if (!cleanTitle) {
      return res.status(400).json({ error: "Please enter a Movie or TV Series name." });
    }

    const validType = contentType === "TV Series" ? "TV Series" : "Movie";
    const validDifficulty =
      difficulty === "Easy" || difficulty === "Hard" ? difficulty : "Medium";
    const validDuration = [15, 30, 45, 60].includes(Number(duration))
      ? Number(duration)
      : 30;
    const validClueCount = Math.min(7, Math.max(3, Math.round(Number(clueCount) || 5)));

    let ai: GoogleGenAI;
    try {
      ai = createAiClient();
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || "Missing Gemini API key." });
    }

    const wantsStream = req.headers.accept?.includes("text/event-stream");
    let heartbeat: ReturnType<typeof setInterval> | null = null;

    const sendStatus = (message: string) => {
      if (wantsStream && !res.writableEnded) {
        res.write(`data: ${JSON.stringify({ type: "status", message })}\n\n`);
      }
    };

    if (wantsStream) {
      res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");
      res.flushHeaders?.();
      sendStatus("Crafting difficulty-calibrated visual clues...");
      heartbeat = setInterval(() => {
        if (!res.writableEnded) {
          res.write(`: keepalive\n\n`);
        }
      }, 2000);
    }

    const sendError = (status: number, message: string) => {
      if (heartbeat) clearInterval(heartbeat);
      if (wantsStream) {
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ type: "error", error: message })}\n\n`);
          res.end();
        }
      } else {
        res.status(status).json({ error: message });
      }
    };

    try {
      const difficultyGuidance =
        validDifficulty === "Easy"
          ? "Easy difficulty: Use unmistakable iconic props and signature visual motifs that casual viewers recognize quickly. Never write the title or main character full names."
          : validDifficulty === "Hard"
          ? "Hard difficulty: Use subtle, symbolic visual clues—obscure props, structural metaphors, and indirect plot hints for cinema/TV buffs without obvious giveaways."
          : "Medium difficulty: Progress smoothly from atmospheric setting clues early on to sharper signature props and motifs by the final clue.";

      const systemInstruction = `You are a storyboard artist and trivia writer for viral whiteboard animation guessing games on Reels, Shorts, and TikTok.

Design a ${validClueCount}-clue visual guessing game storyboard for the ${validType}: "${cleanTitle}".

CLUE RULES:
1. ${difficultyGuidance}
2. NEVER spoil the answer! Never include the title words, character proper names, or actor names in any clue header, caption, or calloutLabel.
3. Order clues from broader/intriguing (Clue 1) to sharper/more revealing (Clue ${validClueCount}).
4. Keep captions punchy and under 70 characters.

WHITEBOARD SVG RULES:
- Each clue's 'strokes' array draws progressively on a 400x280 canvas (stay inside x: 30..370, y: 24..256, centered around 200, 140).
- Use 5 to 8 clean, expressive SVG path 'd' strings per clue with concise integer coordinates (M, L, Q, C, A, Z):
  1) Main silhouette ('color': 'black', 'strokeWidth': 4)
  2) Key inner details ('color': 'black' or 'muted', 'strokeWidth': 2.5)
  3) Iconic colored highlight ('color': 'accent', 'strokeWidth': 4) picking the best accentColor ('orange', 'blue', 'red', 'green', 'amber')
  4) 1 annotation arrow or emphasis mark ('annotation': true, 'color': 'accent', 'strokeWidth': 3).`;

      const trimmed = await generateWithFallbackStream(
        ai,
        `Create a ${validClueCount}-clue whiteboard animation quiz storyboard for the ${validType} "${cleanTitle}" (${validDifficulty} difficulty, ${validDuration}s total video). Generate exactly ${validClueCount} clues numbered 1 through ${validClueCount}.`,
        systemInstruction,
        STORYBOARD_SCHEMA,
        sendStatus
      );

      if (heartbeat) clearInterval(heartbeat);

      const parsed = JSON.parse(trimmed);
      const clues = (Array.isArray(parsed.clues) ? parsed.clues : [])
        .slice(0, validClueCount)
        .map((clue: any, idx: number) => ({
          id: `clue-${idx + 1}-${Date.now()}`,
          index: idx + 1,
          header: String(clue.header || `Clue ${idx + 1}`),
          caption: String(clue.caption || ""),
          symbolBadge: clue.symbolBadge || "question",
          accentColor: clue.accentColor || "orange",
          calloutLabel: clue.calloutLabel ? String(clue.calloutLabel) : undefined,
          calloutX: typeof clue.calloutX === "number" ? clue.calloutX : undefined,
          calloutY: typeof clue.calloutY === "number" ? clue.calloutY : undefined,
          strokes: Array.isArray(clue.strokes) ? clue.strokes : [],
        }));

      const storyboardPayload = {
        title: String(parsed.canonicalTitle || cleanTitle),
        contentType: validType,
        difficulty: validDifficulty,
        duration: validDuration,
        clueCount: clues.length,
        hookHeadline: String(
          parsed.hookHeadline ||
            (validType === "Movie" ? "Can You Guess This Movie?" : "Can You Guess This Series?")
        ),
        hookSubline: String(
          parsed.hookSubline || `${clues.length} clues · ${validDifficulty} mode`
        ),
        releaseYear: String(parsed.releaseYear || ""),
        creatorOrDirector: String(parsed.creatorOrDirector || ""),
        genreLabel: String(parsed.genreLabel || validType),
        revealFact: String(parsed.revealFact || ""),
        clues,
      };

      if (wantsStream) {
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ type: "result", storyboard: storyboardPayload })}\n\n`);
          res.end();
        }
      } else {
        res.json(storyboardPayload);
      }
    } catch (error: any) {
      console.error("Storyboard generation error:", error);
      const status = Number(error?.status || 500);
      sendError(status >= 400 && status < 600 ? status : 500, extractCleanErrorMessage(error));
    }
  });

  app.post("/api/regenerate-clue", async (req, res) => {
    try {
      const { title, contentType, difficulty, clueIndex, totalClues, existingCaptions } =
        req.body ?? {};
      const cleanTitle = typeof title === "string" ? title.trim() : "";
      if (!cleanTitle) {
        return res.status(400).json({ error: "Missing title." });
      }

      const ai = createAiClient();
      const rawText = await generateWithFallbackStream(
        ai,
        `Generate a fresh, creative alternative visual clue #${clueIndex} (out of ${totalClues}) for the ${contentType} "${cleanTitle}" at ${difficulty} difficulty. Avoid duplicating these existing clue captions: ${JSON.stringify(
          existingCaptions || []
        )}. Remember: never reveal the title, use coordinates within 30..370 x 24..256, and include 5 to 8 crisp SVG strokes.`,
        "You are a whiteboard animation illustrator. Output one fresh ClueScene JSON object with clean SVG strokes in a 400x280 viewBox, never spoiling the movie/series title.",
        CLUE_SCHEMA
      );

      const clue = JSON.parse(rawText);
      return res.json({
        id: `clue-${clueIndex}-${Date.now()}`,
        index: Number(clueIndex) || 1,
        header: String(clue.header || `Clue ${clueIndex}`),
        caption: String(clue.caption || ""),
        symbolBadge: clue.symbolBadge || "question",
        accentColor: clue.accentColor || "orange",
        calloutLabel: clue.calloutLabel ? String(clue.calloutLabel) : undefined,
        calloutX: typeof clue.calloutX === "number" ? clue.calloutX : undefined,
        calloutY: typeof clue.calloutY === "number" ? clue.calloutY : undefined,
        strokes: Array.isArray(clue.strokes) ? clue.strokes : [],
      });
    } catch (error: any) {
      console.error("Clue regeneration error:", error);
      return res.status(500).json({ error: error?.message || "Failed to regenerate clue." });
    }
  });

  // Never let unknown /api/* routes fall through to HTML SPA fallback
  app.all("/api/*", (_req, res) => {
    res.status(404).json({ error: "API endpoint not found." });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Whiteboard Quiz Studio server listening on http://localhost:${PORT}`);
  });
}

startServer();
