import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function UserIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <circle cx="36" cy="26" r="11" />
      <path d="M14 60c2-12 11-18 22-18s20 6 22 18" />
    </LineIcon>
  )
}
