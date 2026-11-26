'use client'

import { KeyIcon } from '@/components/icons'
import { AuthBackdrops, AuthShell } from '@/components/shared/auth-shell'
import { Button } from '@/components/ui/button'
import { AppPaths } from '@/lib/app-paths'
import { useTranslate } from '@/lib/i18n/use-translate'
import { KitSection } from './kit-section'
import { KitSpecimen } from './kit-specimen'

export function AuthShellSection(): React.JSX.Element {
  const t = useTranslate()
  return (
    <KitSection title={t('dev.kit.auth_shell.title')} kicker={t('dev.kit.auth_shell.kicker')}>
      <KitSpecimen
        label={t('dev.kit.auth_shell.specimen')}
        className="h-[640px] w-full overflow-hidden rounded-card shadow-[inset_0_0_0_1px_var(--rule)] [&>*]:w-full"
      >
        <AuthShell
          backdrop={AuthBackdrops.GINGHAM}
          art={
            <span className="flex size-24 items-center justify-center rounded-pill bg-raised text-ink shadow-float">
              <KeyIcon className="size-[60px]" />
            </span>
          }
          desktopPanel={null}
          kicker={t('dev.kit.auth_shell.sample_kicker')}
          title={t('dev.kit.auth_shell.sample_title')}
          backHref={AppPaths.HOME}
          className="min-h-full"
        >
          <p className="text-body text-muted-foreground">{t('dev.kit.auth_shell.sample_body')}</p>
          <Button className="w-full">{t('dev.kit.auth_shell.sample_action')}</Button>
        </AuthShell>
      </KitSpecimen>
    </KitSection>
  )
}
