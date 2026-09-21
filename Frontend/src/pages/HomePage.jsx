import React, { useState, useMemo } from 'react'
import { Button } from '../components/ui/Button'
import { useServices } from '../hooks/useServices'
import {
  Calendar,
  Clock,
  Video,
  Star,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search,
  Users,
  Award,
  Share2,
} from 'lucide-react'

// Curated high quality photos for booking consultations & meetings (Airbnb / modern studio vibe)
const defaultServiceImages = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
]

const fallbackShowcaseServices = [
  {
    id: 'demo-1',
    name: '1-on-1 Strategic Consultation',
    duration_minutes: 30,
    price: 75,
    rating: '4.98',
    reviews_count: 142,
    host_name: 'Sarah Jenkins',
    host_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    description: 'A deep-dive strategy session to audit your roadmap, unblock technical bottlenecks, and accelerate growth.',
    category: 'Strategy & Growth',
  },
  {
    id: 'demo-2',
    name: 'Product & Design Critique',
    duration_minutes: 45,
    price: 120,
    rating: '4.96',
    reviews_count: 98,
    host_name: 'Alex Rivera',
    host_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    description: 'Hands-on feedback on user experience, design systems, and product interaction patterns.',
    category: 'Design & UX',
  },
  {
    id: 'demo-3',
    name: 'Executive Advisory & Mentorship',
    duration_minutes: 60,
    price: 150,
    rating: '5.0',
    reviews_count: 76,
    host_name: 'David Kim',
    host_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    description: 'High-level advisory on leadership, hiring, team structure, and scaling high-performing organizations.',
    category: 'Advisory',
  },
  {
    id: 'demo-4',
    name: 'Quick Project Sync & Intro',
    duration_minutes: 15,
    price: 0,
    rating: '4.92',
    reviews_count: 210,
    host_name: 'Sarah Jenkins',
    host_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    description: 'A swift 15-minute alignment check-in to get aligned on scope, milestones, and next steps.',
    category: 'Quick Catchup',
  },
]

// Mock dates for live interactive hero preview widget
const heroSampleDates = [
  { dayName: 'Mon', dayNum: 14, dateStr: '2026-10-14' },
  { dayName: 'Tue', dayNum: 15, dateStr: '2026-10-15', recommended: true },
  { dayName: 'Wed', dayNum: 16, dateStr: '2026-10-16' },
  { dayName: 'Thu', dayNum: 17, dateStr: '2026-10-17' },
  { dayName: 'Fri', dayNum: 18, dateStr: '2026-10-18' },
]

const heroSampleTimes = ['09:30 AM', '11:00 AM', '02:30 PM', '04:15 PM']

const categories = ['All Services', 'Strategy & Growth', 'Design & UX', 'Advisory', 'Quick Catchup']

const testimonials = [
  {
    quote:
      'Luma completely eliminated our email back-and-forth. Clients constantly compliment how beautiful and easy the booking flow is. It genuinely feels like reserving an Airbnb for your schedule.',
    author: 'Elena Rostova',
    role: 'VP of Product',
    company: 'CraftStudio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    rating: 5,
  },
  {
    quote:
      'The cleanest scheduling platform we have used. The live timezone sync, automated Google Meet invites, and instant confirmations brought our no-show rate down to practically zero.',
    author: 'Marcus Chen',
    role: 'Founder & Advisor',
    company: 'ScaleOps',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    rating: 5,
  },
  {
    quote:
      'Booking a high-value consultation used to feel clunky and disjointed. With Luma, our guests pick a slot in 30 seconds and receive calendar invites immediately. Absolute game changer.',
    author: 'Amara Okafor',
    role: 'Design Director',
    company: 'Kinetic Labs',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    rating: 5,
  },
]

const faqs = [
  {
    question: 'Do I need to create an account to book a time?',
    answer:
      'No! Guests can book any available service without creating an account. If you want to keep track of your bookings and manage them in one dashboard, you can sign in anytime.',
  },
  {
    question: 'How do video meeting links and calendar invites work?',
    answer:
      'As soon as your reservation is confirmed, an automated calendar event is created with your Google Meet video link and full instructions sent straight to your email.',
  },
  {
    question: 'Can I reschedule or cancel my appointment?',
    answer:
      'Yes, absolutely. Every booking comes with flexible management. You can cancel or reschedule through your confirmation link or directly from the My Bookings page with zero penalties.',
  },
  {
    question: 'How does timezone detection work for international guests?',
    answer:
      'Luma automatically translates all calendar slots to your local system timezone in real-time, completely preventing timezone conversion errors or double bookings.',
  },
]

