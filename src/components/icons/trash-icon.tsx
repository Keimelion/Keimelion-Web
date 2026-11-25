import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function TrashIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <path d="M16 22h40" />
      <path d="M28 22v-6h16v6" />
      <path d="M20 22l3 36h26l3-36" />
    </LineIcon>
  )
}
