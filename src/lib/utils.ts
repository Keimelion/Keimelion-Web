import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['display-xl', 'display-m', 'title', 'body', 'small', 'label', 'kicker'],
      radius: ['card', 'sheet', 'field', 'thumb', 'pill'],
      shadow: ['card', 'float'],
    },
    classGroups: {
      transition: [{ transition: ['press'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function doNothing(): void {
  return undefined
}
