'use client'

import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslate } from '@/lib/i18n/use-translate'
import { cn } from '@/lib/utils'

const LUCIDE_BRAND_STROKE_WIDTH = 1.75

interface ReplayStageProps {
  animationName: string
  onReplay: (() => void) | null
  className?: string | undefined
  children: React.ReactNode
}

export function ReplayStage({
  animationName,
  onReplay,
  className,
  children,
}: ReplayStageProps): React.JSX.Element {
  const t = useTranslate()
  const [playCount, setPlayCount] = useState(0)
  return (
    <div className="flex min-w-0 flex-col items-start gap-2">
      <div key={playCount} className={cn('w-full min-w-0', className)}>
        {children}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          onReplay?.()
          setPlayCount((count) => count + 1)
        }}
      >
        <RotateCcw aria-hidden="true" strokeWidth={LUCIDE_BRAND_STROKE_WIDTH} />
        {t('dev.kit.motion.replay')}{' '}
        <span className="sr-only">
          {t('dev.kit.motion.replay_context', { name: animationName })}
        </span>
      </Button>
    </div>
  )
}
