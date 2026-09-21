import { useCallback, useEffect, useState } from 'react'
import * as bookingApi from '../api/bookings'
export function useBookings(autoLoad = true) {
  const [bookings, setBookings] = useState([]); const [loading, setLoading] = useState(autoLoad); const [error, setError] = useState(null)
  const refresh = useCallback(() => { setLoading(true); return bookingApi.getBookings().then((data) => setBookings(Array.isArray(data) ? data : data.items || [])).catch((err) => { setError(err); throw err }).finally(() => setLoading(false)) }, [])
  useEffect(() => { if (autoLoad) queueMicrotask(() => { refresh().catch(() => {}) }) }, [autoLoad, refresh])
  const create = async (payload) => { const booking = await bookingApi.createBooking(payload); setBookings((all) => [booking, ...all]); return booking }
  const cancel = async (id) => { await bookingApi.cancelBooking(id); setBookings((all) => all.filter((booking) => booking.id !== id)) }
  return { bookings, loading, error, refresh, create, cancel }
}
