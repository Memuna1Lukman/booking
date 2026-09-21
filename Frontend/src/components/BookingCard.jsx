import { Calendar, Clock, Video, Trash2 } from 'lucide-react'

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

export function BookingCard({ booking, onCancel }) {
  const serviceName = booking.service?.name || booking.service_name || 'Appointment'
  const date = booking.date || booking.slot?.date
  const rawTime = booking.start_time || booking.slot?.start_time
  const time = formatTime(rawTime)

  const formattedDate = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date pending'

  return (
    <article className="user-reservation-card">
      <div className="reservation-card-left">
        <div className="reservation-card-icon-box">
          <Calendar size={22} className="card-calendar-icon" />
        </div>
        <div className="reservation-card-info">
          <div className="reservation-card-top-row">
            <span className="reservation-badge-status">
              <span className="status-indicator-dot" />
              {booking.status || 'Confirmed'}
            </span>
            {booking.id && <span className="reservation-id-tag">#{booking.id}</span>}
          </div>
          <h3 className="reservation-service-name">{serviceName}</h3>
          <div className="reservation-meta-row">
            <span className="meta-item">
              <Calendar size={14} />
              {formattedDate}
            </span>
            {time && (
              <span className="meta-item">
                <Clock size={14} />
                {time}
              </span>
            )}
            <span className="meta-item">
              <Video size={14} />
              Google Meet
            </span>
          </div>
        </div>
      </div>

      <div className="reservation-card-right">
        {onCancel && (
          <button
            type="button"
            className="btn-cancel-reservation"
            onClick={() => onCancel(booking.id)}
            title="Cancel this reservation"
            aria-label={`Cancel booking for ${serviceName}`}
          >
            <Trash2 size={15} />
            <span>Cancel</span>
          </button>
        )}
      </div>
    </article>
  )
}
