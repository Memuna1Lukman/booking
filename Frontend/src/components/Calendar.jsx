import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const key = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function Calendar({ value, onChange, availableDates = [] }) {
  const [month, setMonth] = useState(() => {
    if (value) {
      const parts = value.split('-')
      if (parts.length === 3) return new Date(Number(parts[0]), Number(parts[1]) - 1, 1)
    }
    return new Date()
  })

  const days = useMemo(() => {
    const start = new Date(month.getFullYear(), month.getMonth(), 1)
    const offset = start.getDay()
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    return [
      ...Array(offset).fill(null),
      ...Array.from({ length: count }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
    ]
  }, [month])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayKey = key(today)

  const monthName = month.toLocaleString('default', { month: 'long', year: 'numeric' })

  const prevMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
  }

  // Calculate if previous month is in the past
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const isPastMonth = month <= currentMonthStart

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <div className="calendar-title-group">
          <CalendarIcon className="calendar-header-icon" size={18} />
          <span className="calendar-month-name">{monthName}</span>
        </div>
        <div className="calendar-nav-buttons">
          <button
            type="button"
            className="calendar-nav-btn"
            aria-label="Previous month"
            onClick={prevMonth}
            disabled={isPastMonth}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="calendar-nav-btn"
            aria-label="Next month"
            onClick={nextMonth}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="calendar-weekdays">
        {weekdays.map((day) => (
          <span key={day} className="calendar-weekday-cell">
            {day}
          </span>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} className="calendar-day-empty" />

          const dateKey = key(day)
          const isToday = dateKey === todayKey
          const isSelected = value === dateKey
          const isAvailable = day >= today && availableDates.includes(dateKey)
          const isPast = day < today

          return (
            <button
              type="button"
              key={dateKey}
              disabled={!isAvailable}
              onClick={() => onChange(dateKey)}
              className={`calendar-day-btn ${isAvailable ? 'is-available' : 'is-unavailable'} ${
                isSelected ? 'is-selected' : ''
              } ${isToday ? 'is-today' : ''} ${isPast ? 'is-past' : ''}`}
              aria-label={`${day.toLocaleDateString('default', { month: 'short', day: 'numeric' })}${
                isAvailable ? ' - Available' : ' - Unavailable'
              }`}
            >
              <span className="day-number">{day.getDate()}</span>
              {isAvailable && !isSelected && <span className="day-dot" />}
            </button>
          )
        })}
      </div>

      {value && (
        <div className="calendar-selected-summary">
          <span>Selected date:</span>
          <strong>
            {new Date(`${value}T12:00:00`).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </strong>
        </div>
      )}
    </div>
  )
}
