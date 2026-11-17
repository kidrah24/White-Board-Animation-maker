import { useMemo, useState } from "react";
import { QuizConfigPanel } from "./components/QuizConfigPanel";
import { WhiteboardStage } from "./components/WhiteboardStage";
import { PublishingSpecsModal } from "./components/PublishingSpecsModal";
import { compileStoryboard } from "./engine/whiteboardEngine";
import {
  ClueScene,
  ContentType,
  DifficultyLevel,
  DurationSeconds,
  QuizStoryboard,
} from "./types";

async function parseJsonSafely(response: Response): Promise<any> {
  const raw = await response.text();
  try {
    return JSON.parse(raw);
  } catch {
    const trimmed = raw.trim();
    if (trimmed.startsWith("<")) {
      throw new Error(
        `Server returned an HTML response (HTTP ${response.status}) instead of JSON. Please try again.`
      );
    }
    throw new Error(trimmed || `Unexpected server response (HTTP ${response.status}).`);
  }
}

export default function App() {
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState<ContentType>("Movie");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Medium");
  const [duration, setDuration] = useState<DurationSeconds>(30);
  const [clueCount, setClueCount] = useState<number>(5);

  const [activeTab, setActiveTab] = useState<"setup" | "clues">("setup");
  const [storyboard, setStoryboard] = useState<QuizStoryboard | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(
    "Crafting difficulty-calibrated visual clues..."
  );
  const [error, setError] = useState<string | null>(null);
  const [regeneratingClueIndex, setRegeneratingClueIndex] = useState<number | null>(null);
  const [specsModalOpen, setSpecsModalOpen] = useState(false);

  const compiled = useMemo(() => {
    if (!storyboard) return null;
    return compileStoryboard(storyboard);
  }, [storyboard]);

  const activeClueIndex = useMemo(() => {
    if (!compiled) return null;
    const idx = compiled.timeline.clueWindows.findIndex(
      (w) => currentTime >= w.start && currentTime < w.end
    );
    return idx >= 0 ? idx : null;
  }, [compiled, currentTime]);

  const handleGenerate = async (overrideTitle?: string, overrideType?: ContentType) => {
    const targetTitle = (overrideTitle ?? title).trim();
    const targetType = overrideType ?? contentType;
    if (!targetTitle) {
      setError("Please enter a Movie or TV Series name.");
      return;
    }

    setError(null);
    setIsPlaying(false);
    setIsGenerating(true);
    setGenerationStep("Connecting to storyboard engine...");

    try {
      const response = await fetch("/api/generate-storyboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream, application/json",
        },
        body: JSON.stringify({
          title: targetTitle,
          contentType: targetType,
          difficulty,
          duration,
          clueCount,
        }),
      });

      const contentTypeHeader = response.headers.get("content-type") || "";

      if (contentTypeHeader.includes("text/event-stream") && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let receivedStoryboard: QuizStoryboard | null = null;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const block of events) {
            const lines = block
              .split("\n")
              .filter((line) => line.startsWith("data:"))
              .map((line) => line.slice(5).trim());
            if (lines.length === 0) continue;

            const payload = JSON.parse(lines.join("\n"));
            if (payload.type === "status" && payload.message) {
              setGenerationStep(payload.message);
            } else if (payload.type === "error") {
              throw new Error(payload.error || "Unable to generate whiteboard storyboard.");
            } else if (payload.type === "result" && payload.storyboard) {
              receivedStoryboard = payload.storyboard as QuizStoryboard;
            }
          }
        }

        if (!receivedStoryboard) {
          throw new Error("Stream ended before storyboard finished generating. Please try again.");
        }

        setStoryboard(receivedStoryboard);
        setCurrentTime(0);
        setIsPlaying(true);
      } else {
        const data = await parseJsonSafely(response);
        if (!response.ok) {
          throw new Error(data?.error || "Unable to generate whiteboard storyboard.");
        }
        setStoryboard(data as QuizStoryboard);
        setCurrentTime(0);
        setIsPlaying(true);
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong while generating your video.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateClue = (index: number, patch: Partial<ClueScene>) => {
    setStoryboard((prev) => {
      if (!prev) return prev;
      const updated = prev.clues.map((c, idx) => (idx === index ? { ...c, ...patch } : c));
      return { ...prev, clues: updated };
    });
  };

  const handleRegenerateClue = async (index: number) => {
    if (!storyboard || regeneratingClueIndex !== null) return;
    setRegeneratingClueIndex(index);
    setError(null);

    try {
      const response = await fetch("/api/regenerate-clue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: storyboard.title,
          contentType: storyboard.contentType,
          difficulty: storyboard.difficulty,
          clueIndex: index + 1,
          totalClues: storyboard.clues.length,
          existingCaptions: storyboard.clues.map((c) => c.caption),
        }),
      });
      const data = await parseJsonSafely(response);
      if (!response.ok) {
        throw new Error(data?.error || "Failed to redraw clue.");
      }
      handleUpdateClue(index, data as ClueScene);
    } catch (err: any) {
      setError(err?.message || "Failed to redraw clue.");
    } finally {
      setRegeneratingClueIndex(null);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStoryboard(null);
    setCurrentTime(0);
    setTitle("");
    setError(null);
    setActiveTab("setup");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#111111] text-[#F0F0F0]">
      {/* Top Bar Contract: 3-zone single row */}
      <header className="bg-[#161616] border-b border-[#2D2D2D]">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#studio"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("setup");
            }}
            className="text-lg font-bold tracking-tight text-[#FFFFFF] whitespace-nowrap shrink-0 font-display"
          >
            Whiteboard Quiz Studio
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#9F9FAA]">
            <button
              type="button"
              onClick={() => setActiveTab("setup")}
              className={`hover:text-[#FFFFFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === "setup"
                  ? "text-[#FFFFFF] underline decoration-[#F96921] decoration-2 underline-offset-4"
                  : ""
              }`}
            >
              Parameters
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("clues")}
              className={`hover:text-[#FFFFFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === "clues"
                  ? "text-[#FFFFFF] underline decoration-[#F96921] decoration-2 underline-offset-4"
                  : ""
              }`}
            >
              Storyboard
            </button>
            <button
              type="button"
              onClick={() => setSpecsModalOpen(true)}
              className="hover:text-[#FFFFFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Export Guide
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="hover:text-[#FFFFFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Clear
            </button>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => {
                setTitle("Inception");
                setContentType("Movie");
                setActiveTab("setup");
                handleGenerate("Inception", "Movie");
              }}
              disabled={isGenerating}
              className="px-4 py-2 text-xs font-semibold text-[#111111] bg-[#F96921] hover:bg-[#FF7B38] disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Run Sample
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <main id="studio" className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[410px_minmax(0,1fr)] gap-6 items-stretch min-h-[calc(100vh-8rem)]">
          <QuizConfigPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            title={title}
            onTitleChange={setTitle}
            contentType={contentType}
            onContentTypeChange={setContentType}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            duration={duration}
            onDurationChange={setDuration}
            clueCount={clueCount}
            onClueCountChange={setClueCount}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            error={error}
            storyboard={storyboard}
            compiled={compiled}
            activeClueIndex={activeClueIndex}
            onJumpToTime={(t) => {
              setCurrentTime(t);
              setIsPlaying(true);
            }}
            onUpdateClue={handleUpdateClue}
            onRegenerateClue={handleRegenerateClue}
            regeneratingClueIndex={regeneratingClueIndex}
          />

          <WhiteboardStage
            compiled={compiled}
            isGenerating={isGenerating}
            generationStep={generationStep}
            currentTime={currentTime}
            onTimeChange={setCurrentTime}
            isPlaying={isPlaying}
            onPlayingChange={setIsPlaying}
            onTrySample={(sampleTitle, sampleType) => {
              setTitle(sampleTitle);
              setContentType(sampleType);
              handleGenerate(sampleTitle, sampleType);
            }}
          />
        </div>
      </main>

      <PublishingSpecsModal
        open={specsModalOpen}
        onClose={() => setSpecsModalOpen(false)}
      />
    </div>
  );
}
