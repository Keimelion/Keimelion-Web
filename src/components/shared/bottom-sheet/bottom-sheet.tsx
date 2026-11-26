'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { AnimatePresence, motion, useDragControls } from 'motion/react'
import type { PanInfo } from 'motion/react'
import { scrim, sheetUp } from '@/lib/motion'

interface BottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string | null
  children: React.ReactNode
}

const SWIPE_CLOSE_DISTANCE_PX = 80
const SWIPE_CLOSE_VELOCITY = 500
const DRAG_ELASTICITY = { top: 0, bottom: 0.6 }

export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
}: BottomSheetProps): React.JSX.Element {
  const dragControls = useDragControls()
  const closeOnSwipe = (_event: PointerEvent, info: PanInfo): void => {
    if (isSwipeDown(info)) onOpenChange(false)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div className="fixed inset-0 z-50 bg-scrim" {...scrim} />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              asChild
              forceMount
              {...(description === null ? { 'aria-describedby': undefined } : {})}
            >
              <motion.div
                className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[90dvh] w-full flex-col overflow-y-auto rounded-t-sheet bg-raised px-[22px] pt-2.5 pb-[30px] text-ink shadow-float outline-none md:max-w-tablet"
                drag="y"
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={DRAG_ELASTICITY}
                onDragEnd={closeOnSwipe}
                {...sheetUp}
              >
                <div
                  aria-hidden="true"
                  onPointerDown={(event) => {
                    dragControls.start(event)
                  }}
                  className="-mx-[22px] -mt-2.5 flex shrink-0 cursor-grab touch-none justify-center pt-2.5 pb-3.5 active:cursor-grabbing"
                >
                  <span className="h-[5px] w-11 rounded-[9px] bg-rule" />
                </div>
                <DialogPrimitive.Title className="text-title">{title}</DialogPrimitive.Title>
                {description === null ? null : (
                  <DialogPrimitive.Description className="mt-1.5 text-sm text-muted-foreground">
                    {description}
                  </DialogPrimitive.Description>
                )}
                {children}
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

function isSwipeDown(info: PanInfo): boolean {
  return info.offset.y > SWIPE_CLOSE_DISTANCE_PX || info.velocity.y > SWIPE_CLOSE_VELOCITY
}
