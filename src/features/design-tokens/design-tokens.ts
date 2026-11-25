import type { MessageId } from '@/lib/i18n/messages'

export const BoardThemes = {
  LIGHT: 'light',
  DARK: 'dark',
} as const

export type BoardTheme = (typeof BoardThemes)[keyof typeof BoardThemes]

export const BOARD_THEME_TITLE_IDS: Readonly<Record<BoardTheme, MessageId>> = {
  [BoardThemes.LIGHT]: 'dev.tokens.day',
  [BoardThemes.DARK]: 'dev.tokens.night',
}

interface ColorToken {
  name: string
  utility: string
  swatchClassName: string
}

export const COLOR_TOKENS: readonly ColorToken[] = [
  { name: 'surface', utility: 'bg-surface', swatchClassName: 'bg-surface' },
  { name: 'raised', utility: 'bg-raised', swatchClassName: 'bg-raised' },
  { name: 'sunken', utility: 'bg-sunken', swatchClassName: 'bg-sunken' },
  { name: 'rule', utility: 'border-rule', swatchClassName: 'bg-rule' },
  { name: 'rule-strong', utility: 'border-rule-strong', swatchClassName: 'bg-rule-strong' },
  { name: 'ink', utility: 'text-ink', swatchClassName: 'bg-ink' },
  { name: 'muted', utility: 'text-muted-foreground', swatchClassName: 'bg-muted-foreground' },
  { name: 'brand', utility: 'bg-brand', swatchClassName: 'bg-brand' },
  { name: 'brand-deep', utility: 'bg-brand-deep', swatchClassName: 'bg-brand-deep' },
  { name: 'brand-soft', utility: 'bg-brand-soft', swatchClassName: 'bg-brand-soft' },
  { name: 'on-brand-soft', utility: 'text-on-brand-soft', swatchClassName: 'bg-on-brand-soft' },
  { name: 'hand', utility: 'text-hand', swatchClassName: 'bg-hand' },
  { name: 'hand-on-paper', utility: 'text-hand-on-paper', swatchClassName: 'bg-hand-on-paper' },
  { name: 'danger', utility: 'bg-danger', swatchClassName: 'bg-danger' },
  { name: 'danger-deep', utility: 'bg-danger-deep', swatchClassName: 'bg-danger-deep' },
  { name: 'warning', utility: 'bg-warning', swatchClassName: 'bg-warning' },
  { name: 'success', utility: 'bg-success', swatchClassName: 'bg-success' },
  { name: 'focus', utility: 'ring-focus', swatchClassName: 'bg-focus' },
  { name: 'on-brand', utility: 'text-on-brand', swatchClassName: 'bg-on-brand' },
  { name: 'on-danger', utility: 'text-on-danger', swatchClassName: 'bg-on-danger' },
  { name: 'on-warning', utility: 'text-on-warning', swatchClassName: 'bg-on-warning' },
  { name: 'on-success', utility: 'text-on-success', swatchClassName: 'bg-on-success' },
  { name: 'inverse', utility: 'bg-inverse', swatchClassName: 'bg-inverse' },
  { name: 'on-inverse', utility: 'text-on-inverse', swatchClassName: 'bg-on-inverse' },
  { name: 'gift-ribbon', utility: 'bg-gift-ribbon', swatchClassName: 'bg-gift-ribbon' },
]

interface ColorPairing {
  name: string
  className: string
}

export const COLOR_PAIRINGS: readonly ColorPairing[] = [
  { name: 'ink / surface', className: 'bg-surface text-ink' },
  { name: 'muted / surface', className: 'bg-surface text-muted-foreground' },
  { name: 'ink / sunken', className: 'bg-sunken text-ink' },
  { name: 'on-brand / brand', className: 'bg-brand text-on-brand' },
  { name: 'on-brand-soft / brand-soft', className: 'bg-brand-soft text-on-brand-soft' },
  { name: 'on-danger / danger', className: 'bg-danger text-on-danger' },
  { name: 'on-success / success', className: 'bg-success text-on-success' },
  { name: 'on-warning / warning', className: 'bg-warning text-on-warning' },
  { name: 'on-inverse / inverse', className: 'bg-inverse text-on-inverse' },
  { name: 'brand / raised', className: 'bg-raised text-brand' },
  { name: 'danger / raised', className: 'bg-raised text-danger' },
  { name: 'success / raised', className: 'bg-raised text-success' },
  { name: 'focus / raised', className: 'bg-raised text-focus' },
]

interface TypeStyle {
  name: string
  spec: string
  className: string
}

export const TYPE_SCALE: readonly TypeStyle[] = [
  {
    name: 'display-xl',
    spec: 'Bricolage Grotesque 800 · 52/56 · −0.035em',
    className: 'font-display text-display-xl',
  },
  {
    name: 'display-m',
    spec: 'Bricolage Grotesque 800 · 32/36 · −0.035em',
    className: 'font-display text-display-m',
  },
  {
    name: 'title',
    spec: 'Bricolage Grotesque 800 · 20/24 · −0.035em',
    className: 'font-display text-title',
  },
  { name: 'body', spec: 'DM Sans 400 · 16/24', className: 'font-sans text-body' },
  { name: 'small', spec: 'DM Sans 400 · 13/18', className: 'font-sans text-small' },
  {
    name: 'label',
    spec: 'DM Mono 500 · 12/16 · +0.1em · caps',
    className: 'font-mono text-label uppercase',
  },
  { name: 'kicker', spec: 'Caveat 600 · 28/28', className: 'font-hand text-kicker text-hand' },
]

interface RadiusToken {
  name: string
  size: string
  className: string
}

export const RADII: readonly RadiusToken[] = [
  { name: 'card', size: '22', className: 'rounded-card' },
  { name: 'sheet', size: '28 · top', className: 'rounded-t-sheet' },
  { name: 'field', size: '16', className: 'rounded-field' },
  { name: 'thumb', size: '16', className: 'rounded-thumb' },
  { name: 'pill', size: '999', className: 'rounded-pill' },
]
