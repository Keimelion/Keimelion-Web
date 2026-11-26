import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function TeacupIcon({
  weight = LineIconWeights.FINE,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <path d="M16 30h34v10a17 17 0 0 1-34 0z" />
      <path d="M50 34h4a6 6 0 0 1 0 12h-5" />
      <path d="M26 22c0-4 4-4 4-8M36 22c0-4 4-4 4-8" />
      <path d="M14 60h40" />
    </LineIcon>
  )
}
