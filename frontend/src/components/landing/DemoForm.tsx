
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import { fetchApi } from '../../lib/api';

export default function DemoForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'loading-wa' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pgName, setPgName] = useState('');
  const [city, setCity] = useState('');
  const [beds, setBeds] = useState('');
  const [time, setTime] = useState('Morning');
  const [website, setWebsite] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // PGMitra WhatsApp number (India country code + mobile number)
  const whatsAppNumber = '919982325021';

  const validate = () => {
    const newErrs: Record<string, string> = {};
    if (!name.trim()) newErrs.name = 'Name is required';
    if (!/^\d{10}$/.test(phone)) newErrs.phone = 'Phone must be exactly 10 digits';
    if (!pgName.trim()) newErrs.pgName = 'PG Name is required';
    if (!city.trim()) newErrs.city = 'City is required';

    const bedsNum = parseInt(beds, 10);
    if (!beds || isNaN(bedsNum) || bedsNum < 1 || bedsNum > 5000) {
      newErrs.beds = 'Beds must be between 1 and 5000';
    }

    return newErrs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website) return;

    const newErrs = validate();
    if (Object.keys(newErrs).length > 0) {
      setErrors(newErrs);
      return;
    }

    setErrors({});
    setStatus('loading');
    setErrorMsg('');

    try {
      await fetchApi('/demo-requests', {
        method: 'POST',
        body: JSON.stringify({
          name,
          phone,
          pgName,
          city,
          approxBeds: parseInt(beds, 10),
          preferredTime: time.toUpperCase(),
        }),
      });

      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  const handleWhatsAppSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (website) return;

    const newErrs = validate();
    if (Object.keys(newErrs).length > 0) {
      setErrors(newErrs);
      return;
    }

    setErrors({});
    setStatus('loading-wa');
    setErrorMsg('');

    // Open a tab immediately to avoid browser popup blocking.
    const whatsappWindow = window.open('about:blank', '_blank');

    if (!whatsappWindow) {
      setStatus('error');
      setErrorMsg('Please allow pop-ups in your browser and try again.');
      return;
    }

    try {
      // Save the demo request in the backend first.
      await fetchApi('/demo-requests', {
        method: 'POST',
        body: JSON.stringify({
          name,
          phone,
          pgName,
          city,
          approxBeds: parseInt(beds, 10),
          preferredTime: time.toUpperCase(),
        }),
      });

      const message = `New PGMitra Demo Request

Owner Name: ${name}
PG/Hostel Name: ${pgName}
Mobile Number: ${phone}
City: ${city}
Student Capacity: ${beds}
Preferred Time: ${time}

Please contact this owner regarding their PGMitra demo request.`;

      const waUrl = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`;

      // Navigate the already-opened tab to WhatsApp.
      whatsappWindow.location.href = waUrl;
      setStatus('success');
    } catch (err: unknown) {
      whatsappWindow.close();
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  const waUrl = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent('Hi, I booked a demo for PGMitra')}`;

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto min-h-[400px]">
        <div className="w-16 h-16 bg-forest-600 rounded-full flex items-center justify-center mb-6 shadow-md">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-ink mb-4">Thank you</h2>
        <p className="text-muted text-lg mb-10 leading-relaxed">
          We have your request. We will contact you at your chosen time on the number you gave us.
        </p>
        <div className="w-full space-y-4">
          {whatsAppNumber && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full min-h-[52px] rounded-xl bg-[#0B6B5F] text-white font-medium hover:bg-forest-900 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 focus-visible:ring-offset-2"
            >
              Chat on WhatsApp
            </a>
          )}
          <Link
            href="/"
            onClick={() => {
              setStatus('idle');
              setName('');
              setPhone('');
              setPgName('');
              setCity('');
              setBeds('');
              setTime('Morning');
            }}
            className="flex items-center justify-center w-full min-h-[52px] rounded-xl border border-line bg-white text-ink font-medium hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 focus-visible:ring-offset-2"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[600px]">
      <div className="hidden lg:flex flex-col w-[38%] bg-gradient-to-br from-forest-900 to-forest-700 p-12 text-white">
        <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-mint-400 tracking-widest mb-8 uppercase backdrop-blur-sm self-start">
          What happens next
        </div>
        <h2 className="text-3xl font-bold leading-tight mb-12">
          A short walkthrough, made for PG owners
        </h2>

        <div className="space-y-8 flex-1">
          <div className="flex items-start">
            <div className="w-8 h-8 shrink-0 rounded-full bg-mint-400/20 text-mint-400 font-bold flex items-center justify-center mr-4">1</div>
            <div>
              <h3 className="font-bold text-lg mb-1">We contact you</h3>
              <p className="text-mint-400/80 leading-relaxed">At the time you choose, on the number you give us.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 shrink-0 rounded-full bg-mint-400/20 text-mint-400 font-bold flex items-center justify-center mr-4">2</div>
            <div>
              <h3 className="font-bold text-lg mb-1">See how it works</h3>
              <p className="text-mint-400/80 leading-relaxed">Rooms, residents and monthly rent, shown on a real example.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 shrink-0 rounded-full bg-mint-400/20 text-mint-400 font-bold flex items-center justify-center mr-4">3</div>
            <div>
              <h3 className="font-bold text-lg mb-1">Decide if it fits</h3>
              <p className="text-mint-400/80 leading-relaxed">Ask anything about your PG. No pressure to sign up.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-10 lg:p-12">
        <h2 className="text-3xl font-bold text-ink mb-2">Book a demo</h2>
        <p className="text-muted mb-8">Tell us about your PG and we will show you how PGMitra works.</p>

        {status === 'error' && (
          <div role="alert" className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-semibold text-ink mb-2">Your name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`min-h-[44px] rounded-xl border ${errors.name ? 'border-red-500' : 'border-line'} bg-white px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent`}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && <p id="name-error" role="alert" className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="phone" className="text-sm font-semibold text-ink mb-2">Phone number (WhatsApp)</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`min-h-[44px] rounded-xl border ${errors.phone ? 'border-red-500' : 'border-line'} bg-white px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent`}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && <p id="phone-error" role="alert" className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="pgName" className="text-sm font-semibold text-ink mb-2">PG name</label>
              <input
                id="pgName"
                type="text"
                value={pgName}
                onChange={(e) => setPgName(e.target.value)}
                className={`min-h-[44px] rounded-xl border ${errors.pgName ? 'border-red-500' : 'border-line'} bg-white px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent`}
                aria-invalid={!!errors.pgName}
                aria-describedby={errors.pgName ? 'pgName-error' : undefined}
              />
              {errors.pgName && <p id="pgName-error" role="alert" className="text-red-500 text-xs mt-1 font-medium">{errors.pgName}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="city" className="text-sm font-semibold text-ink mb-2">City</label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`min-h-[44px] rounded-xl border ${errors.city ? 'border-red-500' : 'border-line'} bg-white px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent`}
                aria-invalid={!!errors.city}
                aria-describedby={errors.city ? 'city-error' : undefined}
              />
              {errors.city && <p id="city-error" role="alert" className="text-red-500 text-xs mt-1 font-medium">{errors.city}</p>}
            </div>

            <div className="flex flex-col md:col-span-2">
              <label htmlFor="beds" className="text-sm font-semibold text-ink mb-2">Approx. number of beds</label>
              <input
                id="beds"
                type="number"
                min="1"
                max="5000"
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className={`min-h-[44px] rounded-xl border ${errors.beds ? 'border-red-500' : 'border-line'} bg-white px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent`}
                aria-invalid={!!errors.beds}
                aria-describedby={errors.beds ? 'beds-error' : undefined}
              />
              {errors.beds && <p id="beds-error" role="alert" className="text-red-500 text-xs mt-1 font-medium">{errors.beds}</p>}
            </div>
          </div>

          <div className="flex flex-col pt-2">
            <span className="text-sm font-semibold text-ink mb-3">Best time to call</span>
            <div className="flex gap-3" role="radiogroup" aria-label="Best time to call">
              {['Morning', 'Afternoon', 'Evening'].map((t) => (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={time === t}
                  onClick={() => setTime(t)}
                  className={`min-h-[44px] flex-1 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 focus-visible:ring-offset-2 ${
                    time === t
                      ? 'bg-forest-600 text-white border-transparent'
                      : 'bg-white text-ink border border-line hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="hidden"
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            style={{ display: 'none' }}
          />

          <div className="pt-6 space-y-3">
            <button
              type="submit"
              disabled={status === 'loading' || status === 'loading-wa'}
              className="w-full flex items-center justify-center min-h-[52px] rounded-xl bg-gradient-to-r from-forest-700 to-forest-600 text-white font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 focus-visible:ring-offset-2 shadow-sm disabled:opacity-70 group"
            >
              {status === 'loading' ? (
                'Please wait...'
              ) : (
                <>
                  Book my demo
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleWhatsAppSubmit}
              disabled={status === 'loading' || status === 'loading-wa'}
              className="w-full flex items-center justify-center min-h-[52px] rounded-xl bg-[#25D366] text-white font-medium hover:bg-[#128C7E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 shadow-sm disabled:opacity-70 group"
            >
              {status === 'loading-wa' ? (
                'Please wait...'
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Send to WhatsApp
                </>
              )}
            </button>

            <p className="text-center text-xs text-muted mt-4">
              We will only use your details to contact you about the demo.<br />
              * Clicking &quot;Send to WhatsApp&quot; will open WhatsApp so you can send us your details directly.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
