import type { GameSession } from '../../types'
import { formatPercent } from '../../lib/calculations'
import { ROUNDS_PER_GAME } from '../../lib/game'
import { BOTTOM_ACTION_CLASS } from '../layout/bottomAction'
import { PrimaryButton } from '../ui/PrimaryButton'

type ResultsScreenProps = {
  totalScore: number
  session: GameSession
  onPlayAgain: () => void
  onHome: () => void
}

export function ResultsScreen({
  totalScore,
  session,
  onPlayAgain,
  onHome,
}: ResultsScreenProps) {
  const maxScore = ROUNDS_PER_GAME * 100

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-stone-900">סיום המשחק</h1>
          <p className="mt-6 text-sm text-stone-600">סה״כ נקודות</p>
          <p className="mt-2 text-4xl font-bold text-stone-900">
            {totalScore}
            <span className="text-lg font-normal text-stone-500">
              {' '}
              / {maxScore}
            </span>
          </p>
        </div>

        <ul className="flex flex-col gap-3">
          {session.roundResults.map((result, index) => {
            const event = session.events.find((e) => e.id === result.eventId)
            if (!event) return null

            return (
              <li
                key={result.eventId}
                className="rounded-lg border border-stone-200 bg-stone-50 p-3"
              >
                <p className="text-xs text-stone-500">אירוע {index + 1}</p>
                <p className="mt-1 text-sm font-medium text-stone-900">
                  {event.name}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
                  <span>
                    ניחוש: {formatPercent(result.guessPercent / 100)} · תשובה:{' '}
                    {formatPercent(result.actualPercent / 100)}
                  </span>
                  <span className="font-semibold text-stone-900">
                    {result.points} נק׳
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className={`${BOTTOM_ACTION_CLASS} flex flex-col gap-3`}>
        <PrimaryButton onClick={onPlayAgain}>שחק שוב</PrimaryButton>
        <button
          type="button"
          onClick={onHome}
          className="flex h-11 w-full items-center justify-center rounded-lg border border-stone-300 bg-white px-6 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-50"
        >
          חזרה לדף הבית
        </button>
      </div>
    </div>
  )
}
