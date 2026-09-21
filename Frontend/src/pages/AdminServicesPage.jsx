import { useState } from 'react'
import { createService } from '../api/services'
import { createSlot } from '../api/slots'
import { useServices } from '../hooks/useServices'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { PlusCircle, Calendar, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react'

export function AdminServicesPage() {
  const { user } = useAuth()
  const { services, refresh } = useServices()
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(true)
  const [service, setService] = useState({ name: '', duration_minutes: 60, price: '' })
  const [slot, setSlot] = useState({ service_id: '', date: '', start_time: '' })
  const [submittingService, setSubmittingService] = useState(false)
  const [submittingSlot, setSubmittingSlot] = useState(false)

  if (!user?.is_admin) {
    return (
      <section className="page-standard-container">
        <div className="alert-banner alert-warning" style={{ marginTop: '40px' }}>
          <ShieldAlert size={24} />
          <div className="alert-content">
            <strong>Access Restricted</strong>
            <p>This management dashboard is available to administrators only.</p>
          </div>
        </div>
      </section>
    )
  }

  const addService = async (event) => {
    event.preventDefault()
    setSubmittingService(true)
    setMessage('')
    try {
      await createService({ ...service, price: Number(service.price) })
      setService({ name: '', duration_minutes: 60, price: '' })
      refresh()
      setIsSuccess(true)
      setMessage('Service published successfully!')
    } catch (err) {
      setIsSuccess(false)
      setMessage(err.message || 'Failed to create service.')
    } finally {
      setSubmittingService(false)
    }
  }

  const addSlot = async (event) => {
    event.preventDefault()
    setSubmittingSlot(true)
    setMessage('')
    try {
      await createSlot(slot)
      setSlot({ service_id: '', date: '', start_time: '' })
      setIsSuccess(true)
      setMessage('Availability slot opened successfully!')
    } catch (err) {
      setIsSuccess(false)
      setMessage(err.message || 'Failed to open slot.')
    } finally {
      setSubmittingSlot(false)
    }
  }

  return (
    <section className="page-standard-container">
      <div className="page-hero-header">
        <div>
          <span className="eyebrow-badge">Admin Dashboard</span>
          <h1 className="page-main-heading">Manage Availability & Services</h1>
          <p className="page-subheading">
            Configure consultation offerings, set durations and prices, and open real-time calendar slots.
          </p>
        </div>
      </div>

      {message && (
        <div className={`alert-banner ${isSuccess ? 'alert-success' : 'alert-warning'}`} style={{ marginBottom: '24px' }}>
          {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <div className="alert-content">
            <strong>{isSuccess ? 'Success' : 'Error'}</strong>
            <p>{message}</p>
          </div>
        </div>
      )}

      <div className="admin-grid-layout">
        {/* New Service Card */}
        <form className="admin-dashboard-card" onSubmit={addService}>
          <div className="admin-card-header">
            <PlusCircle size={20} className="text-primary" />
            <div>
              <h3>Add New Service Offering</h3>
              <p>Define a new appointment type for clients to book</p>
            </div>
          </div>

          <div className="form-group">
            <label className="input-label" htmlFor="svc-name">Service Title</label>
            <input
              id="svc-name"
              className="text-input"
              placeholder="e.g. 1-on-1 Strategy Session"
              value={service.name}
              onChange={(e) => setService({ ...service, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="input-label" htmlFor="svc-duration">Duration (Minutes)</label>
              <input
                id="svc-duration"
                type="number"
                min="5"
                step="5"
                className="text-input"
                value={service.duration_minutes}
                onChange={(e) => setService({ ...service, duration_minutes: Number(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="svc-price">Price ($ USD)</label>
              <input
                id="svc-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="text-input"
                value={service.price}
                onChange={(e) => setService({ ...service, price: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" variant="primary" disabled={submittingService} style={{ marginTop: '8px' }}>
            {submittingService ? 'Publishing…' : 'Publish Service'}
          </Button>
        </form>

        {/* New Slot Card */}
        <form className="admin-dashboard-card" onSubmit={addSlot}>
          <div className="admin-card-header">
            <Calendar size={20} className="text-primary" />
            <div>
              <h3>Open Calendar Time Slot</h3>
              <p>Add available booking times for guests</p>
            </div>
          </div>

          <div className="form-group">
            <label className="input-label" htmlFor="slot-service">Select Service</label>
            <select
              id="slot-service"
              className="text-input"
              value={slot.service_id}
              onChange={(e) => setSlot({ ...slot, service_id: e.target.value })}
              required
            >
              <option value="">Choose a service…</option>
              {services.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.duration_minutes || 60} min)
                </option>
              ))}
            </select>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="input-label" htmlFor="slot-date">Date</label>
              <input
                id="slot-date"
                type="date"
                className="text-input"
                value={slot.date}
                onChange={(e) => setSlot({ ...slot, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="slot-time">Start Time</label>
              <input
                id="slot-time"
                type="time"
                className="text-input"
                value={slot.start_time}
                onChange={(e) => setSlot({ ...slot, start_time: e.target.value })}
                required
              />
            </div>
          </div>

          <Button type="submit" variant="primary" disabled={submittingSlot} style={{ marginTop: '8px' }}>
            {submittingSlot ? 'Opening Slot…' : 'Open Time Slot'}
          </Button>
        </form>
      </div>
    </section>
  )
}
