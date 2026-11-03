import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Logo from '../../components/Logo';
import { connection } from 'next/server';
import DemoScheduler, { type DayOption } from '../../components/landing/DemoScheduler';
import { BRAND } from '../../lib/brand';

export const instant = false;

export const metadata: Metadata = {
  title: 'Book a demo | PGMitra',
};

function getNext7DaysKolkata(): DayOption[] {
  const now = new Date();
  const isoFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
  });

  const dayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
  });

  const monthFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    month: 'short',
  });

  const weekdayLongFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
  });

  const monthLongFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    month: 'long',
  });

  const todayStr = isoFormatter.format(now); // "YYYY-MM-DD"
  const [year, month, date] = todayStr.split('-').map(Number);

  const days: DayOption[] = [];

  for (let i = 0; i < 7; i++) {
    const current = new Date(Date.UTC(year, month - 1, date + i, 12, 0, 0));
    const iso = isoFormatter.format(current);
    const weekday = weekdayFormatter.format(current);
    const day = dayFormatter.format(current);
    const monthLabel = monthFormatter.format(current);
    const full = `${weekday}, ${day} ${monthLabel}`;
    const weekdayLong = weekdayLongFormatter.format(current);
    const monthLong = monthLongFormatter.format(current);
    const accessibleLabel = `${weekdayLong}, ${day} ${monthLong}`;

    days.push({
      iso,
      weekday,
      day,
      monthLabel,
      full,
      accessibleLabel,
    });
  }

  return days;
}

export default async function BookDemoPage() {
  await connection();
  const days = getNext7DaysKolkata();

  return (
    <div className="min-h-screen bg-[#F5F4F1] text-[#242624] font-sans flex flex-col selection:bg-[#34D399]/30">
      {/* Navbar with subtle blur and clean border */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-[#E7E4DD] sticky top-0 z-30 transition-all">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40 rounded-xl p-0.5 group"
          >
            <Logo />
          </Link>

          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-xl border border-[#E2E8E5] bg-white hover:bg-[#F2F8F6] text-sm font-semibold text-[#4A5568] hover:text-[#0F766E] hover:border-[#0F766E]/30 shadow-xs hover:shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#F5F4F1] text-[#6B7280] group-hover:bg-[#EAF4F3] group-hover:text-[#0F766E] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
            </span>
            <span>Back to home</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1140px] mx-auto">
          {/* Centered Heading Block */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <h1 className="text-[32px] lg:text-[44px] font-[800] leading-[1.15] text-[#242624] tracking-tight">
              When should we <span className="text-[#0F766E]">call you?</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#526078] leading-relaxed">
              Choose a day and time that suits you. We will show you {BRAND} on a real example.
            </p>
          </div>

          <DemoScheduler days={days} />
        </div>
      </main>
    </div>
  );
}
