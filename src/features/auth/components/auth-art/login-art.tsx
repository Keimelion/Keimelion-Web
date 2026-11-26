'use client'

import { LampIcon, PlantIcon } from '@/components/icons'
import { WrappedGift, WrappedGiftModes } from '@/components/shared/wrapped-gift'
import { OccasionPapers } from '@/lib/occasions/occasion-paper'
import { doNothing } from '@/lib/utils'

export function LoginArt(): React.JSX.Element {
  return (
    <div className="relative h-[104px] w-[250px]">
      <span className="absolute top-[30px] left-0 flex size-[54px] -rotate-8 items-center justify-center rounded-xl bg-paper-mint text-ink">
        <PlantIcon className="size-[33px]" />
      </span>
      <WrappedGift
        paper={OccasionPapers.ROSE}
        mode={WrappedGiftModes.WRAP}
        onDone={doNothing}
        className="absolute top-0 left-[66px] h-[104px] w-[118px] rounded-[18px]"
      >
        <span className="flex size-full items-center justify-center bg-paper-rose text-ink">
          <LampIcon className="size-16" />
        </span>
      </WrappedGift>
      <WrappedGift
        paper={OccasionPapers.MUSTARD}
        mode={WrappedGiftModes.STATIC}
        onDone={doNothing}
        className="absolute top-[34px] left-[196px] size-[54px] rotate-7 rounded-xl"
      />
    </div>
  )
}
