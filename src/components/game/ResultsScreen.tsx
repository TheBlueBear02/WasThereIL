import type { GameSession } from '../../types'
import { getCategoryStrokeStyle } from '../../lib/categoryStyles'
import { ROUNDS_PER_GAME } from '../../lib/game'
import { BOTTOM_ACTION_CLASS } from '../layout/bottomAction'
import { PrimaryButton } from '../ui/PrimaryButton'
import { HalfDonutGauge } from './HalfDonutGauge'

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
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto" dir="ltr">
        <div className="flex flex-col gap-6" dir="rtl">
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

          <ul className="flex flex-col gap-4">
            {session.roundResults.map((result) => {
              const event = session.events.find((e) => e.id === result.eventId)
              if (!event) return null

              const answerStrokeClass = getCategoryStrokeStyle(event.category)

              return (
                <li
                  key={result.eventId}
                  className="rounded-xl border border-stone-200 bg-stone-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 text-sm font-semibold leading-snug text-stone-900">
                      {event.name}
                    </p>
                    <p className="shrink-0 text-sm font-semibold text-stone-900">
                      {result.points} נק׳
                    </p>
                  </div>

                  <div className="mx-auto mt-2 max-w-[240px]">
                    <HalfDonutGauge
                      percent={result.guessPercent}
                      comparePercent={result.actualPercent}
                      compareStrokeClassName={answerStrokeClass}
                      readOnly
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className={`${BOTTOM_ACTION_CLASS} flex flex-col gap-3`}>
        <PrimaryButton onClick={onPlayAgain}>שחק שוב</PrimaryButton>
        <button
          type="button"
          onClick={onHome}
          className="flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-stone-300 bg-white px-6 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-50"
        >
          חזרה לדף הבית
        </button>
      </div>
    </div>
  )
}
