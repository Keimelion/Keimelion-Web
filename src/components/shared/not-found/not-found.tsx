import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AppPaths } from '@/lib/app-paths'
import { getServerTranslate } from '@/lib/i18n/server-translate'
import { NotFoundParcel } from './not-found-parcel'

interface NotFoundProps {
  isSignedIn: boolean
}

export async function NotFound({ isSignedIn }: NotFoundProps): Promise<React.JSX.Element> {
  const t = await getServerTranslate()
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center lg:grid lg:grid-cols-2 lg:gap-x-16 lg:py-16 lg:text-left">
      <div className="flex flex-col items-center gap-3">
        <NotFoundParcel
          stampLabel={t('error.not_found.stamp')}
          addressLabel={t('error.not_found.label_to')}
          fallbackPageLabel={t('error.not_found.label_page')}
          className="w-[285px] lg:w-[510px]"
        />
        <p className="font-hand text-kicker text-hand lg:text-[34px]">
          {t('error.not_found.kicker')}
        </p>
      </div>
      <div className="flex w-full max-w-md flex-col items-center gap-3 lg:max-w-none lg:items-start lg:gap-3.5">
        <p className="hidden font-mono text-sm text-muted-foreground lg:block">
          {t('error.not_found.code')}
        </p>
        <h1 className="text-[28px] leading-8 lg:text-[56px] lg:leading-[58px]">
          {t('error.not_found.title')}
        </h1>
        <p className="text-[15px] leading-[22px] text-muted-foreground lg:text-lg lg:leading-7">
          {t('error.not_found.description')}
        </p>
        <div className="mt-1 flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
          <Button asChild>
            <Link href={AppPaths.HOME}>{t('error.not_found.back_home')}</Link>
          </Button>
          <Button asChild variant="ghost">
            {isSignedIn ? (
              <Link href={AppPaths.LISTS}>{t('common.nav.my_lists')}</Link>
            ) : (
              <Link href={AppPaths.NEW_LIST}>{t('common.nav.create_my_list')}</Link>
            )}
          </Button>
        </div>
      </div>
    </section>
  )
}
