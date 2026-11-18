import {
  ClueLayout,
  ClueScene,
  ConnectorType,
  MarkerAccent,
  QuizStoryboard,
  SceneBackdrop,
  SymbolBadge,
} from "../types";
import {
  ILLUSTRATION_LIBRARY,
  IllustrationId,
  IllustrationStrokeDef,
  MarkerFillRole,
} from "./illustrationLibrary";

export const CANVAS_WIDTH = 720;
export const CANVAS_HEIGHT = 1280;

const ACCENT_HEX: Record<MarkerAccent, string> = {
  orange: "#F96921",
  blue: "#0099FF",
  red: "#DC2626",
  green: "#16A34A",
  amber: "#FFB41F",
};

const INK_BLACK = "#18181B";
const INK_MUTED = "#64748B";
const INK_BACKDROP = "#94A3B8";
const BOARD_BG = "#FDFDFB";

export interface SampledPoint {
  x: number;
  y: number;
  dist: number;
}

export interface CompiledStroke {
  points: SampledPoint[];
  totalLength: number;
  color: string;
  strokeWidth: number;
  annotation: boolean;
  fillColor?: string;
  fillAlpha?: number;
  rawPathD?: string;
  scaleX?: number;
  scaleY?: number;
  offsetX?: number;
  offsetY?: number;
}

export interface CompiledClue {
  clue: ClueScene;
  frameStrokes: CompiledStroke[];
  backdropStrokes: CompiledStroke[];
  artStrokes: CompiledStroke[];
  badgeStrokes: CompiledStroke[];
  allStrokes: CompiledStroke[];
  totalDrawLength: number;
}

export interface CompiledStoryboard {
  storyboard: QuizStoryboard;
  introStrokes: CompiledStroke[];
  introDrawLength: number;
  clues: CompiledClue[];
  countdownRingStrokes: CompiledStroke[];
  revealBurstStrokes: CompiledStroke[];
  timeline: {
    introStart: number;
    introEnd: number;
    clueWindows: Array<{ start: number; end: number }>;
    countdownStart: number;
    countdownEnd: number;
    revealStart: number;
    revealEnd: number;
  };
}

function resolveMarkerFill(
  role: MarkerFillRole | undefined,
  accentHex: string
): { color: string; alpha: number } | null {
  if (!role) return null;
  switch (role) {
    case "accentSoft":
      return { color: accentHex, alpha: 0.16 };
    case "accentMid":
      return { color: accentHex, alpha: 0.34 };
    case "warm":
      return { color: "#FDBA74", alpha: 0.3 };
    case "cool":
      return { color: "#38BDF8", alpha: 0.24 };
    case "gold":
      return { color: "#FACC15", alpha: 0.32 };
    case "emerald":
      return { color: "#22C55E", alpha: 0.24 };
    case "crimson":
      return { color: "#EF4444", alpha: 0.26 };
    case "slate":
      return { color: "#334155", alpha: 0.2 };
    case "smoke":
      return { color: "#E2E8F0", alpha: 0.42 };
    default:
      return null;
  }
}

const SYMBOL_PATHS: Record<SymbolBadge, string[]> = {
  question: [
    "M 18 22 C 18 10, 42 10, 42 22 C 42 31, 30 31, 30 40",
    "M 30 49 L 30 52",
  ],
  lightning: ["M 34 8 L 16 32 L 29 32 L 24 54 L 44 28 L 31 28 Z"],
  star: [
    "M 30 8 L 36 22 L 52 24 L 40 34 L 43 50 L 30 42 L 17 50 L 20 34 L 8 24 L 24 22 Z",
  ],
  heart: [
    "M 30 50 C 12 36, 8 20, 18 13 C 25 8, 30 15, 30 19 C 30 15, 35 8, 42 13 C 52 20, 48 36, 30 50 Z",
  ],
  clock: [
    "M 30 9 A 21 21 0 1 1 29.9 9 Z",
    "M 30 17 L 30 30 L 40 35",
  ],
  eye: [
    "M 8 30 Q 30 10 52 30 Q 30 50 8 30 Z",
    "M 30 22 A 8 8 0 1 1 29.9 22 Z",
  ],
  film: [
    "M 10 14 L 50 14 L 50 46 L 10 46 Z",
    "M 10 24 L 50 24",
    "M 20 14 L 26 24",
    "M 34 14 L 40 24",
  ],
  skull: [
    "M 16 34 C 14 18, 46 18, 44 34 L 40 42 L 40 50 L 20 50 L 20 42 Z",
    "M 24 31 A 3 3 0 1 1 23.9 31 Z",
    "M 36 31 A 3 3 0 1 1 35.9 31 Z",
  ],
  crown: [
    "M 10 44 L 14 18 L 24 30 L 30 14 L 36 30 L 46 18 L 50 44 Z",
    "M 10 48 L 50 48",
  ],
  key: [
    "M 20 20 A 9 9 0 1 1 19.9 20 Z",
    "M 26 26 L 48 48",
    "M 40 40 L 46 34",
    "M 45 45 L 51 39",
  ],
  fire: [
    "M 30 8 C 42 20, 48 34, 38 48 C 34 52, 24 52, 20 46 C 12 36, 18 22, 26 16 C 26 24, 32 24, 30 8 Z",
  ],
  music: [
    "M 22 44 L 22 14 L 44 10 L 44 40",
    "M 16 44 A 6 4 0 1 1 15.9 44 Z",
    "M 38 40 A 6 4 0 1 1 37.9 40 Z",
  ],
};

function sampleSvgPath(
  d: string,
  scaleX = 1,
  scaleY = 1,
  offsetX = 0,
  offsetY = 0,
  step = 4
): SampledPoint[] {
  if (typeof document === "undefined" || !d || !d.trim()) return [];
  try {
    const svgNS = "http://www.w3.org/2000/svg";
    const pathEl = document.createElementNS(svgNS, "path");
    pathEl.setAttribute("d", d);
    const rawLen = pathEl.getTotalLength();
    if (!Number.isFinite(rawLen) || rawLen <= 0.5) return [];

    const count = Math.max(4, Math.min(280, Math.ceil(rawLen / step)));
    const pts: SampledPoint[] = [];
    let accum = 0;

    for (let i = 0; i <= count; i++) {
      const pt = pathEl.getPointAtLength((rawLen * i) / count);
      const sx = pt.x * scaleX + offsetX;
      const sy = pt.y * scaleY + offsetY;
      if (i > 0) {
        const prev = pts[pts.length - 1];
        const segLen = Math.hypot(sx - prev.x, sy - prev.y);
        accum += segLen > 45 ? 2 : segLen;
      }
      pts.push({ x: sx, y: sy, dist: accum });
    }
    return pts;
  } catch {
    return [];
  }
}

