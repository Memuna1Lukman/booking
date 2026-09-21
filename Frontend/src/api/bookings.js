import api from './axios'
export const createBooking = (booking) => api.post('/bookings', booking)
export const getBookings = () => api.get('/bookings')
export const getBooking = (id) => api.get(`/bookings/${id}`)
export const cancelBooking = (id) => api.delete(`/bookings/${id}`)
