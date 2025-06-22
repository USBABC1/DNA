export enum AppState {
  Welcome,
  Session,
  Analyzing,
  Report,
  Error,
}

export interface Question {
  id: number
  text: string
  audioUrl?: string
}

export interface SessionResponse {
  question: string
  audio: Blob
}

export interface SessionData {
  responses: SessionResponse[]
}

export interface AnalysisReport {
  overall_sentiment: string
  sentiment_over_time: { sentiment: string; timestamp: number }[]
  key_phrases: string[]
  transcription: string
}
