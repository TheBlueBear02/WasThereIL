import { useEffect, useState } from 'react'
import type { AgeTier } from '../../types'
import { formatPercent } from '../../lib/calculations'

const TIER_COLORS = [
  'bg-sky-500',
  'bg-teal-500',
  'bg-amber-500',
  'bg-orange-500',
]

const BAR_STAGGER_MS = 700
const BAR_DURATION_MS = 1000
const REVEAL_DELAY_MS = 2500

type AgeTierChartProps = {
  tiers: AgeTier[]
  /** Stagger bar fill + fade-in on mount (check phase) */
  animate?: boolean
}

export function AgeTierChart({ tiers, animate = false }: AgeTierChartProps) {
  const [revealed, setRevealed] = useState(!animate)

  useEffect(() => {
    if (!animate) return
    const timeoutId = window.setTimeout(() => setRevealed(true), REVEAL_DELAY_MS)
    return () => window.clearTimeout(timeoutId)
  }, [animate])

  return (
    <div
      className={`space-y-3 transition-all duration-500 ease-out ${
        animate
          ? revealed
            ? 'translate-y-0 opacity-100'
            : 'translate-y-2 opacity-0'
          : ''
      } ${!animate ? 'mt-4 border-t border-stone-200 pt-4' : ''}`}
    >
      {tiers.map((tier, index) => (
        <div
          key={tier.id}
          className={
            animate
              ? `transition-all duration-500 ease-out ${
                  revealed
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-1 opacity-0'
                }`
              : undefined
          }
          style={
            animate
              ? { transitionDelay: `${120 + index * BAR_STAGGER_MS}ms` }
              : undefined
          }
        >
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
              className={`h-full rounded-full ease-out ${TIER_COLORS[index]}`}
              style={{
                width: revealed ? `${tier.percentage * 100}%` : '0%',
                transition: `width ${BAR_DURATION_MS}ms ease-out`,
                transitionDelay: animate
                  ? `${200 + index * BAR_STAGGER_MS}ms`
                  : undefined,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
