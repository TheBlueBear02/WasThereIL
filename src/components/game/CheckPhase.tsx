import { useMemo } from 'react'
import type { HistoryEvent, RoundResult } from '../../types'
import { formatCount, getAgeTiers, getApproxCount } from '../../lib/calculations'
import { getCategoryStrokeStyle } from '../../lib/categoryStyles'
import { formatYearRange, ROUNDS_PER_GAME } from '../../lib/game'
import { BOTTOM_ACTION_CLASS } from '../layout/bottomAction'
import { PrimaryButton } from '../ui/PrimaryButton'
import { AgeTierChart } from '../events/AgeTierChart'
import { HalfDonutGauge } from './HalfDonutGauge'

type CheckPhaseProps = {
  event: HistoryEvent
  result: RoundResult
  roundNumber: number
  onNext: () => void
}

export function CheckPhase({
  event,
  result,
  roundNumber,
  onNext,
}: CheckPhaseProps) {
  const yearLabel = formatYearRange(event.year, event.endYear)
  const answerStrokeClass = getCategoryStrokeStyle(event.category)
  const isLastRound = roundNumber >= ROUNDS_PER_GAME

  const tiers = useMemo(() => getAgeTiers(event.year), [event.year])
  const approxCount = useMemo(
    () => getApproxCount(result.actualPercent / 100),
    [result.actualPercent],
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold leading-tight text-stone-900 sm:text-3xl">
            {event.name}
          </h2>
          <p className="mt-2 text-base text-stone-500">{yearLabel}</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-snug text-stone-600">
            {event.description}
          </p>
        </div>

        <div className="px-4 pb-5 space-y-4">
          <HalfDonutGauge
            percent={result.guessPercent}
            comparePercent={result.actualPercent}
            compareStrokeClassName={answerStrokeClass}
            readOnly
          />

          <p className="text-xs text-stone-500 text-center">
            כ־{formatCount(approxCount)} אנשים
          </p>

          <p className="border-t border-stone-200 pt-3 text-center text-sm font-semibold text-stone-900">
            {result.points} נקודות בסיבוב זה
          </p>
        </div>

        <div className="p-4">
          <p className="mb-3 text-xs font-medium text-stone-600">
            פילוח לפי גילאים
          </p>
          <AgeTierChart tiers={tiers} />
        </div>
      </div>

      <div className={BOTTOM_ACTION_CLASS}>
        <PrimaryButton onClick={onNext}>
          {isLastRound ? 'לתוצאות' : 'הבא'}
        </PrimaryButton>
      </div>
    </div>
  )
}
