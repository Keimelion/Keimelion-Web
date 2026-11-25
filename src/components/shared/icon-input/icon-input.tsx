import * as React from 'react'
import type { LineIconProps } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface IconInputProps extends React.ComponentProps<'input'> {
  icon: React.ComponentType<LineIconProps>
}

export const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ icon: Icon, className, ...props }, ref) => (
    <div className="relative w-full min-w-0">
      <Icon className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-rule-strong" />
      <Input ref={ref} className={cn('pl-11', className)} {...props} />
    </div>
  ),
)
IconInput.displayName = 'IconInput'
