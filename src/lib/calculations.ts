import { CBS_POPULATION, TOTAL_POPULATION } from '../data/cbs-population'
import type { AgeTier } from '../types'

export const REFERENCE_YEAR = 2025

const AGE_TIER_DEFINITIONS: Omit<AgeTier, 'percentage'>[] = [
  { id: 1, label: 'היו בגיל לזכור  (5+)', minAgeAtEvent: 5 },
  { id: 2, label: 'היו בגיל בת/בר מצווה ומעלה (12+)', minAgeAtEvent: 12 },
  { id: 3, label: 'היו בגיל צבא/הצבעה ומעלה (18+)', minAgeAtEvent: 18 },
  { id: 4, label: 'היו בוגרים (21+)', minAgeAtEvent: 21 },
]

export function getMinCurrentAge(
  eventYear: number,
  minAgeAtEvent = 0,
): number {
  return REFERENCE_YEAR - eventYear + minAgeAtEvent
}

export function getEligibleCount(minCurrentAge: number): number {
  return CBS_POPULATION.reduce(
    (sum, bucket) => (bucket.age >= minCurrentAge ? sum + bucket.total : sum),
    0,
  )
}

export function getMainPercentage(eventYear: number): number {
  const minCurrentAge = getMinCurrentAge(eventYear)
  return getEligibleCount(minCurrentAge) / TOTAL_POPULATION
}

export function getAgeTiers(eventYear: number): AgeTier[] {
  return AGE_TIER_DEFINITIONS.map((tier) => {
    const minCurrentAge = getMinCurrentAge(eventYear, tier.minAgeAtEvent)
    const percentage = getEligibleCount(minCurrentAge) / TOTAL_POPULATION
    return { ...tier, percentage }
  })
}

export function getApproxCount(percentage: number): number {
  return Math.round(percentage * TOTAL_POPULATION)
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) {
    const millions = n / 1_000_000
    const rounded =
      millions >= 10
        ? Math.round(millions)
        : Math.round(millions * 10) / 10
    return `${rounded} מיליון`
  }
  if (n >= 1_000) {
    const thousands = n / 1_000
    const rounded =
      thousands >= 100
        ? Math.round(thousands)
        : Math.round(thousands * 10) / 10
    return `${rounded} אלף`
  }
  return n.toLocaleString('he-IL')
}

export function formatPercent(ratio: number): string {
  return `${(ratio * 100).toFixed(1)}%`
}
