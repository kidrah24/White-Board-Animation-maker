export type ContentType = "Movie" | "TV Series";
export type DifficultyLevel = "Easy" | "Medium" | "Hard";
export type DurationSeconds = 15 | 30 | 45 | 60;
export type MarkerAccent = "orange" | "blue" | "red" | "green" | "amber";

export type SymbolBadge =
  | "question"
  | "lightning"
  | "star"
  | "heart"
  | "clock"
  | "eye"
  | "film"
  | "skull"
  | "crown"
  | "key"
  | "fire"
  | "music";

export interface WhiteboardStroke {
  d: string;
  color: "black" | "accent" | "muted";
  strokeWidth: number;
  annotation?: boolean;
}

export interface ClueScene {
  id: string;
  index: number;
  header: string;
  caption: string;
  symbolBadge: SymbolBadge;
  accentColor: MarkerAccent;
  calloutLabel?: string;
  calloutX?: number;
  calloutY?: number;
  strokes: WhiteboardStroke[];
}

export interface QuizStoryboard {
  title: string;
  contentType: ContentType;
  difficulty: DifficultyLevel;
  duration: DurationSeconds;
  clueCount: number;
  hookHeadline: string;
  hookSubline: string;
  releaseYear: string;
  creatorOrDirector: string;
  genreLabel: string;
  revealFact: string;
  clues: ClueScene[];
}

export interface GenerateRequest {
  title: string;
  contentType: ContentType;
  difficulty: DifficultyLevel;
  duration: DurationSeconds;
  clueCount: number;
}
