import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  User,
  UserPlus,
  LogIn,
  CheckCircle2,
} from 'lucide-react'

export function LoginPage({ go, initialMode = 'login' }) {
  const { login, signup } = useAuth()
  const [localMode, setLocalMode] = useState(null)
  const mode = localMode ?? initialMode ?? 'login'

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const switchMode = (newMode) => {
    setLocalMode(newMode)
    setError('')
    setSuccessMsg('')
    if (go) {
      go(newMode === 'signup' ? '/signup' : '/login')
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccessMsg('')

    if (mode === 'signup') {
      const cleanUsername = username.trim()
      const cleanEmail = email.trim()

      if (!cleanUsername) {
        setError('Please choose a username.')
        return
      }
      if (cleanUsername.length < 3) {
        setError('Username must be at least 3 characters.')
        return
      }
      if (!cleanEmail) {
        setError('Please provide a valid email address.')
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }

      setLoading(true)
      try {
        const loggedInUser = await signup({
          username: cleanUsername,
          email: cleanEmail,
          password,
        })
        if (loggedInUser) {
          go('/bookings')
        } else {
          setSuccessMsg('Account created successfully! Please sign in.')
          setLocalMode('login')
          setPassword('')
          setConfirmPassword('')
        }
      } catch (err) {
        if (err.status === 409 || err.message?.toLowerCase().includes('already exist')) {
          setError('An account with this email or username already exists.')
        } else {
          setError(err.message || 'Failed to create account. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(true)
      try {
        await login({ email: email.trim(), password })
        go('/bookings')
      } catch (err) {
        setError(err.message || 'Invalid email or password.')
      } finally {
        setLoading(false)
      }
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
          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={`auth-tab-btn ${mode === 'login' ? 'is-active' : ''}`}
              onClick={() => switchMode('login')}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              className={`auth-tab-btn ${mode === 'signup' ? 'is-active' : ''}`}
              onClick={() => switchMode('signup')}
            >
              <UserPlus size={15} />
              <span>Sign Up</span>
            </button>
          </div>

          <div className="auth-header">
            <div className="auth-brand-badge">
              {mode === 'signup' ? (
                <UserPlus size={20} className="brand-badge-icon" />
              ) : (
                <Sparkles size={20} className="brand-badge-icon" />
              )}
            </div>
            <h1 className="auth-title">
              {mode === 'signup' ? 'Create an account' : 'Welcome back'}
            </h1>
            <p className="auth-subtitle">
              {mode === 'signup'
                ? 'Sign up to reserve sessions, manage appointments, and access your schedule.'
                : 'Sign in to manage your appointments, reschedule times, and view bookings.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={submit}>
            {mode === 'signup' && (
              <div className="form-group">
                <label className="input-label" htmlFor="username-input">
                  Username
                </label>
                <div className="input-field-wrapper">
                  <User size={18} className="input-prefix-icon" />
                  <input
                    id="username-input"
                    type="text"
                    className="text-input"
                    placeholder="e.g. alexsmith"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="input-label" htmlFor="email-input">
                {mode === 'signup' ? 'Email address' : 'Email or username'}
              </label>
              <div className="input-field-wrapper">
                <Mail size={18} className="input-prefix-icon" />
                <input
                  id="email-input"
                  type={mode === 'signup' ? 'email' : 'text'}
                  className="text-input"
                  placeholder={mode === 'signup' ? 'name@example.com' : 'name@example.com or username'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete={mode === 'signup' ? 'email' : 'username'}
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
                  placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
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

            {mode === 'signup' && (
              <div className="form-group">
                <label className="input-label" htmlFor="confirm-password-input">
                  Confirm password
                </label>
                <div className="input-field-wrapper">
                  <Lock size={18} className="input-prefix-icon" />
                  <input
                    id="confirm-password-input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="text-input text-input-has-suffix"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="auth-error-banner" role="alert">
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="auth-success-banner" role="status">
                <CheckCircle2 size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            <Button type="submit" variant="primary" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span>{mode === 'signup' ? 'Creating account…' : 'Signing in…'}</span>
                </>
              ) : mode === 'signup' ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="auth-switch-prompt">
              {mode === 'signup' ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="auth-switch-btn"
                    onClick={() => switchMode('login')}
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="auth-switch-btn"
                    onClick={() => switchMode('signup')}
                  >
                    Sign Up
                  </button>
                </span>
              )}
            </div>

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
