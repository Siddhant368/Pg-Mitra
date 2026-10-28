import Link from "next/link";
import { Plus, ArrowRight, Building, BedDouble, Users, CreditCard, Sparkles } from "lucide-react";

interface PropertyOnboardingCardProps {
  onOpenSetupGuide?: () => void;
}

export default function PropertyOnboardingCard({ onOpenSetupGuide }: PropertyOnboardingCardProps) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E1EAF4] shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Side: Modern SVG & CSS Illustration */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#E8F7F5] via-[#F0FAF8] to-[#E3F0FF] p-6 sm:p-10 flex items-center justify-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#E1EAF4]">
          {/* Subtle background circles */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/40 blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-[#0F8B83]/10 blur-xl pointer-events-none" />

          {/* Central Architecture Visual */}
          <div className="relative w-full max-w-xs flex flex-col items-center">
            {/* Main Modern Building Graphic */}
            <div className="relative z-10 w-44 sm:w-56 bg-white rounded-2xl p-3.5 sm:p-4 shadow-lg border border-[#E1EAF4]/80 flex flex-col items-center">
              {/* Roof Header */}
              <div className="w-full h-7 sm:h-8 bg-gradient-to-r from-[#0F8B83] to-[#08756E] rounded-xl flex items-center justify-between px-3 text-white mb-2.5 sm:mb-3">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase">PG Mitra</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                </span>
              </div>

              {/* Windows Grid */}
              <div className="w-full grid grid-cols-3 gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
                <div className="h-8 sm:h-9 rounded-lg bg-[#F5F8FC] border border-[#E1EAF4] flex items-center justify-center">
                  <div className="w-2 sm:w-2.5 h-3 sm:h-4 bg-[#0F8B83]/20 rounded-xs" />
                </div>
                <div className="h-8 sm:h-9 rounded-lg bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center">
                  <div className="w-2 sm:w-2.5 h-3 sm:h-4 bg-[#0F8B83] rounded-xs" />
                </div>
                <div className="h-8 sm:h-9 rounded-lg bg-[#F5F8FC] border border-[#E1EAF4] flex items-center justify-center">
                  <div className="w-2 sm:w-2.5 h-3 sm:h-4 bg-[#0F8B83]/20 rounded-xs" />
                </div>
                <div className="h-8 sm:h-9 rounded-lg bg-[#F5F8FC] border border-[#E1EAF4] flex items-center justify-center">
                  <div className="w-2 sm:w-2.5 h-3 sm:h-4 bg-[#0F8B83]/20 rounded-xs" />
                </div>
                <div className="h-8 sm:h-9 rounded-lg bg-[#F5F8FC] border border-[#E1EAF4] flex items-center justify-center">
                  <div className="w-2 sm:w-2.5 h-3 sm:h-4 bg-[#0F8B83]/20 rounded-xs" />
                </div>
                <div className="h-8 sm:h-9 rounded-lg bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center">
                  <div className="w-2 sm:w-2.5 h-3 sm:h-4 bg-[#0F8B83] rounded-xs" />
                </div>
              </div>

              {/* Ground Entrance */}
              <div className="w-full flex items-end justify-center pt-1 border-t border-[#E1EAF4]">
                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-t-lg bg-[#102A56] flex items-center justify-center text-white">
                  <Building className="w-3.5 sm:w-4 h-3.5 sm:h-4 opacity-80" />
                </div>
              </div>
            </div>

            {/* Floating Tag 1: Rooms */}
            <div className="absolute -top-2.5 -left-2 sm:-left-6 z-20 bg-white/95 backdrop-blur-xs px-2.5 sm:px-3 py-1 rounded-xl border border-[#E1EAF4] shadow-md flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#102A56]">
              <div className="p-1 rounded-md bg-sky-50 text-sky-600">
                <BedDouble className="w-3 h-3" />
              </div>
              <span>Rooms</span>
            </div>

            {/* Floating Tag 2: Students */}
            <div className="absolute top-1/2 -right-2 sm:-right-8 z-20 bg-white/95 backdrop-blur-xs px-2.5 sm:px-3 py-1 rounded-xl border border-[#E1EAF4] shadow-md flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#102A56]">
              <div className="p-1 rounded-md bg-purple-50 text-purple-600">
                <Users className="w-3 h-3" />
              </div>
              <span>Students</span>
            </div>

            {/* Floating Tag 3: Payments */}
            <div className="absolute -bottom-2 -left-2 sm:-left-4 z-20 bg-white/95 backdrop-blur-xs px-2.5 sm:px-3 py-1 rounded-xl border border-[#E1EAF4] shadow-md flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#102A56]">
              <div className="p-1 rounded-md bg-amber-50 text-amber-600">
                <CreditCard className="w-3 h-3" />
              </div>
              <span>Payments</span>
            </div>
          </div>
        </div>

        {/* Right Side: Onboarding Content */}
        <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="w-10 sm:w-12 h-1.5 rounded-full bg-[#0F8B83] mb-3" />

          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F8B83] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Getting Started</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#102A56] tracking-tight mb-2">
            Your property journey starts here
          </h2>

          <p className="text-xs sm:text-sm text-[#7186A5] leading-relaxed mb-5 max-w-lg">
            Add your first PG, hostel, or co-living space. Set up rooms, assign bed capacities, and start collecting student rent effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <Link
              href="/owner/pgs/add"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0F8B83]/25 transition-all duration-200 min-h-[44px]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Your First PG</span>
            </Link>

            {onOpenSetupGuide && (
              <button
                type="button"
                onClick={onOpenSetupGuide}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#F5F8FC] hover:bg-[#E8F7F5] text-[#102A56] hover:text-[#0F8B83] text-xs sm:text-sm font-semibold border border-[#E1EAF4] transition-all min-h-[44px]"
              >
                <span>View Quick Setup Guide</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7186A5]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
