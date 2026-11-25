'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { motion } from 'motion/react'

import { MotionDurations, MotionEasings } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  value: string
  knobId: string
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

const KNOB_TRANSITION = { duration: MotionDurations.M, ease: MotionEasings.STANDARD }

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ value, defaultValue, onValueChange, ...props }, ref) => {
  const knobId = React.useId()
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? '')
  const currentValue = value ?? uncontrolledValue
  const changeValue = (nextValue: string): void => {
    setUncontrolledValue(nextValue)
    onValueChange?.(nextValue)
  }
  return (
    <TabsContext.Provider value={{ value: currentValue, knobId }}>
      <TabsPrimitive.Root ref={ref} value={currentValue} onValueChange={changeValue} {...props} />
    </TabsContext.Provider>
  )
})
Tabs.displayName = TabsPrimitive.Root.displayName

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-grid h-9 max-w-full auto-cols-[minmax(0,1fr)] grid-flow-col items-center rounded-pill bg-sunken p-[3px]',
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, value, children, ...props }, ref) => {
  const context = useTabsContext()
  const isActive = context.value === value
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      value={value}
      className={cn(
        'touch-target inline-flex h-[30px] min-w-0 cursor-pointer items-center justify-center rounded-pill px-[13px] text-[13px] font-bold whitespace-nowrap text-muted-foreground transition-colors duration-200 outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-on-inverse [&_svg]:size-3.5',
        className,
      )}
      {...props}
    >
      {isActive ? (
        <motion.span
          layoutId={context.knobId}
          transition={KNOB_TRANSITION}
          className="absolute inset-0 rounded-pill bg-inverse"
        />
      ) : null}
      <span className="relative inline-flex min-w-0 items-center gap-1.5">{children}</span>
    </TabsPrimitive.Trigger>
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 min-w-0 rounded-field outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

function useTabsContext(): TabsContextValue {
  const context = React.useContext(TabsContext)
  if (context === null) throw new Error('Tabs parts must be used within <Tabs>')
  return context
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