function buildStroke(
  d: string,
  color: string,
  strokeWidth: number,
  scaleX = 1,
  scaleY = 1,
  offsetX = 0,
  offsetY = 0,
  annotation = false,
  fillSpec?: { color: string; alpha: number } | null
): CompiledStroke | null {
  const points = sampleSvgPath(d, scaleX, scaleY, offsetX, offsetY);
  if (points.length < 2) return null;
  return {
    points,
    totalLength: points[points.length - 1].dist,
    color,
    strokeWidth,
    annotation,
    fillColor: fillSpec?.color,
    fillAlpha: fillSpec?.alpha,
    rawPathD: fillSpec ? d : undefined,
    scaleX,
    scaleY,
    offsetX,
    offsetY,
  };
}

function compileLibraryIcon(
  iconId: IllustrationId | undefined,
  accentHex: string,
  scale: number,
  offsetX: number,
  offsetY: number
): CompiledStroke[] {
  const defs: IllustrationStrokeDef[] =
    (iconId && ILLUSTRATION_LIBRARY[iconId]) || ILLUSTRATION_LIBRARY.magnifying_glass;
  return defs
    .map((def) => {
      const strokeHex =
        def.role === "accent"
          ? accentHex
          : def.role === "detail"
          ? INK_MUTED
          : INK_BLACK;
      const w = (def.width || 4) * Math.max(0.85, Math.min(1.2, scale * 0.82));
      const fillSpec = resolveMarkerFill(def.fill, accentHex);
      return buildStroke(def.d, strokeHex, w, scale, scale, offsetX, offsetY, false, fillSpec);
    })
    .filter((s): s is CompiledStroke => s !== null);
}

function inferBackdrop(clue: ClueScene): SceneBackdrop {
  if (clue.backdrop) return clue.backdrop;
  const icons = `${clue.primaryIcon || ""} ${clue.secondaryIcon || ""}`;
  if (/train_locomotive|ticket_stub/.test(icons)) return "railway";
  if (/palace_arch|diya_lamp|wedding_garland|crown|throne/.test(icons)) return "palace";
  if (/mustard_field|cricket_bat_ball|scooter_vespa|paper_kite/.test(icons)) return "village";
  if (/flask|syringe|pills|brain|stethoscope/.test(icons)) return "lab";
  if (/rv_van|desert|motorcycle_sidecar/.test(icons)) return "desert";
  if (/ship|iceberg|shark|ocean|island/.test(icons)) return "ocean";
  if (/rocket|black_hole|alien/.test(icons)) return "space";
  if (/forest|dragon|dinosaur|bicycle/.test(icons)) return "forest";
  if (/bat|city|bridge|vault|police|prison/.test(icons)) return "city_night";
  if (/television|puzzle|coffee|newspaper|radio_transistor/.test(icons)) return "office";
  if (/sword|skull|volcano/.test(icons)) return "dungeon";
  if (/waffle|house|balloon|clock_tower|sports_car|paint_palette|piano_keys/.test(icons))
    return "suburbia";
  return "stage";
}

