import { Clock, Video, Check } from 'lucide-react'

export function ServiceSelector({ services, value, onChange }) {
  if (!services || services.length === 0) {
    return (
      <div className="empty-state-box">
        <p>No services currently available.</p>
      </div>
    )
  }

  return (
    <div className="service-selection-list" role="radiogroup" aria-label="Available services">
      {services.map((service) => {
        const isSelected = value?.id === service.id
        const duration = service.duration_minutes || service.duration || 60
        const price = service.price ? `$${service.price}` : 'Free'

        return (
          <div
            key={service.id}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            className={`service-card-item ${isSelected ? 'is-selected' : ''}`}
            onClick={() => onChange(service)}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault()
                onChange(service)
              }
            }}
          >
            <div className="service-card-left">
              <div className={`service-radio-circle ${isSelected ? 'is-checked' : ''}`}>
                {isSelected && <Check size={14} className="check-icon" />}
              </div>
              <div className="service-info-group">
                <h4 className="service-item-title">{service.name}</h4>
                <div className="service-badges-row">
                  <span className="badge badge-subtle">
                    <Clock size={12} className="badge-icon" />
                    {duration} mins
                  </span>
                  <span className="badge badge-subtle">
                    <Video size={12} className="badge-icon" />
                    Google Meet / Video
                  </span>
                </div>
              </div>
            </div>

            <div className="service-card-right">
              <span className="service-price-tag">{price}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
