import * as React from 'react'

import { cn } from '@/lib/utils'
import { FIELD_CONTROL_CLASS_NAME } from './field-styles'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(FIELD_CONTROL_CLASS_NAME, 'h-13 truncate', className)}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
