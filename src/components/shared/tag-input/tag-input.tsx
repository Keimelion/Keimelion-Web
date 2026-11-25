'use client'

import * as React from 'react'
import { CloseIcon } from '@/components/icons'
import { useTranslate } from '@/lib/i18n/use-translate'
import { cn } from '@/lib/utils'

interface TagInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'maxLength'
> {
  value: readonly string[]
  onValueChange: (value: string[]) => void
  maxTags: number
  maxTagLength: number
}

const ADD_KEYS = new Set(['Enter', ','])

export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  (
    { value, onValueChange, maxTags, maxTagLength, className, disabled, onBlur, ...inputProps },
    ref,
  ) => {
    const [draft, setDraft] = React.useState('')
    const isFull = value.length >= maxTags

    const commitDraft = (): void => {
      const tag = draft.trim()
      setDraft('')
      if (tag === '' || isFull || hasTag(value, tag)) return
      onValueChange([...value, tag])
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (ADD_KEYS.has(event.key)) {
        event.preventDefault()
        commitDraft()
        return
      }
      if (event.key === 'Backspace' && draft === '' && value.length > 0) {
        onValueChange(value.slice(0, -1))
      }
    }

    return (
      <div
        className={cn(
          'flex min-h-13 w-full min-w-0 flex-wrap items-center gap-1.5 rounded-field bg-raised px-3 py-1 text-ink shadow-[inset_0_0_0_1.5px_var(--rule)] transition-shadow duration-200 focus-within:shadow-[inset_0_0_0_2px_var(--ink),0_0_0_4px_color-mix(in_srgb,var(--focus)_18%,transparent)] has-[[aria-invalid=true]]:shadow-[inset_0_0_0_2px_var(--danger)]',
          disabled === true && 'bg-sunken shadow-none',
          className,
        )}
      >
        {value.map((tag) => (
          <TagChip
            key={tag}
            tag={tag}
            isDisabled={disabled === true}
            onRemove={() => {
              onValueChange(value.filter((existingTag) => existingTag !== tag))
            }}
          />
        ))}
        <input
          ref={ref}
          type="text"
          value={draft}
          maxLength={maxTagLength}
          disabled={disabled === true || isFull}
          onChange={(event) => {
            setDraft(event.currentTarget.value)
          }}
          onKeyDown={handleKeyDown}
          onBlur={(event) => {
            commitDraft()
            onBlur?.(event)
          }}
          className="h-11 min-w-24 flex-1 bg-transparent px-1 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          {...inputProps}
        />
      </div>
    )
  },
)
TagInput.displayName = 'TagInput'

function hasTag(tags: readonly string[], candidate: string): boolean {
  const normalisedCandidate = candidate.toLocaleLowerCase()
  return tags.some((tag) => tag.toLocaleLowerCase() === normalisedCandidate)
}

interface TagChipProps {
  tag: string
  isDisabled: boolean
  onRemove: () => void
}

function TagChip({ tag, isDisabled, onRemove }: TagChipProps): React.JSX.Element {
  const t = useTranslate()
  return (
    <span className="inline-flex h-[34px] max-w-full min-w-0 items-center gap-1 rounded-pill bg-sunken pr-1 pl-3 text-sm font-semibold">
      <span className="min-w-0 truncate">{tag}</span>
      <button
        type="button"
        disabled={isDisabled}
        onClick={onRemove}
        className="touch-target inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-pill text-muted-foreground transition-press outline-none hover:bg-raised hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none"
      >
        <CloseIcon className="size-3.5" />
        <span className="sr-only">{t('common.tag_input.remove', { tag })}</span>
      </button>
    </span>
  )
}
