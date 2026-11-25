import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

const LUCIDE_BRAND_STROKE_WIDTH = 1.75

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-pill font-sans font-bold transition-press outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:scale-[0.94] active:duration-120 disabled:pointer-events-none disabled:bg-sunken disabled:text-rule-strong disabled:shadow-none aria-busy:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-brand text-on-brand shadow-[inset_0_-3px_0_var(--brand-deep)] hover:bg-brand-deep',
        ghost:
          'bg-transparent text-ink shadow-[inset_0_0_0_1.5px_var(--rule-strong)] hover:bg-sunken',
        light: 'bg-raised text-brand shadow-card hover:bg-surface',
        danger:
          'bg-danger text-on-danger shadow-[inset_0_-3px_0_var(--danger-deep)] hover:bg-danger-deep',
      },
      size: {
        md: 'min-h-12 px-[22px] text-base leading-5 [&_svg]:size-5',
        sm: 'touch-target min-h-9 px-3.5 text-sm leading-5 [&_svg]:size-4',
        icon: 'size-12 [&_svg]:size-5',
        'icon-sm': 'touch-target size-9 [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, isLoading = false, onClick, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        aria-busy={isLoading || undefined}
        aria-disabled={isLoading || undefined}
        onClick={isLoading ? undefined : onClick}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {isLoading ? (
              <LoaderCircle
                aria-hidden="true"
                strokeWidth={LUCIDE_BRAND_STROKE_WIDTH}
                className="animate-spin motion-reduce:animate-none"
              />
            ) : null}
            {children}
          </>
        )}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
