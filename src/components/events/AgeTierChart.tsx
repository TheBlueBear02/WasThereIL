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

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

type AgeTierChartProps = {
  tiers: AgeTier[]
  /** Stagger bar fill + fade-in on mount (check phase) */
  animate?: boolean
  /** When to start the reveal (check phase: after points animation) */
  revealDelayMs?: number
}

export function AgeTierChart({
  tiers,
  animate = false,
  revealDelayMs = 2500,
}: AgeTierChartProps) {
  const [revealed, setRevealed] = useState(
    !animate || prefersReducedMotion(),
  )

  useEffect(() => {
    if (!animate || prefersReducedMotion()) return
    const timeoutId = window.setTimeout(() => setRevealed(true), revealDelayMs)
    return () => window.clearTimeout(timeoutId)
  }, [animate, revealDelayMs])

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
