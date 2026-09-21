import { useEffect, useState } from 'react'
import { getSlots } from '../api/slots'
export function useSlots(serviceId, date) {
  const [slots, setSlots] = useState([]); const [loading, setLoading] = useState(false); const [error, setError] = useState(null)
  useEffect(() => { queueMicrotask(() => {
    if (!serviceId || !date) { setSlots([]); return }
    setLoading(true); setError(null)
    getSlots({ serviceId, date }).then((data) => setSlots(Array.isArray(data) ? data : data.items || [])).catch(setError).finally(() => setLoading(false))
  }) }, [serviceId, date])
  return { slots, loading, error }
}
