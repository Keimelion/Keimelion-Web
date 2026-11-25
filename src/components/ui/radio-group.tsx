'use client'

import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'

import { cn } from '@/lib/utils'

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn('grid gap-3', className)} {...props} />
))
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'touch-target inline-flex size-[22px] shrink-0 cursor-pointer items-center justify-center rounded-pill bg-raised shadow-[inset_0_0_0_1.5px_var(--rule-strong)] transition-press outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:shadow-[inset_0_0_0_2px_var(--brand)]',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="size-2.5 rounded-pill bg-brand" />
  </RadioGroupPrimitive.Item>
))
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

const RadioGroupCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'group flex min-w-0 cursor-pointer flex-col gap-3 rounded-card bg-raised p-3 text-left text-ink shadow-[inset_0_0_0_1.5px_var(--rule)] transition-press outline-none hover:shadow-[inset_0_0_0_1.5px_var(--rule-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-brand data-[state=checked]:text-on-brand data-[state=checked]:shadow-none',
      className,
    )}
    {...props}
  >
    {children}
  </RadioGroupPrimitive.Item>
))
RadioGroupCard.displayName = 'RadioGroupCard'

export { RadioGroup, RadioGroupItem, RadioGroupCard }
