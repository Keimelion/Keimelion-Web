'use client'

import * as React from 'react'
import type * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldError,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

const Form = FormProvider

interface FormFieldContextValue {
  name: string
}

interface FormItemContextValue {
  id: string
  requiredRef: React.MutableRefObject<boolean>
  hasDescription: boolean
  registerDescription: () => () => void
}

interface FieldIds {
  item: string
  description: string
  message: string
}

interface FormFieldState {
  ids: FieldIds
  error: FieldError | undefined
  required: boolean
  hasDescription: boolean
  markRequired: () => void
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)
const FormItemContext = React.createContext<FormItemContextValue | null>(null)

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>): React.JSX.Element {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

function buildFieldIds(baseId: string): FieldIds {
  return {
    item: `${baseId}-form-item`,
    description: `${baseId}-form-item-description`,
    message: `${baseId}-form-item-message`,
  }
}

function useFieldContext(): FormFieldContextValue {
  const context = React.useContext(FormFieldContext)
  if (context === null) {
    throw new Error('Field components must be used within <FormField>')
  }
  return context
}

function useItemContext(): FormItemContextValue {
  const context = React.useContext(FormItemContext)
  if (context === null) {
    throw new Error('Field components must be used within <FormItem>')
  }
  return context
}

function useFormField(): FormFieldState {
  const fieldContext = useFieldContext()
  const itemContext = useItemContext()
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  return {
    ids: buildFieldIds(itemContext.id),
    error: fieldState.error,
    required: itemContext.requiredRef.current,
    hasDescription: itemContext.hasDescription,
    markRequired: () => {
      itemContext.requiredRef.current = true
    },
  }
}

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId()
    const requiredRef = React.useRef<boolean>(false)
    requiredRef.current = false
    const [descriptionCount, setDescriptionCount] = React.useState(0)
    const registerDescription = React.useCallback(() => {
      setDescriptionCount((count) => count + 1)
      return () => {
        setDescriptionCount((count) => count - 1)
      }
    }, [])
    const hasDescription = descriptionCount > 0
    return (
      <FormItemContext.Provider value={{ id, requiredRef, hasDescription, registerDescription }}>
        <div ref={ref} className={cn('flex min-w-0 flex-col gap-1.5', className)} {...props} />
      </FormItemContext.Provider>
    )
  },
)
FormItem.displayName = 'FormItem'

interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  required?: boolean
}

const FormLabel = React.forwardRef<React.ComponentRef<typeof LabelPrimitive.Root>, FormLabelProps>(
  ({ className, required = false, ...props }, ref) => {
    const { ids, markRequired } = useFormField()
    if (required) markRequired()
    return (
      <Label
        ref={ref}
        className={cn(required && "after:ml-0.5 after:text-danger after:content-['*']", className)}
        htmlFor={ids.item}
        {...props}
      />
    )
  },
)
FormLabel.displayName = 'FormLabel'

const FormControl = React.forwardRef<
  React.ComponentRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>((props, ref) => {
  const { error, ids, required, hasDescription } = useFormField()
  const hasError = error !== undefined
  return (
    <Slot
      ref={ref}
      id={ids.item}
      aria-invalid={hasError}
      aria-required={required ? true : undefined}
      aria-describedby={buildDescribedBy(ids, hasDescription, hasError)}
      {...props}
    />
  )
})
FormControl.displayName = 'FormControl'

function buildDescribedBy(
  ids: FieldIds,
  hasDescription: boolean,
  hasError: boolean,
): string | undefined {
  const describedBy = [hasDescription ? ids.description : null, hasError ? ids.message : null]
    .filter((id) => id !== null)
    .join(' ')
  return describedBy === '' ? undefined : describedBy
}

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { id, registerDescription } = useItemContext()
  React.useEffect(registerDescription, [registerDescription])
  return (
    <p
      ref={ref}
      id={buildFieldIds(id).description}
      className={cn('text-small text-muted-foreground', className)}
      {...props}
    />
  )
})
FormDescription.displayName = 'FormDescription'

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, ids } = useFormField()
  const errorMessage = typeof error?.message === 'string' ? error.message : null
  const body = errorMessage ?? children
  return (
    <p
      ref={ref}
      id={ids.message}
      className={cn('min-h-[18px] text-small font-medium text-danger', className)}
      aria-live="polite"
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
}
