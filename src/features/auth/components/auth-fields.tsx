'use client'

import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { PasswordInput } from '@/components/shared/password-input'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface AuthFieldProps<TValues extends FieldValues> {
  control: Control<TValues>
  name: FieldPath<TValues>
  label: string
  description: React.ReactNode
  inputProps: Omit<React.ComponentProps<'input'>, 'type'>
  children?: React.ReactNode
}

interface AuthTextFieldProps<TValues extends FieldValues> extends AuthFieldProps<TValues> {
  type: 'email' | 'text'
}

export function AuthTextField<TValues extends FieldValues>({
  control,
  name,
  label,
  description,
  type,
  inputProps,
}: AuthTextFieldProps<TValues>): React.JSX.Element {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel required>{label}</FormLabel>
          <FormControl>
            <Input type={type} {...inputProps} {...field} />
          </FormControl>
          <FieldHelp description={description} />
        </FormItem>
      )}
    />
  )
}

export function AuthPasswordField<TValues extends FieldValues>({
  control,
  name,
  label,
  description,
  inputProps,
  children = null,
}: AuthFieldProps<TValues>): React.JSX.Element {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel required>{label}</FormLabel>
          <FormControl>
            <PasswordInput {...inputProps} {...field} />
          </FormControl>
          <FieldHelp description={description} />
          {children}
        </FormItem>
      )}
    />
  )
}

interface FieldHelpProps {
  description: React.ReactNode
}

function FieldHelp({ description }: FieldHelpProps): React.JSX.Element {
  return (
    <>
      {description === null ? null : <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </>
  )
}
