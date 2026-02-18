import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Calendar, Loader2, ChevronRight } from 'lucide-react';
import israelFlag from '../assets/israel-flag-icon-free-vector.png';

// IGV Brand Color
const IGV_BLUE = '#00318D';
const IGV_BLUE_HOVER = '#002570';

// ENV variable - Google Calendar appointment booking URL (israel.growth.venture@gmail.com)
// Must NOT be Calendly or any third-party booking service - Google Appointment Schedule ONLY
const BOOKING_URL = process.env.REACT_APP_AUDIT_BOOKING_URL || '';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://igv-cms-backend.onrender.com';

/**
 * BookingPreview — shows next available slots fetched from backend.
 * Clicking a slot redirects to /appointment with the slot pre-filled.
 */
const BookingPreview = ({ navigate }) => {
  const { t, i18n } = useTranslation();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Jerusalem';
    fetch(`${BACKEND_URL}/api/booking/availability?days=7&duration=60&tz=${encodeURIComponent(tz)}`)
      .then(r => r.json())
      .then(data => {
        setSlots((data.slots || []).slice(0, 6));
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const formatSlot = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString(i18n.language === 'he' ? 'he-IL' : i18n.language === 'en' ? 'en-GB' : 'fr-FR', {
      weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-6 h-6 animate-spin" style={{ color: IGV_BLUE }} />
    </div>
  );

  if (error || slots.length === 0) return (
    <div className="py-8 text-gray-400 text-sm">
      {t('booking.noSlotsPreview', 'Les créneaux s\'afficheront après votre paiement.')}
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mt-4">
      {slots.map((slot, i) => (
        <button
          key={i}
          onClick={() => navigate(`/appointment?pack=audit&start=${encodeURIComponent(slot.start)}&end=${encodeURIComponent(slot.end)}`)}
          className="flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all hover:shadow-md text-sm font-medium"
          style={{ borderColor: IGV_BLUE, color: IGV_BLUE, backgroundColor: 'white' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = IGV_BLUE; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = IGV_BLUE; }}
        >
          <span>{formatSlot(slot.start)}</span>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        </button>
      ))}
      <div className="sm:col-span-2 text-center mt-4">
        <button
          onClick={() => navigate('/payment?pack=audit')}
          className="text-sm underline"
          style={{ color: IGV_BLUE }}
        >
          {t('booking.seeAllAfterPayment', 'Voir tous les créneaux après paiement →')}
        </button>
      </div>
    </div>
  );
};

/**
 * Audit Landing Page - Premium conversion page for 60min diagnostic
 * Design: Strategic cabinet style, minimal, decision-focused
 * Target: <45 seconds reading time
 * Colors: IGV Blue (#00318D), no black dominant
 */
const Audit = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'he';
  
  // Redirect from main domain to audit subdomain
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // If on main domain, redirect to audit subdomain
      if (hostname === 'israelgrowthventure.com' || hostname === 'www.israelgrowthventure.com') {
        window.location.replace('https://audit.israelgrowthventure.com/');
      }
    }
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle payment CTA click
  const handlePaymentClick = () => {
    // Navigate to internal payment page with audit pack pre-selected
    navigate('/payment?pack=audit');
  };

  // Secondary CTA - scroll to inline booking preview
  const scrollToBooking = () => {
    scrollToSection('booking-preview');
  };

  // Primary CTA Button - "Payer et réserver"
  const PrimaryCTAButton = ({ className = '' }) => (
    <button
      onClick={handlePaymentClick}
      className={`
        inline-flex items-center justify-center gap-3
        px-8 py-4 text-lg font-bold
        rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        text-white shadow-lg hover:shadow-xl
        ${className}
      `}
      style={{ 
        backgroundColor: IGV_BLUE,
        '--tw-ring-color': IGV_BLUE
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = IGV_BLUE_HOVER}
      onMouseLeave={(e) => e.target.style.backgroundColor = IGV_BLUE}
    >
      <span>{t('audit.cta.payAndBook')}</span>
      <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
    </button>
  );

  // Secondary CTA - "Voir les créneaux" (scroll to booking preview)
  const SecondaryCTALink = () => (
    <button
      onClick={scrollToBooking}
      className="inline-flex items-center gap-2 text-sm mt-4 hover:underline transition-colors bg-transparent border-0 cursor-pointer"
      style={{ color: IGV_BLUE }}
    >
      <Calendar className="w-4 h-4" />
      <span>{t('audit.cta.viewSlots')}</span>
    </button>
  );

  // Section divider
  const Divider = () => (
    <div className="w-24 h-px bg-gray-200 mx-auto my-16" />
  );

  return (
    <>
      <Helmet>
        <title>{t('audit.seo.title')}</title>
        <meta name="description" content={t('audit.seo.description')} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://audit.israelgrowthventure.com" />
        
        {/* Open Graph */}
        <meta property="og:title" content={t('audit.seo.title')} />
        <meta property="og:description" content={t('audit.seo.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://audit.israelgrowthventure.com" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={t('audit.seo.title')} />
        <meta name="twitter:description" content={t('audit.seo.description')} />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* SECTION 1 — HERO */}
        <section 
          id="hero"
          className="pt-32 pb-24 px-6 lg:px-8"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-8 tracking-tight"
              style={{ color: IGV_BLUE }}
            >
              {t('audit.hero.title')}
              <img
                src={israelFlag}
                alt=""
                aria-hidden="true"
                style={{
                  height: '0.85em',
                  width: 'auto',
                  marginLeft: '10px',
                  verticalAlign: 'baseline',
                  transform: 'rotate(12deg)',
                  position: 'relative',
                  top: '-0.08em',
                  display: 'inline',
                  pointerEvents: 'none'
                }}
              />
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed">
              {t('audit.hero.subtitle')}
            </p>
            <PrimaryCTAButton />
            <div className="block">
              <SecondaryCTALink />
            </div>
            <button
              onClick={() => scrollToSection('reality')}
              className="block mx-auto mt-12 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={t('audit.accessibility.scrollDown')}
            >
              <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </section>

        <Divider />

        {/* SECTION 2 — REALITE MARCHE */}
        <section 
          id="reality"
          className="py-24 px-6 lg:px-8 bg-gray-50"
        >
          <div className="max-w-3xl mx-auto">
            <h2 
              className="text-3xl sm:text-4xl font-bold mb-8 text-center"
              style={{ color: IGV_BLUE }}
            >
              {t('audit.reality.title')}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed text-center">
              {t('audit.reality.description')}
            </p>
          </div>
        </section>

        <Divider />

        {/* SECTION 3 — CE QUE VOUS OBTENEZ */}
        <section 
          id="deliverables"
          className="py-24 px-6 lg:px-8"
        >
          <div className="max-w-3xl mx-auto">
            <h2 
              className="text-3xl sm:text-4xl font-bold mb-12 text-center"
              style={{ color: IGV_BLUE }}
            >
              {t('audit.deliverables.title')}
            </h2>
            <ul className="space-y-6">
              {['verdict', 'adaptations', 'strategy', 'budget'].map((item) => (
                <li 
                  key={item}
                  className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg"
                >
                  <div 
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: IGV_BLUE }}
                  >
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {t(`audit.deliverables.items.${item}.title`)}
                    </h3>
                    <p className="text-gray-600">
                      {t(`audit.deliverables.items.${item}.description`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Divider />

        {/* SECTION 4 — POSITIONNEMENT */}
        <section 
          id="positioning"
          className="py-24 px-6 lg:px-8"
          style={{ backgroundColor: IGV_BLUE }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white leading-relaxed">
              <span className="text-blue-200">{t('audit.positioning.before')}</span>
              <br />
              <span className="text-white">{t('audit.positioning.after')}</span>
            </blockquote>
          </div>
        </section>

        <Divider />

        {/* SECTION 5 — PRIX */}
        <section 
          id="pricing"
          className="py-24 px-6 lg:px-8"
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block">
              <span 
                className="text-6xl sm:text-7xl lg:text-8xl font-bold"
                style={{ color: IGV_BLUE }}
              >
                900 €
              </span>
            </div>
            <p className="text-lg text-gray-600 mt-6">
              {t('audit.pricing.deductible')}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {t('audit.pricing.duration')}
            </p>
          </div>
        </section>

        <Divider />

        {/* SECTION 6 — CTA FINAL */}
        <section 
          id="final-cta"
          className="py-24 px-6 lg:px-8 bg-gray-50"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 
              className="text-3xl sm:text-4xl font-bold mb-8"
              style={{ color: IGV_BLUE }}
            >
              {t('audit.final.title')}
            </h2>
            <PrimaryCTAButton />
            <div className="block">
              <SecondaryCTALink />
            </div>
          </div>
        </section>

        <Divider />

        {/* SECTION 7 — BOOKING PREVIEW */}
        <section
          id="booking-preview"
          className="py-24 px-6 lg:px-8"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: IGV_BLUE }}
            >
              {t('booking.previewTitle', 'Voyez les créneaux disponibles')}
            </h2>
            <p className="text-gray-600 mb-8">
              {t('booking.previewSubtitle', 'Réservez après paiement — voici un aperçu des prochains créneaux disponibles.')}
            </p>
            <BookingPreview navigate={navigate} />
          </div>
        </section>

        {/* FOOTER MINIMAL */}
        <footer className="py-12 px-6 lg:px-8 border-t border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-gray-500">
              <span 
                className="brand-name-constant font-semibold"
                style={{ color: IGV_BLUE }}
              >
                Israel Growth Venture
              </span>
              {' '}&mdash;{' '}
              {t('audit.footer.tagline')}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {t('audit.footer.legal')}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Audit;
