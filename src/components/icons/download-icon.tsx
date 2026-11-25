import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function DownloadIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <path d="M36 12v32" />
      <path d="M24 34l12 12 12-12" />
      <path d="M16 56h40" />
    </LineIcon>
  )
}
