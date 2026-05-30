import { useMemo } from 'react'
import type { HistoryEvent } from '../../types'
import {
  formatCount,
  formatPercent,
  getAgeTiers,
  getApproxCount,
  getMainPercentage,
} from '../../lib/calculations'
import { getCategoryBarStyle } from '../../lib/categoryStyles'
import { formatYearRange } from '../../lib/game'
import { AgeTierChart } from './AgeTierChart'

type EventCardProps = {
  event: HistoryEvent
  isExpanded: boolean
  onToggle: () => void
}

export function EventCard({ event, isExpanded, onToggle }: EventCardProps) {
  const percentage = useMemo(
    () => getMainPercentage(event.year),
    [event.year],
  )
  const approxCount = useMemo(
    () => getApproxCount(percentage),
    [percentage],
  )
  const tiers = useMemo(
    () => (isExpanded ? getAgeTiers(event.year) : null),
    [event.year, isExpanded],
  )

  const barStyle = getCategoryBarStyle(event.category)
  const yearLabel = formatYearRange(event.year, event.endYear)

  return (
    <article className="rounded-lg border border-stone-200 bg-stone-50">
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-11 w-full flex-col gap-2 p-4 text-start"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-sm font-medium leading-snug text-stone-900">
            {event.name}
          </h2>
          <span className="shrink-0 text-xs text-stone-500">{yearLabel}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[15px] font-semibold text-stone-900">
            {formatPercent(percentage)}
          </span>
          <span
            className={`text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            aria-hidden
          >
            ▼
          </span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-stone-200"
          dir="ltr"
        >
          <div
            className={`h-full rounded-full transition-[width] duration-400 ease-out ${barStyle}`}
            style={{ width: `${percentage * 100}%` }}
          />
        </div>

        <p className="text-xs text-stone-500">
          כ־{formatCount(approxCount)} אנשים
        </p>
      </button>

      {isExpanded && tiers && (
        <div className="px-4 pb-4">
          <AgeTierChart tiers={tiers} />
        </div>
      )}
    </article>
  )
}
