import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function CalendarIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <rect x="12" y="16" width="48" height="42" rx="6" />
      <path d="M12 30h48" />
      <path d="M24 10v12M48 10v12" />
    </LineIcon>
  )
}
