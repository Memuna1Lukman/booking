import { useEffect, useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import { Button } from './components/ui/Button'
import { HomePage } from './pages/HomePage'
import { BookingPage } from './pages/BookingPage'
import { MyBookingsPage } from './pages/MyBookingsPage'
import { LoginPage } from './pages/LoginPage'
import { AdminServicesPage } from './pages/AdminServicesPage'
import {
  Calendar,
  LogOut,
  LogIn,
  Shield,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react'
import './App.css'

function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || '/')
  useEffect(() => {
    const updateRoute = () => {
      const hash = window.location.hash.slice(1) || '/'
      const base = hash.split('?')[0] || '/'
      setRoute(base)
    }
    window.addEventListener('hashchange', updateRoute)
    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])
  return route
}

function Navigation({ go, currentRoute }) {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigateTo = (path) => {
    setMobileMenuOpen(false)
    go(path)
  }

  return (
    <header className={`navbar-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Brand Logo */}
        <button
          type="button"
          className="navbar-brand-btn"
          onClick={() => navigateTo('/')}
          aria-label="Luma Booking Home"
        >
          <div className="brand-logo-mark">
            <Calendar size={18} className="logo-icon" />
          </div>
          <span className="brand-name-text">
            luma<span className="brand-dot">.</span>
          </span>
          <span className="brand-pill-badge">Bookings</span>
        </button>

        {/* Center Desktop Navigation */}
        <nav className="desktop-nav-links" aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-link-btn ${currentRoute === '/' ? 'is-active' : ''}`}
            onClick={() => navigateTo('/')}
          >
            Home
          </button>
          <button
            type="button"
            className={`nav-link-btn ${currentRoute === '/book' ? 'is-active' : ''}`}
            onClick={() => navigateTo('/book')}
          >
            Book a Time
          </button>
          <button
            type="button"
            className={`nav-link-btn ${currentRoute === '/bookings' ? 'is-active' : ''}`}
            onClick={() => navigateTo('/bookings')}
          >
            My Bookings
          </button>
          {user?.is_admin && (
            <button
              type="button"
              className={`nav-link-btn ${currentRoute === '/admin' ? 'is-active' : ''}`}
              onClick={() => navigateTo('/admin')}
            >
              <Shield size={14} className="nav-icon" />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* Right Desktop Actions */}
        <div className="navbar-actions-right">
          {user ? (
            <div className="user-profile-menu">
              <span className="user-email-chip" title={user.email}>
                <span className="user-avatar-initial">
                  {user.email ? user.email.slice(0, 1).toUpperCase() : 'U'}
                </span>
                <span className="user-email-text">{user.email}</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="btn-signout"
                onClick={logout}
                title="Sign out"
              >
                <LogOut size={15} />
                <span>Sign out</span>
              </Button>
            </div>
          ) : (
            <div className="guest-nav-actions">
              <button
                type="button"
                className="btn-text-signin"
                onClick={() => navigateTo('/login')}
              >
                <LogIn size={15} />
                <span>Sign in</span>
              </button>
              <Button
                variant="primary"
                size="sm"
                className="btn-header-book"
                onClick={() => navigateTo('/book')}
              >
                <span>Book Now</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-dropdown">
          <button
            type="button"
            className={`mobile-nav-item ${currentRoute === '/' ? 'is-active' : ''}`}
            onClick={() => navigateTo('/')}
          >
            Home
          </button>
          <button
            type="button"
            className={`mobile-nav-item ${currentRoute === '/book' ? 'is-active' : ''}`}
            onClick={() => navigateTo('/book')}
          >
            Book an Appointment
          </button>
          <button
            type="button"
            className={`mobile-nav-item ${currentRoute === '/bookings' ? 'is-active' : ''}`}
            onClick={() => navigateTo('/bookings')}
          >
            My Bookings
          </button>
          {user?.is_admin && (
            <button
              type="button"
              className={`mobile-nav-item ${currentRoute === '/admin' ? 'is-active' : ''}`}
              onClick={() => navigateTo('/admin')}
            >
              Admin Dashboard
            </button>
          )}

          <div className="mobile-nav-divider" />

          {user ? (
            <div className="mobile-user-section">
              <span className="mobile-user-email">{user.email}</span>
              <Button variant="secondary" onClick={logout} style={{ width: '100%' }}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="mobile-auth-section">
              <Button
                variant="secondary"
                onClick={() => navigateTo('/login')}
                style={{ width: '100%', marginBottom: '10px' }}
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </Button>
              <Button
                variant="primary"
                onClick={() => navigateTo('/book')}
                style={{ width: '100%' }}
              >
                <span>Book Appointment</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

function AppContent() {
  const route = useRoute()
  const go = (path) => {
    window.location.hash = path
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const page =
    route === '/book' ? (
      <BookingPage go={go} />
    ) : route === '/bookings' ? (
      <MyBookingsPage go={go} />
    ) : route === '/login' ? (
      <LoginPage go={go} />
    ) : route === '/admin' ? (
      <AdminServicesPage />
    ) : (
      <HomePage go={go} />
    )

  return (
    <div className="app-layout-shell">
      <Navigation go={go} currentRoute={route} />
      <main className="app-main-content">{page}</main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
