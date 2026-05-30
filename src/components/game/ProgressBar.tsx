type ProgressBarProps = {
  percent: number
  barClassName: string
}

export function ProgressBar({ percent, barClassName }: ProgressBarProps) {
  const width = Math.min(100, Math.max(0, percent))

  return (
    <div className="h-2 overflow-hidden rounded-full bg-stone-200" dir="ltr">
      <div
        className={`h-full rounded-full transition-[width] duration-400 ease-out ${barClassName}`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}
