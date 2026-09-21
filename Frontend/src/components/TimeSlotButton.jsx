import { Clock, Check } from 'lucide-react'

// Helper to format "09:30" or "09:30:00" to "9:30 AM"
function formatTimeString(rawTime) {
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

export function TimeSlotButton({ slot, selected, onClick }) {
  const time = slot.start_time || slot.time || slot.start
  const formatted = formatTimeString(time)

  return (
    <button
      type="button"
      className={`time-slot-pill ${selected ? 'is-selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <Clock size={14} className="slot-clock-icon" />
      <span className="slot-time-text">{formatted}</span>
      {selected && <Check size={14} className="slot-check-icon" />}
    </button>
  )
}
