import { toast } from 'sonner'
import { translate } from '@/lib/i18n/translate'

const DEFAULT_UNDO_DELAY_MS = 5000

interface NotifyWithUndoInput {
  message: string
  undoLabel?: string
  delayMs?: number
  onCommit: () => void
  onUndo: () => void
}

export function notifyWithUndo({
  message,
  undoLabel = translate('common.undo.action'),
  delayMs = DEFAULT_UNDO_DELAY_MS,
  onCommit,
  onUndo,
}: NotifyWithUndoInput): void {
  const settlement = { isSettled: false }
  const settle = (outcome: () => void): void => {
    if (settlement.isSettled) return
    settlement.isSettled = true
    window.clearTimeout(commitTimeout)
    outcome()
  }
  const commitTimeout = window.setTimeout(() => {
    settle(onCommit)
    toast.dismiss(toastId)
  }, delayMs)
  const toastId = toast(message, {
    duration: delayMs,
    action: {
      label: undoLabel,
      onClick: () => {
        settle(onUndo)
      },
    },
    onDismiss: () => {
      settle(onCommit)
    },
    onAutoClose: () => {
      settle(onCommit)
    },
  })
}
