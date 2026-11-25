import { BowGeometry } from './bow-geometry'

export function BowGlyph(): React.JSX.Element {
  return (
    <g transform={BowGeometry.OFFSET_TRANSFORM} fill="currentColor">
      <path d={BowGeometry.TAILS_PATH} />
      <path
        d={BowGeometry.LOOPS_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={BowGeometry.LOOPS_STROKE_WIDTH}
        strokeLinejoin="round"
      />
      <circle
        cx={BowGeometry.KNOT_CENTER_X}
        cy={BowGeometry.KNOT_CENTER_Y}
        r={BowGeometry.KNOT_RADIUS}
      />
    </g>
  )
}
