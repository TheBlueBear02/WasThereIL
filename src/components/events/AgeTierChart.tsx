import type { AgeTier } from '../../types'
import { formatPercent } from '../../lib/calculations'

const TIER_COLORS = [
  'bg-sky-500',
  'bg-teal-500',
  'bg-amber-500',
  'bg-orange-500',
]

type AgeTierChartProps = {
  tiers: AgeTier[]
}

export function AgeTierChart({ tiers }: AgeTierChartProps) {
  return (
    <div className="mt-4 space-y-3 border-t border-stone-200 pt-4">
      {tiers.map((tier, index) => (
        <div key={tier.id}>
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-xs text-stone-600">{tier.label}</span>
            <span className="shrink-0 text-xs font-medium text-stone-800">
              {formatPercent(tier.percentage)}
            </span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-stone-200"
            dir="rtl"
          >
            <div
              className={`h-full rounded-full transition-[width] duration-400 ease-out ${TIER_COLORS[index]}`}
              style={{ width: `${tier.percentage * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
