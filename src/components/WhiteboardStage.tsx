import React, { useEffect, useRef, useState } from "react";
import {
  Download,
  Eye,
  EyeOff,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CompiledStoryboard,
  renderWhiteboardFrame,
} from "../engine/whiteboardEngine";
import { WhiteboardSoundEngine } from "../engine/soundEngine";
import { exportWhiteboardVideo } from "../engine/videoExporter";

interface WhiteboardStageProps {
  compiled: CompiledStoryboard | null;
  isGenerating: boolean;
  generationStep: string;
  currentTime: number;
  onTimeChange: (t: number) => void;
  isPlaying: boolean;
  onPlayingChange: (playing: boolean) => void;
  onTrySample: (title: string, contentType: "Movie" | "TV Series") => void;
}

function formatTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
}

export const WhiteboardStage: React.FC<WhiteboardStageProps> = ({
  compiled,
  isGenerating,
  generationStep,
  currentTime,
  onTimeChange,
  isPlaying,
  onPlayingChange,
  onTrySample,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const soundRef = useRef<WhiteboardSoundEngine | null>(null);
  const lastPhaseRef = useRef<string>("");
  const lastCountRef = useRef<number>(-1);
  const exportAbortRef = useRef<AbortController | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState<string | null>(null);

  if (!soundRef.current && typeof window !== "undefined") {
    soundRef.current = new WhiteboardSoundEngine();
  }

  useEffect(() => {
    soundRef.current?.setMuted(isMuted);
  }, [isMuted]);

  // Draw current frame whenever compiled or currentTime updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !compiled) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderNow = () => {
      const res = renderWhiteboardFrame(ctx, compiled, currentTime);
      if (isPlaying && soundRef.current) {
        soundRef.current.setDrawingActive(res.isDrawing);
        const phaseKey = `${res.phase}-${res.activeClueIndex ?? ""}`;
        if (phaseKey !== lastPhaseRef.current) {
          lastPhaseRef.current = phaseKey;
          if (res.phase === "intro") soundRef.current.playTone("intro");
          else if (res.phase === "clue") soundRef.current.playTone("clue");
          else if (res.phase === "reveal") soundRef.current.playTone("reveal");
        }
        if (res.phase === "countdown") {
          const { countdownStart, countdownEnd } = compiled.timeline;
          const localP = (currentTime - countdownStart) / (countdownEnd - countdownStart);
          const countStep = Math.max(1, Math.min(5, 5 - Math.floor(localP * 5)));
          if (countStep !== lastCountRef.current) {
            lastCountRef.current = countStep;
            soundRef.current.playTone("tick");
          }
        } else {
          lastCountRef.current = -1;
        }
      }
    };

    if (document.fonts && document.fonts.status !== "loaded") {
      document.fonts.ready.then(renderNow);
    } else {
      renderNow();
    }
  }, [compiled, currentTime, isPlaying]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying || !compiled) {
      soundRef.current?.setDrawingActive(false);
      return;
    }

    let rafId = 0;
    let lastTimestamp = performance.now();
    let localTime = currentTime;
    const totalDur = compiled.storyboard.duration;

    if (localTime >= totalDur - 0.05) {
      localTime = 0;
      onTimeChange(0);
    }

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastTimestamp) / 1000);
      lastTimestamp = now;
      localTime += dt;

      if (localTime >= totalDur) {
        onTimeChange(totalDur);
        onPlayingChange(false);
        soundRef.current?.stopAll();
        return;
      }

      onTimeChange(localTime);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      soundRef.current?.stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, compiled]);

  const handleRestart = () => {
    lastPhaseRef.current = "";
    lastCountRef.current = -1;
    onTimeChange(0);
    onPlayingChange(true);
  };

  const handleTogglePlay = () => {
    if (!compiled) return;
    if (!isPlaying && currentTime >= compiled.storyboard.duration - 0.05) {
      lastPhaseRef.current = "";
      onTimeChange(0);
    }
    onPlayingChange(!isPlaying);
  };

  const handleExport = async () => {
    if (!compiled || isExporting) return;
    onPlayingChange(false);
    setExportError(null);
    setExportProgress(0);
    setIsExporting(true);

    const controller = new AbortController();
    exportAbortRef.current = controller;

    try {
      const result = await exportWhiteboardVideo({
        compiled,
        includeAudio: !isMuted,
        onProgress: setExportProgress,
        signal: controller.signal,
      });
      const url = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
    } catch (err: any) {
      if (err?.message !== "Export cancelled.") {
        setExportError(err?.message || "Failed to export video.");
      }
    } finally {
      setIsExporting(false);
      exportAbortRef.current = null;
    }
  };

  const handleCancelExport = () => {
    exportAbortRef.current?.abort();
  };

  const duration = compiled?.storyboard.duration ?? 30;
  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="flex flex-col h-full studio-mat-grid rounded-xl border border-[#2D2D2D] overflow-hidden">
      {/* Top stage bar */}
      <div className="flex items-center justify-between gap-4 px-5 py-3 bg-[#1B1B1B] border-b border-[#2D2D2D]">
        <div className="flex items-center gap-2 text-xs text-[#9F9FAA] min-w-0">
          <span className="font-medium text-[#F0F0F0] truncate">
            {compiled ? compiled.storyboard.title : "9:16 Vertical Preview"}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-tabular whitespace-nowrap">720×1280</span>
          {compiled && (
            <>
              <span aria-hidden="true">·</span>
              <span className="whitespace-nowrap">{compiled.storyboard.contentType}</span>
              <span aria-hidden="true">·</span>
              <span className="whitespace-nowrap">{compiled.storyboard.difficulty}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowSafeZones((v) => !v)}
            disabled={!compiled}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#D4D4DC] bg-[#262626] hover:bg-[#303030] disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
            title="Toggle Reels / Shorts / TikTok UI safe-zone guides"
          >
            {showSafeZones ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Safe Zones</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMuted((m) => !m)}
            className="inline-flex items-center justify-center w-8 h-8 text-[#D4D4DC] bg-[#262626] hover:bg-[#303030] rounded-lg transition-colors shrink-0 cursor-pointer"
            aria-label={isMuted ? "Unmute whiteboard sound" : "Mute whiteboard sound"}
            title={isMuted ? "Unmute sound effects" : "Mute sound effects"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Center 9:16 Whiteboard Viewport */}
      <div className="relative flex-1 flex items-center justify-center p-5 md:p-7 min-h-[520px]">
        <div
          className="relative bg-[#FDFDFB] rounded-xl border border-[#303030] shadow-xl overflow-hidden"
          style={{
            aspectRatio: "9 / 16",
            height: "min(620px, 68vh)",
            maxWidth: "100%",
          }}
        >
          {compiled ? (
            <>
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="w-full h-full block"
              />

              {/* Optional TikTok/Reels/Shorts Safe-Zone Overlay */}
              {showSafeZones && (
                <div className="absolute inset-0 pointer-events-none select-none">
                  <div className="absolute top-0 inset-x-0 h-[8%] bg-[#F96921]/12 border-b border-dashed border-[#F96921]/70 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-[#111111] bg-white/90 px-1.5 py-0.5 rounded">
                      Top Platform Header Zone
                    </span>
                  </div>
                  <div className="absolute right-0 top-[42%] bottom-[16%] w-[15%] bg-[#F96921]/12 border-l border-dashed border-[#F96921]/70 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-[#111111] -rotate-90 whitespace-nowrap bg-white/90 px-1.5 py-0.5 rounded">
                      Action Icons
                    </span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 h-[16%] bg-[#F96921]/12 border-t border-dashed border-[#F96921]/70 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-[#111111] bg-white/90 px-1.5 py-0.5 rounded">
                      Caption & Audio Bar Safe Zone
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty State before first generation (on crisp whiteboard sheet) */
            <div className="w-full h-full bg-[#FDFDFB] flex flex-col items-center justify-between p-6 text-center">
              <div className="text-[11px] font-mono text-[#71717D] tracking-wide pt-2">
                9:16 WHITEBOARD CANVAS
              </div>

              <div className="space-y-4 max-w-[260px]">
                <svg
                  viewBox="0 0 200 130"
                  className="w-40 h-28 mx-auto"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="22"
                    y="16"
                    width="156"
                    height="96"
                    rx="6"
                    stroke="#CBD5E1"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                  />
                  <path
                    d="M 55 82 L 85 45 L 112 72 L 130 56 L 150 82"
                    stroke="#18181B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="136" cy="38" r="8" stroke="#F96921" strokeWidth="3" />
                  <path
                    d="M 152 24 L 168 12"
                    stroke="#0099FF"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold text-[#111111]">
                    Ready to sketch your quiz
                  </h3>
                  <p className="text-xs text-[#52525B] leading-relaxed">
                    Enter any movie or TV series on the left to generate progressive dry-erase
                    clues timed for Reels, Shorts, and TikTok.
                  </p>
                </div>

                <div className="pt-1 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => onTrySample("Inception", "Movie")}
                    className="w-full px-3 py-2 text-xs font-semibold text-[#111111] bg-[#F96921] hover:bg-[#FF7B38] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Try Sample: Inception
                  </button>
                  <button
                    type="button"
                    onClick={() => onTrySample("Breaking Bad", "TV Series")}
                    className="w-full px-3 py-2 text-xs font-medium text-[#111111] bg-[#EAEAE6] hover:bg-[#DFDFDA] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Try Sample: Breaking Bad
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-[#71717D] pb-2">
                Draws stroke-by-stroke with marker SFX
              </div>
            </div>
          )}

          {/* Generating Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-[#111111]/92 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10">
              <Loader2 className="w-8 h-8 text-[#F96921] animate-spin mb-3" />
              <p className="text-sm font-semibold text-[#F0F0F0]">Composing Whiteboard Video</p>
              <p className="text-xs text-[#9F9FAA] mt-1 max-w-[240px]">{generationStep}</p>
            </div>
          )}

          {/* Exporting Overlay */}
          {isExporting && (
            <div className="absolute inset-0 bg-[#111111]/92 text-[#F0F0F0] flex flex-col items-center justify-center p-6 text-center z-20">
              <p className="text-sm font-semibold">Rendering Vertical Video</p>
              <p className="text-3xl font-mono-tabular font-semibold text-[#F96921] mt-2">
                {exportProgress}%
              </p>
              <div className="w-48 h-1.5 bg-[#2D2D2D] rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-[#F96921] transition-all duration-150"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
              <p className="text-xs text-[#9F9FAA] mt-3 max-w-[230px]">
                Capturing 30fps canvas frames and marker audio track...
              </p>
              <button
                type="button"
                onClick={handleCancelExport}
                className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#1B1B1B] hover:bg-[#262626] border border-[#303030] rounded-lg cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel Export</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Transport & Export Bar */}
      <div className="px-5 py-3.5 bg-[#1B1B1B] border-t border-[#2D2D2D] space-y-2.5">
        {exportError && (
          <div className="text-xs text-red-200 bg-red-950/50 border border-red-800/70 rounded-lg px-3 py-2">
            {exportError}
          </div>
        )}

        {/* Scrubber */}
        <div className="relative flex items-center gap-3">
          <span className="text-xs font-mono-tabular text-[#D4D4DC] w-11 shrink-0">
            {formatTime(currentTime)}
          </span>

          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min={0}
              max={duration}
              step={0.05}
              value={Math.min(duration, currentTime)}
              disabled={!compiled || isExporting}
              onChange={(e) => {
                onPlayingChange(false);
                onTimeChange(Number(e.target.value));
              }}
              aria-label="Video timeline scrubber"
              className="w-full h-1.5 bg-[#2D2D2D] rounded-lg appearance-none cursor-pointer accent-[#F96921] disabled:opacity-40"
              style={{
                background: compiled
                  ? `linear-gradient(to right, #F96921 ${progressPct}%, #2D2D2D ${progressPct}%)`
                  : undefined,
              }}
            />
          </div>

          <span className="text-xs font-mono-tabular text-[#9F9FAA] w-11 text-right shrink-0">
            {formatTime(duration)}
          </span>
        </div>

        {/* Transport Controls Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTogglePlay}
              disabled={!compiled || isExporting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#F0F0F0] bg-[#2D2D2D] hover:bg-[#3A3A3A] disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>

            <button
              type="button"
              onClick={handleRestart}
              disabled={!compiled || isExporting}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#D4D4DC] bg-[#222222] hover:bg-[#2D2D2D] disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={!compiled || isExporting || isGenerating}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#111111] bg-[#F96921] hover:bg-[#FF7B38] disabled:bg-[#2D2D2D] disabled:text-[#71717D] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? `Exporting ${exportProgress}%` : "Export Video"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
