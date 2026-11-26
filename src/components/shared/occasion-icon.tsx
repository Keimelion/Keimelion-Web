import { ArchesShape, CloudShape, FlowerShape, LeafShape, SunShape } from '@/components/icons'
import { OccasionShapes } from '@/lib/occasions/occasion-shape'
import type { OccasionShape } from '@/lib/occasions/occasion-shape'

interface OccasionIconProps {
  shape: OccasionShape
  className?: string | undefined
}

export function OccasionIcon({ shape, className }: OccasionIconProps): React.JSX.Element {
  switch (shape) {
    case OccasionShapes.FLOWER:
      return <FlowerShape className={className} />
    case OccasionShapes.CLOUD:
      return <CloudShape className={className} />
    case OccasionShapes.ARCHES:
      return <ArchesShape className={className} />
    case OccasionShapes.SUN:
      return <SunShape className={className} />
    case OccasionShapes.LEAF:
      return <LeafShape className={className} />
    default:
      return shape satisfies never
  }
}
