import { useCallback, useId, useRef } from 'react'
import {
  CHECK_GAUGE_DELAY_MS,
  CHECK_GAUGE_DURATION_MS,
} from '../../lib/checkPhaseAnimation'
import { formatPercent } from '../../lib/calculations'
import { useAnimatedValue } from '../../hooks/useAnimatedValue'

type HalfDonutGaugeProps = {
  percent: number
  onChange?: (percent: number) => void
  /** Second arc for read-only comparison (e.g. actual answer on check screen) */
  comparePercent?: number
  compareStrokeClassName?: string
  readOnly?: boolean
  /** Animate compare arc and answer label from 0% on mount (check phase) */
  animateCompare?: boolean
  /** Tailwind stroke class for the filled arc (e.g. stroke-primary) */
  strokeClassName?: string
  ariaLabel?: string
}

const SIZE = 280
const CX = SIZE / 2
const CY = SIZE * 0.58
const RADIUS = 99
const STROKE = 18
/** Top arc in compare mode — slightly wider to mask the arc beneath */
const TOP_STROKE = STROKE + 2

/** Upper semicircle arc, left → over the top → right */
const ARC_PATH = `M ${CX - RADIUS} ${CY} A ${RADIUS} ${RADIUS} 0 0 1 ${CX + RADIUS} ${CY}`

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)))
}

/** t = 0 at left (0%), t = 1 at right (100%) */
function pointOnArc(t: number): { x: number; y: number } {
  const angle = Math.PI * (1 - t)
  return {
    x: CX + RADIUS * Math.cos(angle),
    y: CY - RADIUS * Math.sin(angle),
  }
}

function progressArcPath(percent: number): string | null {
  if (percent <= 0) return null
  const start = pointOnArc(0)
  const end = pointOnArc(Math.min(100, percent) / 100)
  return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 0 1 ${end.x} ${end.y}`
}

function pointerToPercent(clientX: number, clientY: number, rect: DOMRect): number {
  const x = clientX - rect.left - CX * (rect.width / SIZE)
  const y = clientY - rect.top - CY * (rect.height / SIZE)
  const scale = rect.width / SIZE
  const nx = x / scale
  const ny = y / scale
  let angle = Math.atan2(-ny, nx)
  if (angle < 0) angle = 0
  if (angle > Math.PI) angle = Math.PI
  return clampPercent((1 - angle / Math.PI) * 100)
}

export function HalfDonutGauge({
  percent,
  onChange,
  comparePercent,
  compareStrokeClassName = 'stroke-stone-900',
  readOnly = false,
  animateCompare = false,
  strokeClassName = 'stroke-primary',
  ariaLabel = 'אחוז הניחוש',
}: HalfDonutGaugeProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const labelId = useId()
  const isInteractive = !readOnly && onChange != null
  const displayedCompare = useAnimatedValue(comparePercent ?? 0, {
    enabled: animateCompare && comparePercent != null,
    durationMs: CHECK_GAUGE_DURATION_MS,
    delayMs: CHECK_GAUGE_DELAY_MS,
  })
  const compareValue =
    comparePercent != null && animateCompare ? displayedCompare : comparePercent
  const progressPath = progressArcPath(percent)
  const comparePath =
    compareValue != null ? progressArcPath(compareValue) : null

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current
      if (!svg || !onChange) return
      onChange(pointerToPercent(clientX, clientY, svg.getBoundingClientRect()))
    },
    [onChange],
  )

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isInteractive) return
    e.currentTarget.setPointerCapture(e.pointerId)
    updateFromPointer(e.clientX, e.clientY)
  }

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isInteractive) return
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
    updateFromPointer(e.clientX, e.clientY)
  }

  const onKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (!isInteractive || !onChange) return
    const step = e.shiftKey ? 10 : 1
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      onChange(clampPercent(percent - step))
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      onChange(clampPercent(percent + step))
    } else if (e.key === 'Home') {
      e.preventDefault()
      onChange(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      onChange(100)
    }
  }

  const compareAriaLabel =
    comparePercent != null
      ? `ניחוש ${formatPercent(percent / 100)}, תשובה ${formatPercent((compareValue ?? comparePercent) / 100)}`
      : ariaLabel

  /** Shorter arc on top so both colors stay visible when one value is lower */
  const guessOnTop =
    compareValue != null && percent < compareValue

  return (
    <div className="relative mx-auto w-full max-w-[300px]" dir="ltr">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE * 0.72}`}
        className={`mx-auto block w-full select-none outline-none focus:outline-none focus-visible:outline-none ${
          isInteractive ? 'touch-none cursor-pointer' : ''
        }`}
        role={isInteractive ? 'slider' : 'img'}
        aria-valuemin={isInteractive ? 0 : undefined}
        aria-valuemax={isInteractive ? 100 : undefined}
        aria-valuenow={isInteractive ? percent : undefined}
        aria-labelledby={isInteractive ? labelId : undefined}
        aria-label={isInteractive ? ariaLabel : compareAriaLabel}
        tabIndex={isInteractive ? 0 : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
        style={{ outline: 'none' }}
      >
        <path
          d={ARC_PATH}
          fill="none"
          className="stroke-stone-200"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
        {compareValue != null ? (
          <>
            {!guessOnTop && progressPath && (
              <path
                d={progressPath}
                fill="none"
                className="stroke-primary-muted"
                strokeWidth={STROKE}
                strokeLinecap="round"
              />
            )}
            {comparePath && (
              <path
                d={comparePath}
                fill="none"
                className={compareStrokeClassName}
                strokeWidth={guessOnTop ? STROKE : TOP_STROKE}
                strokeLinecap="round"
              />
            )}
            {guessOnTop && progressPath && (
              <path
                d={progressPath}
                fill="none"
                className="stroke-primary-muted"
                strokeWidth={TOP_STROKE}
                strokeLinecap="round"
              />
            )}
          </>
        ) : (
          progressPath && (
            <path
              d={progressPath}
              fill="none"
              className={strokeClassName}
              strokeWidth={STROKE}
              strokeLinecap="round"
            />
          )
        )}
        {compareValue != null ? (
          <>
            <text
              x={CX}
              y={CY - 42}
              textAnchor="middle"
              className="fill-stone-500 text-[0.8rem] font-medium"
              style={{ fontFamily: 'inherit' }}
            >
              ניחוש {formatPercent(percent / 100)}
            </text>
            <text
              id={labelId}
              x={CX}
              y={CY - 12}
              textAnchor="middle"
              className="fill-stone-900 text-[1.85rem] font-semibold"
              style={{ fontFamily: 'inherit' }}
            >
              {formatPercent(compareValue / 100)}
            </text>
          </>
        ) : (
          <text
            id={labelId}
            x={CX}
            y={CY - 22}
            textAnchor="middle"
            className="fill-stone-900 text-[2rem] font-semibold"
            style={{ fontFamily: 'inherit' }}
          >
            {formatPercent(percent / 100)}
          </text>
        )}
      </svg>
      <div className="pointer-events-none -mt-2 flex justify-between px-1 text-xs text-stone-400">
        <span>0%</span>
        <span>100%</span>
      </div>
      {compareValue != null && (
        <div className="mt-3 flex justify-center gap-4 text-xs text-stone-600">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-4 rounded-full bg-primary-muted" />
            הניחוש שלך
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className={`inline-block h-2 w-4 rounded-full ${compareStrokeClassName.replace('stroke-', 'bg-')}`}
            />
            התשובה
          </span>
        </div>
      )}
    </div>
  )
}
