import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Calendar, Check, Loader2, ChevronRight, Video, Mail, Phone, User } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const IGV_BLUE = '#00318D';
const IGV_BLUE_HOVER = '#002570';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://igv-cms-backend.onrender.com';

/**
 * AppointmentPage — Post-payment booking page for the Audit pack.
 * Flow: select slot → fill form → confirm → see Meet link
 */
const Appointment = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const [searchParams] = useSearchParams();

  // Pre-filled slot from Audit landing page preview
  const preStart = searchParams.get('start');
  const preEnd   = searchParams.get('end');

  const [slots, setSlots]               = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError]     = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(
    preStart && preEnd ? { start: preStart, end: preEnd } : null
  );

  // Form
  const [email, setEmail]   = useState('');
  const [name, setName]     = useState('');
  const [phone, setPhone]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState(null);

  // Confirmation
  const [confirmation, setConfirmation] = useState(null);

  // Load slots
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Jerusalem';
    fetch(`${BACKEND_URL}/api/booking/availability?days=14&duration=60&tz=${encodeURIComponent(tz)}`)
      .then(r => r.json())
      .then(data => {
        setSlots(data.slots || []);
        setSlotsLoading(false);
      })
      .catch(() => {
        setSlotsError(true);
        setSlotsLoading(false);
      });
  }, []);

  const getLocale = () =>
    i18n.language === 'he' ? 'he-IL' : i18n.language === 'en' ? 'en-GB' : 'fr-FR';

  const formatSlot = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString(getLocale(), {
      weekday: 'long', day: 'numeric', month: 'long',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatShort = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString(getLocale(), {
      weekday: 'short', day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Group slots by day label
  const slotsByDay = slots.reduce((acc, slot) => {
    const day = new Date(slot.start).toLocaleDateString(getLocale(), {
      weekday: 'long', day: 'numeric', month: 'long'
    });
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {});

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setFormError(t('booking.errorNoSlot', 'Veuillez sélectionner un créneau.'));
      return;
    }
    if (!email.trim()) {
      setFormError(t('booking.errorNoEmail', "L'email est obligatoire."));
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/booking/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: selectedSlot.start,
          end: selectedSlot.end,
          email: email.trim(),
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
          topic: 'audit'
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 503) {
          throw new Error(
            t('booking.error503',
              "L'agenda n'est pas encore configuré. Contactez-nous directement : israel.growth.venture@gmail.com")
          );
        }
        if (res.status === 409) {
          throw new Error(
            t('booking.error409',
              'Ce créneau vient d\'être réservé. Veuillez en choisir un autre.')
          );
        }
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setConfirmation(data);
    } catch (err) {
      setFormError(
        err.message ||
        t('booking.errorGeneric', 'Une erreur est survenue. Réessayez ou contactez-nous par email.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── CONFIRMATION ──────────────────────────────────────────────────────────
  if (confirmation) {
    return (
      <>
        <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
        <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-10 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: IGV_BLUE }}
            >
              <Check className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: IGV_BLUE }}>
              {t('booking.confirmed', 'Rendez-vous confirmé !')}
            </h1>
            <p className="text-gray-600 mb-6">
              {t('booking.confirmedDesc', 'Un email de confirmation vous a été envoyé.')}
            </p>
            <div className="bg-gray-50 rounded-xl p-5 text-left space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 flex-shrink-0" style={{ color: IGV_BLUE }} />
                <span className="text-gray-800 font-medium">{formatSlot(confirmation.start)}</span>
              </div>
              {confirmation.meetLink && (
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 flex-shrink-0" style={{ color: IGV_BLUE }} />
                  <a
                    href={confirmation.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline break-all"
                    style={{ color: IGV_BLUE }}
                  >
                    {t('booking.joinMeet', 'Rejoindre le Google Meet')}
                  </a>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400">
              {t('booking.confirmEmail', "Vérifiez vos spams si vous ne recevez pas l'email.")}
            </p>
          </div>
        </div>
      </>
    );
  }

  // ── MAIN BOOKING PAGE ─────────────────────────────────────────────────────
  return (
    <>
      <Helmet>
        <title>{t('booking.pageTitle', 'Choisissez votre créneau – IGV Audit')}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className={`min-h-screen pt-20 bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Hero */}
        <section className="py-16 px-6 text-center" style={{ backgroundColor: IGV_BLUE }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            {t('booking.auditTitle', 'Audit sur votre marque – Implantation en Israël')}
          </h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            {t('booking.auditSubtitle', 'Sélectionnez un créneau de 60 minutes et confirmez votre rendez-vous.')}
          </p>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT — Slot selection */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {t('booking.selectSlot', '1. Choisissez un créneau')}
            </h2>

            {slotsLoading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-7 h-7 animate-spin" style={{ color: IGV_BLUE }} />
              </div>
            )}

            {slotsError && (
              <div className="bg-red-50 text-red-700 rounded-xl p-4 text-sm">
                {t('booking.slotsError', 'Impossible de charger les créneaux. Contactez-nous par email.')}{' '}
                <a
                  href="mailto:israel.growth.venture@gmail.com"
                  className="underline font-medium"
                >
                  israel.growth.venture@gmail.com
                </a>
              </div>
            )}

            {!slotsLoading && !slotsError && slots.length === 0 && (
              <div className="bg-yellow-50 text-yellow-800 rounded-xl p-4 text-sm">
                {t('booking.noSlots', 'Aucun créneau disponible dans les 14 prochains jours. Contactez-nous.')}
              </div>
            )}

            {!slotsLoading && Object.entries(slotsByDay).map(([day, daySlots]) => (
              <div key={day} className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{day}</p>
                <div className="grid grid-cols-2 gap-2">
                  {daySlots.map((slot, i) => {
                    const isSelected = selectedSlot?.start === slot.start;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedSlot(slot)}
                        className="px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all"
                        style={{
                          borderColor: IGV_BLUE,
                          backgroundColor: isSelected ? IGV_BLUE : 'white',
                          color: isSelected ? 'white' : IGV_BLUE
                        }}
                      >
                        {new Date(slot.start).toLocaleTimeString(getLocale(), {
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT — Form */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {t('booking.yourInfo', '2. Vos coordonnées')}
            </h2>

            {selectedSlot && (
              <div
                className="rounded-xl p-4 mb-6 text-sm font-medium text-white flex items-center gap-3"
                style={{ backgroundColor: IGV_BLUE }}
              >
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{formatShort(selectedSlot.start)}</span>
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="ml-auto text-blue-200 hover:text-white text-xs underline"
                >
                  {t('booking.change', 'Changer')}
                </button>
              </div>
            )}

            <form onSubmit={handleConfirm} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('booking.email', 'Email')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('booking.name', 'Nom (optionnel)')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder={t('booking.namePlaceholder', 'Prénom Nom')}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('booking.phone', 'Téléphone (optionnel)')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="+33 6 ..."
                  />
                </div>
              </div>

              {formError && (
                <div className="bg-red-50 text-red-700 rounded-lg p-3 text-sm">{formError}</div>
              )}

              <button
                type="submit"
                disabled={submitting || !selectedSlot}
                className="w-full py-4 px-6 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: submitting ? IGV_BLUE_HOVER : IGV_BLUE }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('booking.confirming', 'Confirmation...')}
                  </>
                ) : (
                  <>
                    {t('booking.confirm', 'Confirmer ce créneau')}
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                {t('booking.gdpr', 'Vos données ne sont utilisées que pour confirmer ce rendez-vous.')}
              </p>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-2">
                {t('booking.helpEmail', 'Des questions ? Écrivez-nous :')}
              </p>
              <a
                href="mailto:israel.growth.venture@gmail.com"
                className="text-sm font-medium underline"
                style={{ color: IGV_BLUE }}
              >
                israel.growth.venture@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointment;
