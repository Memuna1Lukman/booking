import { useCallback, useEffect, useState } from 'react'
import { getServices } from '../api/services'
export function useServices() {
  const [services, setServices] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(null)
  const refresh = useCallback(() => { setLoading(true); setError(null); return getServices().then((data) => setServices(Array.isArray(data) ? data : data.items || [])).catch(setError).finally(() => setLoading(false)) }, [])
  useEffect(() => { queueMicrotask(() => { refresh() }) }, [refresh])
  return { services, loading, error, refresh }
}
