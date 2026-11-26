interface ProgressProps {
  value: number
  max: number
  label: string
  valueText: string
}

const PERCENT = 100

export function Progress({ value, max, label, valueText }: ProgressProps): React.JSX.Element {
  const percentage = max === 0 ? 0 : Math.min(PERCENT, Math.max(0, (value / max) * PERCENT))
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={valueText}
        className="h-2 min-w-0 flex-1 overflow-hidden rounded-[9px] bg-raised/70"
      >
        <div
          className="h-full rounded-[9px] bg-brand"
          style={{ width: `${String(percentage)}%` }}
        />
      </div>
      <span aria-hidden="true" className="shrink-0 font-mono text-label tracking-normal">
        {valueText}
      </span>
    </div>
  )
}
