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
        <div className="lg:col-span-5 bg-gradient-to-br from-[#E8F7F5] via-[#F0FAF8] to-[#E3F0FF] p-8 sm:p-12 flex items-center justify-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#E1EAF4]">
          {/* Subtle background circles */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/40 blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-[#0F8B83]/10 blur-xl pointer-events-none" />

          {/* Central Architecture Visual */}
          <div className="relative w-full max-w-xs flex flex-col items-center">
            {/* Main Modern Building Graphic */}
            <div className="relative z-10 w-48 sm:w-56 bg-white rounded-2xl p-4 shadow-lg border border-[#E1EAF4]/80 flex flex-col items-center">
              {/* Roof Header */}
              <div className="w-full h-8 bg-gradient-to-r from-[#0F8B83] to-[#08756E] rounded-xl flex items-center justify-between px-3 text-white mb-3">
                <span className="text-[10px] font-bold tracking-wider uppercase">PG Mitra</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                </span>
              </div>

              {/* Windows Grid */}
              <div className="w-full grid grid-cols-3 gap-2 mb-3">
                <div className="h-9 rounded-lg bg-[#F5F8FC] border border-[#E1EAF4] flex items-center justify-center">
                  <div className="w-2.5 h-4 bg-[#0F8B83]/20 rounded-xs" />
                </div>
                <div className="h-9 rounded-lg bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center">
                  <div className="w-2.5 h-4 bg-[#0F8B83] rounded-xs" />
                </div>
                <div className="h-9 rounded-lg bg-[#F5F8FC] border border-[#E1EAF4] flex items-center justify-center">
                  <div className="w-2.5 h-4 bg-[#0F8B83]/20 rounded-xs" />
                </div>
                <div className="h-9 rounded-lg bg-[#F5F8FC] border border-[#E1EAF4] flex items-center justify-center">
                  <div className="w-2.5 h-4 bg-[#0F8B83]/20 rounded-xs" />
                </div>
                <div className="h-9 rounded-lg bg-[#F5F8FC] border border-[#E1EAF4] flex items-center justify-center">
                  <div className="w-2.5 h-4 bg-[#0F8B83]/20 rounded-xs" />
                </div>
                <div className="h-9 rounded-lg bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center">
                  <div className="w-2.5 h-4 bg-[#0F8B83] rounded-xs" />
                </div>
              </div>

              {/* Ground Entrance */}
              <div className="w-full flex items-end justify-center pt-1 border-t border-[#E1EAF4]">
                <div className="w-8 h-8 rounded-t-lg bg-[#102A56] flex items-center justify-center text-white">
                  <Building className="w-4 h-4 opacity-80" />
                </div>
              </div>
            </div>

            {/* Floating Tag 1: Rooms */}
            <div className="absolute -top-3 -left-3 sm:-left-6 z-20 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#E1EAF4] shadow-md flex items-center gap-1.5 text-xs font-semibold text-[#102A56] animate-bounce [animation-duration:3s]">
              <div className="p-1 rounded-md bg-sky-50 text-sky-600">
                <BedDouble className="w-3.5 h-3.5" />
              </div>
              <span>Rooms</span>
            </div>

            {/* Floating Tag 2: Students */}
            <div className="absolute top-1/2 -right-4 sm:-right-8 z-20 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#E1EAF4] shadow-md flex items-center gap-1.5 text-xs font-semibold text-[#102A56] animate-pulse">
              <div className="p-1 rounded-md bg-purple-50 text-purple-600">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span>Students</span>
            </div>

            {/* Floating Tag 3: Payments */}
            <div className="absolute -bottom-2 -left-2 sm:-left-4 z-20 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#E1EAF4] shadow-md flex items-center gap-1.5 text-xs font-semibold text-[#102A56]">
              <div className="p-1 rounded-md bg-amber-50 text-amber-600">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <span>Payments</span>
            </div>
          </div>
        </div>

        {/* Right Side: Onboarding Content */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          {/* Small teal decorative line */}
          <div className="w-12 h-1.5 rounded-full bg-[#0F8B83] mb-4" />

          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F8B83] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Getting Started</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#102A56] tracking-tight mb-3">
            Your property journey starts here
          </h2>

          <p className="text-sm sm:text-base text-[#7186A5] leading-relaxed mb-8 max-w-xl font-normal">
            Add your first PG to manage rooms, students and rent in one place. Streamline tenant registrations, track monthly collections, and resolve maintenance requests instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/owner/pgs/add"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-sm font-semibold shadow-sm shadow-[#0F8B83]/25 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Add Your First PG</span>
            </Link>

            <button
              type="button"
              onClick={onOpenSetupGuide}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F8B83] hover:text-[#08756E] transition-colors py-2 px-1 hover:underline"
            >
              <span>Explore setup guide</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