export function HomePage({ go }) {
  const { services, loading: servicesLoading } = useServices()
  const [selectedCategory, setSelectedCategory] = useState('All Services')
  const [searchQuery, setSearchQuery] = useState('')

  // Interactive hero widget state
  const [heroSelectedDate, setHeroSelectedDate] = useState('2026-10-15')
  const [heroSelectedTime, setHeroSelectedTime] = useState('11:00 AM')

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(0)

  // Merge real backend services with showcase fallback if backend is empty
  const displayServices = useMemo(() => {
    if (services && services.length > 0) {
      return services.map((s, idx) => ({
        ...s,
        rating: '4.98',
        reviews_count: 85 + (idx * 23),
        host_name: 'Sarah Jenkins',
        host_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        category: idx % 2 === 0 ? 'Strategy & Growth' : 'Design & UX',
        description: s.description || 'Verified consultation with comprehensive insights, action plan, and live Q&A.',
      }))
    }
    return fallbackShowcaseServices
  }, [services])

  // Filter services by category and search
  const filteredServices = useMemo(() => {
    return displayServices.filter((svc) => {
      const matchesCategory =
        selectedCategory === 'All Services' || svc.category === selectedCategory
      const matchesSearch =
        !searchQuery ||
        svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (svc.description && svc.description.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [displayServices, selectedCategory, searchQuery])

  const handleBookService = (serviceId) => {
    if (window.sessionStorage) {
      window.sessionStorage.setItem('selected_service_id', String(serviceId))
    }
    go('/book')
  }

  const handleHeroBookNow = () => {
    go('/book')
  }

  return (
    <div className="home-container">
      {/* ========================================================================= */}
      {/* HERO SECTION: High-converting Calendly / Airbnb Hybrid */}
      {/* ========================================================================= */}
      <section className="hero-section">
        <div className="hero-content-col">
          <div className="hero-eyebrow-pill">
            <span className="eyebrow-dot" />
            <Sparkles size={14} className="eyebrow-sparkle" />
            <span>Effortless Scheduling & Reservations</span>
          </div>

          <h1 className="hero-headline">
            Book appointments & consultations with <span className="text-highlight">zero back-and-forth.</span>
          </h1>

          <p className="hero-subheading">
            Explore verified services, select a time on an interactive live calendar, and get confirmed instantly. Built with the beauty and ease of Airbnb.
          </p>

          <div className="hero-cta-group">
            <Button
              variant="primary"
              size="lg"
              className="hero-primary-btn"
              onClick={handleHeroBookNow}
            >
              <span>Book an Appointment</span>
              <ArrowRight size={18} />
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="hero-secondary-btn"
              onClick={() => go('/bookings')}
            >
              <Calendar size={18} />
              <span>View My Bookings</span>
            </Button>
          </div>

          {/* Social Proof & Trust Strip */}
          <div className="hero-social-proof">
            <div className="avatars-stack">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                alt="Client 1"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                alt="Client 2"
              />
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80"
                alt="Client 3"
              />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                alt="Client 4"
              />
            </div>
            <div className="proof-text-group">
              <div className="stars-rating-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="star-filled" fill="#F59E0B" color="#F59E0B" />
                ))}
                <strong>4.98 / 5</strong>
              </div>
              <span className="proof-subtext">From 2,400+ satisfied clients and teams</span>
            </div>
          </div>

          <div className="hero-trust-badges">
            <span className="trust-badge-item">
              <CheckCircle2 size={15} className="trust-icon" />
              Instant Confirmation
            </span>
            <span className="trust-badge-item">
              <CheckCircle2 size={15} className="trust-icon" />
              No Account Required
            </span>
            <span className="trust-badge-item">
              <CheckCircle2 size={15} className="trust-icon" />
              Free Cancellation
            </span>
          </div>
        </div>

        {/* Hero Interactive Booking Widget (Right Column) */}
        <div className="hero-widget-col">
          <div className="hero-interactive-card">
            {/* Widget Header with Host Details */}
            <div className="widget-card-header">
              <div className="widget-host-info">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Host"
                  className="widget-host-avatar"
                />
                <div>
                  <div className="widget-host-meta">
                    <span className="widget-host-name">Sarah Jenkins</span>
                    <span className="widget-superhost-badge">
                      <Star size={11} fill="currentColor" /> Superhost
                    </span>
                  </div>
                  <h3 className="widget-service-title">1-on-1 Strategic Consultation</h3>
                </div>
              </div>
              <div className="widget-price-badge">
                <span className="price-amount">$75</span>
                <span className="price-unit">/ session</span>
              </div>
            </div>

            {/* Service Highlights Bar */}
            <div className="widget-highlights-row">
              <span className="widget-tag">
                <Clock size={13} />
                30 mins
              </span>
              <span className="widget-tag">
                <Video size={13} />
                Google Meet
              </span>
              <span className="widget-tag status-available">
                <span className="pulse-dot" />
                Slots open today
              </span>
            </div>

            <div className="widget-card-body">
              <div className="widget-step-label">
                <span>Select a day</span>
                <small className="widget-month-label">October 2026</small>
              </div>

              {/* Interactive Date Pills */}
              <div className="widget-days-grid" role="radiogroup" aria-label="Choose day">
                {heroSampleDates.map((item) => {
                  const isSelected = heroSelectedDate === item.dateStr
                  return (
                    <button
                      key={item.dateStr}
                      type="button"
                      className={`widget-day-pill ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => setHeroSelectedDate(item.dateStr)}
                      aria-pressed={isSelected}
                    >
                      <span className="day-name">{item.dayName}</span>
                      <strong className="day-number">{item.dayNum}</strong>
                      {item.recommended && !isSelected && <span className="day-dot-indicator" />}
                    </button>
                  )
                })}
              </div>

              {/* Interactive Time Slots */}
              <div className="widget-step-label" style={{ marginTop: '18px' }}>
                <span>Available times</span>
                <small className="widget-tz-label">Local Time (GMT+1)</small>
              </div>

              <div className="widget-times-grid">
                {heroSampleTimes.map((timeStr) => {
                  const isSelected = heroSelectedTime === timeStr
                  return (
                    <button
                      key={timeStr}
                      type="button"
                      className={`widget-time-pill ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => setHeroSelectedTime(timeStr)}
                      aria-pressed={isSelected}
                    >
                      <Clock size={13} />
                      <span>{timeStr}</span>
                      {isSelected && <CheckCircle2 size={13} className="time-check" />}
                    </button>
                  )
                })}
              </div>

              {/* Dynamic Action Button */}
              <Button
                variant="primary"
                className="widget-book-action-btn"
                onClick={handleHeroBookNow}
              >
                <span>Reserve {heroSelectedTime} Slot</span>
                <ArrowRight size={16} />
              </Button>
            </div>

            <div className="widget-card-footer">
              <div className="widget-footer-item">
                <Globe size={13} className="footer-icon" />
                <span>Timezone automatically detected</span>
              </div>
              <div className="widget-footer-item">
                <ShieldCheck size={13} className="footer-icon" />
                <span>Encrypted & Private</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* LOGO STRIP / TRUSTED BY MODERN TEAMS */}
      {/* ========================================================================= */}
      <section className="companies-trust-bar">
        <span className="bar-title">TRUSTED BY INNOVATIVE FOUNDERS & CREATORS GLOBALLY</span>
        <div className="companies-logos">
          <span className="company-logo">Linear</span>
          <span className="company-logo">Notion</span>
          <span className="company-logo">Figma</span>
          <span className="company-logo">Vercel</span>
          <span className="company-logo">Stripe</span>
          <span className="company-logo">Loom</span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* AIRBNB-STYLE SERVICES EXPLORER & CATEGORY BAR */}
      {/* ========================================================================= */}
      <section className="services-section" id="services">
        <div className="section-title-wrap">
          <span className="eyebrow-badge">Curated Offerings</span>
          <h2 className="section-title">Explore Available Services</h2>
          <p className="section-desc">
            Select a consultation or session designed to provide actionable insight, guidance, and clarity.
          </p>
        </div>

        {/* Filter & Search Bar (Airbnb Search Vibe) */}
        <div className="search-filter-container">
          <div className="category-pills-row">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-filter-pill ${selectedCategory === cat ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="service-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by keyword or service…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-field"
            />
          </div>
        </div>

        {/* Services Cards Grid (Airbnb Cards) */}
        <div className="services-cards-grid">
          {filteredServices.length === 0 ? (
            <div className="empty-state-box" style={{ gridColumn: '1 / -1' }}>
              <p className="empty-title">No services found matching your criteria</p>
              <Button variant="secondary" onClick={() => { setSelectedCategory('All Services'); setSearchQuery(''); }}>
                Reset Filters
              </Button>
            </div>
          ) : (
            filteredServices.map((service, index) => {
              const image = defaultServiceImages[index % defaultServiceImages.length]
              const duration = service.duration_minutes || 60
              const priceDisplay = service.price ? `$${service.price}` : 'Free'

              return (
                <article key={service.id} className="service-airbnb-card">
                  {/* Card Image with Hover Zoom */}
                  <div className="service-card-media">
                    <img src={image} alt={service.name} className="service-img" loading="lazy" />
                    <div className="media-overlay-badges">
                      <span className="media-tag duration-tag">
                        <Clock size={12} />
                        {duration} mins
                      </span>
                      <span className="media-tag type-tag">
                        <Video size={12} />
                        Video Call
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="service-card-details">
                    <div className="card-host-row">
                      <div className="host-mini-info">
                        <img
                          src={service.host_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                          alt={service.host_name || 'Host'}
                          className="host-mini-img"
                        />
                        <span className="host-mini-name">{service.host_name || 'Sarah Jenkins'}</span>
                      </div>
                      <div className="card-rating-chip">
                        <Star size={13} fill="#F59E0B" color="#F59E0B" />
                        <strong>{service.rating}</strong>
                        <span className="review-count">({service.reviews_count})</span>
                      </div>
                    </div>

                    <h3 className="service-name-text">{service.name}</h3>
                    <p className="service-desc-text">{service.description}</p>

                    <div className="card-bottom-action-row">
                      <div className="price-display-block">
                        <span className="price-number">{priceDisplay}</span>
                        <span className="price-subtext">per booking</span>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        className="btn-card-reserve"
                        onClick={() => handleBookService(service.id)}
                      >
                        <span>Book Now</span>
                        <ArrowRight size={14} />
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* HOW IT WORKS: The 3-Step Effortless Flow (Calendly & Airbnb) */}
      {/* ========================================================================= */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="section-title-wrap">
          <span className="eyebrow-badge">Simple & Seamless</span>
          <h2 className="section-title">How Booking Works</h2>
          <p className="section-desc">
            No endless email threads. Get scheduled in three intuitive steps.
          </p>
        </div>

        <div className="how-steps-grid">
          <div className="how-step-card">
            <div className="step-num-bubble">01</div>
            <div className="step-icon-circle">
              <Sparkles size={24} className="step-svg-icon" />
            </div>
            <h3 className="step-card-title">1. Select your service</h3>
            <p className="step-card-text">
              Browse available consultations and meeting formats. Each offering shows transparent durations, pricing, and expectations upfront.
            </p>
          </div>

          <div className="how-step-card">
            <div className="step-num-bubble">02</div>
            <div className="step-icon-circle">
              <Calendar size={24} className="step-svg-icon" />
            </div>
            <h3 className="step-card-title">2. Pick a convenient slot</h3>
            <p className="step-card-text">
              View real-time availability on our interactive calendar. Times automatically synchronize with your local timezone so there are never any mix-ups.
            </p>
          </div>

          <div className="how-step-card">
            <div className="step-num-bubble">03</div>
            <div className="step-icon-circle">
              <CheckCircle2 size={24} className="step-svg-icon" />
            </div>
            <h3 className="step-card-title">3. Confirmed in seconds</h3>
            <p className="step-card-text">
              Receive your confirmed reservation, Google Meet video link, and calendar invite instantly. Need to adjust? Reschedule anytime with one click.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* WHY TEAMS CHOOSE LUMA (Calendly Value Props) */}
      {/* ========================================================================= */}
      <section className="features-section" id="features">
        <div className="section-title-wrap">
          <span className="eyebrow-badge">Designed for Clarity</span>
          <h2 className="section-title">Why Modern Professionals Choose Luma</h2>
          <p className="section-desc">
            Every feature is crafted to protect your focus, save your time, and elevate your client experience.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-item-card">
            <div className="feature-icon-box">
              <Zap size={22} />
            </div>
            <h3 className="feature-title">Instant Self-Serve Booking</h3>
            <p className="feature-desc">
              Replace 4 back-and-forth emails with a single polished link where clients can pick an open slot in 30 seconds.
            </p>
          </div>

          <div className="feature-item-card">
            <div className="feature-icon-box">
              <Globe size={22} />
            </div>
            <h3 className="feature-title">Smart Timezone Intelligence</h3>
            <p className="feature-desc">
              Automatic local timezone conversion ensures you and your guests are always on the same page, anywhere in the world.
            </p>
          </div>

          <div className="feature-item-card">
            <div className="feature-icon-box">
              <ShieldCheck size={22} />
            </div>
            <h3 className="feature-title">Buffer Time & Focus Protection</h3>
            <p className="feature-desc">
              Smart buffer management prevents back-to-back fatigue by preserving transition breaks between appointments.
            </p>
          </div>

          <div className="feature-item-card">
            <div className="feature-icon-box">
              <Share2 size={22} />
            </div>
            <h3 className="feature-title">Frictionless Rescheduling</h3>
            <p className="feature-desc">
              Plans change. Guests can modify or cancel reservations with a single click without needing to chase down coordinators.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* REVIEWS & SOCIAL PROOF: Airbnb Guest Reviews Style */}
      {/* ========================================================================= */}
      <section className="reviews-section">
        <div className="section-title-wrap">
          <span className="eyebrow-badge">Guest Experiences</span>
          <h2 className="section-title">Loved by Hosts & Guests Alike</h2>
          <p className="section-desc">
            See what founders, consultants, and clients have to say about booking with Luma.
          </p>
        </div>

        <div className="reviews-cards-grid">
          {testimonials.map((item, idx) => (
            <div key={idx} className="review-guest-card">
              <div className="review-stars-row">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <blockquote className="review-quote-text">“{item.quote}”</blockquote>
              <div className="review-author-row">
                <img src={item.avatar} alt={item.author} className="review-author-avatar" />
                <div>
                  <strong className="review-author-name">{item.author}</strong>
                  <span className="review-author-role">
                    {item.role}, {item.company}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FAQ ACCORDION SECTION */}
      {/* ========================================================================= */}
      <section className="faq-section">
        <div className="section-title-wrap">
          <span className="eyebrow-badge">Got Questions?</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-desc">
            Everything you need to know about scheduling your appointment with Luma.
          </p>
        </div>

        <div className="faq-accordion-list">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div key={index} className={`faq-accordion-item ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <span className="faq-toggle-icon">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>
                {isOpen && (
                  <div className="faq-answer-panel">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FINAL BOTTOM CTA BANNER (Airbnb / Calendly Style) */}
      {/* ========================================================================= */}
      <section className="bottom-cta-banner">
        <div className="cta-banner-card">
          <div className="cta-card-content">
            <span className="eyebrow-badge text-white">Reclaim Your Calendar</span>
            <h2 className="cta-banner-title">
              Ready to schedule your appointment in under 60 seconds?
            </h2>
            <p className="cta-banner-subtitle">
              Join thousands of professionals who have simplified their meetings with Luma.
            </p>
            <div className="cta-banner-buttons">
              <Button
                variant="white"
                size="lg"
                className="cta-btn-white"
                onClick={handleHeroBookNow}
              >
                <span>Book Your Session Now</span>
                <ArrowRight size={18} />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="cta-btn-ghost-white"
                onClick={() => go('/bookings')}
              >
                <span>View My Bookings</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER: Airbnb & Calendly Hybrid */}
      {/* ========================================================================= */}
      <footer className="site-main-footer">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-brand-logo">
              <div className="brand-logo-mark">
                <Calendar size={18} className="logo-icon" />
              </div>
              <span className="brand-name-text">
                luma<span className="brand-dot">.</span>
              </span>
            </div>
            <p className="footer-brand-tagline">
              Modern scheduling for thoughtful work. Designed with the elegance and simplicity of Airbnb and Calendly.
            </p>
            <div className="footer-trust-pills">
              <span className="trust-pill-small">
                <ShieldCheck size={13} /> 100% Encrypted
              </span>
              <span className="trust-pill-small">
                <Globe size={13} /> Global Timezone Sync
              </span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <button type="button" onClick={() => go('/')}>Home</button>
            <button type="button" onClick={() => go('/book')}>Book an Appointment</button>
            <button type="button" onClick={() => go('/bookings')}>My Bookings</button>
            <button type="button" onClick={() => go('/login')}>Sign In</button>
          </div>

          <div className="footer-links-col">
            <h4>Services</h4>
            <button type="button" onClick={() => go('/book')}>1-on-1 Consultation</button>
            <button type="button" onClick={() => go('/book')}>Strategy & Growth</button>
            <button type="button" onClick={() => go('/book')}>Product Review</button>
            <button type="button" onClick={() => go('/book')}>Executive Coaching</button>
          </div>

          <div className="footer-links-col">
            <h4>Confidence & Trust</h4>
            <span>Instant confirmations</span>
            <span>Free cancellation</span>
            <span>Google Meet integration</span>
            <span>No account required</span>
          </div>
        </div>

        <div className="footer-bottom-row">
          <div className="footer-bottom-left">
            <span>© 2026 Luma Booking Inc. All rights reserved.</span>
            <span className="dot-sep">·</span>
            <a href="#/book">Privacy</a>
            <span className="dot-sep">·</span>
            <a href="#/book">Terms</a>
            <span className="dot-sep">·</span>
            <a href="#/book">Sitemap</a>
          </div>

          <div className="footer-bottom-right">
            <span className="locale-selector">
              <Globe size={14} /> English (US)
            </span>
            <span className="currency-selector">$ USD</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
