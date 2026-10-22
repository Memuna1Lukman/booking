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
    let errorMessage = 'Something went wrong. Please try again.'
    if (typeof data?.detail === 'string') {
      errorMessage = data.detail
    } else if (Array.isArray(data?.detail) && data.detail.length > 0) {
      errorMessage = data.detail.map((d) => d.msg || JSON.stringify(d)).join(', ')
    } else if (data?.message) {
      errorMessage = data.message
    }
    const error = new Error(errorMessage)
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
