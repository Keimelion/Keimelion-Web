import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function CloseIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <path d="M20 20l32 32M52 20L20 52" />
    </LineIcon>
  )
}