function compileBackdropStrokes(backdrop: SceneBackdrop, accentHex: string): CompiledStroke[] {
  const specs: Array<{
    d: string;
    color: string;
    w: number;
    fill?: { color: string; alpha: number };
  }> = [];

  switch (backdrop) {
    case "desert":
      specs.push(
        { d: "M 72 628 Q 180 578 300 618 Q 440 568 560 606 L 648 614", color: INK_BACKDROP, w: 2.5 },
        { d: "M 136 594 L 154 554 L 194 554 L 210 598", color: INK_BACKDROP, w: 2 },
        { d: "M 498 594 L 516 558 L 566 558 L 584 606", color: INK_BACKDROP, w: 2 },
        {
          d: "M 556 324 A 24 24 0 1 1 555.9 324 Z",
          color: "#F59E0B",
          w: 2.5,
          fill: { color: "#FDE047", alpha: 0.24 },
        },
        { d: "M 92 344 Q 112 332 132 342 Q 148 332 164 344", color: INK_BACKDROP, w: 2 }
      );
      break;
    case "city_night":
      specs.push(
        {
          d: "M 82 630 L 82 478 L 128 478 L 128 630 M 136 630 L 136 432 L 192 432 L 192 630 M 528 630 L 528 446 L 584 446 L 584 630 M 592 630 L 592 492 L 638 492 L 638 630",
          color: INK_BACKDROP,
          w: 2.2,
          fill: { color: "#64748B", alpha: 0.1 },
        },
        { d: "M 152 332 L 158 332 M 155 329 L 155 335 M 536 338 L 542 338 M 539 335 L 539 341", color: "#F59E0B", w: 2.5 },
        { d: "M 72 630 L 648 630", color: INK_BACKDROP, w: 2.5 }
      );
      break;
    case "ocean":
      specs.push(
        {
          d: "M 72 586 Q 150 568 230 586 T 390 586 T 550 586 T 648 586 L 648 642 L 72 642 Z",
          color: "#38BDF8",
          w: 2.5,
          fill: { color: "#38BDF8", alpha: 0.12 },
        },
        { d: "M 106 364 Q 140 342 174 358 Q 202 346 226 364", color: INK_BACKDROP, w: 2 },
        { d: "M 480 344 Q 504 334 522 346", color: INK_BACKDROP, w: 2 }
      );
      break;
    case "space":
      specs.push(
        { d: "M 92 356 Q 360 286 628 362", color: INK_BACKDROP, w: 2 },
        { d: "M 108 424 L 120 424 M 114 418 L 114 430 M 596 392 L 608 392 M 602 386 L 602 398 M 148 594 L 158 594 M 153 589 L 153 599 M 566 576 L 576 576 M 571 571 L 571 581", color: accentHex, w: 2.5 },
        { d: "M 534 328 A 14 14 0 1 1 533.9 328 Z", color: INK_BACKDROP, w: 2, fill: { color: accentHex, alpha: 0.14 } }
      );
      break;
    case "lab":
      specs.push(
        { d: "M 72 622 L 648 622", color: INK_BACKDROP, w: 2.5 },
        { d: "M 104 336 L 240 336 M 104 378 L 220 378 M 480 336 L 616 336", color: INK_BACKDROP, w: 2 },
        { d: "M 326 286 L 394 286 L 414 316 L 306 316 Z", color: INK_BACKDROP, w: 2, fill: { color: "#FACC15", alpha: 0.14 } },
        { d: "M 118 336 L 118 312 L 132 312 L 132 336 M 154 336 L 154 306 L 168 306 L 168 336", color: INK_BACKDROP, w: 2 }
      );
      break;
    case "forest":
      specs.push(
        {
          d: "M 72 624 L 106 544 L 132 588 L 162 528 L 194 606 L 532 606 L 564 532 L 594 584 L 622 544 L 648 624",
          color: INK_BACKDROP,
          w: 2.2,
          fill: { color: "#22C55E", alpha: 0.1 },
        },
        { d: "M 118 352 Q 130 342 142 352 Q 154 342 166 352", color: INK_BACKDROP, w: 2 }
      );
      break;
    case "office":
      specs.push(
        { d: "M 72 624 L 648 624", color: INK_BACKDROP, w: 2.5 },
        { d: "M 112 316 L 236 316 L 236 328 L 112 328 Z M 484 316 L 608 316 L 608 328 L 484 328 Z", color: INK_BACKDROP, w: 2, fill: { color: "#E2E8F0", alpha: 0.4 } },
        { d: "M 86 436 L 86 624 M 634 436 L 634 624", color: INK_BACKDROP, w: 2 }
      );
      break;
    case "dungeon":
      specs.push(
        { d: "M 82 326 L 146 326 L 146 356 L 82 356 Z M 552 342 L 624 342 L 624 374 L 552 374 Z", color: INK_BACKDROP, w: 2, fill: { color: "#64748B", alpha: 0.12 } },
        { d: "M 72 632 L 648 632", color: INK_BACKDROP, w: 2.5 },
        { d: "M 70 290 L 122 332 M 70 290 L 92 348", color: INK_BACKDROP, w: 1.8 }
      );
      break;
    case "suburbia":
      specs.push(
        { d: "M 72 624 L 648 624", color: INK_BACKDROP, w: 2.5 },
        { d: "M 84 624 L 84 576 L 100 562 L 116 576 L 116 624 M 132 624 L 132 576 L 148 562 L 164 576 L 164 624", color: INK_BACKDROP, w: 2 },
        { d: "M 548 560 L 584 528 L 620 560 L 620 624 L 548 624 Z", color: INK_BACKDROP, w: 2, fill: { color: "#FDBA74", alpha: 0.14 } }
      );
      break;
    case "palace":
      specs.push(
        {
          d: "M 74 628 L 74 364 Q 140 296 206 364 L 206 628 M 514 628 L 514 364 Q 580 296 646 364 L 646 628",
          color: INK_BACKDROP,
          w: 2.2,
          fill: { color: "#FDBA74", alpha: 0.14 },
        },
        {
          d: "M 140 318 C 154 294, 168 294, 182 318 M 538 318 C 552 294, 566 294, 580 318",
          color: "#F59E0B",
          w: 2,
        },
        { d: "M 140 364 L 140 398 M 580 364 L 580 398", color: "#F59E0B", w: 2 },
        { d: "M 72 628 L 648 628", color: INK_BACKDROP, w: 2.5 }
      );
      break;
    case "railway":
      specs.push(
        { d: "M 72 630 L 648 630 M 72 608 L 648 608", color: INK_BACKDROP, w: 2.4 },
        {
          d: "M 104 608 L 122 630 M 164 608 L 182 630 M 224 608 L 242 630 M 478 608 L 496 630 M 538 608 L 556 630 M 598 608 L 616 630",
          color: INK_BACKDROP,
          w: 2,
        },
        {
          d: "M 92 318 L 216 318 L 216 356 L 92 356 Z M 154 288 L 154 318",
          color: INK_BACKDROP,
          w: 2,
          fill: { color: "#FACC15", alpha: 0.18 },
        },
        {
          d: "M 548 310 A 18 18 0 1 1 547.9 310 Z M 548 318 L 548 328 L 558 328",
          color: INK_BACKDROP,
          w: 2,
          fill: { color: "#FFFFFF", alpha: 0.6 },
        },
        { d: "M 80 420 Q 112 370 156 382", color: INK_BACKDROP, w: 1.8 }
      );
      break;
    case "village":
      specs.push(
        {
          d: "M 72 624 Q 200 572 340 612 Q 480 568 648 618 L 648 642 L 72 642 Z",
          color: "#22C55E",
          w: 2.2,
          fill: { color: "#FACC15", alpha: 0.14 },
        },
        {
          d: "M 518 604 L 518 548 L 578 548 L 578 604 M 506 548 L 548 518 L 590 548 Z",
          color: INK_BACKDROP,
          w: 2,
          fill: { color: "#FDBA74", alpha: 0.16 },
        },
        { d: "M 136 332 A 22 22 0 1 1 135.9 332 Z", color: "#F59E0B", w: 2.2, fill: { color: "#FDE047", alpha: 0.2 } },
        { d: "M 92 376 Q 116 364 140 374 Q 160 364 180 376", color: INK_BACKDROP, w: 1.8 }
      );
      break;
    case "stage":
    default:
      specs.push(
        {
          d: "M 180 286 L 86 636 L 634 636 L 540 286 Z",
          color: "#E2E8F0",
          w: 1.8,
          fill: { color: "#FACC15", alpha: 0.08 },
        },
        { d: "M 92 634 L 628 634", color: INK_BACKDROP, w: 2.5 }
      );
      break;
  }

  return specs
    .map((s) => buildStroke(s.d, s.color, s.w, 1, 1, 0, 0, false, s.fill))
    .filter((s): s is CompiledStroke => s !== null);
}

