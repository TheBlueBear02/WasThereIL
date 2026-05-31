import { TOTAL_POPULATION } from '../../data/cbs-population'
import { formatCount } from '../../lib/calculations'
import { BOTTOM_ACTION_CLASS } from '../layout/bottomAction'
import { PrimaryButton } from '../ui/PrimaryButton'

type HomeScreenProps = {
  onPlay: () => void
}

export function HomeScreen({ onPlay }: HomeScreenProps) {
  const totalLabel = formatCount(TOTAL_POPULATION)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="shrink-0 pt-2">
        <img
          src="/images/header-logo.png"
          alt="מצב האומה"
          className="mx-auto h-12 w-full object-contain"
        />
      </header>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-start overflow-y-auto pt-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900">
          אתה זוכר?
        </h1>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-600">
          
          נחשו איזה חלק מהאוכלוסייה בישראל היום היה כאן בזמן אירועים היסטוריים
        </p>
        <p className="mt-2 text-xs text-stone-500">
          מבוסס על נתוני הלמ״ס 2024 (כ־{totalLabel})
        </p>
      </div>

      <div className={BOTTOM_ACTION_CLASS}>
        <PrimaryButton onClick={onPlay}>שחק</PrimaryButton>
      </div>
    </div>
  )
}
