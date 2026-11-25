import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function BedIcon({
  weight = LineIconWeights.FINE,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <path d="M10 50V24" />
      <path d="M10 40h52v14" />
      <path d="M10 40v-6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v6" />
      <path d="M10 54h52" />
    </LineIcon>
  )
}
