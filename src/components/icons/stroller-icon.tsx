import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function StrollerIcon({
  weight = LineIconWeights.FINE,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <path d="M18 34h36v10a18 18 0 0 1-36 0z" />
      <path d="M54 34c6-12 0-18-6-18" />
      <circle cx="24" cy="62" r="4" />
      <circle cx="48" cy="62" r="4" />
    </LineIcon>
  )
}
