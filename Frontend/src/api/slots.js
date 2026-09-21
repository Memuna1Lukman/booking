import api from './axios'
export const getSlots = ({ serviceId, date } = {}) => {
  const query = new URLSearchParams()
  if (serviceId) query.set('service_id', serviceId)
  if (date) query.set('date', date)
  return api.get(`/slots${query.size ? `?${query}` : ''}`)
}
export const getSlot = (id) => api.get(`/slots/${id}`)
export const createSlot = (slot) => api.post('/slots', slot)
