import { cn } from '@/lib/utils'
import { getServerTranslate } from '@/lib/i18n/server-translate'
import { BOARD_THEME_TITLE_IDS } from '../design-tokens'
import type { BoardTheme } from '../design-tokens'
import { BoardSection } from './board-section'
import { ColorTokens } from './color-tokens'
import { EffectTokens } from './effect-tokens'
import { PaperTokens } from './paper-tokens'
import { RadiusTokens } from './radius-tokens'
import { TypeScale } from './type-scale'

interface DesignTokensBoardProps {
  theme: BoardTheme
}

export async function DesignTokensBoard({
  theme,
}: DesignTokensBoardProps): Promise<React.JSX.Element> {
  const t = await getServerTranslate()
  return (
    <article className={cn('min-w-0', theme)}>
      <div className="flex flex-col gap-8 rounded-card border border-rule bg-surface p-4 text-ink lg:p-6">
        <h2 className="text-display-m">{t(BOARD_THEME_TITLE_IDS[theme])}</h2>
        <BoardSection title={t('dev.tokens.colors')}>
          <ColorTokens />
        </BoardSection>
        <BoardSection title={t('dev.tokens.papers')}>
          <PaperTokens />
        </BoardSection>
        <BoardSection title={t('dev.tokens.type_scale')}>
          <TypeScale sample={t('dev.tokens.type_sample')} />
        </BoardSection>
        <BoardSection title={t('dev.tokens.radii')}>
          <RadiusTokens />
        </BoardSection>
        <BoardSection title={t('dev.tokens.effects')}>
          <EffectTokens />
        </BoardSection>
      </div>
    </article>
  )
}
