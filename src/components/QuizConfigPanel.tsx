import React from "react";
import { Loader2, Minus, Plus, RefreshCw, Play } from "lucide-react";
import {
  ClueScene,
  ContentType,
  DifficultyLevel,
  DurationSeconds,
  MarkerAccent,
  QuizStoryboard,
} from "../types";
import { CompiledStoryboard, computeTimelineBounds } from "../engine/whiteboardEngine";

interface QuizConfigPanelProps {
  activeTab: "setup" | "clues";
  onTabChange: (tab: "setup" | "clues") => void;
  title: string;
  onTitleChange: (val: string) => void;
  contentType: ContentType;
  onContentTypeChange: (val: ContentType) => void;
  difficulty: DifficultyLevel;
  onDifficultyChange: (val: DifficultyLevel) => void;
  duration: DurationSeconds;
  onDurationChange: (val: DurationSeconds) => void;
  clueCount: number;
  onClueCountChange: (val: number) => void;
  onGenerate: (overrideTitle?: string, overrideType?: ContentType) => void;
  isGenerating: boolean;
  error: string | null;
  storyboard: QuizStoryboard | null;
  compiled: CompiledStoryboard | null;
  activeClueIndex: number | null;
  onJumpToTime: (time: number) => void;
  onUpdateClue: (index: number, patch: Partial<ClueScene>) => void;
  onRegenerateClue: (index: number) => void;
  regeneratingClueIndex: number | null;
}

const ACCENT_SWATCHES: Array<{ id: MarkerAccent; label: string; dotClass: string }> = [
  { id: "orange", label: "Brand Orange", dotClass: "bg-[#F96921]" },
  { id: "blue", label: "Electric Blue", dotClass: "bg-[#0099FF]" },
  { id: "amber", label: "Warm Gold", dotClass: "bg-[#FFB41F]" },
  { id: "red", label: "Crimson Red", dotClass: "bg-[#DC2626]" },
  { id: "green", label: "Emerald Green", dotClass: "bg-[#16A34A]" },
];

const QUICK_IDEAS: Array<{ title: string; type: ContentType }> = [
  { title: "Inception", type: "Movie" },
  { title: "Stranger Things", type: "TV Series" },
  { title: "Spirited Away", type: "Movie" },
  { title: "Severance", type: "TV Series" },
  { title: "The Dark Knight", type: "Movie" },
];

