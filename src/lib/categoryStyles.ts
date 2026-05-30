import type { EventCategory } from '../types'

export const CATEGORY_BAR_STYLES: Record<EventCategory, string> = {
  founding: 'bg-amber-500',
  war: 'bg-red-500',
  conflict: 'bg-orange-500',
  peace: 'bg-emerald-500',
  society: 'bg-violet-500',
  operation: 'bg-blue-500',
  election: 'bg-stone-500',
}

export const CATEGORY_STROKE_STYLES: Record<EventCategory, string> = {
  founding: 'stroke-amber-500',
  war: 'stroke-red-500',
  conflict: 'stroke-orange-500',
  peace: 'stroke-emerald-500',
  society: 'stroke-violet-500',
  operation: 'stroke-blue-500',
  election: 'stroke-stone-500',
}

export function getCategoryBarStyle(category: EventCategory): string {
  return CATEGORY_BAR_STYLES[category]
}

export function getCategoryStrokeStyle(category: EventCategory): string {
  return CATEGORY_STROKE_STYLES[category]
}
