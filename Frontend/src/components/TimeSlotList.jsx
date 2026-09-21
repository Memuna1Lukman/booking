import { TimeSlotButton } from './TimeSlotButton'
import { Spinner } from './ui/Spinner'
import { Clock } from 'lucide-react'

export function TimeSlotList({ slots, value, onChange, loading }) {
  if (loading) {
    return (
      <div className="slots-loading-state">
        <Spinner size="md" />
        <span>Finding available times…</span>
      </div>
    )
  }

  if (!slots || !slots.length) {
    return (
      <div className="empty-state-box">
        <Clock size={28} className="empty-icon" />
        <p className="empty-title">No available slots for this date</p>
        <span className="empty-subtitle">Please select another date on the calendar above.</span>
      </div>
    )
  }

  return (
    <div className="time-slots-container">
      <div className="time-slots-header">
        <span className="slots-count-badge">{slots.length} open slots available</span>
      </div>
      <div className="time-slots-grid">
        {slots.map((slot) => (
          <TimeSlotButton
            key={slot.id || slot.start_time}
            slot={slot}
            selected={value?.id === slot.id}
            onClick={() => onChange(slot)}
          />
        ))}
      </div>
    </div>
  )
}
