import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function BookIcon({
  weight = LineIconWeights.FINE,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <path d="M14 18h20a6 6 0 0 1 6 6v34a5 5 0 0 0-5-5H14z" />
      <path d="M58 18H44a6 6 0 0 0-4 2" />
      <path d="M58 18v35H45a5 5 0 0 0-5 5" />
    </LineIcon>
  )
}
