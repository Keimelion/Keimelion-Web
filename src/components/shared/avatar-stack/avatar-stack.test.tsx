import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OccasionPapers } from '@/lib/occasions/occasion-paper'
import { renderWithIntl } from '@/test/test-utils'
import { AvatarStack } from './avatar-stack'

const PEOPLE = [
  { id: 'lea', name: 'léa', paper: OccasionPapers.ROSE },
  { id: 'axel', name: 'Axel', paper: OccasionPapers.MINT },
  { id: 'karim', name: 'Karim', paper: OccasionPapers.MUSTARD },
  { id: 'ines', name: 'Inès', paper: OccasionPapers.SKY },
]

describe('AvatarStack', () => {
  it('lists every visible person by name with a capital initial', () => {
    renderWithIntl(<AvatarStack people={PEOPLE.slice(0, 2)} maxVisible={3} label="List team" />)

    const list = screen.getByRole('list', { name: 'List team' })
    expect(list.children).toHaveLength(2)
    expect(screen.getByText('léa')).toBeInTheDocument()
    expect(screen.getByText('L')).toBeInTheDocument()
  })

  it('folds the people beyond the limit into a counter', () => {
    renderWithIntl(<AvatarStack people={PEOPLE} maxVisible={2} label="List team" />)

    expect(screen.getByText('+2')).toBeInTheDocument()
    expect(screen.getByText('and 2 other people')).toBeInTheDocument()
  })
})
