import { createContext, useContext } from 'react'
export const AuthContext = createContext(null)
export function useAuthContext() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within AuthProvider'); return context }