function compileConnectorStrokes(
  connector: ConnectorType | undefined,
  accentHex: string,
  cx: number,
  cy: number
): CompiledStroke[] {
  const kind = connector || "plus";
  const raw: Array<{ d: string; w: number; color: string; fill?: { color: string; alpha: number } }> = [];

  if (kind === "plus") {
    raw.push(
      {
        d: `M ${cx} ${cy - 30} A 30 30 0 1 1 ${cx - 0.1} ${cy - 30} Z`,
        w: 3,
        color: accentHex,
        fill: { color: accentHex, alpha: 0.16 },
      },
      { d: `M ${cx - 16} ${cy} L ${cx + 16} ${cy}`, w: 5.5, color: INK_BLACK },
      { d: `M ${cx} ${cy - 16} L ${cx} ${cy + 16}`, w: 5.5, color: INK_BLACK }
    );
  } else if (kind === "arrow") {
    raw.push(
      { d: `M ${cx - 34} ${cy + 4} Q ${cx} ${cy - 18} ${cx + 28} ${cy + 2}`, w: 5.5, color: accentHex },
      { d: `M ${cx + 12} ${cy - 14} L ${cx + 32} ${cy + 2} L ${cx + 12} ${cy + 18}`, w: 5.5, color: accentHex },
      { d: `M ${cx - 26} ${cy - 12} L ${cx - 12} ${cy - 14}`, w: 3, color: INK_MUTED }
    );
  } else if (kind === "equals") {
    raw.push(
      {
        d: `M ${cx - 28} ${cy - 24} L ${cx + 28} ${cy - 24} L ${cx + 28} ${cy + 24} L ${cx - 28} ${cy + 24} Z`,
        w: 2.5,
        color: accentHex,
        fill: { color: accentHex, alpha: 0.14 },
      },
      { d: `M ${cx - 18} ${cy - 9} L ${cx + 18} ${cy - 9}`, w: 5.5, color: INK_BLACK },
      { d: `M ${cx - 18} ${cy + 9} L ${cx + 18} ${cy + 9}`, w: 5.5, color: INK_BLACK }
    );
  } else {
    raw.push(
      { d: `M ${cx + 8} ${cy - 44} L ${cx - 10} ${cy - 2} L ${cx + 6} ${cy - 2} L ${cx - 12} ${cy + 42}`, w: 4, color: accentHex },
      { d: `M ${cx - 28} ${cy - 16} L ${cx - 16} ${cy + 16} L ${cx - 4} ${cy - 16}`, w: 5, color: INK_BLACK },
      {
        d: `M ${cx + 26} ${cy - 12} C ${cx + 8} ${cy - 20}, ${cx + 6} ${cy}, ${cx + 18} ${cy} C ${cx + 28} ${cy}, ${cx + 26} ${cy + 18}, ${cx + 6} ${cy + 14}`,
        w: 5,
        color: INK_BLACK,
      }
    );
  }

  return raw
    .map((s) => buildStroke(s.d, s.color, s.w, 1, 1, 0, 0, true, s.fill))
    .filter((s): s is CompiledStroke => s !== null);
}

function compileCompositionalArt(
  clue: ClueScene,
  accentHex: string
): CompiledStroke[] {
  const layout: ClueLayout =
    clue.layout || (clue.secondaryIcon ? "pair_relation" : "single_spotlight");

  if (!clue.primaryIcon && clue.strokes && clue.strokes.length > 0) {
    return clue.strokes
      .map((s) => {
        const strokeHex =
          s.color === "accent" ? accentHex : s.color === "muted" ? INK_MUTED : INK_BLACK;
        const width = Math.min(8, Math.max(2.5, (s.strokeWidth || 3.5) * 1.25));
        return buildStroke(s.d, strokeHex, width, 1.4, 1.4, 80, 315, Boolean(s.annotation));
      })
      .filter((s): s is CompiledStroke => s !== null);
  }

  const out: CompiledStroke[] = [];

  if (layout === "pair_relation" && clue.secondaryIcon) {
    out.push(...compileLibraryIcon(clue.primaryIcon, accentHex, 1.26, 70, 360));
    out.push(...compileConnectorStrokes(clue.connector, accentHex, 360, 486));
    out.push(...compileLibraryIcon(clue.secondaryIcon, accentHex, 1.26, 398, 360));
  } else if (layout === "cause_effect" && clue.secondaryIcon) {
    out.push(...compileLibraryIcon(clue.primaryIcon, accentHex, 1.18, 76, 316));
    const arrow = [
      buildStroke("M 318 408 Q 422 376 440 462", accentHex, 5.5, 1, 1, 0, 0, true),
      buildStroke("M 422 446 L 442 466 L 458 442", accentHex, 5.5, 1, 1, 0, 0, true),
      buildStroke("M 352 384 L 372 380", INK_MUTED, 3, 1, 1, 0, 0, true),
    ].filter((s): s is CompiledStroke => s !== null);
    out.push(...arrow);
    out.push(...compileLibraryIcon(clue.secondaryIcon, accentHex, 1.18, 396, 452));
  } else if (layout === "thought_bubble") {
    const thinker = [
      buildStroke("M 156 446 A 32 32 0 1 1 155.9 446 Z", INK_BLACK, 5, 1, 1, 0, 0, false, {
        color: "#FDE68A",
        alpha: 0.35,
      }),
      buildStroke("M 130 460 C 138 432, 178 432, 186 456", INK_BLACK, 4.5),
      buildStroke("M 164 476 A 3 3 0 1 1 163.9 476 Z M 176 476 A 3 3 0 1 1 175.9 476 Z", INK_BLACK, 3),
      buildStroke("M 100 634 C 102 554, 210 554, 212 634 Z", INK_BLACK, 5, 1, 1, 0, 0, false, {
        color: accentHex,
        alpha: 0.22,
      }),
      buildStroke("M 176 520 L 184 562 L 160 562", INK_BLACK, 4),
      buildStroke("M 224 474 A 9 9 0 1 1 223.9 474 Z", accentHex, 3.5, 1, 1, 0, 0, true, {
        color: accentHex,
        alpha: 0.2,
      }),
      buildStroke("M 250 446 A 14 14 0 1 1 249.9 446 Z", accentHex, 3.5, 1, 1, 0, 0, true, {
        color: accentHex,
        alpha: 0.2,
      }),
      buildStroke(
        "M 316 326 C 344 298, 412 298, 444 324 C 494 310, 558 338, 560 378 C 612 388, 628 446, 598 492 C 616 538, 574 584, 520 578 C 488 610, 416 612, 380 582 C 322 592, 272 554, 288 506 C 254 472, 268 402, 308 388 C 296 362, 300 340, 316 326 Z",
        INK_BLACK,
        4.5,
        1,
        1,
        0,
        0,
        false,
        { color: "#FFFFFF", alpha: 0.72 }
      ),
    ].filter((s): s is CompiledStroke => s !== null);
    out.push(...thinker);
    out.push(...compileLibraryIcon(clue.primaryIcon, accentHex, 1.24, 318, 336));
  } else {
    out.push(...compileLibraryIcon(clue.primaryIcon, accentHex, 1.72, 188, 314));
    const spotlight = [
      buildStroke("M 134 350 L 134 312 L 172 312", accentHex, 5, 1, 1, 0, 0, true),
      buildStroke("M 548 312 L 586 312 L 586 350", accentHex, 5, 1, 1, 0, 0, true),
      buildStroke("M 134 612 L 134 650 L 172 650", accentHex, 5, 1, 1, 0, 0, true),
      buildStroke("M 548 650 L 586 650 L 586 612", accentHex, 5, 1, 1, 0, 0, true),
    ].filter((s): s is CompiledStroke => s !== null);
    out.push(...spotlight);
  }

  return out;
}

