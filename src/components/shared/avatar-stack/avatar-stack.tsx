'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useTranslate } from '@/lib/i18n/use-translate'
import { OCCASION_PAPER_CLASS_NAMES } from '@/lib/occasions/occasion-paper'
import type { OccasionPaper } from '@/lib/occasions/occasion-paper'
import { cn } from '@/lib/utils'

export interface AvatarPerson {
  id: string
  name: string
  paper: OccasionPaper
}

interface AvatarStackProps {
  people: readonly AvatarPerson[]
  maxVisible: number
  label: string
}

export function AvatarStack({ people, maxVisible, label }: AvatarStackProps): React.JSX.Element {
  const t = useTranslate()
  const visiblePeople = people.slice(0, maxVisible)
  const hiddenCount = people.length - visiblePeople.length
  return (
    <ul aria-label={label} className="flex items-center">
      {visiblePeople.map((person) => (
        <li key={person.id} className="-ml-2 first:ml-0">
          <Avatar>
            <AvatarFallback
              className={cn('text-[15px]', OCCASION_PAPER_CLASS_NAMES[person.paper].paper)}
            >
              <span aria-hidden="true">{getInitial(person.name)}</span>
              <span className="sr-only">{person.name}</span>
            </AvatarFallback>
          </Avatar>
        </li>
      ))}
      {hiddenCount > 0 ? (
        <li className="-ml-2">
          <Avatar>
            <AvatarFallback className="text-[13px]">
              <span aria-hidden="true">
                {t('common.avatar_stack.more', { count: hiddenCount })}
              </span>
              <span className="sr-only">
                {t('common.avatar_stack.more_label', { count: hiddenCount })}
              </span>
            </AvatarFallback>
          </Avatar>
        </li>
      ) : null}
    </ul>
  )
}

function getInitial(name: string): string {
  const [firstCharacter = ''] = Array.from(name.trim())
  return firstCharacter.toLocaleUpperCase()
}
