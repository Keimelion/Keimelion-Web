import { cn } from '@/lib/utils'

export const LineIconWeights = {
  REGULAR: 5,
  FINE: 2.2,
} as const

export type LineIconWeight = (typeof LineIconWeights)[keyof typeof LineIconWeights]

const LINE_ICON_GRID = '0 0 72 72'

export interface LineIconProps extends Omit<
  React.SVGProps<SVGSVGElement>,
  'children' | 'strokeWidth' | 'viewBox'
> {
  weight?: LineIconWeight
}

interface LineIconBaseProps extends LineIconProps {
  children: React.ReactNode
}

export function LineIcon({
  weight = LineIconWeights.REGULAR,
  className,
  children,
  ...props
}: LineIconBaseProps): React.JSX.Element {
  return (
    <svg
      aria-hidden="true"
      viewBox={LINE_ICON_GRID}
      fill="none"
      stroke="currentColor"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('size-5 shrink-0', className)}
      {...props}
    >
      {children}
    </svg>
  )
}
