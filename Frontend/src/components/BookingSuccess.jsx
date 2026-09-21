import { CheckCircle2, Calendar, Clock, Video, Mail, ArrowRight } from 'lucide-react'
import { Button } from './ui/Button'

export function BookingSuccess({ booking, onDone }) {
  const serviceName = booking?.service?.name || booking?.service_name || 'Confirmed Appointment'
  const date = booking?.date || booking?.slot?.date
  const time = booking?.start_time || booking?.slot?.start_time

  const formattedDate = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div className="booking-success-card">
      <div className="success-icon-wrapper">
        <CheckCircle2 size={48} className="success-check-icon" />
      </div>

      <span className="success-eyebrow">Reservation Confirmed</span>
      <h2 className="success-title">You’re officially booked!</h2>
      <p className="success-subtitle">
        We’ve reserved your time and sent the calendar invite with meeting instructions.
      </p>

      {booking?.id && (
        <div className="booking-ref-badge">
          <span>Booking Reference:</span>
          <strong>#{booking.id}</strong>
        </div>
      )}

      <div className="confirmed-details-box">
        <div className="confirmed-detail-item">
          <Video size={18} className="detail-icon" />
          <div>
            <span className="detail-label">Service</span>
            <strong className="detail-value">{serviceName}</strong>
          </div>
        </div>

        {formattedDate && (
          <div className="confirmed-detail-item">
            <Calendar size={18} className="detail-icon" />
            <div>
              <span className="detail-label">Date</span>
              <strong className="detail-value">{formattedDate}</strong>
            </div>
          </div>
        )}

        {time && (
          <div className="confirmed-detail-item">
            <Clock size={18} className="detail-icon" />
            <div>
              <span className="detail-label">Time</span>
              <strong className="detail-value">{String(time).slice(0, 5)}</strong>
            </div>
          </div>
        )}

        <div className="confirmed-detail-item">
          <Mail size={18} className="detail-icon" />
          <div>
            <span className="detail-label">Meeting Access</span>
            <strong className="detail-value">Google Meet link sent to your email</strong>
          </div>
        </div>
      </div>

      <div className="success-actions-row">
        <Button variant="primary" onClick={onDone} className="success-primary-btn">
          <span>View My Bookings</span>
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  )
}
