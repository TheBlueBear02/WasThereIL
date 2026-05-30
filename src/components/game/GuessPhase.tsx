import { useState } from 'react'
import type { HistoryEvent } from '../../types'
import { formatYearRange } from '../../lib/game'
import { BOTTOM_ACTION_CLASS } from '../layout/bottomAction'
import { PrimaryButton } from '../ui/PrimaryButton'
import { HalfDonutGauge } from './HalfDonutGauge'

type GuessPhaseProps = {
  event: HistoryEvent
  onSubmit: (guessPercent: number) => void
}

export function GuessPhase({ event, onSubmit }: GuessPhaseProps) {
  const [guessPercent, setGuessPercent] = useState(50)
  const yearLabel = formatYearRange(event.year, event.endYear)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-12 overflow-y-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold leading-tight text-stone-900 sm:text-3xl">
            {event.name}
          </h2>
          <p className="mt-2 text-base text-stone-500">{yearLabel}</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-snug text-stone-600">
            {event.description}
          </p>
        </div>

        <div className="px-4 pb-5">
          <p className="mb-0 text-center text-sm text-stone-600">
            איזה חלק מהאוכלוסייה בישראל היום היה כאן בזמן {event.name}?
          </p>
          <HalfDonutGauge
            percent={guessPercent}
            onChange={setGuessPercent}
          />
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={guessPercent}
            onChange={(e) => setGuessPercent(Number(e.target.value))}
            className="mx-auto mt-4 block h-2 w-[85%] max-w-xs cursor-pointer accent-primary"
            dir="ltr"
            aria-label="אחוז הניחוש"
          />
        </div>
      </div>

      <div className={BOTTOM_ACTION_CLASS}>
        <PrimaryButton onClick={() => onSubmit(guessPercent)}>
          אישור
        </PrimaryButton>
      </div>
    </div>
  )
}