export function compileStoryboard(storyboard: QuizStoryboard): CompiledStoryboard {
  const isMovie = storyboard.contentType === "Movie";

  const introRaw: Array<{
    d: string;
    color: string;
    w: number;
    fill?: { color: string; alpha: number };
  }> = isMovie
    ? [
        {
          d: "M 40 80 L 240 80 L 240 210 L 40 210 Z",
          color: INK_BLACK,
          w: 6,
          fill: { color: "#334155", alpha: 0.14 },
        },
        {
          d: "M 40 80 L 235 35 L 244 65 L 49 110 Z",
          color: ACCENT_HEX.orange,
          w: 5,
          fill: { color: ACCENT_HEX.orange, alpha: 0.25 },
        },
        { d: "M 80 71 L 98 99", color: INK_BLACK, w: 4 },
        { d: "M 130 60 L 148 88", color: INK_BLACK, w: 4 },
        { d: "M 180 48 L 198 76", color: INK_BLACK, w: 4 },
        {
          d: "M 118 122 L 172 150 L 118 178 Z",
          color: ACCENT_HEX.blue,
          w: 5,
          fill: { color: ACCENT_HEX.blue, alpha: 0.28 },
        },
      ]
    : [
        {
          d: "M 45 75 L 235 75 L 235 205 L 45 205 Z",
          color: INK_BLACK,
          w: 6,
          fill: { color: "#334155", alpha: 0.14 },
        },
        {
          d: "M 65 95 L 195 95 L 195 185 L 65 185 Z",
          color: ACCENT_HEX.orange,
          w: 4,
          fill: { color: "#38BDF8", alpha: 0.22 },
        },
        { d: "M 140 75 L 105 28", color: INK_BLACK, w: 4 },
        { d: "M 140 75 L 175 28", color: INK_BLACK, w: 4 },
        { d: "M 215 112 A 7 7 0 1 1 214.9 112 Z", color: ACCENT_HEX.orange, w: 4 },
        { d: "M 215 142 A 7 7 0 1 1 214.9 142 Z", color: INK_BLACK, w: 4 },
        {
          d: "M 110 120 L 155 140 L 110 160 Z",
          color: ACCENT_HEX.blue,
          w: 4,
          fill: { color: ACCENT_HEX.blue, alpha: 0.26 },
        },
      ];

  const introStrokes = introRaw
    .map((s) => buildStroke(s.d, s.color, s.w, 1.35, 1.35, 171, 286, false, s.fill))
    .filter((s): s is CompiledStroke => s !== null);

  const introDrawLength = introStrokes.reduce((acc, s) => acc + s.totalLength, 0);

  const clues: CompiledClue[] = storyboard.clues.map((clue) => {
    const accentHex = ACCENT_HEX[clue.accentColor] || ACCENT_HEX.orange;

    const frameStrokes: CompiledStroke[] = [
      buildStroke(
        "M 56 278 Q 360 272 664 279 Q 670 508 662 732 Q 360 740 58 732 Q 50 508 56 278 Z",
        INK_BLACK,
        3.5,
        1,
        1,
        0,
        0,
        false,
        { color: "#FFFFFF", alpha: 0.68 }
      ),
      buildStroke(
        "M 46 296 L 94 264 L 106 280 L 58 312 Z",
        "#D97706",
        2,
        1,
        1,
        0,
        0,
        false,
        { color: "#FDE68A", alpha: 0.65 }
      ),
      buildStroke(
        "M 624 264 L 674 294 L 662 310 L 612 280 Z",
        "#D97706",
        2,
        1,
        1,
        0,
        0,
        false,
        { color: "#FDE68A", alpha: 0.65 }
      ),
    ].filter((s): s is CompiledStroke => s !== null);

    const backdrop = inferBackdrop(clue);
    const backdropStrokes = compileBackdropStrokes(backdrop, accentHex);
    const artStrokes = compileCompositionalArt(clue, accentHex);

    const badgeRaw = SYMBOL_PATHS[clue.symbolBadge] || SYMBOL_PATHS.question;
    const badgeStrokes = badgeRaw
      .map((d) => buildStroke(d, accentHex, 3.8, 0.9, 0.9, 596, 294, true))
      .filter((s): s is CompiledStroke => s !== null);

    const allStrokes = [...frameStrokes, ...backdropStrokes, ...artStrokes, ...badgeStrokes];
    const totalDrawLength = allStrokes.reduce((acc, s) => acc + s.totalLength, 0);

    return {
      clue,
      frameStrokes,
      backdropStrokes,
      artStrokes,
      badgeStrokes,
      allStrokes,
      totalDrawLength,
    };
  });

  const countdownRingStrokes = [
    buildStroke(
      "M 360 440 A 135 135 0 1 1 359.8 440",
      ACCENT_HEX.orange,
      8,
      1,
      1,
      0,
      0,
      false,
      { color: ACCENT_HEX.orange, alpha: 0.08 }
    ),
  ].filter((s): s is CompiledStroke => s !== null);

  const revealBurstRaw = [
    "M 360 190 L 360 150",
    "M 245 215 L 215 185",
    "M 475 215 L 505 185",
    "M 185 315 L 145 305",
    "M 535 315 L 575 305",
    "M 120 510 Q 360 495 600 510",
  ];
  const revealBurstStrokes = revealBurstRaw
    .map((d, i) =>
      buildStroke(d, i % 2 === 0 ? ACCENT_HEX.orange : ACCENT_HEX.amber, 5.5, 1, 1, 0, 0, true)
    )
    .filter((s): s is CompiledStroke => s !== null);

  const { introEnd, countdownStart, revealStart } = computeTimelineBounds(
    storyboard.duration
  );

  const cluesSpan = countdownStart - introEnd;
  const perClue = clues.length > 0 ? cluesSpan / clues.length : cluesSpan;
  const clueWindows = clues.map((_, i) => ({
    start: introEnd + i * perClue,
    end: introEnd + (i + 1) * perClue,
  }));

  return {
    storyboard,
    introStrokes,
    introDrawLength,
    clues,
    countdownRingStrokes,
    revealBurstStrokes,
    timeline: {
      introStart: 0,
      introEnd,
      clueWindows,
      countdownStart,
      countdownEnd: revealStart,
      revealStart,
      revealEnd: storyboard.duration,
    },
  };
}

