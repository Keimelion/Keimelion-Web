export function toCalendarDate(localDay: Date): Date {
  return new Date(Date.UTC(localDay.getFullYear(), localDay.getMonth(), localDay.getDate()))
}

export function fromCalendarDate(calendarDate: Date): Date {
  return new Date(
    calendarDate.getUTCFullYear(),
    calendarDate.getUTCMonth(),
    calendarDate.getUTCDate(),
  )
}
