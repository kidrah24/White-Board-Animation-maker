import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CompiledStoryboard,
  renderWhiteboardFrame,
} from "./whiteboardEngine";
import { WhiteboardSoundEngine } from "./soundEngine";

export interface ExportOptions {
  compiled: CompiledStoryboard;
  includeAudio: boolean;
  onProgress: (percent: number) => void;
  signal?: AbortSignal;
}

export interface ExportResult {
  blob: Blob;
  filename: string;
  mimeType: string;
}

function pickSupportedMimeType(): { mimeType: string; ext: string } {
  const candidates = [
    { mimeType: "video/mp4;codecs=avc1", ext: "mp4" },
    { mimeType: "video/mp4", ext: "mp4" },
    { mimeType: "video/webm;codecs=vp9,opus", ext: "webm" },
    { mimeType: "video/webm;codecs=vp8,opus", ext: "webm" },
    { mimeType: "video/webm", ext: "webm" },
  ];
  for (const c of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(c.mimeType)) {
      return c;
    }
  }
  return { mimeType: "video/webm", ext: "webm" };
}

export async function exportWhiteboardVideo({
  compiled,
  includeAudio,
  onProgress,
  signal,
}: ExportOptions): Promise<ExportResult> {
  if (typeof MediaRecorder === "undefined") {
    throw new Error("Your browser does not support MediaRecorder video export.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to initialize 2D export canvas.");
  }

  // Ensure fonts are loaded before drawing into export canvas
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const fps = 30;
  const videoStream = canvas.captureStream(fps);
  const soundEngine = includeAudio ? new WhiteboardSoundEngine() : null;
  if (soundEngine) {
    soundEngine.setMuted(false);
    const audioStream = soundEngine.getExportAudioStream();
    if (audioStream) {
      audioStream.getAudioTracks().forEach((track) => videoStream.addTrack(track));
    }
  }

  const { mimeType, ext } = pickSupportedMimeType();
  const recorder = new MediaRecorder(videoStream, {
    mimeType,
    videoBitsPerSecond: 4_500_000,
  });

  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  const totalDuration = compiled.storyboard.duration;
  const slug = compiled.storyboard.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const filename = `${slug || "whiteboard-quiz"}-${totalDuration}s.${ext}`;

  return new Promise<ExportResult>((resolve, reject) => {
    let rafId = 0;
    let lastPhaseKey = "";
    let lastCountdownStep = -1;

    const cleanup = () => {
      cancelAnimationFrame(rafId);
      soundEngine?.stopAll();
      videoStream.getTracks().forEach((t) => t.stop());
    };

    if (signal) {
      signal.addEventListener("abort", () => {
        cleanup();
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
        reject(new Error("Export cancelled."));
      });
    }

    recorder.onerror = () => {
      cleanup();
      reject(new Error("Recording failed during video export."));
    };

    recorder.onstop = () => {
      cleanup();
      if (signal?.aborted) return;
      const blob = new Blob(chunks, { type: mimeType });
      onProgress(100);
      resolve({ blob, filename, mimeType });
    };

    // Draw initial frame before starting recorder
    renderWhiteboardFrame(ctx, compiled, 0);
    recorder.start(200);
    const startTime = performance.now();

    const step = (now: number) => {
      if (signal?.aborted) return;
      const elapsedSec = (now - startTime) / 1000;
      const clamped = Math.min(totalDuration, elapsedSec);

      const frameRes = renderWhiteboardFrame(ctx, compiled, clamped);

      if (soundEngine) {
        soundEngine.setDrawingActive(frameRes.isDrawing);
        const phaseKey = `${frameRes.phase}-${frameRes.activeClueIndex ?? ""}`;
        if (phaseKey !== lastPhaseKey) {
          lastPhaseKey = phaseKey;
          if (frameRes.phase === "intro") soundEngine.playTone("intro");
          else if (frameRes.phase === "clue") soundEngine.playTone("clue");
          else if (frameRes.phase === "reveal") soundEngine.playTone("reveal");
        }
        if (frameRes.phase === "countdown") {
          const { countdownStart, countdownEnd } = compiled.timeline;
          const localP = (clamped - countdownStart) / (countdownEnd - countdownStart);
          const countStep = Math.max(1, Math.min(5, 5 - Math.floor(localP * 5)));
          if (countStep !== lastCountdownStep) {
            lastCountdownStep = countStep;
            soundEngine.playTone("tick");
          }
        }
      }

      onProgress(Math.min(99, Math.round((clamped / totalDuration) * 100)));

      if (elapsedSec < totalDuration) {
        rafId = requestAnimationFrame(step);
      } else {
        soundEngine?.stopAll();
        setTimeout(() => {
          if (recorder.state !== "inactive") {
            recorder.stop();
          }
        }, 120);
      }
    };

    rafId = requestAnimationFrame(step);
  });
}
