import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function MailIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <rect x="10" y="18" width="52" height="36" rx="6" />
      <path d="M12 22l24 18 24-18" />
    </LineIcon>
  )
}
