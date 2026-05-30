import type { GameSession } from '../../types'
import { ROUNDS_PER_GAME } from '../../lib/game'
import { CheckPhase } from './CheckPhase'
import { GuessPhase } from './GuessPhase'

type GameScreenProps = {
  session: GameSession
  onSubmitGuess: (guessPercent: number) => void
  onNext: () => void
}

export function GameScreen({
  session,
  onSubmitGuess,
  onNext,
}: GameScreenProps) {
  const event = session.events[session.roundIndex]
  const roundNumber = session.roundIndex + 1
  const currentResult = session.roundResults[session.roundIndex]

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <p className="mb-6 shrink-0 text-center text-sm text-stone-500">
        אירוע {roundNumber} מתוך {ROUNDS_PER_GAME}
      </p>

      {session.phase === 'guessing' && (
        <GuessPhase event={event} onSubmit={onSubmitGuess} />
      )}

      {session.phase === 'check' && currentResult && (
        <CheckPhase
          event={event}
          result={currentResult}
          roundNumber={roundNumber}
          onNext={onNext}
        />
      )}
    </div>
  )
}
