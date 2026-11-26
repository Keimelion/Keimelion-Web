'use client'

import Link from 'next/link'
import { INLINE_AUTH_LINK_CLASS_NAME } from '@/features/auth/components/auth-link-styles'
import { AppPaths } from '@/lib/app-paths'
import { useTranslate } from '@/lib/i18n/use-translate'
import { useTranslateRich } from '@/lib/i18n/use-translate-rich'

const PRIMARY_MOUSE_BUTTON = 0

interface SignupTermsProps {
  onOpenDocument: (title: string) => void
}

export function SignupTerms({ onOpenDocument }: SignupTermsProps): React.JSX.Element {
  const t = useTranslate()
  const translateRich = useTranslateRich()
  const renderDocumentLink =
    (href: string, title: string) =>
    (chunks: React.ReactNode[]): React.ReactNode => (
      <Link
        href={href}
        className={INLINE_AUTH_LINK_CLASS_NAME}
        onClick={(event) => {
          if (isOpeningElsewhere(event)) return
          event.preventDefault()
          onOpenDocument(title)
        }}
      >
        {chunks}
      </Link>
    )
  return (
    <p className="text-small text-muted-foreground">
      {translateRich('auth.signup.terms', {
        terms: renderDocumentLink(AppPaths.TERMS_OF_USE, t('common.footer.terms_of_use')),
        privacy: renderDocumentLink(AppPaths.PRIVACY, t('common.footer.privacy')),
      })}
    </p>
  )
}

function isOpeningElsewhere(event: React.MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.button !== PRIMARY_MOUSE_BUTTON ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
}
