import { Calendar, Clock, Video, ShieldCheck, ArrowRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/Button'
import { Spinner } from './ui/Spinner'

function formatTime(rawTime) {
  if (!rawTime) return ''
  const str = String(rawTime).slice(0, 5)
  const parts = str.split(':')
  if (parts.length < 2) return str
  const h = parseInt(parts[0], 10)
  const m = parts[1]
  if (isNaN(h)) return str
  const ampm = h >= 12 ? 'PM' : 'AM'
  const displayH = h % 12 === 0 ? 12 : h % 12
  return `${displayH}:${m} ${ampm}`
}

export function BookingConfirmation({ service, date, slot, onConfirm, loading, go }) {
  const { user } = useAuth()
  const isComplete = Boolean(service && date && slot)
  const duration = service?.duration_minutes || service?.duration || 60
  const price = service?.price ? `$${service.price}` : 'Free'

  const formattedDate = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const formattedTime = slot ? formatTime(slot.start_time || slot.time || slot.start) : null

  return (
    <aside className="reservation-summary-card">
      <div className="summary-card-header">
        <div className="host-mini-badge">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="Host"
            className="host-mini-avatar"
          />
          <div>
            <span className="host-eyebrow">Verified Host</span>
            <strong className="host-name">Sarah Jenkins</strong>
          </div>
          <span className="superhost-pill">★ 4.98</span>
        </div>
        <h3 className="summary-title">Reservation Details</h3>
      </div>

      <div className="summary-items-list">
        <div className="summary-row">
          <div className="summary-row-label">
            <Video size={16} className="summary-icon text-muted" />
            <span>Service</span>
          </div>
          <strong className="summary-row-value">
            {service?.name || <span className="text-placeholder">Select a service</span>}
          </strong>
        </div>

        {service && (
          <div className="summary-row">
            <div className="summary-row-label">
              <Clock size={16} className="summary-icon text-muted" />
              <span>Duration</span>
            </div>
            <strong className="summary-row-value">{duration} minutes</strong>
          </div>
        )}

        <div className="summary-row">
          <div className="summary-row-label">
            <Calendar size={16} className="summary-icon text-muted" />
            <span>Date</span>
          </div>
          <strong className="summary-row-value">
            {formattedDate || <span className="text-placeholder">Pick a date</span>}
          </strong>
        </div>

        <div className="summary-row">
          <div className="summary-row-label">
            <Clock size={16} className="summary-icon text-muted" />
            <span>Time</span>
          </div>
          <strong className="summary-row-value">
            {formattedTime || <span className="text-placeholder">Choose a time slot</span>}
          </strong>
        </div>

        <div className="summary-divider" />

        <div className="summary-price-breakdown">
          <div className="summary-price-row">
            <span>Session Fee</span>
            <span>{price}</span>
          </div>
          <div className="summary-price-row">
            <span>Booking & Sync Fee</span>
            <span className="text-success">$0.00</span>
          </div>
          <div className="summary-price-row total-row">
            <strong>Total</strong>
            <strong className="total-amount">{price}</strong>
          </div>
        </div>
      </div>

      <div className="summary-actions">
        {user ? (
          <Button
            variant="primary"
            className="confirm-booking-btn"
            onClick={onConfirm}
            disabled={!isComplete || loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span>Reserving slot…</span>
              </>
            ) : (
              <>
                <span>Confirm Reservation</span>
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        ) : (
          <div className="booking-auth-prompt-box">
            <Button
              variant="primary"
              className="confirm-booking-btn"
              onClick={() => (go ? go('/signup') : (window.location.hash = '/signup'))}
              disabled={!isComplete}
            >
              <span>Sign Up to Reserve</span>
              <ArrowRight size={16} />
            </Button>
            <button
              type="button"
              className="booking-auth-signin-link"
              onClick={() => (go ? go('/login') : (window.location.hash = '/login'))}
            >
              Already have an account? Sign in
            </button>
          </div>
        )}
      </div>

      <div className="summary-guarantee-note">
        <ShieldCheck size={16} className="guarantee-icon" />
        <span>Instant confirmation · Free cancellation anytime</span>
      </div>
    </aside>
  )
}
