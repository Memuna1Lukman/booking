const RAW_URL = import.meta.env.VITE_API_URL || 'https://booking-raw.vercel.app'
const API_URL = RAW_URL.replace(/\/+$/, '')

async function request(path, options = {}) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const response = await fetch(`${API_URL}${cleanPath}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json() : null
  if (!response.ok) {
    const error = new Error(data?.detail || 'Something went wrong. Please try again.')
    error.status = response.status
    error.data = data
    throw error
  }
  return data
}

export default {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
