import type { GameSession } from '../../types'
import { ROUNDS_PER_GAME } from '../../lib/game'
import { BackButton } from '../ui/BackButton'
import { CheckPhase } from './CheckPhase'
import { GuessPhase } from './GuessPhase'

type GameScreenProps = {
  session: GameSession
  onSubmitGuess: (guessPercent: number) => void
  onNext: () => void
  onExit: () => void
}

export function GameScreen({
  session,
  onSubmitGuess,
  onNext,
  onExit,
}: GameScreenProps) {
  const event = session.events[session.roundIndex]
  const roundNumber = session.roundIndex + 1
  const currentResult = session.roundResults[session.roundIndex]

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative mb-6 shrink-0 pt-1">
        <BackButton onClick={onExit} className="absolute top-0 left-0" />
        <p className="text-center text-sm text-stone-500">
          אירוע {roundNumber} מתוך {ROUNDS_PER_GAME}
        </p>
      </div>

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
