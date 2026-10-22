import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useBookings } from '../hooks/useBookings'
import { BookingList } from '../components/BookingList'
import { Spinner } from '../components/ui/Spinner'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Calendar, Plus, RefreshCw, AlertCircle, LogIn, UserPlus } from 'lucide-react'

export function MyBookingsPage({ go }) {
  const { user, loading: authLoading } = useAuth()
  const { bookings, loading, error, cancel, refresh } = useBookings(Boolean(user))
  const [cancelingId, setCancelingId] = useState(null)
  const [cancelingInProgress, setCancelingInProgress] = useState(false)

  if (authLoading) {
    return (
      <div className="page-loading-center">
        <Spinner size="lg" />
        <p>Loading your profile…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <section className="page-standard-container">
        <div className="guest-prompt-card">
          <div className="prompt-icon-bubble">
            <Calendar size={36} />
          </div>
          <h2>Sign in to view your bookings</h2>
          <p>
            Track your upcoming consultations, manage reservations, and access your meeting links all in one place.
          </p>
          <div className="prompt-actions">
            <Button variant="primary" onClick={() => go('/login')}>
              <LogIn size={16} />
              <span>Sign in</span>
            </Button>
            <Button variant="secondary" onClick={() => go('/signup')}>
              <UserPlus size={16} />
              <span>Create Account</span>
            </Button>
            <Button variant="ghost" onClick={() => go('/book')}>
              Browse Available Services
            </Button>
          </div>
        </div>
      </section>
    )
  }

  const handleCancelClick = (id) => {
    setCancelingId(id)
  }

  const confirmCancel = async () => {
    if (!cancelingId) return
    setCancelingInProgress(true)
    try {
      await cancel(cancelingId)
      setCancelingId(null)
    } catch (err) {
      window.alert(err.message || 'Failed to cancel booking.')
    } finally {
      setCancelingInProgress(false)
    }
  }

  return (
    <section className="page-standard-container">
      <div className="page-hero-header">
        <div>
          <span className="eyebrow-badge">My Schedule</span>
          <h1 className="page-main-heading">Bookings & Reservations</h1>
          <p className="page-subheading">
            View all your upcoming consultations, manage meeting times, and download calendar invites.
          </p>
        </div>
        <div className="page-header-actions">
          <button
            type="button"
            className="btn-icon-secondary"
            onClick={() => refresh().catch(() => {})}
            title="Refresh bookings"
            aria-label="Refresh bookings"
          >
            <RefreshCw size={16} />
          </button>
          <Button variant="primary" onClick={() => go('/book')}>
            <Plus size={16} />
            <span>Book New Slot</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="page-loading-center">
          <Spinner size="md" />
          <p>Loading your reservations…</p>
        </div>
      ) : error ? (
        <div className="alert-banner alert-warning">
          <AlertCircle size={20} />
          <div className="alert-content">
            <strong>Could not load bookings</strong>
            <p>Please check your connection and try refreshing.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => refresh()}>
            Retry
          </Button>
        </div>
      ) : (
        <BookingList bookings={bookings} onCancel={handleCancelClick} />
      )}

      {cancelingId && (
        <Modal onClose={() => !cancelingInProgress && setCancelingId(null)} title="Cancel Reservation">
          <div className="modal-cancel-content">
            <p>Are you sure you want to cancel this booking? This time slot will be reopened for other clients.</p>
            <div className="modal-actions-row">
              <Button
                variant="secondary"
                onClick={() => setCancelingId(null)}
                disabled={cancelingInProgress}
              >
                Keep Reservation
              </Button>
              <Button
                variant="primary"
                className="btn-danger"
                onClick={confirmCancel}
                disabled={cancelingInProgress}
              >
                {cancelingInProgress ? 'Canceling…' : 'Yes, Cancel Booking'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}
