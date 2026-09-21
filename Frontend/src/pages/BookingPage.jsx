import React, { useState, useEffect } from 'react'
import { useServices } from '../hooks/useServices'
import { useSlots } from '../hooks/useSlots'
import { useBookings } from '../hooks/useBookings'
import { useAvailableDates } from '../hooks/useAvailableDates'
import { ServiceSelector } from '../components/ServiceSelector'
import { Calendar } from '../components/Calendar'
import { TimeSlotList } from '../components/TimeSlotList'
import { BookingConfirmation } from '../components/BookingConfirmation'
import { BookingConflictNotice } from '../components/BookingConflictNotice'
import { BookingSuccess } from '../components/BookingSuccess'
import { Spinner } from '../components/ui/Spinner'
import { Check, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react'

export function BookingPage({ go }) {
  const { services, loading: servicesLoading, error: servicesError } = useServices()
  const availableDates = useAvailableDates()
  const [service, setService] = useState(null)
  const [date, setDate] = useState(null)
  const [slot, setSlot] = useState(null)
  const [booking, setBooking] = useState(null)
  const [conflict, setConflict] = useState(false)
  const [saving, setSaving] = useState(false)

  const { slots, loading: slotsLoading } = useSlots(service?.id, date)
  const { create } = useBookings(false)

  // Check for preselected service from homepage navigation
  useEffect(() => {
    if (services.length > 0 && !service) {
      const preselectedId = window.sessionStorage?.getItem('selected_service_id')
      if (preselectedId) {
        const found = services.find((s) => String(s.id) === String(preselectedId))
        if (found) {
          setService(found)
          window.sessionStorage.removeItem('selected_service_id')
        }
      }
    }
  }, [services, service])

  const chooseService = (next) => {
    setService(next)
    setDate(null)
    setSlot(null)
    setConflict(false)
  }

  const chooseDate = (next) => {
    setDate(next)
    setSlot(null)
    setConflict(false)
  }

  const confirm = async () => {
    setSaving(true)
    setConflict(false)
    try {
      const result = await create({ service_id: service.id, slot_id: slot.id })
      setBooking(result)
    } catch (error) {
      if (error.status === 409) {
        setConflict(true)
      } else {
        window.alert(error.message || 'Failed to complete reservation.')
      }
    } finally {
      setSaving(false)
    }
  }

  if (booking) {
    return (
      <section className="page-standard-container" style={{ maxWidth: '640px', margin: '48px auto' }}>
        <BookingSuccess booking={booking} onDone={() => go('/bookings')} />
      </section>
    )
  }

  return (
    <section className="booking-page-container">
      {/* Top Breadcrumb / Return */}
      <div className="booking-nav-top">
        <button type="button" className="booking-back-btn" onClick={() => go('/')}>
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="booking-page-header">
        <div className="booking-badge-wrapper">
          <span className="eyebrow-badge">
            <Sparkles size={13} />
            Reserve Your Session
          </span>
        </div>
        <h1 className="booking-main-title">Select a Date & Time</h1>
        <p className="booking-subtitle">
          Pick your desired consultation, select a day on our live calendar, and choose your preferred slot.
        </p>
      </div>

      <div className="booking-two-col-layout">
        {/* Left Column: Interactive Steps */}
        <div className="booking-flow-steps">
          {/* Step 1: Select Service */}
          <section className="step-card">
            <div className="step-header">
              <div className={`step-circle ${service ? 'is-completed' : 'is-active'}`}>
                {service ? <Check size={14} /> : '1'}
              </div>
              <div>
                <h2 className="step-heading">Select a Service Offering</h2>
                <p className="step-desc">Choose the consultation type or experience you would like to book</p>
              </div>
            </div>

            <div className="step-content">
              {servicesLoading ? (
                <div className="step-loading-box">
                  <Spinner size="md" />
                  <span>Loading services catalog…</span>
                </div>
              ) : servicesError ? (
                <div className="alert-banner alert-warning">
                  <AlertCircle size={18} />
                  <span>Could not load services. Please check your network connection.</span>
                </div>
              ) : (
                <ServiceSelector services={services} value={service} onChange={chooseService} />
              )}
            </div>
          </section>

          {/* Step 2: Pick a Date */}
          <section className="step-card">
            <div className="step-header">
              <div className={`step-circle ${date ? 'is-completed' : service ? 'is-active' : 'is-idle'}`}>
                {date ? <Check size={14} /> : '2'}
              </div>
              <div>
                <h2 className="step-heading">Choose a Date</h2>
                <p className="step-desc">Pick an available day for your appointment</p>
              </div>
            </div>

            <div className="step-content">
              <Calendar value={date} onChange={chooseDate} availableDates={availableDates} />
            </div>
          </section>

          {/* Step 3: Choose a Time Slot */}
          <section className="step-card">
            <div className="step-header">
              <div className={`step-circle ${slot ? 'is-completed' : date ? 'is-active' : 'is-idle'}`}>
                {slot ? <Check size={14} /> : '3'}
              </div>
              <div>
                <h2 className="step-heading">Select a Time Slot</h2>
                <p className="step-desc">Choose from open times in your local timezone</p>
              </div>
            </div>

            <div className="step-content">
              {!service || !date ? (
                <div className="empty-state-box">
                  <p className="empty-title">Select a service and date first</p>
                  <span className="empty-subtitle">
                    Once you pick a service and date above, open slots will appear right here.
                  </span>
                </div>
              ) : (
                <TimeSlotList slots={slots} value={slot} onChange={setSlot} loading={slotsLoading} />
              )}

              {conflict && <BookingConflictNotice />}
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Reservation Summary */}
        <div className="booking-summary-col">
          <BookingConfirmation
            service={service}
            date={date}
            slot={slot}
            onConfirm={confirm}
            loading={saving}
          />
        </div>
      </div>
    </section>
  )
}
