import { useEffect, useState } from 'react'

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

type UseAnimatedValueOptions = {
  enabled?: boolean
  durationMs?: number
  /** Pause at the start value before the ease begins */
  delayMs?: number
}

/** Eases from 0 to `target` on mount when `enabled`; respects reduced motion. */
export function useAnimatedValue(
  target: number,
  { enabled = true, durationMs = 900, delayMs = 0 }: UseAnimatedValueOptions = {},
): number {
  const shouldAnimate = enabled && !prefersReducedMotion()
  const [value, setValue] = useState(shouldAnimate ? 0 : target)

  useEffect(() => {
    if (!shouldAnimate) {
      setValue(target)
      return
    }

    setValue(0)
    let start: number | null = null
    let raf = 0

    const run = (ts: number) => {
      if (start == null) start = ts
      const t = Math.min(1, (ts - start) / durationMs)
      setValue(target * easeOutCubic(t))
      if (t < 1) raf = requestAnimationFrame(run)
      else setValue(target)
    }

    const startAnimation = () => {
      raf = requestAnimationFrame(run)
    }

    const timeoutId =
      delayMs > 0 ? window.setTimeout(startAnimation, delayMs) : undefined
    if (!timeoutId) startAnimation()

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId)
      cancelAnimationFrame(raf)
    }
  }, [target, shouldAnimate, durationMs, delayMs])

  return value
}