export function computeTimelineBounds(totalDur: number) {
  const introEnd = totalDur <= 15 ? 1.4 : totalDur <= 30 ? 2.6 : totalDur <= 45 ? 3.5 : 4.0;
  const revealDur = totalDur <= 15 ? 2.1 : totalDur <= 30 ? 3.6 : 4.5;
  const revealStart = totalDur - revealDur;
  const countdownStart = Math.max(introEnd + 1, revealStart - 5.0);
  return { introEnd, countdownStart, revealStart };
}

function drawStrokePolygonFill(
  ctx: CanvasRenderingContext2D,
  stroke: CompiledStroke,
  alphaScale: number
) {
  if (!stroke.fillColor || !stroke.fillAlpha || stroke.points.length < 3 || alphaScale <= 0) {
    return;
  }
  ctx.save();
  ctx.globalAlpha = stroke.fillAlpha * Math.min(1, alphaScale);
  ctx.fillStyle = stroke.fillColor;
  ctx.beginPath();
  const pts = stroke.points;
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const jump = Math.hypot(curr.x - prev.x, curr.y - prev.y);
    if (jump > 45) {
      ctx.moveTo(curr.x, curr.y);
    } else {
      ctx.lineTo(curr.x, curr.y);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPartialStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: CompiledStroke[],
  progress: number
): { tipX: number; tipY: number; tipColor: string } | null {
  const totalLen = strokes.reduce((acc, s) => acc + s.totalLength, 0);
  if (totalLen <= 0 || progress <= 0) return null;

  const targetDist = totalLen * Math.min(1, Math.max(0, progress));

  // Pass 1: Watercolor marker washes appear smoothly once each shape's outline is mostly drawn
  let fillCovered = 0;
  for (const stroke of strokes) {
    if (fillCovered >= targetDist) break;
    const remaining = targetDist - fillCovered;
    const strokeRatio = Math.min(1, remaining / Math.max(1, stroke.totalLength));
    if (strokeRatio >= 0.45 && stroke.fillColor) {
      drawStrokePolygonFill(ctx, stroke, (strokeRatio - 0.45) / 0.55);
    }
    fillCovered += stroke.totalLength;
  }

  // Pass 2: Crisp hand-drawn marker ink outlines
  let covered = 0;
  let activeTip: { tipX: number; tipY: number; tipColor: string } | null = null;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const stroke of strokes) {
    if (covered >= targetDist) break;
    const remaining = targetDist - covered;
    const strokeRatio = Math.min(1, remaining / Math.max(1, stroke.totalLength));
    const maxDistInStroke = stroke.totalLength * strokeRatio;

    ctx.beginPath();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.strokeWidth;

    const pts = stroke.points;
    let lastDrawnPt = pts[0];
    ctx.moveTo(pts[0].x, pts[0].y);

    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const jump = Math.hypot(curr.x - prev.x, curr.y - prev.y);
      if (curr.dist <= maxDistInStroke) {
        if (jump > 45) {
          ctx.moveTo(curr.x, curr.y);
        } else {
          ctx.lineTo(curr.x, curr.y);
        }
        lastDrawnPt = curr;
      } else {
        const segTotal = curr.dist - prev.dist;
        if (segTotal > 0.001 && jump <= 45) {
          const t = (maxDistInStroke - prev.dist) / segTotal;
          const ix = prev.x + (curr.x - prev.x) * t;
          const iy = prev.y + (curr.y - prev.y) * t;
          ctx.lineTo(ix, iy);
          lastDrawnPt = { x: ix, y: iy, dist: maxDistInStroke };
        }
        break;
      }
    }
    ctx.stroke();

    if (strokeRatio < 1) {
      activeTip = {
        tipX: lastDrawnPt.x,
        tipY: lastDrawnPt.y,
        tipColor: stroke.color,
      };
      break;
    }
    covered += stroke.totalLength;
  }

  ctx.restore();
  return activeTip;
}

function drawHighlighterBanner(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  color: string,
  progress: number
) {
  if (progress <= 0) return;
  const p = Math.min(1, progress);
  ctx.save();
  ctx.globalAlpha = 0.17;
  ctx.fillStyle = color;
  const left = centerX - width / 2;
  ctx.beginPath();
  ctx.roundRect(left, centerY - height / 2, width * p, height, 10);
  ctx.fill();
  ctx.restore();
}

function drawBoardStickyBanner(
  ctx: CanvasRenderingContext2D,
  text: string,
  accentHex: string,
  revealProgress: number
) {
  if (!text || revealProgress <= 0) return;
  const p = Math.min(1, revealProgress);
  ctx.save();
  ctx.globalAlpha = p;
  ctx.font = '700 26px "Edu SA Hand", cursive, sans-serif';
  const metrics = ctx.measureText(text);
  const pillW = Math.min(460, Math.max(180, metrics.width + 46));
  const pillH = 48;
  const cx = CANVAS_WIDTH / 2;
  const cy = 684;

  ctx.translate(cx, cy);
  ctx.rotate(-0.015);
  ctx.scale(0.92 + 0.08 * p, 0.92 + 0.08 * p);

  // Soft shadow
  ctx.fillStyle = "rgba(15, 23, 42, 0.09)";
  ctx.beginPath();
  ctx.roundRect(-pillW / 2 + 4, -pillH / 2 + 5, pillW, pillH, 10);
  ctx.fill();

  // Warm sticky-note fill + hand-drawn border
  ctx.fillStyle = "#FEF3C7";
  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-pillW / 2, -pillH / 2, pillW, pillH, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = INK_BLACK;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 0, 1);
  ctx.restore();
}

