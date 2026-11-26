'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

import { CheckIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer touch-target inline-flex size-[22px] shrink-0 cursor-pointer items-center justify-center rounded-md bg-raised shadow-[inset_0_0_0_1.5px_var(--rule-strong)] transition-press outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:shadow-[inset_0_0_0_2px_var(--danger)] data-[state=checked]:bg-brand data-[state=checked]:text-on-brand data-[state=checked]:shadow-none',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="data-[state=checked]:animate-in data-[state=checked]:zoom-in-50 data-[state=checked]:duration-200 data-[state=checked]:ease-spring">
      <CheckIcon className="size-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
