'use client';
import { BRAND } from '../../lib/brand';

export default function Footer() {
  const currentYear = 2026;
  
  return (
    <footer className="w-full py-4 border-t border-white/10 mt-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-brand-light-mint/60">
            &copy; {currentYear} {BRAND}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
