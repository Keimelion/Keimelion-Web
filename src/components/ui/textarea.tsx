import * as React from 'react'

import { cn } from '@/lib/utils'
import { FIELD_CONTROL_CLASS_NAME } from './field-styles'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(FIELD_CONTROL_CLASS_NAME, 'min-h-28 resize-y py-3.5 break-words', className)}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
