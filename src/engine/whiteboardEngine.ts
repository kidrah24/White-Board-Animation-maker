import { ClueScene, MarkerAccent, QuizStoryboard, SymbolBadge } from "../types";

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
const INK_MUTED = "#71717A";
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
}

export interface CompiledClue {
  clue: ClueScene;
  frameStrokes: CompiledStroke[];
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

    const count = Math.max(4, Math.min(260, Math.ceil(rawLen / step)));
    const pts: SampledPoint[] = [];
    let accum = 0;

    for (let i = 0; i <= count; i++) {
      const pt = pathEl.getPointAtLength((rawLen * i) / count);
      const sx = pt.x * scaleX + offsetX;
      const sy = pt.y * scaleY + offsetY;
      if (i > 0) {
        const prev = pts[pts.length - 1];
        const segLen = Math.hypot(sx - prev.x, sy - prev.y);
        // Handle M jumps inside a single compound d string gracefully by keeping step
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
  annotation = false
): CompiledStroke | null {
  const points = sampleSvgPath(d, scaleX, scaleY, offsetX, offsetY);
  if (points.length < 2) return null;
  return {
    points,
    totalLength: points[points.length - 1].dist,
    color,
    strokeWidth,
    annotation,
  };
}

export function compileStoryboard(storyboard: QuizStoryboard): CompiledStoryboard {
  const isMovie = storyboard.contentType === "Movie";

  // Intro icon strokes (centered around x: 220..500, y: 310..560)
  const introRaw = isMovie
    ? [
        // Cinema clapperboard
        { d: "M 40 80 L 240 80 L 240 210 L 40 210 Z", color: INK_BLACK, w: 6 },
        { d: "M 40 80 L 235 35 L 244 65 L 49 110 Z", color: ACCENT_HEX.orange, w: 5 },
        { d: "M 80 71 L 98 99", color: INK_BLACK, w: 4 },
        { d: "M 130 60 L 148 88", color: INK_BLACK, w: 4 },
        { d: "M 180 48 L 198 76", color: INK_BLACK, w: 4 },
        { d: "M 118 122 L 172 150 L 118 178 Z", color: ACCENT_HEX.blue, w: 5 },
      ]
    : [
        // Retro TV set with rabbit-ear antennas
        { d: "M 45 75 L 235 75 L 235 205 L 45 205 Z", color: INK_BLACK, w: 6 },
        { d: "M 65 95 L 195 95 L 195 185 L 65 185 Z", color: ACCENT_HEX.orange, w: 4 },
        { d: "M 140 75 L 105 28", color: INK_BLACK, w: 4 },
        { d: "M 140 75 L 175 28", color: INK_BLACK, w: 4 },
        { d: "M 215 112 A 7 7 0 1 1 214.9 112 Z", color: ACCENT_HEX.orange, w: 4 },
        { d: "M 215 142 A 7 7 0 1 1 214.9 142 Z", color: INK_BLACK, w: 4 },
        { d: "M 110 120 L 155 140 L 110 160 Z", color: ACCENT_HEX.blue, w: 4 },
      ];

  const introStrokes = introRaw
    .map((s) => buildStroke(s.d, s.color, s.w, 1.35, 1.35, 171, 290))
    .filter((s): s is CompiledStroke => s !== null);

  const introDrawLength = introStrokes.reduce((acc, s) => acc + s.totalLength, 0);

  // Compile each clue scene
  const clues: CompiledClue[] = storyboard.clues.map((clue) => {
    const accentHex = ACCENT_HEX[clue.accentColor] || ACCENT_HEX.blue;

    // Hand-drawn sketchbook frame box around illustration
    const frameStrokes: CompiledStroke[] = [
      buildStroke(
        "M 64 295 Q 360 288 656 296 Q 662 510 654 735 Q 360 742 66 734 Q 58 515 64 295",
        "#CBD5E1",
        3,
        1,
        1,
        0,
        0,
        false
      ),
    ].filter((s): s is CompiledStroke => s !== null);

    // Scale AI 400x280 strokes cleanly into (x: 78..642, y: 318..712)
    const artScale = 1.4;
    const artOffsetX = 80;
    const artOffsetY = 315;

    const artStrokes = clue.strokes
      .map((s) => {
        const strokeHex =
          s.color === "accent" ? accentHex : s.color === "muted" ? INK_MUTED : INK_BLACK;
        const width = Math.min(8, Math.max(2.5, (s.strokeWidth || 3.5) * 1.25));
        return buildStroke(
          s.d,
          strokeHex,
          width,
          artScale,
          artScale,
          artOffsetX,
          artOffsetY,
          Boolean(s.annotation)
        );
      })
      .filter((s): s is CompiledStroke => s !== null);

    // Top-right corner symbol badge doodle
    const badgeRaw = SYMBOL_PATHS[clue.symbolBadge] || SYMBOL_PATHS.question;
    const badgeStrokes = badgeRaw
      .map((d) => buildStroke(d, accentHex, 3.5, 0.95, 0.95, 582, 312, true))
      .filter((s): s is CompiledStroke => s !== null);

    const allStrokes = [...frameStrokes, ...artStrokes, ...badgeStrokes];
    const totalDrawLength = allStrokes.reduce((acc, s) => acc + s.totalLength, 0);

    return {
      clue,
      frameStrokes,
      artStrokes,
      badgeStrokes,
      allStrokes,
      totalDrawLength,
    };
  });

  // Countdown ring
  const countdownRingStrokes = [
    buildStroke(
      "M 360 440 A 135 135 0 1 1 359.8 440",
      ACCENT_HEX.orange,
      7,
      1,
      1,
      0,
      0,
      false
    ),
  ].filter((s): s is CompiledStroke => s !== null);

  // Reveal starburst strokes
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
      buildStroke(d, i % 2 === 0 ? ACCENT_HEX.orange : ACCENT_HEX.amber, 5, 1, 1, 0, 0, true)
    )
    .filter((s): s is CompiledStroke => s !== null);

  // Build timeline windows matched to storyboard.duration with exact 5-second answer countdown
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

function drawPartialStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: CompiledStroke[],
  progress: number
): { tipX: number; tipY: number; tipColor: string } | null {
  const totalLen = strokes.reduce((acc, s) => acc + s.totalLength, 0);
  if (totalLen <= 0 || progress <= 0) return null;

  const targetDist = totalLen * Math.min(1, Math.max(0, progress));
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
      // Prevent connecting across internal SVG M-command jumps
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
  // Subtle natural wrist tilt
  ctx.rotate(-0.18);

  // Soft drop shadow on whiteboard
  ctx.shadowColor = "rgba(15, 23, 42, 0.16)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetX = 6;
  ctx.shadowOffsetY = 10;

  // Marker nib
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(10, -14);
  ctx.lineTo(18, -8);
  ctx.closePath();
  ctx.fill();

  // Marker tapered collar
  ctx.fillStyle = "#1E293B";
  ctx.beginPath();
  ctx.moveTo(10, -14);
  ctx.lineTo(28, -38);
  ctx.lineTo(42, -28);
  ctx.lineTo(18, -8);
  ctx.closePath();
  ctx.fill();

  // Marker barrel (white dry-erase body)
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

  // Colored stripe band on marker barrel
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.moveTo(76, -101);
  ctx.lineTo(94, -125);
  ctx.lineTo(116, -109);
  ctx.lineTo(98, -85);
  ctx.closePath();
  ctx.fill();

  // Stylized clean studio hand gripping marker
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#F5D0B5";
  ctx.strokeStyle = "#D4A383";
  ctx.lineWidth = 2;

  // Palm & wrist silhouette
  ctx.beginPath();
  ctx.moveTo(52, -32);
  ctx.bezierCurveTo(75, -18, 128, -5, 175, 18);
  ctx.lineTo(225, 75);
  ctx.lineTo(160, 115);
  ctx.bezierCurveTo(102, 72, 65, 22, 42, -10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Index finger resting along marker
  ctx.beginPath();
  ctx.roundRect(36, -54, 62, 22, 11);
  ctx.fill();
  ctx.stroke();

  // Thumb wrapping across barrel
  ctx.beginPath();
  ctx.roundRect(44, -28, 48, 22, 11);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawWhiteboardSurface(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = BOARD_BG;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Subtle corner lighting gradient for authentic studio whiteboard surface
  const grad = ctx.createRadialGradient(
    CANVAS_WIDTH * 0.5,
    CANVAS_HEIGHT * 0.42,
    80,
    CANVAS_WIDTH * 0.5,
    CANVAS_HEIGHT * 0.5,
    CANVAS_HEIGHT * 0.72
  );
  grad.addColorStop(0, "rgba(255,255,255,0.45)");
  grad.addColorStop(1, "rgba(226,232,240,0.32)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Very subtle architectural dot texture
  ctx.fillStyle = "rgba(148, 163, 184, 0.14)";
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

  // Top subtle watermark-free studio header bar on board (inside safe zone y >= 110)
  ctx.save();
  ctx.font = '600 22px "Onest", sans-serif';
  ctx.fillStyle = "#71717D";
  ctx.textAlign = "center";
  ctx.fillText(
    `${storyboard.contentType.toUpperCase()} QUIZ  ·  ${storyboard.difficulty.toUpperCase()}`,
    CANVAS_WIDTH / 2,
    130
  );
  ctx.restore();

  // 1. INTRO SCENE
  if (t < timeline.introEnd) {
    const localP = (t - timeline.introStart) / (timeline.introEnd - timeline.introStart);
    const drawP = Math.min(1, localP / 0.65);

    const tip = drawPartialStrokes(ctx, compiled.introStrokes, drawP);

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

    // Wipe transition out on last 8%
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

  // 2. CLUE SCENES
  for (let i = 0; i < compiled.clues.length; i++) {
    const win = timeline.clueWindows[i];
    if (t >= win.start && t < win.end) {
      const cClue = compiled.clues[i];
      const accentHex = ACCENT_HEX[cClue.clue.accentColor] || ACCENT_HEX.orange;
      const localP = (t - win.start) / (win.end - win.start);

      // Step progress dots at top (y = 185)
      const dotGap = 32;
      const startDotsX = CANVAS_WIDTH / 2 - ((compiled.clues.length - 1) * dotGap) / 2;
      for (let d = 0; d < compiled.clues.length; d++) {
        ctx.beginPath();
        ctx.arc(startDotsX + d * dotGap, 178, d === i ? 9 : 6, 0, Math.PI * 2);
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

      // Clue header
      drawWrappedMarkerText(
        ctx,
        cClue.clue.header,
        CANVAS_WIDTH / 2,
        215,
        610,
        46,
        '700 34px "Edu SA Hand", cursive, sans-serif',
        accentHex,
        Math.min(1, localP / 0.22)
      );

      // Progressive drawing takes first 68% of clue window, leaving 32% for reading & comprehension
      const drawP = Math.min(1, localP / 0.68);
      const tip = drawPartialStrokes(ctx, cClue.allStrokes, drawP);

      // Optional callout label appears once strokes hit 65%
      if (cClue.clue.calloutLabel && localP > 0.45) {
        const cx = 80 + (cClue.clue.calloutX ?? 280) * 1.4;
        const cy = 315 + (cClue.clue.calloutY ?? 65) * 1.4;
        const callP = Math.min(1, (localP - 0.45) / 0.2);
        ctx.save();
        ctx.globalAlpha = callP;
        ctx.font = '700 25px "Edu SA Hand", cursive, sans-serif';
        ctx.fillStyle = accentHex;
        ctx.textAlign = "center";
        ctx.fillText(
          cClue.clue.calloutLabel,
          Math.max(130, Math.min(CANVAS_WIDTH - 130, cx)),
          Math.max(330, Math.min(705, cy))
        );
        ctx.restore();
      }

      // Caption text drawn progressively beneath frame (y = 785)
      drawWrappedMarkerText(
        ctx,
        cClue.clue.caption,
        CANVAS_WIDTH / 2,
        785,
        590,
        48,
        '500 34px "Edu SA Hand", cursive, sans-serif',
        INK_BLACK,
        Math.max(0, (localP - 0.22) / 0.48)
      );

      // Gentle board wipe fade on last 6%
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

  // 3. COUNTDOWN SCENE (5 seconds after all clues before revealing answer)
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

  // 4. REVEAL SCENE
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
