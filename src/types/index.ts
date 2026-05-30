export type AgeBucket = { age: number; total: number }

export type EventCategory =
  | 'war'
  | 'conflict'
  | 'founding'
  | 'society'
  | 'peace'
  | 'operation'
  | 'election'

export type HistoryEvent = {
  id: string
  name: string
  description: string
  year: number
  endYear: number
  category: EventCategory
}

export type AgeTier = {
  id: number
  label: string
  minAgeAtEvent: number
  percentage: number
}

export type AppScreen = 'home' | 'game' | 'results'

export type GamePhase = 'guessing' | 'check'

export type RoundResult = {
  eventId: string
  guessPercent: number
  actualPercent: number
  points: number
}

export type GameSession = {
  events: HistoryEvent[]
  roundIndex: number
  phase: GamePhase
  roundResults: RoundResult[]
}
