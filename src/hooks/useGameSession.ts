import { useCallback, useMemo, useState } from 'react'
import { EVENTS } from '../data/events'
import {
  getActualPercent,
  pickRandomEvents,
  scoreRound,
  sumScores,
} from '../lib/game'
import type { AppScreen, GameSession } from '../types'

function createSession(): GameSession {
  return {
    events: pickRandomEvents(EVENTS),
    roundIndex: 0,
    phase: 'guessing',
    roundResults: [],
  }
}

export function useGameSession() {
  const [screen, setScreen] = useState<AppScreen>('home')
  const [session, setSession] = useState<GameSession | null>(null)

  const totalScore = useMemo(() => {
    if (!session) return 0
    return sumScores(session.roundResults.map((r) => r.points))
  }, [session])

  const startGame = useCallback(() => {
    setSession(createSession())
    setScreen('game')
  }, [])

  const submitGuess = useCallback((guessPercent: number) => {
    const clamped = Math.min(100, Math.max(0, Math.round(guessPercent)))
    setSession((current) => {
      if (!current || current.phase !== 'guessing') return current
      const event = current.events[current.roundIndex]
      const actualPercent = getActualPercent(event.year)
      const points = scoreRound(clamped, actualPercent)
      return {
        ...current,
        phase: 'check',
        roundResults: [
          ...current.roundResults,
          {
            eventId: event.id,
            guessPercent: clamped,
            actualPercent,
            points,
          },
        ],
      }
    })
  }, [])

  const nextRound = useCallback(() => {
    setSession((current) => {
      if (!current || current.phase !== 'check') return current
      if (current.roundIndex < current.events.length - 1) {
        return {
          ...current,
          roundIndex: current.roundIndex + 1,
          phase: 'guessing',
        }
      }
      setScreen('results')
      return current
    })
  }, [])

  const playAgain = useCallback(() => {
    setSession(createSession())
    setScreen('game')
  }, [])

  const goHome = useCallback(() => {
    setSession(null)
    setScreen('home')
  }, [])

  return {
    screen,
    session,
    totalScore,
    startGame,
    submitGuess,
    nextRound,
    playAgain,
    goHome,
  }
}
