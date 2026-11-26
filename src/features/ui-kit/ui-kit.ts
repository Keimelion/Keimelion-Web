import {
  BedIcon,
  CalendarIcon,
  MoreIcon,
  BikeIcon,
  BookIcon,
  CakeIcon,
  CameraIcon,
  CandleIcon,
  CasseroleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  CopyIcon,
  DownloadIcon,
  DragHandleIcon,
  EditIcon,
  ExtensionIcon,
  EyeIcon,
  GiftIcon,
  GlobeIcon,
  HeadphonesIcon,
  HomeIcon,
  LampIcon,
  LinkIcon,
  ListIcon,
  LockIcon,
  MailIcon,
  MinusIcon,
  PlantIcon,
  PlateIcon,
  PlusIcon,
  RingsIcon,
  SearchIcon,
  ShareIcon,
  StrollerIcon,
  TeacupIcon,
  TeddyBearIcon,
  TrashIcon,
  UserIcon,
} from '@/components/icons'
import type { LineIconProps } from '@/components/icons'
import type { AvatarPerson } from '@/components/shared/avatar-stack'
import { OccasionPapers } from '@/lib/occasions/occasion-paper'
import type { MessageId } from '@/lib/i18n/messages'
import type { OccasionPaper } from '@/lib/occasions/occasion-paper'
import { GiftPatterns } from '@/lib/occasions/gift-pattern'
import type { GiftPattern } from '@/lib/occasions/gift-pattern'

interface NamedLineIcon {
  name: string
  icon: React.ComponentType<LineIconProps>
}

export const LINE_ICONS: readonly NamedLineIcon[] = [
  { name: 'BedIcon', icon: BedIcon },
  { name: 'BikeIcon', icon: BikeIcon },
  { name: 'BookIcon', icon: BookIcon },
  { name: 'CakeIcon', icon: CakeIcon },
  { name: 'CalendarIcon', icon: CalendarIcon },
  { name: 'CameraIcon', icon: CameraIcon },
  { name: 'CandleIcon', icon: CandleIcon },
  { name: 'CasseroleIcon', icon: CasseroleIcon },
  { name: 'CheckIcon', icon: CheckIcon },
  { name: 'ChevronDownIcon', icon: ChevronDownIcon },
  { name: 'ChevronLeftIcon', icon: ChevronLeftIcon },
  { name: 'ChevronRightIcon', icon: ChevronRightIcon },
  { name: 'CloseIcon', icon: CloseIcon },
  { name: 'CopyIcon', icon: CopyIcon },
  { name: 'DownloadIcon', icon: DownloadIcon },
  { name: 'DragHandleIcon', icon: DragHandleIcon },
  { name: 'EditIcon', icon: EditIcon },
  { name: 'ExtensionIcon', icon: ExtensionIcon },
  { name: 'EyeIcon', icon: EyeIcon },
  { name: 'GiftIcon', icon: GiftIcon },
  { name: 'GlobeIcon', icon: GlobeIcon },
  { name: 'HeadphonesIcon', icon: HeadphonesIcon },
  { name: 'HomeIcon', icon: HomeIcon },
  { name: 'LampIcon', icon: LampIcon },
  { name: 'LinkIcon', icon: LinkIcon },
  { name: 'ListIcon', icon: ListIcon },
  { name: 'LockIcon', icon: LockIcon },
  { name: 'MailIcon', icon: MailIcon },
  { name: 'MinusIcon', icon: MinusIcon },
  { name: 'MoreIcon', icon: MoreIcon },
  { name: 'PlantIcon', icon: PlantIcon },
  { name: 'PlateIcon', icon: PlateIcon },
  { name: 'PlusIcon', icon: PlusIcon },
  { name: 'RingsIcon', icon: RingsIcon },
  { name: 'SearchIcon', icon: SearchIcon },
  { name: 'ShareIcon', icon: ShareIcon },
  { name: 'StrollerIcon', icon: StrollerIcon },
  { name: 'TeacupIcon', icon: TeacupIcon },
  { name: 'TeddyBearIcon', icon: TeddyBearIcon },
  { name: 'TrashIcon', icon: TrashIcon },
  { name: 'UserIcon', icon: UserIcon },
]

export const OCCASION_PAPER_LABEL_IDS: Readonly<Record<OccasionPaper, MessageId>> = {
  [OccasionPapers.LILAC]: 'dev.kit.occasions.wedding',
  [OccasionPapers.ROSE]: 'dev.kit.occasions.birth',
  [OccasionPapers.SKY]: 'dev.kit.occasions.first_home',
  [OccasionPapers.MUSTARD]: 'dev.kit.occasions.birthday',
  [OccasionPapers.MINT]: 'dev.kit.occasions.any_moment',
}

export const KIT_PEOPLE: readonly AvatarPerson[] = [
  { id: 'lea', name: 'Léa', paper: OccasionPapers.ROSE },
  { id: 'axel', name: 'Axel', paper: OccasionPapers.MINT },
  { id: 'karim', name: 'Karim', paper: OccasionPapers.MUSTARD },
  { id: 'ines', name: 'Inès', paper: OccasionPapers.SKY },
  { id: 'jo', name: 'Jo', paper: OccasionPapers.LILAC },
]

export const KIT_PHOTO_SOURCE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><rect width="90" height="90" fill="rgb(214 196 164)"/><circle cx="45" cy="48" r="24" fill="rgb(163 38 26)"/><rect x="18" y="40" width="54" height="8" rx="4" fill="rgb(28 26 51)"/></svg>',
)}`

export const GIFT_PATTERN_LABEL_IDS: Readonly<Record<GiftPattern, MessageId>> = {
  [GiftPatterns.DOTS]: 'dev.kit.gift_papers.dots',
  [GiftPatterns.STRIPES]: 'dev.kit.gift_papers.stripes',
  [GiftPatterns.GINGHAM]: 'dev.kit.gift_papers.gingham',
  [GiftPatterns.CONFETTI]: 'dev.kit.gift_papers.confetti',
  [GiftPatterns.BOWS]: 'dev.kit.gift_papers.bows',
  [GiftPatterns.STARS]: 'dev.kit.gift_papers.stars',
}
