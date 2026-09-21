import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react'

export function LoginPage({ go }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login({ email, password })
      go('/bookings')
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page-wrapper">
      <div className="auth-container">
        <button type="button" className="auth-back-link" onClick={() => go('/')}>
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <div className="auth-card-box">
          <div className="auth-header">
            <div className="auth-brand-badge">
              <Sparkles size={20} className="brand-badge-icon" />
            </div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">
              Sign in to manage your appointments, reschedule times, and view bookings.
            </p>
          </div>

          <form className="auth-form" onSubmit={submit}>
            <div className="form-group">
              <label className="input-label" htmlFor="email-input">
                Email address
              </label>
              <div className="input-field-wrapper">
                <Mail size={18} className="input-prefix-icon" />
                <input
                  id="email-input"
                  type="email"
                  className="text-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="input-label" htmlFor="password-input">
                Password
              </label>
              <div className="input-field-wrapper">
                <Lock size={18} className="input-prefix-icon" />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  className="text-input text-input-has-suffix"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error-banner" role="alert">
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" variant="primary" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span>Signing in…</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="auth-security-notice">
              <ShieldCheck size={14} className="text-muted" />
              <span>Secure SSL encrypted connection</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
