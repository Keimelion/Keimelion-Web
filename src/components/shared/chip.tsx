import { cn } from '@/lib/utils'

interface ChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-pressed'> {
  isSelected: boolean
}

export function Chip({
  isSelected,
  className,
  type = 'button',
  ...props
}: ChipProps): React.JSX.Element {
  return (
    <button
      type={type}
      aria-pressed={isSelected}
      className={cn(
        'inline-flex h-[34px] shrink-0 cursor-pointer items-center gap-1.5 rounded-pill bg-raised px-3.5 text-sm font-semibold whitespace-nowrap text-ink shadow-[inset_0_0_0_1.5px_var(--rule)] transition-press outline-none hover:shadow-[inset_0_0_0_1.5px_var(--rule-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:scale-[0.94] disabled:pointer-events-none disabled:opacity-50 aria-pressed:bg-inverse aria-pressed:text-on-inverse aria-pressed:shadow-none [&_svg]:size-4',
        className,
      )}
      {...props}
    />
  )
}
