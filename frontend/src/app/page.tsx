import type { Metadata } from 'next';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import StatsSection from '../components/landing/StatsSection';
import Pricing from '../components/landing/Pricing';
import Faq from '../components/landing/Faq';
import FinalCta from '../components/landing/FinalCta';

export const metadata: Metadata = {
  title: 'PGMitra - Premium PG & Co-Living Management Software',
  description: 'Automate rent collection, manage residents, track maintenance, and streamline daily operations — all in one powerful platform. Built for PGs, hostels and co-living spaces.',
  openGraph: {
    title: 'PGMitra - Premium PG & Co-Living Management Software',
    description: 'Automate rent collection, manage residents, track maintenance, and streamline daily operations — all in one powerful platform.',
    type: 'website',
    siteName: 'PGMitra',
  },
};

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col bg-brand-bg text-brand-navy selection:bg-brand-teal/30">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Hero />
        <StatsSection />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
    </div>
  );
}
