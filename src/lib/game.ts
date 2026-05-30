import type { HistoryEvent } from '../types'
import { getMainPercentage } from './calculations'

export const ROUNDS_PER_GAME = 4

export function pickRandomEvents(
  all: HistoryEvent[],
  count = ROUNDS_PER_GAME,
): HistoryEvent[] {
  const shuffled = [...all]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, count)
}

export function getActualPercent(eventYear: number): number {
  return getMainPercentage(eventYear) * 100
}

export function scoreRound(
  guessPercent: number,
  actualPercent: number,
): number {
  return Math.max(0, Math.round(100 - Math.abs(guessPercent - actualPercent)))
}

export function sumScores(roundScores: number[]): number {
  return roundScores.reduce((sum, score) => sum + score, 0)
}

export function formatYearRange(year: number, endYear: number): string {
  return endYear === year ? String(year) : `${year}–${endYear}`
}
