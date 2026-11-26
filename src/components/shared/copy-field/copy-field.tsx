'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckIcon, CopyIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { FIELD_CONTROL_CLASS_NAME } from '@/components/ui/field-styles'
import type { MessageId } from '@/lib/i18n/messages'
import { useTranslate } from '@/lib/i18n/use-translate'
import { notifyError } from '@/lib/notify'
import { cn } from '@/lib/utils'

const CopyStates = {
  IDLE: 'idle',
  COPIED: 'copied',
  FAILED: 'failed',
} as const

type CopyState = (typeof CopyStates)[keyof typeof CopyStates]

const COPIED_FEEDBACK_MS = 2000

const ANNOUNCEMENT_IDS: Readonly<Record<CopyState, MessageId | null>> = {
  [CopyStates.IDLE]: null,
  [CopyStates.COPIED]: 'common.copy_field.copied_announcement',
  [CopyStates.FAILED]: 'common.copy_field.failed_announcement',
}

interface CopyFieldProps {
  value: string
  label: string
}

export function CopyField({ value, label }: CopyFieldProps): React.JSX.Element {
  const t = useTranslate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [copyState, setCopyState] = useState<CopyState>(CopyStates.IDLE)
  useResetAfterCopy(copyState, setCopyState)

  const copyValue = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value)
      setCopyState(CopyStates.COPIED)
    } catch {
      inputRef.current?.select()
      setCopyState(CopyStates.FAILED)
      notifyError({ title: t('common.copy_field.failed') })
    }
  }

  const isCopied = copyState === CopyStates.COPIED
  const announcementId = ANNOUNCEMENT_IDS[copyState]
  return (
    <div className="flex w-full min-w-0 items-center gap-2">
      <input
        ref={inputRef}
        readOnly
        value={value}
        aria-label={label}
        onFocus={(event) => {
          event.currentTarget.select()
        }}
        className={cn(FIELD_CONTROL_CLASS_NAME, 'h-13 flex-1 truncate font-mono text-sm')}
      />
      <Button
        variant={isCopied ? 'primary' : 'ghost'}
        className={cn(
          'shrink-0',
          isCopied && 'bg-success text-on-success shadow-none hover:bg-success',
        )}
        onClick={() => {
          void copyValue()
        }}
      >
        {isCopied ? <CheckIcon /> : <CopyIcon />}
        {t(isCopied ? 'common.copy_field.copied' : 'common.copy_field.copy')}
      </Button>
      <span role="status" className="sr-only">
        {announcementId === null ? '' : t(announcementId)}
      </span>
    </div>
  )
}

function useResetAfterCopy(copyState: CopyState, setCopyState: (state: CopyState) => void): void {
  useEffect(() => {
    if (copyState !== CopyStates.COPIED) return undefined
    const timeout = window.setTimeout(() => {
      setCopyState(CopyStates.IDLE)
    }, COPIED_FEEDBACK_MS)
    return () => {
      window.clearTimeout(timeout)
    }
  }, [copyState, setCopyState])
}
