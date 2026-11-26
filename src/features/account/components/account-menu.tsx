'use client'

import { useRouter } from 'next/navigation'
import { LockIcon, UserIcon } from '@/components/icons'
import { MoreMenu, MoreMenuTones } from '@/components/shared/more-menu'
import type { MoreMenuItem } from '@/components/shared/more-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useLogout } from '@/features/account/hooks/use-logout'
import { useStoredUserInitial } from '@/features/account/hooks/use-stored-user-initial'
import { AppPaths } from '@/lib/app-paths'
import { useTranslate } from '@/lib/i18n/use-translate'

export function AccountMenu(): React.JSX.Element {
  const t = useTranslate()
  const router = useRouter()
  const logout = useLogout()
  const items: readonly MoreMenuItem[] = [
    {
      id: 'profile',
      label: t('common.account_menu.profile'),
      icon: UserIcon,
      tone: MoreMenuTones.DEFAULT,
      onSelect: () => {
        router.push(AppPaths.PROFILE)
      },
    },
    {
      id: 'legal',
      label: t('common.account_menu.legal'),
      icon: LockIcon,
      tone: MoreMenuTones.DEFAULT,
      onSelect: () => {
        router.push(AppPaths.LEGAL_NOTICE)
      },
    },
    {
      id: 'log-out',
      label: t('common.account_menu.log_out'),
      icon: null,
      tone: MoreMenuTones.DANGER,
      onSelect: () => {
        logout.mutate()
      },
    },
  ]
  return (
    <MoreMenu
      label={t('common.account_menu.open')}
      trigger={<AccountMenuTrigger />}
      items={items}
      footerItem={{
        id: 'feedback',
        label: t('common.account_menu.send_feedback'),
        icon: null,
        tone: MoreMenuTones.HIGHLIGHT,
        onSelect: () => {
          router.push(AppPaths.FEEDBACK)
        },
      }}
    />
  )
}

type AccountMenuTriggerProps = React.ComponentProps<'button'>

function AccountMenuTrigger(props: AccountMenuTriggerProps): React.JSX.Element {
  const t = useTranslate()
  const initial = useStoredUserInitial()
  return (
    <button
      type="button"
      className="touch-target cursor-pointer rounded-pill outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      {...props}
    >
      <Avatar className="size-9">
        <AvatarFallback className="bg-paper-rose text-[17px]">
          {initial === null ? (
            <UserIcon className="size-5" />
          ) : (
            <span aria-hidden="true">{initial}</span>
          )}
        </AvatarFallback>
      </Avatar>
      <span className="sr-only">{t('common.account_menu.open')}</span>
    </button>
  )
}
