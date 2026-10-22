import { useEffect, useState } from 'react'
import * as authApi from '../api/auth'
import { AuthContext } from './authStore'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authApi.getCurrentUser().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false))
  }, [])

  const login = async (credentials) => {
    const nextUser = await authApi.login(credentials)
    setUser(nextUser?.user || nextUser)
    return nextUser
  }
  const signup = async (userData) => {
    await authApi.register(userData)
    try {
      return await login({ email: userData.email, password: userData.password })
    } catch {
      return null
    }
  }
  const logout = async () => {
    try { await authApi.logout() } finally { setUser(null) }
  }
  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}
