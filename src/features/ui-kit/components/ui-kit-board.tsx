import { AuthShellSection } from './auth-shell-section'
import { BrandSection } from './brand-section'
import { ButtonSection } from './button-section'
import { CardSection } from './card-section'
import { ChipSection } from './chip-section'
import { ChoiceSection } from './choice-section'
import { ControlSection } from './control-section'
import { CountdownSection } from './countdown-section'
import { FeedbackSection } from './feedback-section'
import { FieldSection } from './field-section'
import { FormControlSection } from './form-control-section'
import { GiftPaperSection } from './gift-paper-section'
import { GiftSection } from './gift-section'
import { IconSection } from './icon-section'
import { ListActivitySection } from './list-activity-section'
import { ListCardSection } from './list-card-section'
import { MotionSection } from './motion-section'
import { NavigationSection } from './navigation-section'
import { OccasionSection } from './occasion-section'
import { OverlaySection } from './overlay-section'
import { StatesSection } from './states-section'

export function UiKitBoard(): React.JSX.Element {
  return (
    <div className="flex min-w-0 flex-col gap-14">
      <BrandSection />
      <OccasionSection />
      <IconSection />
      <ButtonSection />
      <ChipSection />
      <FieldSection />
      <FormControlSection />
      <ControlSection />
      <ChoiceSection />
      <CardSection />
      <ListCardSection />
      <OverlaySection />
      <NavigationSection />
      <AuthShellSection />
      <MotionSection />
      <GiftSection />
      <GiftPaperSection />
      <CountdownSection />
      <FeedbackSection />
      <StatesSection />
      <ListActivitySection />
    </div>
  )
}
