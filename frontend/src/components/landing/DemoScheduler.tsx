'use client';

import { useState, useRef, useId } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, CheckCircle2, MessageCircle } from 'lucide-react';
import { fetchApi } from '../../lib/api';

export interface DayOption {
  iso: string;
  weekday: string;
  day: string;
  monthLabel: string;
  full: string;
  accessibleLabel?: string;
}

interface DemoSchedulerProps {
  days: DayOption[];
}

type TimeSlot = 'MORNING' | 'AFTERNOON' | 'EVENING';

const TIME_OPTIONS: { id: TimeSlot; label: string }[] = [
  { id: 'MORNING', label: 'Morning' },
  { id: 'AFTERNOON', label: 'Afternoon' },
  { id: 'EVENING', label: 'Evening' },
];

export default function DemoScheduler({ days }: DemoSchedulerProps) {
  // Default selection: tomorrow (days[1] if available, otherwise days[0])
  const defaultDay = days.length > 1 ? days[1] : days[0];

  const [selectedDay, setSelectedDay] = useState<DayOption>(defaultDay);
  const [selectedTime, setSelectedTime] = useState<TimeSlot>('EVENING');

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pgName, setPgName] = useState('');
  const [city, setCity] = useState('');
  const [beds, setBeds] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot

  // Form submission state
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs for focusing first invalid field
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const bedsInputRef = useRef<HTMLInputElement>(null);

  const dayRadiosRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Unique IDs for accessibility
  const dayGroupLabelId = useId();
  const timeGroupLabelId = useId();

  const rawWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const whatsAppNumber = rawWhatsApp.replace(/\D/g, '');
  const waDirectMessage = encodeURIComponent('Hi, I would like a PGMitra demo');
  const waUrl = whatsAppNumber ? `https://wa.me/${whatsAppNumber}?text=${waDirectMessage}` : '';

  const cleanPhone = (val: string) => {
    let digits = val.trim().replace(/[\s\-]/g, '');
    if (digits.startsWith('+91')) {
      digits = digits.substring(3);
    } else if (digits.startsWith('91') && digits.length === 12) {
      digits = digits.substring(2);
    } else if (digits.startsWith('0') && digits.length === 11) {
      digits = digits.substring(1);
    }
    return digits.replace(/\D/g, '');
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const trimmedName = name.trim();

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 80) {
      newErrors.name = 'Please enter your name (2 to 80 characters)';
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const cleanedPhone = cleanPhone(phone);
    if (!/^\d{10}$/.test(cleanedPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit WhatsApp phone number';
    }

    if (beds.trim() !== '') {
      const bedsNum = parseInt(beds, 10);
      if (isNaN(bedsNum) || bedsNum < 1 || bedsNum > 5000) {
        newErrors.beds = 'Please enter a bed count between 1 and 5000';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (website && website.trim() !== '') {
      // Hidden honeypot triggered: simulate success without saving
      setStatus('success');
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus first invalid field
      if (validationErrors.name && nameInputRef.current) {
        nameInputRef.current.focus();
      } else if (validationErrors.email && emailInputRef.current) {
        emailInputRef.current.focus();
      } else if (validationErrors.phone && phoneInputRef.current) {
        phoneInputRef.current.focus();
      } else if (validationErrors.beds && bedsInputRef.current) {
        bedsInputRef.current.focus();
      }
      return;
    }

    setErrors({});
    setStatus('loading');
    setErrorMsg('');

    try {
      const cleanedPhone = cleanPhone(phone);
      const bedsNum = beds.trim() !== '' ? parseInt(beds, 10) : undefined;

      await fetchApi('/demo-requests', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: cleanedPhone,
          pgName: pgName.trim() || undefined,
          city: city.trim() || undefined,
          approxBeds: bedsNum,
          preferredDate: selectedDay.iso,
          preferredTime: selectedTime,
          message: message.trim() || undefined,
          website: website || undefined,
        }),
      });

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      if (
        err?.status === 429 ||
        err?.message?.includes('Too Many Requests') ||
        err?.message?.includes('Throttler')
      ) {
        setErrorMsg('Too many requests. Please wait a minute and try again.');
      } else if (err?.message) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Unable to submit your request right now. Please try again or reach out on WhatsApp.');
      }
    }
  };

  // Keyboard navigation for day radio group
  const handleDayKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % days.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + days.length) % days.length;
    }

    if (nextIndex !== index) {
      setSelectedDay(days[nextIndex]);
      dayRadiosRef.current[nextIndex]?.focus();
    }
  };

  const selectedTimeLabel = TIME_OPTIONS.find((t) => t.id === selectedTime)?.label || 'Evening';

  // Success view
  if (status === 'success') {
    return (
      <div className="w-full max-w-lg mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-[#E7E4DD] shadow-xl text-center">
        <div className="w-16 h-16 rounded-full bg-[#EAF4F3] text-[#0F766E] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#242624] tracking-tight mb-3">
          Request received
        </h2>

        <p className="text-[#526078] text-base sm:text-lg leading-relaxed mb-8">
          Thank you. We will contact you on <strong className="text-[#242624] font-semibold">{selectedDay.full}</strong> in the{' '}
          <strong className="text-[#242624] font-semibold">{selectedTimeLabel.toLowerCase()}</strong> to confirm. Until then, you can chat with us on WhatsApp.
        </p>

        <div className="space-y-3">
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[52px] rounded-xl bg-[#0B6B5F] hover:bg-[#085249] text-white font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat on WhatsApp</span>
            </a>
          )}

          <Link
            href="/"
            className="w-full min-h-[52px] rounded-xl border border-[#D9D5CB] bg-white text-[#242624] font-semibold flex items-center justify-center hover:bg-[#F5F4F1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-start gap-7 lg:gap-7">
      {/* LEFT COLUMN: Form Card (flex 1.5) */}
      <div className="w-full lg:flex-[1.5] bg-white rounded-3xl p-5 sm:p-8 border border-[#E7E4DD] shadow-sm">
        <form onSubmit={handleSubmit} noValidate>
          {/* Honeypot field */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
          />

          {/* Section 1: Pick a day */}
          <fieldset className="mb-8 border-none p-0 m-0">
            <legend className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-[#052E26] text-[#34D399] text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <span id={dayGroupLabelId} className="text-[17px] font-bold text-[#242624]">
                Pick a day
              </span>
            </legend>

            <div
              role="radiogroup"
              aria-labelledby={dayGroupLabelId}
              className="grid grid-cols-7 gap-1.5 sm:gap-2.5"
            >
              {days.map((item, idx) => {
                const isSelected = selectedDay.iso === item.iso;
                return (
                  <button
                    key={item.iso}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={item.accessibleLabel || item.full}
                    ref={(el) => {
                      dayRadiosRef.current[idx] = el;
                    }}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => setSelectedDay(item)}
                    onKeyDown={(e) => handleDayKeyDown(e, idx)}
                    className={`min-h-[52px] sm:min-h-[64px] flex flex-col items-center justify-center rounded-xl py-1.5 px-0.5 sm:py-2 sm:px-1 border transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40 ${
                      isSelected
                        ? 'bg-[#0F766E] border-[#0F766E] text-white shadow-sm'
                        : 'bg-white border-[#D9D5CB] text-[#242624] hover:border-[#0F766E]/50 hover:bg-[#F5F4F1]/60'
                    }`}
                  >
                    <span
                      className={`text-[11px] sm:text-xs font-medium uppercase tracking-tight ${
                        isSelected ? 'text-white/80' : 'text-[#526078]'
                      }`}
                    >
                      {item.weekday}
                    </span>
                    <span className="text-[18px] sm:text-[20px] font-bold leading-tight mt-0.5">
                      {item.day}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Section 2: Pick a time */}
          <fieldset className="mb-8 border-none p-0 m-0">
            <legend className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-[#052E26] text-[#34D399] text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <span id={timeGroupLabelId} className="text-[17px] font-bold text-[#242624]">
                Pick a time
              </span>
            </legend>

            <div
              role="radiogroup"
              aria-labelledby={timeGroupLabelId}
              className="grid grid-cols-3 gap-2.5 sm:gap-3"
            >
              {TIME_OPTIONS.map((slot) => {
                const isSelected = selectedTime === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedTime(slot.id)}
                    className={`min-h-[44px] rounded-xl font-semibold text-sm sm:text-base border transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40 ${
                      isSelected
                        ? 'bg-[#0F766E] border-[#0F766E] text-white shadow-sm'
                        : 'bg-white border-[#D9D5CB] text-[#242624] hover:border-[#0F766E]/50 hover:bg-[#F5F4F1]/60'
                    }`}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Section 3: Your details */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-[#052E26] text-[#34D399] text-xs font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <h2 className="text-[17px] font-bold text-[#242624]">
                Your details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Your name */}
              <div className="flex flex-col">
                <label htmlFor="name-input" className="text-sm font-semibold text-[#242624] mb-1.5">
                  Your name <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  id="name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors((prev) => ({ ...prev, name: '' }));
                    }
                  }}
                  placeholder="e.g. Rahul Sharma"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={`min-h-[46px] rounded-xl bg-white px-3.5 py-2.5 text-base sm:text-sm text-[#242624] border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40 ${
                    errors.name ? 'border-red-500' : 'border-[#D9D5CB]'
                  }`}
                />
                {errors.name && (
                  <p id="name-error" role="alert" className="text-red-600 text-xs mt-1 font-medium">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email address */}
              <div className="flex flex-col">
                <label htmlFor="email-input" className="text-sm font-semibold text-[#242624] mb-1.5">
                  Email address <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  ref={emailInputRef}
                  id="email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: '' }));
                    }
                  }}
                  placeholder="e.g. rahul@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`min-h-[46px] rounded-xl bg-white px-3.5 py-2.5 text-base sm:text-sm text-[#242624] border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40 ${
                    errors.email ? 'border-red-500' : 'border-[#D9D5CB]'
                  }`}
                />
                {errors.email && (
                  <p id="email-error" role="alert" className="text-red-600 text-xs mt-1 font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone (WhatsApp) */}
              <div className="flex flex-col">
                <label htmlFor="phone-input" className="text-sm font-semibold text-[#242624] mb-1.5">
                  Phone (WhatsApp) <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  ref={phoneInputRef}
                  id="phone-input"
                  type="tel"
                  inputMode="numeric"
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) {
                      setErrors((prev) => ({ ...prev, phone: '' }));
                    }
                  }}
                  placeholder="e.g. 9876543210"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  className={`min-h-[46px] rounded-xl bg-white px-3.5 py-2.5 text-base sm:text-sm text-[#242624] border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40 ${
                    errors.phone ? 'border-red-500' : 'border-[#D9D5CB]'
                  }`}
                />
                {errors.phone && (
                  <p id="phone-error" role="alert" className="text-red-600 text-xs mt-1 font-medium">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* PG / Company name */}
              <div className="flex flex-col">
                <label htmlFor="pgname-input" className="text-sm font-semibold text-[#242624] mb-1.5">
                  PG / Company name
                </label>
                <input
                  id="pgname-input"
                  type="text"
                  value={pgName}
                  onChange={(e) => setPgName(e.target.value)}
                  placeholder="e.g. Green Valley PG"
                  className="min-h-[46px] rounded-xl bg-white px-3.5 py-2.5 text-base sm:text-sm text-[#242624] border border-[#D9D5CB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40"
                />
              </div>

              {/* City */}
              <div className="flex flex-col">
                <label htmlFor="city-input" className="text-sm font-semibold text-[#242624] mb-1.5">
                  City
                </label>
                <input
                  id="city-input"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className="min-h-[46px] rounded-xl bg-white px-3.5 py-2.5 text-base sm:text-sm text-[#242624] border border-[#D9D5CB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40"
                />
              </div>

              {/* Approx. number of beds */}
              <div className="flex flex-col">
                <label htmlFor="beds-input" className="text-sm font-semibold text-[#242624] mb-1.5">
                  Approx. number of beds
                </label>
                <input
                  ref={bedsInputRef}
                  id="beds-input"
                  type="number"
                  min="1"
                  max="5000"
                  value={beds}
                  onChange={(e) => {
                    setBeds(e.target.value);
                    if (errors.beds) {
                      setErrors((prev) => ({ ...prev, beds: '' }));
                    }
                  }}
                  placeholder="e.g. 50"
                  aria-invalid={!!errors.beds}
                  aria-describedby={errors.beds ? 'beds-error' : undefined}
                  className={`min-h-[46px] rounded-xl bg-white px-3.5 py-2.5 text-base sm:text-sm text-[#242624] border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40 ${
                    errors.beds ? 'border-red-500' : 'border-[#D9D5CB]'
                  }`}
                />
                {errors.beds && (
                  <p id="beds-error" role="alert" className="text-red-600 text-xs mt-1 font-medium">
                    {errors.beds}
                  </p>
                )}
              </div>

              {/* Message / Special Notes (full width) */}
              <div className="flex flex-col sm:col-span-2">
                <label htmlFor="message-input" className="text-sm font-semibold text-[#242624] mb-1.5">
                  Message / Requirements (optional)
                </label>
                <textarea
                  id="message-input"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any specific questions or requirements about your PG operations..."
                  className="rounded-xl bg-white px-3.5 py-2.5 text-base sm:text-sm text-[#242624] border border-[#D9D5CB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40 resize-none"
                />
              </div>
            </div>
          </section>

          {/* Error Alert Box */}
          {status === 'error' && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
            >
              {errorMsg}
            </div>
          )}

          {/* Submit Button & Muted line */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full min-h-[52px] rounded-xl bg-gradient-to-r from-[#0B5A4B] to-[#0F766E] text-white font-semibold text-base flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-[0_4px_14px_rgba(15,118,110,0.25)] disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40"
            >
              {status === 'loading' ? (
                'Please wait...'
              ) : (
                <>
                  <span>Request my demo</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-[#526078] mt-3.5">
              We will only use your details to contact you about the demo.
            </p>
          </div>
        </form>
      </div>

      {/* RIGHT COLUMN: Summary Card & WhatsApp button (flex 1, sticky top-6 on desktop) */}
      <aside className="w-full lg:flex-1 lg:sticky lg:top-6 flex flex-col gap-4">
        {/* On mobile: WhatsApp button is above summary card. On desktop: Summary card is first, WhatsApp is under it */}
        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="order-1 lg:order-2 w-full min-h-[48px] rounded-xl border border-[#0B6B5F] bg-white text-[#0B6B5F] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#EAF4F3]/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp instead</span>
          </a>
        )}

        {/* White rounded-2xl "Your request" card */}
        <div className="order-2 lg:order-1 bg-white rounded-2xl p-6 border border-[#E7E4DD] shadow-sm">
          <span className="text-[11px] font-bold text-[#0F766E] tracking-wider uppercase block mb-1">
            YOUR REQUEST
          </span>

          <h3
            aria-live="polite"
            className="text-lg font-bold text-[#242624] tracking-tight mb-5"
          >
            Demo for {pgName.trim() ? pgName.trim() : 'your PG'}
          </h3>

          {/* Rows separated by 1px lines */}
          <div className="divide-y divide-[#E7E4DD] text-sm">
            <div className="py-3 flex justify-between items-center gap-3">
              <span className="text-[#526078]">Preferred day</span>
              <span aria-live="polite" className="font-semibold text-[#242624] text-right">
                {selectedDay.full}
              </span>
            </div>

            <div className="py-3 flex justify-between items-center gap-3">
              <span className="text-[#526078]">Preferred time</span>
              <span aria-live="polite" className="font-semibold text-[#242624] text-right">
                {selectedTimeLabel}
              </span>
            </div>

            <div className="py-3 flex justify-between items-center gap-3">
              <span className="text-[#526078]">Email</span>
              <span aria-live="polite" className="font-semibold text-[#242624] text-right truncate max-w-[180px]">
                {email.trim() || 'Not entered'}
              </span>
            </div>

            <div className="py-3 flex justify-between items-center gap-3">
              <span className="text-[#526078]">Contact</span>
              <span className="font-semibold text-[#242624] text-right">
                WhatsApp and call
              </span>
            </div>
          </div>

          <p className="text-xs text-[#526078] leading-relaxed mt-4 pt-3 border-t border-[#E7E4DD]">
            We will confirm the time by call or WhatsApp. This is a request, not a fixed slot.
          </p>

          {/* WHAT YOU WILL SEE */}
          <div className="mt-6 pt-5 border-t border-[#E7E4DD]">
            <span className="text-[11px] font-bold text-[#526078] tracking-wider uppercase block mb-3">
              WHAT YOU WILL SEE
            </span>
            <ul className="space-y-2.5">
              <li className="flex items-start text-sm text-[#242624]">
                <div className="w-4 h-4 rounded-full bg-[#EAF4F3] text-[#0F766E] flex items-center justify-center shrink-0 mr-2.5 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Rooms and beds</span>
              </li>
              <li className="flex items-start text-sm text-[#242624]">
                <div className="w-4 h-4 rounded-full bg-[#EAF4F3] text-[#0F766E] flex items-center justify-center shrink-0 mr-2.5 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Tenants and bed assignment</span>
              </li>
              <li className="flex items-start text-sm text-[#242624]">
                <div className="w-4 h-4 rounded-full bg-[#EAF4F3] text-[#0F766E] flex items-center justify-center shrink-0 mr-2.5 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Monthly rent and pending list</span>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