export const QuizConfigPanel: React.FC<QuizConfigPanelProps> = ({
  activeTab,
  onTabChange,
  title,
  onTitleChange,
  contentType,
  onContentTypeChange,
  difficulty,
  onDifficultyChange,
  duration,
  onDurationChange,
  clueCount,
  onClueCountChange,
  onGenerate,
  isGenerating,
  error,
  storyboard,
  compiled,
  activeClueIndex,
  onJumpToTime,
  onUpdateClue,
  onRegenerateClue,
  regeneratingClueIndex,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  const clampClues = (n: number) => Math.min(7, Math.max(3, n));

  return (
    <div className="bg-[#1B1B1B] border border-[#2D2D2D] rounded-xl flex flex-col h-full overflow-hidden">
      {/* Segmented Control Header */}
      <div className="p-3 border-b border-[#2D2D2D] bg-[#161616]">
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#111111] border border-[#2D2D2D] rounded-lg">
          <button
            type="button"
            onClick={() => onTabChange("setup")}
            className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "setup"
                ? "bg-[#262626] text-[#F0F0F0]"
                : "text-[#9F9FAA] hover:text-[#F0F0F0]"
            }`}
          >
            Quiz Parameters
          </button>
          <button
            type="button"
            onClick={() => onTabChange("clues")}
            className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "clues"
                ? "bg-[#262626] text-[#F0F0F0]"
                : "text-[#9F9FAA] hover:text-[#F0F0F0]"
            }`}
          >
            {storyboard ? `Storyboard (${storyboard.clues.length})` : "Storyboard"}
          </button>
        </div>
      </div>

      {activeTab === "setup" ? (
        <form onSubmit={handleSubmit} className="p-5 space-y-5 flex-1 overflow-y-auto">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-[#F0F0F0]">Create Guessing Video</h2>
            <p className="text-xs text-[#9F9FAA] leading-relaxed">
              Configure your title and pacing. AI generates progressive dry-erase illustrations
              and captions calibrated to your difficulty.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="text-xs text-red-200 bg-red-950/50 border border-red-800/70 rounded-lg p-3 leading-relaxed"
            >
              {error}
            </div>
          )}

          {/* Movie or TV Series Name */}
          <div className="space-y-1.5">
            <label htmlFor="title-input" className="block text-xs font-medium text-[#D4D4DC]">
              Enter Movie or TV Series Name
            </label>
            <input
              id="title-input"
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g., Inception, Breaking Bad, Dune"
              required
              disabled={isGenerating}
              className="w-full min-h-[42px] px-3.5 py-2 text-sm text-[#F0F0F0] bg-[#111111] border border-[#303030] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F96921] focus-visible:border-[#F96921] placeholder:text-[#71717D] disabled:opacity-60"
            />
          </div>

          {/* Content Type + Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="content-type-select" className="block text-xs font-medium text-[#D4D4DC]">
                Content Type
              </label>
              <select
                id="content-type-select"
                value={contentType}
                onChange={(e) => onContentTypeChange(e.target.value as ContentType)}
                disabled={isGenerating}
                className="w-full min-h-[42px] px-3 py-2 text-sm text-[#F0F0F0] bg-[#111111] border border-[#303030] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F96921] focus-visible:border-[#F96921] disabled:opacity-60 cursor-pointer"
              >
                <option value="Movie">Movie</option>
                <option value="TV Series">TV Series</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="difficulty-select" className="block text-xs font-medium text-[#D4D4DC]">
                Difficulty
              </label>
              <select
                id="difficulty-select"
                value={difficulty}
                onChange={(e) => onDifficultyChange(e.target.value as DifficultyLevel)}
                disabled={isGenerating}
                className="w-full min-h-[42px] px-3 py-2 text-sm text-[#F0F0F0] bg-[#111111] border border-[#303030] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F96921] focus-visible:border-[#F96921] disabled:opacity-60 cursor-pointer"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Animation Duration + Number of Clues */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="duration-select" className="block text-xs font-medium text-[#D4D4DC]">
                Animation Duration
              </label>
              <select
                id="duration-select"
                value={duration}
                onChange={(e) => onDurationChange(Number(e.target.value) as DurationSeconds)}
                disabled={isGenerating}
                className="w-full min-h-[42px] px-3 py-2 text-sm text-[#F0F0F0] bg-[#111111] border border-[#303030] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F96921] focus-visible:border-[#F96921] disabled:opacity-60 cursor-pointer tabular-nums"
              >
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={45}>45 seconds</option>
                <option value={60}>60 seconds</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="clue-count-input" className="block text-xs font-medium text-[#D4D4DC]">
                Number of clues (3–7)
              </label>
              <div className="flex items-center border border-[#303030] rounded-lg bg-[#111111] overflow-hidden min-h-[42px]">
                <button
                  type="button"
                  onClick={() => onClueCountChange(clampClues(clueCount - 1))}
                  disabled={isGenerating || clueCount <= 3}
                  aria-label="Decrease clue count"
                  className="px-3 h-[40px] text-[#9F9FAA] hover:text-[#F0F0F0] hover:bg-[#222222] disabled:opacity-35 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  id="clue-count-input"
                  type="number"
                  min={3}
                  max={7}
                  value={clueCount}
                  onChange={(e) => {
                    const parsed = parseInt(e.target.value, 10);
                    if (!Number.isNaN(parsed)) {
                      onClueCountChange(clampClues(parsed));
                    }
                  }}
                  disabled={isGenerating}
                  className="w-full text-center text-sm font-mono-tabular font-medium text-[#F0F0F0] bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => onClueCountChange(clampClues(clueCount + 1))}
                  disabled={isGenerating || clueCount >= 7}
                  aria-label="Increase clue count"
                  className="px-3 h-[40px] text-[#9F9FAA] hover:text-[#F0F0F0] hover:bg-[#222222] disabled:opacity-35 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <button
            type="submit"
            disabled={isGenerating || !title.trim()}
            className="w-full min-h-[44px] px-4 py-2.5 text-sm font-semibold text-[#111111] bg-[#F96921] hover:bg-[#FF7B38] disabled:bg-[#2D2D2D] disabled:text-[#71717D] rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Video...</span>
              </>
            ) : (
              <span>Generate Video</span>
            )}
          </button>

          {/* Subtle divider + Quick Presets */}
          <div className="pt-4 border-t border-[#2D2D2D] space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#9F9FAA]">
              <span>Quick test prompts</span>
              <span className="font-mono-tabular">
                {(() => {
                  const { introEnd, countdownStart } = computeTimelineBounds(duration);
                  const perClue = (countdownStart - introEnd) / clueCount;
                  return `${perClue.toFixed(1)}s / clue · 5s countdown`;
                })()}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_IDEAS.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => {
                    onTitleChange(item.title);
                    onContentTypeChange(item.type);
                    onGenerate(item.title, item.type);
                  }}
                  className="px-2.5 py-1.5 text-xs text-[#D4D4DC] bg-[#111111] border border-[#2D2D2D] hover:border-[#F96921] hover:text-[#F0F0F0] rounded-md transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </form>
      ) : (
        /* Storyboard Clues Editor */
        <div className="flex-1 overflow-y-auto divide-y divide-[#2D2D2D]">
          {!storyboard ? (
            <div className="p-6 text-center space-y-3">
              <p className="text-sm font-medium text-[#F0F0F0]">No storyboard generated yet</p>
              <p className="text-xs text-[#9F9FAA] leading-relaxed">
                Generate a video from Quiz Parameters to inspect, edit captions, adjust marker
                colors, or redraw individual clues.
              </p>
              <button
                type="button"
                onClick={() => onTabChange("setup")}
                className="px-4 py-2 text-xs font-semibold text-[#111111] bg-[#F96921] hover:bg-[#FF7B38] rounded-lg cursor-pointer"
              >
                Go to Quiz Parameters
              </button>
            </div>
          ) : (
            <>
              {/* Storyboard Summary Row */}
              <div className="p-4 bg-[#161616] space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#F0F0F0] truncate">
                    {storyboard.title}
                  </h3>
                  <span className="text-xs font-mono-tabular text-[#FFB41F] whitespace-nowrap">
                    {storyboard.duration}s
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#9F9FAA]">
                  <span>{storyboard.contentType}</span>
                  <span aria-hidden="true">·</span>
                  <span>{storyboard.releaseYear}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{storyboard.creatorOrDirector}</span>
                </div>
              </div>

              {/* Clue Rows */}
              {storyboard.clues.map((clue, idx) => {
                const win = compiled?.timeline.clueWindows[idx];
                const isActive = activeClueIndex === idx;
                const isRegenerating = regeneratingClueIndex === idx;

                return (
                  <div
                    key={clue.id}
                    className={`p-4 space-y-3 transition-colors ${
                      isActive ? "bg-[#F96921]/10" : "bg-[#1B1B1B] hover:bg-[#212121]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => win && onJumpToTime(win.start + 0.05)}
                        className="inline-flex items-center gap-2 text-left min-w-0 cursor-pointer group"
                      >
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 text-xs font-mono-tabular font-semibold rounded shrink-0 transition-colors ${
                            isActive
                              ? "bg-[#F96921] text-[#111111]"
                              : "bg-[#2D2D2D] text-[#F0F0F0] group-hover:bg-[#F96921] group-hover:text-[#111111]"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-[#F0F0F0] truncate group-hover:text-[#F96921]">
                          {clue.header}
                        </span>
                      </button>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {win && (
                          <button
                            type="button"
                            onClick={() => onJumpToTime(win.start + 0.05)}
                            title="Jump preview to this clue"
                            className="p-1.5 text-[#9F9FAA] hover:text-[#F96921] hover:bg-[#262626] rounded-md cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onRegenerateClue(idx)}
                          disabled={isRegenerating || isGenerating}
                          title="Regenerate this clue illustration"
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-[#D4D4DC] hover:text-[#F0F0F0] bg-[#262626] hover:bg-[#303030] rounded-md transition-colors cursor-pointer disabled:opacity-40"
                        >
                          <RefreshCw
                            className={`w-3 h-3 ${isRegenerating ? "animate-spin" : ""}`}
                          />
                          <span>Redraw</span>
                        </button>
                      </div>
                    </div>

                    {/* Editable Caption */}
                    <div className="space-y-1">
                      <label
                        htmlFor={`clue-caption-${idx}`}
                        className="block text-[11px] font-medium text-[#9F9FAA]"
                      >
                        Handwritten Caption
                      </label>
                      <input
                        id={`clue-caption-${idx}`}
                        type="text"
                        value={clue.caption}
                        onChange={(e) => onUpdateClue(idx, { caption: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs text-[#F0F0F0] bg-[#111111] border border-[#303030] rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F96921]"
                      />
                    </div>

                    {/* Marker Accent Swatch + Callout */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-[#9F9FAA] mr-1">Marker:</span>
                        {ACCENT_SWATCHES.map((swatch) => (
                          <button
                            key={swatch.id}
                            type="button"
                            onClick={() => onUpdateClue(idx, { accentColor: swatch.id })}
                            aria-label={`Set ${swatch.label} marker`}
                            title={swatch.label}
                            className={`w-5 h-5 rounded-full ${swatch.dotClass} flex items-center justify-center cursor-pointer transition-transform ${
                              clue.accentColor === swatch.id
                                ? "ring-2 ring-offset-2 ring-offset-[#1B1B1B] ring-[#F0F0F0] scale-105"
                                : "opacity-65 hover:opacity-100"
                            }`}
                          />
                        ))}
                      </div>

                      {win && (
                        <span className="text-[11px] font-mono-tabular text-[#71717D]">
                          {win.start.toFixed(1)}s – {win.end.toFixed(1)}s
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};
