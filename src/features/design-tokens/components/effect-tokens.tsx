import { getServerTranslate } from '@/lib/i18n/server-translate'
import { TokenName } from './token-name'

export async function EffectTokens(): Promise<React.JSX.Element> {
  const t = await getServerTranslate()
  return (
    <ul className="grid grid-cols-2 gap-3">
      <li className="flex flex-col gap-2">
        <span aria-hidden="true" className="h-16 rounded-card bg-raised shadow-card" />
        <TokenName name="elevation-card" detail="shadow-card" />
      </li>
      <li className="flex flex-col gap-2">
        <span aria-hidden="true" className="h-16 rounded-card bg-raised shadow-float" />
        <TokenName name="elevation-float" detail="shadow-float" />
      </li>
      <li className="flex flex-col gap-2">
        <span className="flex h-16 items-center justify-center rounded-card bg-raised text-small opacity-(--reserved-opacity)">
          {t('dev.tokens.reserved_sample')}
        </span>
        <TokenName name="reserved-opacity" detail="opacity-(--reserved-opacity)" />
      </li>
      <li className="flex flex-col gap-2">
        <span
          aria-hidden="true"
          className="h-16 rounded-thumb bg-gift-sky brightness-(--photo-brightness)"
        />
        <TokenName name="photo-brightness" detail="brightness-(--photo-brightness)" />
      </li>
    </ul>
  )
}
