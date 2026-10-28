import type { Metadata } from 'next';
import Link from 'next/link';
import { Home } from 'lucide-react';
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
      {/* White navbar with bottom border */}
      <header className="w-full bg-white border-b border-[#E7E4DD] sticky top-0 z-30">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40 rounded-lg p-1"
          >
            <div className="p-2 rounded-lg bg-[#EAF4F3]">
              <Home className="w-6 h-6 text-[#0F766E]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#052E26]">
              PG<span className="text-[#0F766E]">Mitra</span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-[#526078] hover:text-[#0F766E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/40 rounded-lg px-3 py-2"
          >
            Back to home
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
