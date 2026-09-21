import api from './axios'
export const getServices = () => api.get('/services')
export const getService = (id) => api.get(`/services/${id}`)
export const createService = (service) => api.post('/services', service)
