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
const SEED_TRACKER_FILE = path.join(DATA_DIR, ".seeded-ids.json");
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
    const seeded = await readSeedVideos();

    if (!fs.existsSync(SAVED_VIDEOS_FILE)) {
      await fsPromises.writeFile(SAVED_VIDEOS_FILE, JSON.stringify(seeded, null, 2), "utf8");
      await fsPromises.writeFile(
        SEED_TRACKER_FILE,
        JSON.stringify(seeded.map((v) => v.id), null, 2),
        "utf8"
      );
      return seeded;
    }

    const raw = await fsPromises.readFile(SAVED_VIDEOS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    const existing: ServerSavedVideo[] = Array.isArray(parsed) ? parsed : [];

    let knownSeedIds: string[] = [];
    if (fs.existsSync(SEED_TRACKER_FILE)) {
      try {
        const trackerRaw = await fsPromises.readFile(SEED_TRACKER_FILE, "utf8");
        const trackerParsed = JSON.parse(trackerRaw);
        if (Array.isArray(trackerParsed)) knownSeedIds = trackerParsed;
      } catch {
        knownSeedIds = [];
      }
    } else {
      knownSeedIds = existing.filter((v) => v.isSeeded).map((v) => v.id);
    }

    const knownSet = new Set(knownSeedIds);
    const existingIdSet = new Set(existing.map((v) => v.id));
    const newlyAddedSeeds = seeded.filter((s) => !knownSet.has(s.id) && !existingIdSet.has(s.id));

    let combined = existing;
    if (newlyAddedSeeds.length > 0 || !fs.existsSync(SEED_TRACKER_FILE)) {
      combined = [...newlyAddedSeeds, ...existing];
      const nextKnown = Array.from(new Set([...knownSeedIds, ...seeded.map((s) => s.id)]));
      await fsPromises.writeFile(SAVED_VIDEOS_FILE, JSON.stringify(combined, null, 2), "utf8");
      await fsPromises.writeFile(SEED_TRACKER_FILE, JSON.stringify(nextKnown, null, 2), "utf8");
    }

    return combined.sort(
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
  "scooter_vespa",
  "cricket_bat_ball",
  "coin_toss",
  "diya_lamp",
  "palace_arch",
  "paint_palette",
  "piano_keys",
  "gold_medal",
  "motorcycle_sidecar",
  "wedding_garland",
  "radio_transistor",
  "stethoscope",
  "mustard_field",
  "paper_kite",
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
    backdrop: {
      type: Type.STRING,
      enum: [
        "desert",
        "city_night",
        "ocean",
        "space",
        "lab",
        "forest",
        "office",
        "dungeon",
        "suburbia",
        "stage",
        "palace",
        "railway",
        "village",
      ],
      description:
        "Environmental whiteboard setting sketched softly behind the main subjects to ground the scene (use 'palace' for havelis/royal forts/weddings, 'railway' for trains/stations, 'village' for rural India/fields/cricket grounds).",
    },
    primaryIcon: {
      type: Type.STRING,
      description:
        "Primary illustration ID chosen strictly from the ALLOWED ICONS list in the instructions.",
    },
    secondaryIcon: {
      type: Type.STRING,
      description:
        "Second illustration ID from ALLOWED ICONS when layout is 'pair_relation' or 'cause_effect', or 'none' for single_spotlight/thought_bubble.",
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
        "Short 1 to 4 word handwritten punchline drawn on a sticky-note callout inside the sketch frame (e.g., 'All Izz Well!', '88 MPH', '2nd October!'). Never put the title here.",
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
    "backdrop",
    "primaryIcon",
    "secondaryIcon",
    "connector",
    "boardNote",
    "symbolBadge",
    "accentColor",
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

const VALID_BACKDROP_SET = new Set<string>([
  "desert",
  "city_night",
  "ocean",
  "space",
  "lab",
  "forest",
  "office",
  "dungeon",
  "suburbia",
  "stage",
  "palace",
  "railway",
  "village",
]);

function resolveIconId(raw: unknown, fallback?: string): string | undefined {
  if (typeof raw !== "string") return fallback;
  const cleaned = raw.trim().toLowerCase();
  if (!cleaned || cleaned === "none" || cleaned === "null") return fallback;
  if (VALID_ICON_SET.has(cleaned)) return cleaned;

  const aliases: Array<[RegExp, string]> = [
    [/scooter|vespa|moped/, "scooter_vespa"],
    [/cricket|bat|stump/, "cricket_bat_ball"],
    [/coin|toss|heads|tails/, "coin_toss"],
    [/diya|lamp|oil_lamp|candle/, "diya_lamp"],
    [/palace|haveli|fort|mahal|temple/, "palace_arch"],
    [/paint|brush|palette|art|canvas/, "paint_palette"],
    [/piano|keyboard|synth/, "piano_keys"],
    [/medal|olympic|podium/, "gold_medal"],
    [/sidecar|motorcycle|motorbike|bullet/, "motorcycle_sidecar"],
    [/wedding|garland|bride|groom|mandap|marriage/, "wedding_garland"],
    [/radio|transistor|boombox/, "radio_transistor"],
    [/stethoscope|doctor|hospital|medical/, "stethoscope"],
    [/mustard|field|farm|wheat|crop/, "mustard_field"],
    [/kite|patang/, "paper_kite"],
    [/train|railway|locomotive|station/, "train_locomotive"],
    [/guitar|mandolin|sitar/, "guitar_instrument"],
    [/envelope|letter|mail|postcard/, "letter_envelope"],
    [/book|diary|journal|notebook/, "book_journal"],
    [/money|cash|dollar|rupee|banknote/, "money_stack"],
    [/police|cop|badge|inspector/, "police_badge"],
    [/prison|jail|bars|cell/, "prison_bars"],
    [/phone|telephone|call/, "telephone"],
    [/ticket|pass|boarding/, "ticket_stub"],
    [/ring|band/, "ring_band"],
    [/top|totem|spinner/, "spinning_top"],
    [/pill|capsule/, "pills"],
    [/flask|beaker|lab|chem/, "flask_beaker"],
    [/van|camper|rv|bus/, "rv_van"],
    [/ship|boat|titanic|liner/, "ship_liner"],
    [/car|delorean|sports_car|taxi/, "sports_car"],
    [/plane|airplane|flight|jet/, "airplane"],
    [/trophy|cup|award/, "trophy_cup"],
    [/crown|king|queen|throne/, "crown"],
    [/sword|fight|weapon|gun/, "sword_shield"],
    [/heart|love|romance/, "heart_broken"],
    [/city|skyline|mumbai|delhi|gotham/, "city_skyline"],
    [/village|forest|tree/, "forest_trees"],
    [/house|home|mansion/, "house_mansion"],
    [/door|portal|gate/, "door_portal"],
    [/clock|watch|time/, "clock_tower"],
    [/eye|blind|sight|vision/, "eye_iris"],
    [/mic|sing|microphone|stage/, "microphone"],
    [/camera|photo|film|movie/, "camera_lens"],
    [/mask|clown|ghost|theater/, "mask_theater"],
  ];

  for (const [pattern, target] of aliases) {
    if (pattern.test(cleaned)) return target;
  }
  return fallback;
}

function normalizeClue(clue: any, idx: number) {
  const primaryIcon = resolveIconId(clue?.primaryIcon, "magnifying_glass")!;
  const rawSecondary = resolveIconId(clue?.secondaryIcon, undefined);
  let layout =
    clue?.layout === "pair_relation" ||
    clue?.layout === "cause_effect" ||
    clue?.layout === "thought_bubble" ||
    clue?.layout === "single_spotlight"
      ? clue.layout
      : rawSecondary
      ? "pair_relation"
      : "single_spotlight";

  const secondaryIcon =
    layout === "pair_relation" || layout === "cause_effect"
      ? rawSecondary && rawSecondary !== primaryIcon
        ? rawSecondary
        : undefined
      : undefined;

  if ((layout === "pair_relation" || layout === "cause_effect") && !secondaryIcon) {
    layout = "single_spotlight";
  }

  const backdrop = VALID_BACKDROP_SET.has(clue?.backdrop) ? clue.backdrop : undefined;

  return {
    id: `clue-${idx + 1}-${Date.now()}`,
    index: idx + 1,
    header: String(clue?.header || `Clue ${idx + 1}`),
    caption: String(clue?.caption || ""),
    layout,
    backdrop,
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

let primaryModelCooldownUntil = 0;

function isQuotaOrLimitError(error: any): boolean {
  const status = Number(error?.status || error?.code || 0);
  const msg = String(error?.message || "").toLowerCase();
  return (
    status === 429 ||
    msg.includes("429") ||
    msg.includes("resource_exhausted") ||
    msg.includes("resource exhausted") ||
    msg.includes("quota") ||
    msg.includes("rate limit") ||
    msg.includes("rate_limit") ||
    msg.includes("limit exceeded") ||
    msg.includes("too many requests")
  );
}

function isFallbackEligibleError(error: any): boolean {
  const status = Number(error?.status || error?.code || 0);
  const msg = String(error?.message || "").toLowerCase();
  return (
    isQuotaOrLimitError(error) ||
    status === 503 ||
    status === 502 ||
    status === 504 ||
    status === 500 ||
    status === 404 ||
    msg.includes("503") ||
    msg.includes("unavailable") ||
    msg.includes("high demand") ||
    msg.includes("overloaded") ||
    msg.includes("capacity")
  );
}

async function generateWithFallbackStream(
  ai: GoogleGenAI,
  contents: string,
  systemInstruction: string,
  schema: any,
  onStatus?: (msg: string) => void
): Promise<string> {
  const allAttempts: Array<{ model: string; thinkingLevel: ThinkingLevel; firstTokenMs: number }> = [
    { model: "gemini-4-hydrogen", thinkingLevel: ThinkingLevel.LOW, firstTokenMs: 10000 },
    { model: "gemini-3.1-flash-lite", thinkingLevel: ThinkingLevel.MINIMAL, firstTokenMs: 25000 },
  ];

  const primaryCoolingDown = Date.now() < primaryModelCooldownUntil;
  const attempts = primaryCoolingDown ? allAttempts.slice(1) : allAttempts;

  if (primaryCoolingDown) {
    onStatus?.("Latest model limit active — switching to previous model (gemini-3.1-flash-lite)...");
  }

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

      if (attempt.model === "gemini-4-hydrogen" && isQuotaOrLimitError(err)) {
        primaryModelCooldownUntil = Date.now() + 5 * 60 * 1000;
      }

      if (i < attempts.length - 1 && (isFallbackEligibleError(err) || isTimeout)) {
        const reason = isQuotaOrLimitError(err)
          ? "Latest model limit exceeded, switching back to previous model..."
          : "Primary model busy, switching back to previous model...";
        onStatus?.(reason);
        continue;
      }
      throw err;
    }
  }

  throw lastError;
}

async function fetchMovieFactBrief(
  ai: GoogleGenAI,
  title: string,
  contentType: "Movie" | "TV Series"
): Promise<string> {
  const primaryCoolingDown = Date.now() < primaryModelCooldownUntil;
  const modelsToTry: Array<{ model: string; thinkingLevel: ThinkingLevel }> = primaryCoolingDown
    ? [{ model: "gemini-3.1-flash-lite", thinkingLevel: ThinkingLevel.MINIMAL }]
    : [
        { model: "gemini-4-hydrogen", thinkingLevel: ThinkingLevel.LOW },
        { model: "gemini-3.1-flash-lite", thinkingLevel: ThinkingLevel.MINIMAL },
      ];

  const prompt = `Look up the ${contentType} "${title}" (including Bollywood, Hindi, Tamil, Telugu, Indian OTT web series, Hollywood, or international cinema).
Return a concise, accurate trivia & plot brief (max 220 words) containing:
1. Official title, release year/run, director or creator, and industry/genre (e.g. Bollywood Action Comedy, Hindi Crime Series, Sci-Fi Thriller).
2. 6-7 hyper-specific, unmistakable visual story details: iconic props, vehicles, costumes, locations, famous numbers/dates, songs/instruments, and memorable plot twists or iconic scenes fans immediately recognize.
3. One verified fun behind-the-scenes or box-office trivia fact.`;

  for (const attempt of modelsToTry) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(new Error("Search lookup timed out")), 7500);
    try {
      const response = await ai.models.generateContent({
        model: attempt.model,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingLevel: attempt.thinkingLevel },
          abortSignal: controller.signal,
        },
      });
      clearTimeout(timer);
      const text = response.text?.trim() || "";
      if (text) return text;
    } catch (err: any) {
      clearTimeout(timer);
      if (attempt.model === "gemini-4-hydrogen" && isQuotaOrLimitError(err)) {
        primaryModelCooldownUntil = Date.now() + 5 * 60 * 1000;
      }
      // Continue cleanly to fallback or return empty brief without failing generation
    }
  }
  return "";
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
      : 45;
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
      sendStatus("Researching film & Bollywood trivia...");
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
      const factBrief = await fetchMovieFactBrief(ai, cleanTitle, validType);
      sendStatus("Designing visual clue scenes...");

      const difficultyGuidance =
        validDifficulty === "Easy"
          ? "Easy difficulty: Use the most famous, unmistakable signature props, vehicles, locations, songs, and plot twists so viewers get an 'aha!' moment within 2–3 clues."
          : validDifficulty === "Hard"
          ? "Hard difficulty: Start with clever indirect plot mechanics, thematic pairings, or deep-cut props (Clues 1–2) before narrowing to sharper iconic hints at the end—still concrete and fair, never generic."
          : "Medium difficulty: Build a crisp funnel—Clue 1 establishes setting/premise, middle clues lock in key objects & conflicts, final clue delivers an unmistakable visual signature.";

      const allowedIconsPrompt = `ALLOWED ICONS (pick ONLY exact IDs from this list):
${ILLUSTRATION_IDS.join(", ")}`;

      const systemInstruction = `You are a viral whiteboard quiz director for Instagram Reels, YouTube Shorts, and TikTok, with deep expertise in BOTH Hollywood/Global cinema AND Bollywood / Hindi / Indian cinema & OTT web series.
Your job is to craft a ${validClueCount}-clue visual guessing game for the ${validType}: "${cleanTitle}".

${allowedIconsPrompt}

HOW DRAWINGS WORK (CRITICAL):
You do NOT write raw SVG coordinates. Instead, our dry-erase engine draws crisp, recognizable artist-crafted illustrations from ALLOWED ICONS and composes them into 4 visual storytelling layouts:
- "pair_relation": Draws primaryIcon + connector ("plus", "arrow", "vs", "equals") + secondaryIcon. IDEAL for combining two iconic elements (e.g., flask_beaker + rv_van = desert lab, scooter_vespa + wedding_garland = 3 Idiots bride escape, mustard_field -> train_locomotive = DDLJ, cricket_bat_ball vs crown = Lagaan, piano_keys + eye_iris = Andhadhun).
- "cause_effect": Draws primaryIcon curving via an action arrow into secondaryIcon (e.g., clock_tower -> gold_medal = Dangal 5 AM training, syringe_vial -> heart_broken, bicycle -> monster_portal, coin_toss -> money_stack = Scam 1992).
- "thought_bubble": Draws a thinker imagining primaryIcon (set secondaryIcon to "none").
- "single_spotlight": Draws one large framed centerpiece icon (set secondaryIcon to "none").

ENVIRONMENTAL BACKDROPS:
Always choose the most atmospheric backdrop:
- "palace": Indian palaces, havelis, royal forts, grand wedding venues (Padmaavat, Bajirao Mastani, Bhool Bhulaiyaa, DDLJ, Om Shanti Om, Mirzapur).
- "railway": Train stations, platforms, steam/express trains (DDLJ, Sholay, Jab We Met, Chennai Express, Kahaani, Harry Potter).
- "village": Rural fields, mud arenas, village streets, cricket pitches (Lagaan, Dangal, Swades, Sholay, Panchayat, Laapataa Ladies).
- Plus "desert", "city_night", "ocean", "space", "lab", "forest", "office", "dungeon", "suburbia", "stage".

BOLLYWOOD & INDIAN CINEMA MASTERY:
When the title is a Bollywood, Hindi, South Indian, or Indian OTT series, NEVER give generic Western/vague clues! Use iconic Indian cinema props, famous catchphrases (without naming characters or the title!), songs/instruments, exact dates/numbers, vehicles, and settings:
- 3 Idiots: { layout: "pair_relation", backdrop: "village", primaryIcon: "scooter_vespa", connector: "plus", secondaryIcon: "wedding_garland", boardNote: "All Izz Well!", caption: "Two friends ride a yellow scooter to steal a bride on September 5th." }
- Sholay: { layout: "single_spotlight", backdrop: "desert", primaryIcon: "coin_toss", secondaryIcon: "none", boardNote: "Heads Every Time", caption: "A rigged two-headed coin settles who stays behind on the bridge." }
- DDLJ: { layout: "pair_relation", backdrop: "railway", primaryIcon: "mustard_field", connector: "arrow", secondaryIcon: "train_locomotive", boardNote: "Ja, Live Life!", caption: "Mandolin notes in golden mustard fields lead to a running train finale." }
- Lagaan: { layout: "pair_relation", backdrop: "village", primaryIcon: "cricket_bat_ball", connector: "vs", secondaryIcon: "crown", boardNote: "Teen Guna Tax!", caption: "Villagers learn a British bat-and-ball game to erase triple taxes." }
- Andhadhun: { layout: "pair_relation", backdrop: "city_night", primaryIcon: "piano_keys", connector: "plus", secondaryIcon: "eye_iris", boardNote: "Keep Playing!", caption: "A 'blind' pianist keeps playing beside a corpse in the living room." }
- Drishyam: { layout: "pair_relation", backdrop: "suburbia", primaryIcon: "ticket_stub", connector: "plus", secondaryIcon: "police_badge", boardNote: "2nd October!", caption: "A 4th-grade dropout builds an airtight alibi using bus tickets." }
- PK: { layout: "pair_relation", backdrop: "desert", primaryIcon: "alien_ufo", connector: "plus", secondaryIcon: "radio_transistor", boardNote: "Wrong Number!", caption: "A stranded visitor clutches a yellow radio hunting his stolen remote." }
- Munna Bhai M.B.B.S.: { layout: "pair_relation", backdrop: "lab", primaryIcon: "stethoscope", connector: "plus", secondaryIcon: "heart_broken", boardNote: "Magic Hug!", caption: "A Mumbai don enters med school and cures patients with warm hugs." }
- Dangal: { layout: "cause_effect", backdrop: "village", primaryIcon: "clock_tower", connector: "arrow", secondaryIcon: "gold_medal", boardNote: "5 AM Akhada", caption: "A strict father wakes his daughters at dawn to win wrestling gold." }
- Stree: { layout: "pair_relation", backdrop: "palace", primaryIcon: "wedding_garland", connector: "vs", secondaryIcon: "door_portal", boardNote: "Kal Aana!", caption: "Townsfolk paint a warning on doors to ward off a festival-night spirit." }
- Mirzapur: { layout: "pair_relation", backdrop: "palace", primaryIcon: "crown", connector: "vs", secondaryIcon: "sword_shield", boardNote: "Purvanchal Throne", caption: "A deadly carpet empire sparks a violent war for small-town rule." }
- Scam 1992: { layout: "cause_effect", backdrop: "office", primaryIcon: "coin_toss", connector: "arrow", secondaryIcon: "money_stack", boardNote: "Risk Hai Toh...", caption: "A bold broker exploits bank loopholes to spark a 1992 stock boom." }

HOLLYWOOD & GLOBAL EXAMPLES:
- Breaking Bad: { layout: "pair_relation", backdrop: "desert", primaryIcon: "flask_beaker", connector: "plus", secondaryIcon: "rv_van", boardNote: "Desert Lab", caption: "A chemistry teacher cooks inside a rolling camper." }
- Inception: { layout: "single_spotlight", backdrop: "stage", primaryIcon: "spinning_top", secondaryIcon: "none", boardNote: "Never stops?", caption: "One tiny metal totem proves if you are still dreaming." }
- Titanic: { layout: "pair_relation", backdrop: "ocean", primaryIcon: "ship_liner", connector: "vs", secondaryIcon: "iceberg", boardNote: "April 1912", caption: "An 'unsinkable' luxury liner meets frozen doom at sea." }

RULES:
1. ${difficultyGuidance}
2. Use "pair_relation" or "cause_effect" for MOST clues (at least 60% of clues) because two-object visual equations make 10x better charades/pictionary hints than single symbols.
3. NEVER repeat the same primaryIcon across different clues in the same quiz.
4. BANNED VAGUE CLUES: Never write generic filler like "A dark secret hides inside", "Everything changes forever", or "Heroes must unite". Every clue MUST cite a specific plot detail, setting, occupation, vehicle, object, rule, or iconic number/quote!
5. NO SPOILERS: Never put any word from "${cleanTitle}", actor names, or main character proper names (no Rancho, Simran, Raj, Gabbar, Munna, Walter White, etc.) in header, caption, or boardNote.
6. Keep boardNote super punchy (1–4 words) and caption sharp (max 68 chars).`;

      const userPrompt = factBrief
        ? `Create a ${validClueCount}-clue whiteboard quiz storyboard for the ${validType} "${cleanTitle}" (${validDifficulty} difficulty, ${validDuration}s total video). Number clues 1 to ${validClueCount} in a logical progression from setting/premise to iconic signature reveal.\n\nVERIFIED FILM / SERIES FACT SHEET:\n${factBrief}`
        : `Create a ${validClueCount}-clue whiteboard quiz storyboard for the ${validType} "${cleanTitle}" (${validDifficulty} difficulty, ${validDuration}s total video). Number clues 1 to ${validClueCount} in a logical progression from setting/premise to iconic signature reveal.`;

      const trimmed = await generateWithFallbackStream(
        ai,
        userPrompt,
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
      const factBrief = await fetchMovieFactBrief(
        ai,
        cleanTitle,
        contentType === "TV Series" ? "TV Series" : "Movie"
      );
      const regenPrompt = factBrief
        ? `Generate a fresh, vivid visual clue #${clueIndex} (out of ${totalClues}) for the ${contentType} "${cleanTitle}" at ${difficulty} difficulty. Do NOT repeat or paraphrase these existing captions: ${JSON.stringify(
            existingCaptions || []
          )}. Choose a distinct primaryIcon (and secondaryIcon when using pair_relation or cause_effect) plus an accurate backdrop ('palace', 'railway', 'village', etc.), write a punchy 1–4 word boardNote, and write a concrete spoiler-free caption (max 68 chars).\n\nVERIFIED FACT SHEET:\n${factBrief}`
        : `Generate a fresh, vivid visual clue #${clueIndex} (out of ${totalClues}) for the ${contentType} "${cleanTitle}" at ${difficulty} difficulty. Do NOT repeat or paraphrase these existing captions: ${JSON.stringify(
            existingCaptions || []
          )}. Choose a distinct primaryIcon (and secondaryIcon when using pair_relation or cause_effect) plus an accurate backdrop, write a punchy 1–4 word boardNote, and write a concrete spoiler-free caption (max 68 chars).`;

      const rawText = await generateWithFallbackStream(
        ai,
        regenPrompt,
        `You are a whiteboard quiz visual director expert in both Hollywood and Bollywood / Indian cinema. Pick recognizable compositional icons ONLY from this allowed list (${ILLUSTRATION_IDS.join(
          ", "
        )}) and backdrops from the allowed enum (preferring pair_relation or cause_effect visual equations; set secondaryIcon to 'none' for single_spotlight/thought_bubble), add a 1-4 word boardNote, and write a specific, non-vague trivia hint that never reveals the title or character proper names.`,
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
