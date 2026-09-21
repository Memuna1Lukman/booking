import { useMemo } from 'react'
// Until a dedicated endpoint exists, dates are offered from today through the next two weeks.
export function useAvailableDates() {
  return useMemo(() => Array.from({ length: 14 }, (_, index) => {
    const date = new Date(); date.setDate(date.getDate() + index); return date.toISOString().slice(0, 10)
  }), [])
}
