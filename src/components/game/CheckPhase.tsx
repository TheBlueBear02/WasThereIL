import { useEffect, useMemo, useState } from 'react'
import type { HistoryEvent, RoundResult } from '../../types'
import { formatCount, getAgeTiers, getApproxCount } from '../../lib/calculations'
import { getCategoryStrokeStyle } from '../../lib/categoryStyles'
import { formatYearRange, ROUNDS_PER_GAME } from '../../lib/game'
import { useAnimatedValue } from '../../hooks/useAnimatedValue'
import {
  CHECK_AGE_TIER_DELAY_MS,
  CHECK_POINTS_DELAY_MS,
  CHECK_POINTS_DURATION_MS,
} from '../../lib/checkPhaseAnimation'
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

  const [pointsRevealed, setPointsRevealed] = useState(false)
  const animatedPoints = useAnimatedValue(result.points, {
    durationMs: CHECK_POINTS_DURATION_MS,
    delayMs: CHECK_POINTS_DELAY_MS,
  })

  useEffect(() => {
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setPointsRevealed(true)
      return
    }
    const timeoutId = window.setTimeout(
      () => setPointsRevealed(true),
      CHECK_POINTS_DELAY_MS,
    )
    return () => window.clearTimeout(timeoutId)
  }, [])

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
            animateCompare
          />

          <p className="text-xs text-stone-500 text-center">
            כ־{formatCount(approxCount)} אנשים
          </p>

          <p
            className={`border-t border-stone-200 pt-3 text-center text-sm font-semibold text-stone-900 transition-all duration-500 ease-out ${
              pointsRevealed
                ? 'translate-y-0 opacity-100'
                : 'translate-y-2 opacity-0'
            }`}
          >
            קיבלת {Math.round(animatedPoints)} נקודות בסיבוב זה
          </p>
        </div>

        <div className="mx-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
          <p className="mb-3 text-xs font-medium text-stone-600">
            פילוח לפי גילאים
          </p>
          <AgeTierChart
            tiers={tiers}
            animate
            revealDelayMs={CHECK_AGE_TIER_DELAY_MS}
          />
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
