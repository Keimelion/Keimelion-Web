'use client'

import { useEffect, useState } from 'react'
import { useShouldReduceMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface ScrollSpySection {
  id: string
  label: string
}

interface ScrollSpyNavProps {
  label: string
  sections: readonly ScrollSpySection[]
  trailing: React.ReactNode
}

const ACTIVE_BAND_ROOT_MARGIN = '0px 0px -60% 0px'
const SECTION_ID_SEPARATOR = ' '

export function ScrollSpyNav({ label, sections, trailing }: ScrollSpyNavProps): React.JSX.Element {
  const shouldReduceMotion = useShouldReduceMotion()
  const [activeId, setActiveId] = useState(sections[0]?.id ?? null)
  useActiveSection(sections.map((section) => section.id).join(SECTION_ID_SEPARATOR), setActiveId)

  const goToSection = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string): void => {
    const target = document.getElementById(sectionId)
    if (target === null) return
    event.preventDefault()
    target.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${sectionId}`)
    setActiveId(sectionId)
  }

  return (
    <nav aria-label={label} className="hidden lg:sticky lg:top-6 lg:flex lg:flex-col lg:gap-4">
      <ul className="flex flex-col gap-1">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={section.id === activeId ? 'location' : undefined}
              onClick={(event) => {
                goToSection(event, section.id)
              }}
              className={cn(
                'flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-muted-foreground transition-press outline-none hover:bg-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                'aria-[current=location]:bg-sunken aria-[current=location]:text-ink',
              )}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
      {trailing}
    </nav>
  )
}

function useActiveSection(sectionIds: string, setActiveId: (sectionId: string) => void): void {
  useEffect(() => {
    const targets = sectionIds
      .split(SECTION_ID_SEPARATOR)
      .map((sectionId) => document.getElementById(sectionId))
      .filter((target) => target !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        const firstVisible = entries.find((entry) => entry.isIntersecting)
        if (firstVisible !== undefined) setActiveId(firstVisible.target.id)
      },
      { rootMargin: ACTIVE_BAND_ROOT_MARGIN },
    )
    targets.forEach((target) => {
      observer.observe(target)
    })
    return () => {
      observer.disconnect()
    }
  }, [sectionIds, setActiveId])
}
