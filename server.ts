import "dotenv/config";
import express from "express";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, "data");
const SAVED_VIDEOS_FILE = path.join(DATA_DIR, "saved-videos.json");
const SEED_VIDEOS_FILE = path.resolve(__dirname, "src/data/seedVideos.json");

interface ServerSavedVideo {
  id: string;
  createdAt: string;
  updatedAt: string;
  isSeeded?: boolean;
  storyboard: any;
}

async function readSeedVideos(): Promise<ServerSavedVideo[]> {
  try {
    if (!fs.existsSync(SEED_VIDEOS_FILE)) return [];
    const raw = await fsPromises.readFile(SEED_VIDEOS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function loadSavedVideos(): Promise<ServerSavedVideo[]> {
  try {
    await fsPromises.mkdir(DATA_DIR, { recursive: true });
    if (!fs.existsSync(SAVED_VIDEOS_FILE)) {
      const seeded = await readSeedVideos();
      await fsPromises.writeFile(SAVED_VIDEOS_FILE, JSON.stringify(seeded, null, 2), "utf8");
      return seeded;
    }
    const raw = await fsPromises.readFile(SAVED_VIDEOS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.sort(
      (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
    );
  } catch (err) {
    console.error("Failed to load saved videos:", err);
    return await readSeedVideos();
  }
}

async function writeSavedVideos(videos: ServerSavedVideo[]): Promise<void> {
  await fsPromises.mkdir(DATA_DIR, { recursive: true });
  const sorted = [...videos].sort(
    (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
  );
  await fsPromises.writeFile(SAVED_VIDEOS_FILE, JSON.stringify(sorted, null, 2), "utf8");
}

async function upsertSavedVideo(record: ServerSavedVideo): Promise<ServerSavedVideo[]> {
  const existing = await loadSavedVideos();
  const idx = existing.findIndex((v) => v.id === record.id);
  const next =
    idx >= 0
      ? existing.map((v, i) => (i === idx ? record : v))
      : [record, ...existing];
  await writeSavedVideos(next);
  return next.sort(
    (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
  );
}

async function deleteSavedVideo(id: string): Promise<ServerSavedVideo[]> {
  const existing = await loadSavedVideos();
  const next = existing.filter((v) => v.id !== id);
  await writeSavedVideos(next);
  return next;
}

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

const ILLUSTRATION_IDS = [
  "spinning_top",
  "pills",
  "flask_beaker",
  "rv_van",
  "ship_liner",
  "iceberg",
  "bat_emblem",
  "lightning_bolt",
  "glasses_scar",
  "ring_band",
  "volcano_mountain",
  "lightsaber_sword",
  "helmet_mask",
  "rocket_spacecraft",
  "black_hole_planet",
  "clock_tower",
  "sports_car",
  "bicycle",
  "moon_crescent",
  "waffle_plate",
  "monster_portal",
  "cassette_tape",
  "headphones",
  "magnifying_glass",
  "footprints",
  "crown",
  "throne_swords",
  "dragon",
  "shark_fin",
  "dinosaur",
  "umbrella",
  "mask_theater",
  "money_stack",
  "vault_safe",
  "television",
  "camera_lens",
  "newspaper",
  "airplane",
  "train_locomotive",
  "bridge_city",
  "city_skyline",
  "house_mansion",
  "island_palm",
  "desert_cactus",
  "forest_trees",
  "ocean_waves",
  "fire_flames",
  "hourglass",
  "brain_maze",
  "eye_iris",
  "skull_bones",
  "sword_shield",
  "bow_arrow",
  "trophy_cup",
  "microphone",
  "chess_piece",
  "key_lock",
  "door_portal",
  "letter_envelope",
  "book_journal",
  "prison_bars",
  "police_badge",
  "syringe_vial",
  "robot_android",
  "alien_ufo",
  "coffee_mug",
  "suitcase",
  "balloon",
  "guitar_instrument",
  "telephone",
  "ticket_stub",
  "compass",
  "heart_broken",
  "puzzle_cube",
] as const;

const CLUE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    index: { type: Type.INTEGER },
    header: {
      type: Type.STRING,
      description:
        "Short whiteboard clue header like 'Clue 1: The Desert Lab' (max 32 chars, never reveal the title).",
    },
    caption: {
      type: Type.STRING,
      description:
        "Concrete, clever trivia clue sentence shown below the sketch (max 68 chars). Must give a real, fair hint without naming the title or character proper names.",
    },
    layout: {
      type: Type.STRING,
      enum: ["single_spotlight", "pair_relation", "cause_effect", "thought_bubble"],
      description:
        "Visual composition on the whiteboard: 'pair_relation' (2 icons linked by +, ->, vs, or =), 'cause_effect' (trigger icon curving into result icon), 'thought_bubble' (person imagining primaryIcon), or 'single_spotlight' (1 giant iconic object).",
    },
    primaryIcon: {
      type: Type.STRING,
      enum: [...ILLUSTRATION_IDS],
      description:
        "Primary artist-drawn whiteboard illustration chosen strictly from the allowed list.",
    },
    secondaryIcon: {
      type: Type.STRING,
      enum: [...ILLUSTRATION_IDS],
      description:
        "Second whiteboard illustration paired with primaryIcon when layout is 'pair_relation' or 'cause_effect'. Choose a distinct icon that completes the visual story.",
    },
    connector: {
      type: Type.STRING,
      enum: ["plus", "arrow", "vs", "equals"],
      description:
        "Symbol drawn between primaryIcon and secondaryIcon in 'pair_relation' layout.",
    },
    boardNote: {
      type: Type.STRING,
      description:
        "Short 1 to 4 word handwritten punchline drawn inside the bottom of the sketch frame (e.g., '99.1% Pure', '88 MPH', 'Never Stops?'). Never put the title here.",
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
  },
  required: [
    "index",
    "header",
    "caption",
    "layout",
    "primaryIcon",
    "symbolBadge",
    "accentColor",
    "boardNote",
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

const VALID_ICON_SET = new Set<string>(ILLUSTRATION_IDS);

function normalizeClue(clue: any, idx: number) {
  const primaryIcon = VALID_ICON_SET.has(clue?.primaryIcon)
    ? clue.primaryIcon
    : "magnifying_glass";
  const secondaryIcon = VALID_ICON_SET.has(clue?.secondaryIcon)
    ? clue.secondaryIcon
    : undefined;
  let layout =
    clue?.layout === "pair_relation" ||
    clue?.layout === "cause_effect" ||
    clue?.layout === "thought_bubble" ||
    clue?.layout === "single_spotlight"
      ? clue.layout
      : secondaryIcon
      ? "pair_relation"
      : "single_spotlight";

  if ((layout === "pair_relation" || layout === "cause_effect") && !secondaryIcon) {
    layout = "single_spotlight";
  }

  return {
    id: `clue-${idx + 1}-${Date.now()}`,
    index: idx + 1,
    header: String(clue?.header || `Clue ${idx + 1}`),
    caption: String(clue?.caption || ""),
    layout,
    primaryIcon,
    secondaryIcon,
    connector:
      clue?.connector === "plus" ||
      clue?.connector === "arrow" ||
      clue?.connector === "vs" ||
      clue?.connector === "equals"
        ? clue.connector
        : "plus",
    boardNote: clue?.boardNote ? String(clue.boardNote).slice(0, 32) : undefined,
    symbolBadge: clue?.symbolBadge || "question",
    accentColor: clue?.accentColor || "orange",
  };
}

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
            onStatus(`Composing clue ${clueMatches}...`);
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

  app.get("/api/videos", async (_req, res) => {
    try {
      const videos = await loadSavedVideos();
      res.json({ videos });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to load saved videos." });
    }
  });

  app.post("/api/videos", async (req, res) => {
    try {
      const { id, createdAt, updatedAt, isSeeded, storyboard } = req.body ?? {};
      if (!storyboard || typeof storyboard.title !== "string" || !Array.isArray(storyboard.clues)) {
        return res.status(400).json({ error: "Invalid video storyboard payload." });
      }
      const now = new Date().toISOString();
      const record: ServerSavedVideo = {
        id: typeof id === "string" && id.trim() ? id.trim() : `vid-${Date.now()}`,
        createdAt: typeof createdAt === "string" ? createdAt : now,
        updatedAt: typeof updatedAt === "string" ? updatedAt : now,
        isSeeded: Boolean(isSeeded),
        storyboard,
      };
      const videos = await upsertSavedVideo(record);
      res.json({ video: record, videos });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to save video." });
    }
  });

  app.delete("/api/videos/:id", async (req, res) => {
    try {
      const videos = await deleteSavedVideo(req.params.id);
      res.json({ ok: true, videos });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to delete video." });
    }
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
      sendStatus("Designing visual clue scenes...");
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
          ? "Easy difficulty: Use the most famous, unmistakable signature props, vehicles, locations, and plot twists so viewers get an 'aha!' moment within 2–3 clues."
          : validDifficulty === "Hard"
          ? "Hard difficulty: Start with clever indirect plot mechanics, thematic pairings, or deep-cut props (Clues 1–2) before narrowing to sharper iconic hints at the end—still concrete and fair, never generic."
          : "Medium difficulty: Build a crisp funnel—Clue 1 establishes setting/premise, middle clues lock in key objects & conflicts, final clue delivers an unmistakable visual signature.";

      const systemInstruction = `You are a viral whiteboard quiz director for Instagram Reels, YouTube Shorts, and TikTok.
Your job is to craft a ${validClueCount}-clue visual guessing game for the ${validType}: "${cleanTitle}".

HOW DRAWINGS WORK (CRITICAL):
You do NOT write raw SVG coordinates. Instead, our dry-erase engine draws crisp, recognizable artist-crafted illustrations from the schema's icon enum and composes them into 4 visual storytelling layouts:
- "pair_relation": Draws primaryIcon + connector ("plus", "arrow", "vs", "equals") + secondaryIcon. IDEAL for combining two iconic elements (e.g., flask_beaker + rv_van = desert lab, ship_liner + iceberg = doomed voyage, rocket_spacecraft -> black_hole_planet = space mission, clock_tower + sports_car = time travel).
- "cause_effect": Draws primaryIcon curving via an action arrow into secondaryIcon (e.g., syringe_vial -> heart_broken, bicycle -> monster_portal, prison_bars -> key_lock).
- "thought_bubble": Draws a thinker imagining primaryIcon (great for dreams, memories, secrets, hallucinations, or obsessions).
- "single_spotlight": Draws one large framed centerpiece icon (e.g., spinning_top, ring_band, waffle_plate, bat_emblem, chess_piece).

Use "pair_relation" or "cause_effect" for MOST clues (at least 60% of clues) because two-object visual equations make 10x better charades/pictionary hints than single generic symbols!
NEVER repeat the same primaryIcon across different clues in the same quiz.

WHAT MAKES GREAT HINTS (NEVER BE VAGUE!):
1. ${difficultyGuidance}
2. BANNED VAGUE CLUES: Never write generic filler like "A dark secret hides inside", "Everything changes forever", or "Heroes must unite". Every clue MUST cite a specific plot detail, setting, occupation, vehicle, object, rule, or iconic number/quote!
3. GOOD EXAMPLES:
   - Breaking Bad: { layout: "pair_relation", primaryIcon: "flask_beaker", connector: "plus", secondaryIcon: "rv_van", boardNote: "Desert Lab", caption: "A chemistry teacher cooks inside a rolling camper." }
   - Inception: { layout: "single_spotlight", primaryIcon: "spinning_top", boardNote: "Never stops?", caption: "One tiny metal totem proves if you are still dreaming." }
   - Titanic: { layout: "pair_relation", primaryIcon: "ship_liner", connector: "vs", secondaryIcon: "iceberg", boardNote: "April 1912", caption: "An 'unsinkable' luxury liner meets frozen doom at sea." }
   - The Matrix: { layout: "thought_bubble", primaryIcon: "pills", boardNote: "Red or Blue?", caption: "Swallow one capsule to wake up from a simulated world." }
   - Back to the Future: { layout: "pair_relation", primaryIcon: "sports_car", connector: "plus", secondaryIcon: "clock_tower", boardNote: "88 MPH!", caption: "Hit top speed during a lightning storm to jump decades." }
4. NO SPOILERS: Never put any word from "${cleanTitle}", actor names, or main character proper names in header, caption, or boardNote.
5. Keep boardNote super punchy (1–4 words) and caption sharp (max 68 chars).`;

      const trimmed = await generateWithFallbackStream(
        ai,
        `Create a ${validClueCount}-clue whiteboard quiz storyboard for the ${validType} "${cleanTitle}" (${validDifficulty} difficulty, ${validDuration}s total video). Number clues 1 to ${validClueCount} in a logical progression from setting/premise to iconic signature reveal.`,
        systemInstruction,
        STORYBOARD_SCHEMA,
        sendStatus
      );

      if (heartbeat) clearInterval(heartbeat);

      const parsed = JSON.parse(trimmed);
      const clues = (Array.isArray(parsed.clues) ? parsed.clues : [])
        .slice(0, validClueCount)
        .map((clue: any, idx: number) => normalizeClue(clue, idx));

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

      const nowIso = new Date().toISOString();
      const savedRecord: ServerSavedVideo = {
        id: `vid-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: nowIso,
        updatedAt: nowIso,
        isSeeded: false,
        storyboard: storyboardPayload,
      };
      await upsertSavedVideo(savedRecord);

      if (wantsStream) {
        if (!res.writableEnded) {
          res.write(
            `data: ${JSON.stringify({
              type: "result",
              storyboard: storyboardPayload,
              savedRecord,
            })}\n\n`
          );
          res.end();
        }
      } else {
        res.json({ ...storyboardPayload, savedRecord });
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
        `Generate a fresh, vivid visual clue #${clueIndex} (out of ${totalClues}) for the ${contentType} "${cleanTitle}" at ${difficulty} difficulty. Do NOT repeat or paraphrase these existing captions: ${JSON.stringify(
          existingCaptions || []
        )}. Choose a distinct primaryIcon (and secondaryIcon when using pair_relation or cause_effect), write a punchy 1–4 word boardNote, and write a concrete spoiler-free caption (max 68 chars).`,
        "You are a whiteboard quiz visual director. Pick recognizable compositional icons from the allowed enum (preferring pair_relation or cause_effect visual equations), add a 1-4 word boardNote, and write a specific, non-vague trivia hint that never reveals the title or character proper names.",
        CLUE_SCHEMA
      );

      const clue = JSON.parse(rawText);
      return res.json(normalizeClue(clue, Math.max(0, (Number(clueIndex) || 1) - 1)));
    } catch (error: any) {
      console.error("Clue regeneration error:", error);
      return res.status(500).json({ error: extractCleanErrorMessage(error) });
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
