import Image from 'next/image'
import type { LineIconProps } from '@/components/icons'
import { OCCASION_PAPER_CLASS_NAMES } from '@/lib/occasions/occasion-paper'
import type { OccasionPaper } from '@/lib/occasions/occasion-paper'
import { cn } from '@/lib/utils'

export const ThumbSizes = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
} as const

export type ThumbSize = (typeof ThumbSizes)[keyof typeof ThumbSizes]

interface ThumbSizeStyle {
  box: string
  icon: string
  pixels: number
}

const THUMB_SIZE_STYLES: Readonly<Record<ThumbSize, ThumbSizeStyle>> = {
  [ThumbSizes.SM]: { box: 'size-10 rounded-[10px]', icon: 'size-6', pixels: 40 },
  [ThumbSizes.MD]: { box: 'size-16 rounded-[14px]', icon: 'size-[39px]', pixels: 64 },
  [ThumbSizes.LG]: { box: 'size-[90px] rounded-thumb', icon: 'size-[55px]', pixels: 90 },
}

interface DrawingThumbProps {
  kind: 'drawing'
  size: ThumbSize
  paper: OccasionPaper
  icon: React.ComponentType<LineIconProps>
}

interface PhotoThumbProps {
  kind: 'photo'
  size: ThumbSize
  src: string
  alt: string
}

type ThumbProps = DrawingThumbProps | PhotoThumbProps

export function Thumb(props: ThumbProps): React.JSX.Element {
  const sizeStyle = THUMB_SIZE_STYLES[props.size]
  if (props.kind === 'photo') {
    return (
      <span className={cn('relative block shrink-0 overflow-hidden bg-sunken', sizeStyle.box)}>
        <Image
          src={props.src}
          alt={props.alt}
          fill
          sizes={`${String(sizeStyle.pixels)}px`}
          className="object-cover brightness-(--photo-brightness)"
        />
      </span>
    )
  }
  const Icon = props.icon
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center text-ink',
        OCCASION_PAPER_CLASS_NAMES[props.paper].paper,
        sizeStyle.box,
      )}
    >
      <Icon className={sizeStyle.icon} />
    </span>
  )
}
