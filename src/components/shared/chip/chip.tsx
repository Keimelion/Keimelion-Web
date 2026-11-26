import { cn } from '@/lib/utils'
import { CHIP_CLASS_NAME } from './chip-styles'

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
      className={cn(CHIP_CLASS_NAME, className)}
      {...props}
    />
  )
}
