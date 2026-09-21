import { AlertCircle } from 'lucide-react'

export function BookingConflictNotice() {
  return (
    <div className="alert-banner alert-warning" role="alert">
      <AlertCircle size={18} className="alert-icon" />
      <div className="alert-content">
        <strong>Time slot no longer available</strong>
        <p>Another client just reserved this exact slot. Please choose another open time from the list above.</p>
      </div>
    </div>
  )
}
