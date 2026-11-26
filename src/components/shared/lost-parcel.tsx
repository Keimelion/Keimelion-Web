'use client'

import { motion } from 'motion/react'
import { BowGlyph } from '@/components/icons'
import { bob, stamp, useShouldReduceMotion } from '@/lib/motion'
import type { MotionPreset } from '@/lib/motion'
import { cn } from '@/lib/utils'

const PARCEL_VIEW_BOX = '0 0 300 250'
const LEFT_FACE_SKEW = 'matrix(1,0.3333,0,1,60,70)'
const RIGHT_FACE_SKEW = 'matrix(1,-0.2727,0,1,150,100)'
const STAMP_TILT = 'rotate(-7 55 84)'
const ADDRESS_HOST = 'keimelion.app/'
const STATUS_CODE = '404'
const STAMPED: MotionPreset = { ...stamp, initial: false }
const FLOATING: MotionPreset = { ...bob, transition: { ...bob.transition, repeat: Infinity } }

interface LostParcelProps {
  stampLabel: string
  addressLabel: string
  pageLabel: string
  className?: string | undefined
}

export function LostParcel({
  stampLabel,
  addressLabel,
  pageLabel,
  className,
}: LostParcelProps): React.JSX.Element {
  return (
    <svg
      aria-hidden="true"
      viewBox={PARCEL_VIEW_BOX}
      className={cn('h-auto overflow-visible', className)}
    >
      <ellipse cx="160" cy="232" rx="118" ry="12" className="fill-parcel-shadow" />
      <motion.g {...FLOATING}>
        <ParcelBox />
        <g transform={LEFT_FACE_SKEW}>
          <AddressLabel addressLabel={addressLabel} pageLabel={pageLabel} />
        </g>
        <g transform={RIGHT_FACE_SKEW}>
          <PostageStamp />
          <g transform={STAMP_TILT}>
            <RubberStamp stampLabel={stampLabel} />
          </g>
        </g>
      </motion.g>
    </svg>
  )
}

function ParcelBox(): React.JSX.Element {
  return (
    <>
      <polygon points="60,70 150,100 150,220 60,190" className="fill-parcel-left" />
      <polygon points="150,100 260,70 260,190 150,220" className="fill-parcel-right" />
      <polygon points="60,70 170,40 260,70 150,100" className="fill-parcel-top" />
      <polyline
        points="60,70 150,100 260,70"
        fill="none"
        strokeWidth="2"
        strokeLinejoin="round"
        className="stroke-parcel-edge"
      />
      <line x1="150" y1="100" x2="150" y2="220" strokeWidth="2" className="stroke-parcel-edge" />
      <polygon points="107,58 121,54 211,82 197,86" className="fill-parcel-tape-top" />
      <polygon points="197,86 211,82 211,202 197,206" className="fill-parcel-tape-side" />
    </>
  )
}

interface AddressLabelProps {
  addressLabel: string
  pageLabel: string
}

function AddressLabel({ addressLabel, pageLabel }: AddressLabelProps): React.JSX.Element {
  return (
    <>
      <rect x="10" y="22" width="70" height="46" rx="4" className="fill-parcel-label" />
      <text x="16" y="34" fontSize="7" className="fill-parcel-label-muted font-mono">
        {addressLabel}
      </text>
      <text
        x="16"
        y="46"
        fontSize="7.5"
        fontWeight="700"
        className="fill-parcel-label-ink font-sans"
      >
        {ADDRESS_HOST}
      </text>
      <text x="16" y="60" fontSize="13" className="fill-parcel-stamp font-hand">
        {pageLabel}
      </text>
    </>
  )
}

function PostageStamp(): React.JSX.Element {
  return (
    <>
      <rect
        x="64"
        y="14"
        width="30"
        height="34"
        rx="2"
        strokeWidth="1.5"
        strokeDasharray="2 2"
        className="fill-parcel-label stroke-parcel-stamp"
      />
      <svg x="67" y="18" width="24" height="24" viewBox="0 0 100 100" className="text-parcel-stamp">
        <BowGlyph />
      </svg>
    </>
  )
}

interface RubberStampProps {
  stampLabel: string
}

function RubberStamp({ stampLabel }: RubberStampProps): React.JSX.Element {
  const shouldReduceMotion = useShouldReduceMotion()
  return (
    <motion.g
      key={shouldReduceMotion ? 'stamped' : 'stamping'}
      {...(shouldReduceMotion ? STAMPED : stamp)}
      className="fill-parcel-stamp"
    >
      <rect
        x="12"
        y="62"
        width="86"
        height="42"
        rx="7"
        strokeWidth="3.5"
        className="fill-parcel-label/35 stroke-parcel-stamp"
      />
      <text
        x="55"
        y="86"
        textAnchor="middle"
        fontSize="20"
        fontWeight="800"
        className="font-display"
      >
        {STATUS_CODE}
      </text>
      <text
        x="55"
        y="98"
        textAnchor="middle"
        fontSize="7"
        fontWeight="700"
        letterSpacing=".5"
        className="font-sans"
      >
        {stampLabel}
      </text>
    </motion.g>
  )
}
