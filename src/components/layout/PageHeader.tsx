import { TOTAL_POPULATION } from '../../data/cbs-population'
import { formatCount } from '../../lib/calculations'

export function PageHeader() {
  const totalLabel = formatCount(TOTAL_POPULATION)

  return (
    <header className="mb-6">
      <h1 className="text-lg font-semibold text-stone-900">
        אתה זוכר?
      </h1>
      <p className="mt-1 text-sm leading-snug text-stone-600">
        איזה חלק מהאוכלוסייה בישראל היום היה כאן בזמן אירועים היסטוריים?
      </p>
      <p className="mt-2 text-xs text-stone-500">
        מבוסס על נתוני הלמ״ס 2024 (כ־{totalLabel})
      </p>
    </header>
  )
}