function drawWrappedMarkerText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
  font: string,
  color: string,
  revealProgress = 1
) {
  if (!text || revealProgress <= 0) return;
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  }
  if (currentLine) lines.push(currentLine);

  const totalChars = text.length;
  const visibleChars = Math.floor(totalChars * Math.min(1, revealProgress));
  let consumed = 0;

  lines.forEach((line, idx) => {
    if (consumed >= visibleChars) return;
    const charsLeft = visibleChars - consumed;
    const shown = charsLeft >= line.length ? line : line.slice(0, charsLeft);
    ctx.globalAlpha = Math.min(1, revealProgress * 1.4);
    ctx.fillText(shown, centerX, startY + idx * lineHeight);
    consumed += line.length + 1;
  });

  ctx.restore();
}

function drawDryEraseHandAndMarker(
  ctx: CanvasRenderingContext2D,
  tipX: number,
  tipY: number,
  accentColor: string
) {
  ctx.save();
  ctx.translate(tipX, tipY);
  ctx.rotate(-0.18);

  ctx.shadowColor = "rgba(15, 23, 42, 0.16)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetX = 6;
  ctx.shadowOffsetY = 10;

  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(10, -14);
  ctx.lineTo(18, -8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#1E293B";
  ctx.beginPath();
  ctx.moveTo(10, -14);
  ctx.lineTo(28, -38);
  ctx.lineTo(42, -28);
  ctx.lineTo(18, -8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#CBD5E1";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(28, -38);
  ctx.lineTo(118, -156);
  ctx.lineTo(140, -140);
  ctx.lineTo(42, -28);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.moveTo(76, -101);
  ctx.lineTo(94, -125);
  ctx.lineTo(116, -109);
  ctx.lineTo(98, -85);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 10;
  ctx.fillStyle = "#F5D0B5";
  ctx.strokeStyle = "#D4A383";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(52, -32);
  ctx.bezierCurveTo(75, -18, 128, -5, 175, 18);
  ctx.lineTo(225, 75);
  ctx.lineTo(160, 115);
  ctx.bezierCurveTo(102, 72, 65, 22, 42, -10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(36, -54, 62, 22, 11);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(44, -28, 48, 22, 11);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawWhiteboardSurface(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = BOARD_BG;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const grad = ctx.createRadialGradient(
    CANVAS_WIDTH * 0.5,
    CANVAS_HEIGHT * 0.42,
    80,
    CANVAS_WIDTH * 0.5,
    CANVAS_HEIGHT * 0.5,
    CANVAS_HEIGHT * 0.72
  );
  grad.addColorStop(0, "rgba(255,255,255,0.48)");
  grad.addColorStop(1, "rgba(226,232,240,0.34)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = "rgba(148, 163, 184, 0.16)";
  for (let y = 40; y < CANVAS_HEIGHT; y += 48) {
    for (let x = 40; x < CANVAS_WIDTH; x += 48) {
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }
}

export interface RenderFrameResult {
  phase: "intro" | "clue" | "countdown" | "reveal";
  activeClueIndex: number | null;
  isDrawing: boolean;
}

export function renderWhiteboardFrame(
  ctx: CanvasRenderingContext2D,
  compiled: CompiledStoryboard,
  timeSeconds: number
): RenderFrameResult {
  const { storyboard, timeline } = compiled;
  const t = Math.max(0, Math.min(storyboard.duration, timeSeconds));

  drawWhiteboardSurface(ctx);

  ctx.save();
  ctx.font = '600 22px "Onest", sans-serif';
  ctx.fillStyle = "#71717D";
  ctx.textAlign = "center";
  ctx.fillText(
    `${storyboard.contentType.toUpperCase()} QUIZ  ·  ${storyboard.difficulty.toUpperCase()}`,
    CANVAS_WIDTH / 2,
    126
  );
  ctx.restore();

  if (t < timeline.introEnd) {
    const localP = (t - timeline.introStart) / (timeline.introEnd - timeline.introStart);
    const drawP = Math.min(1, localP / 0.65);

    const tip = drawPartialStrokes(ctx, compiled.introStrokes, drawP);

    drawHighlighterBanner(
      ctx,
      CANVAS_WIDTH / 2,
      650,
      540,
      46,
      ACCENT_HEX.orange,
      Math.min(1, localP / 0.45)
    );

    drawWrappedMarkerText(
      ctx,
      storyboard.hookHeadline,
      CANVAS_WIDTH / 2,
      620,
      600,
      64,
      '700 46px "Edu SA Hand", cursive, sans-serif',
      INK_BLACK,
      Math.min(1, localP / 0.55)
    );

    drawWrappedMarkerText(
      ctx,
      storyboard.hookSubline,
      CANVAS_WIDTH / 2,
      770,
      560,
      40,
      '500 30px "Edu SA Hand", cursive, sans-serif',
      ACCENT_HEX.orange,
      Math.max(0, (localP - 0.35) / 0.4)
    );

    if (localP > 0.92) {
      const wipe = (localP - 0.92) / 0.08;
      ctx.fillStyle = `rgba(253, 253, 251, ${wipe})`;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    if (tip && drawP < 0.99) {
      drawDryEraseHandAndMarker(ctx, tip.tipX, tip.tipY, tip.tipColor);
      return { phase: "intro", activeClueIndex: null, isDrawing: true };
    }
    return { phase: "intro", activeClueIndex: null, isDrawing: false };
  }

  for (let i = 0; i < compiled.clues.length; i++) {
    const win = timeline.clueWindows[i];
    if (t >= win.start && t < win.end) {
      const cClue = compiled.clues[i];
      const accentHex = ACCENT_HEX[cClue.clue.accentColor] || ACCENT_HEX.orange;
      const localP = (t - win.start) / (win.end - win.start);

      const dotGap = 32;
      const startDotsX = CANVAS_WIDTH / 2 - ((compiled.clues.length - 1) * dotGap) / 2;
      for (let d = 0; d < compiled.clues.length; d++) {
        ctx.beginPath();
        ctx.arc(startDotsX + d * dotGap, 168, d === i ? 9 : 6, 0, Math.PI * 2);
        if (d < i) {
          ctx.fillStyle = "#94A3B8";
          ctx.fill();
        } else if (d === i) {
          ctx.fillStyle = accentHex;
          ctx.fill();
        } else {
          ctx.strokeStyle = "#CBD5E1";
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
      }

      drawHighlighterBanner(
        ctx,
        CANVAS_WIDTH / 2,
        222,
        480,
        36,
        accentHex,
        Math.min(1, localP / 0.25)
      );

      drawWrappedMarkerText(
        ctx,
        cClue.clue.header,
        CANVAS_WIDTH / 2,
        200,
        610,
        46,
        '700 34px "Edu SA Hand", cursive, sans-serif',
        INK_BLACK,
        Math.min(1, localP / 0.22)
      );

      // Soft paper card drop shadow beneath sketch panel
      ctx.save();
      ctx.fillStyle = "rgba(15, 23, 42, 0.06)";
      ctx.beginPath();
      ctx.roundRect(64, 284, 608, 456, 12);
      ctx.fill();
      ctx.restore();

      const drawP = Math.min(1, localP / 0.68);
      const tip = drawPartialStrokes(ctx, cClue.allStrokes, drawP);

      const boardLabel = cClue.clue.boardNote || cClue.clue.calloutLabel;
      if (boardLabel && localP > 0.38) {
        drawBoardStickyBanner(ctx, boardLabel, accentHex, (localP - 0.38) / 0.22);
      }

      drawWrappedMarkerText(
        ctx,
        cClue.clue.caption,
        CANVAS_WIDTH / 2,
        780,
        590,
        48,
        '500 34px "Edu SA Hand", cursive, sans-serif',
        INK_BLACK,
        Math.max(0, (localP - 0.18) / 0.45)
      );

      if (localP > 0.94) {
        const wipe = (localP - 0.94) / 0.06;
        ctx.fillStyle = `rgba(253, 253, 251, ${wipe})`;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      if (tip && drawP < 0.99) {
        drawDryEraseHandAndMarker(ctx, tip.tipX, tip.tipY, tip.tipColor);
        return { phase: "clue", activeClueIndex: i, isDrawing: true };
      }
      return { phase: "clue", activeClueIndex: i, isDrawing: false };
    }
  }

  if (t >= timeline.countdownStart && t < timeline.countdownEnd) {
    const localP =
      (t - timeline.countdownStart) / (timeline.countdownEnd - timeline.countdownStart);
    const step = Math.max(1, Math.min(5, 5 - Math.floor(localP * 5)));
    const subP = (localP * 5) % 1;

    drawPartialStrokes(ctx, compiled.countdownRingStrokes, Math.min(1, subP * 1.4));

    drawWrappedMarkerText(
      ctx,
      "ALL CLUES REVEALED",
      CANVAS_WIDTH / 2,
      250,
      560,
      40,
      '700 28px "Onest", sans-serif',
      "#52525B",
      1
    );

    ctx.save();
    ctx.font = '700 155px "Edu SA Hand", cursive, sans-serif';
    ctx.fillStyle = INK_BLACK;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const scale = 0.85 + Math.sin(Math.min(1, subP * 2) * Math.PI * 0.5) * 0.2;
    ctx.translate(CANVAS_WIDTH / 2, 575);
    ctx.scale(scale, scale);
    ctx.fillText(String(step), 0, 0);
    ctx.restore();

    drawWrappedMarkerText(
      ctx,
      `Answer in ${step} ${step === 1 ? "second" : "seconds"}...`,
      CANVAS_WIDTH / 2,
      790,
      560,
      48,
      '700 36px "Edu SA Hand", cursive, sans-serif',
      ACCENT_HEX.orange,
      1
    );

    return { phase: "countdown", activeClueIndex: null, isDrawing: false };
  }

  const revealP = Math.min(
    1,
    (t - timeline.revealStart) / Math.max(0.5, timeline.revealEnd - timeline.revealStart)
  );

  const tip = drawPartialStrokes(
    ctx,
    compiled.revealBurstStrokes,
    Math.min(1, revealP / 0.45)
  );

  drawWrappedMarkerText(
    ctx,
    "THE ANSWER IS...",
    CANVAS_WIDTH / 2,
    240,
    560,
    40,
    '700 30px "Onest", sans-serif',
    ACCENT_HEX.orange,
    Math.min(1, revealP / 0.2)
  );

  drawHighlighterBanner(
    ctx,
    CANVAS_WIDTH / 2,
    365,
    520,
    60,
    ACCENT_HEX.amber,
    Math.min(1, revealP / 0.35)
  );

  drawWrappedMarkerText(
    ctx,
    storyboard.title,
    CANVAS_WIDTH / 2,
    330,
    600,
    68,
    '700 56px "Edu SA Hand", cursive, sans-serif',
    INK_BLACK,
    Math.min(1, revealP / 0.35)
  );

  const metaLine = [
    storyboard.releaseYear,
    storyboard.creatorOrDirector,
    storyboard.genreLabel,
  ]
    .filter(Boolean)
    .join("  ·  ");

  drawWrappedMarkerText(
    ctx,
    metaLine,
    CANVAS_WIDTH / 2,
    545,
    580,
    38,
    '600 25px "Onest", sans-serif',
    "#475569",
    Math.max(0, (revealP - 0.2) / 0.25)
  );

  if (storyboard.revealFact) {
    drawWrappedMarkerText(
      ctx,
      storyboard.revealFact,
      CANVAS_WIDTH / 2,
      640,
      570,
      44,
      '400 30px "Edu SA Hand", cursive, sans-serif',
      INK_BLACK,
      Math.max(0, (revealP - 0.35) / 0.3)
    );
  }

  drawWrappedMarkerText(
    ctx,
    "How many clues did you need? Comment below!",
    CANVAS_WIDTH / 2,
    845,
    560,
    40,
    '700 28px "Edu SA Hand", cursive, sans-serif',
    ACCENT_HEX.orange,
    Math.max(0, (revealP - 0.55) / 0.25)
  );

  if (tip && revealP < 0.44) {
    drawDryEraseHandAndMarker(ctx, tip.tipX, tip.tipY, tip.tipColor);
    return { phase: "reveal", activeClueIndex: null, isDrawing: true };
  }

  return { phase: "reveal", activeClueIndex: null, isDrawing: false };
}
