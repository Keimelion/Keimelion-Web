import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function ExtensionIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <path d="M16 26h12a6 6 0 1 1 12 0h12v12a6 6 0 1 1 0 12v10H16V50a6 6 0 1 0 0-12z" />
    </LineIcon>
  )
}
