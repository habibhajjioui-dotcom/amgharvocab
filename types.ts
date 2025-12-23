
export enum CEFRLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
}

export interface TranslationSense {
  meaning: string;
  translation: string;
  confidence: number;
}

export interface TranslateResponse {
  word: string;
  pos: string;
  translations: TranslationSense[];
  example_target: string;
  example_native: string;
  tts_hint: string;
  debug?: any;
}

export interface GenerateTextResponse {
  title: string;
  content: string;
  target_language: string;
}

export interface VocabSense {
  translation: string;
  example: string;
}

export interface VocabItem {
  id: string;
  word: string;
  pos: string;
  context: string;
  targetLanguage: string;
  nativeLanguage: string;
  senses: VocabSense[];
  repetition: number;
  interval: number;
  easiness: number;
  nextReview: number;
}

export interface GeneratedText {
  id: string;
  title: string;
  content: string;
  level: CEFRLevel;
  targetLanguage: string;
  includedVocab: string[];
}

export interface UserSettings {
  userName: string;
  nativeLanguage: string;
  targetLanguage: string;
  targetLanguages: string[];
  level: CEFRLevel;
  preferredLevel: CEFRLevel;
  hasOnboarded: boolean;
  optOutAI: boolean;
  interests: string[];
}

export interface AppState {
  settings: UserSettings;
  vocab: VocabItem[];
  history: GeneratedText[];
}
