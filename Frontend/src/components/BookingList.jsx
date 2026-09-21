import { BookingCard } from './BookingCard'
import { CalendarX, Sparkles } from 'lucide-react'

export function BookingList({ bookings, onCancel }) {
  if (!bookings || !bookings.length) {
    return (
      <div className="empty-bookings-panel">
        <div className="empty-icon-circle">
          <CalendarX size={36} />
        </div>
        <h3>No upcoming bookings found</h3>
        <p>When you reserve time with our team or hosts, your upcoming appointments will appear here.</p>
        <a href="#/book" className="btn btn-primary" style={{ marginTop: '16px' }}>
          <Sparkles size={16} />
          <span>Book an Appointment</span>
        </a>
      </div>
    )
  }

  return (
    <div className="reservation-cards-stack">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} onCancel={onCancel} />
      ))}
    </div>
  )
}
