import api from './axios'
export const login = (credentials) => api.post('/auth/login', credentials)
export const register = (userData) => api.post('/users', userData)
export const logout = () => api.post('/auth/logout', {})
export const getCurrentUser = () => api.get('/auth/me')
