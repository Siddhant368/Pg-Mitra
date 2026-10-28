export default function DashboardSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-6">
      {/* 1. Mobile Top Branded Navbar Skeleton */}
      <div className="md:hidden sticky top-0 z-30 bg-gradient-to-r from-[#052E26] via-[#08756E] to-[#0B5A4B] px-4 py-2.5 rounded-b-2xl shadow-md border-b border-white/10 animate-pulse">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <div className="h-7 w-28 bg-white/20 rounded-xl" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20" />
            <div className="w-8 h-8 rounded-full bg-white/20" />
          </div>
        </div>
      </div>

      {/* 2. Gap + Mobile Greeting Card Skeleton (Green Gradient) */}
      <div className="md:hidden px-3.5 pt-3 pb-0.5 animate-pulse">
        <div className="bg-gradient-to-br from-[#052E26] via-[#08756E] to-[#0B5A4B] p-4.5 rounded-2xl shadow-md border border-[#0F8B83]/30 flex items-center justify-between gap-3">
          <div className="space-y-1.5 flex-1">
            <div className="h-3 w-20 bg-white/20 rounded" />
            <div className="h-6 w-44 bg-white/20 rounded-lg" />
            <div className="h-3 w-56 bg-white/20 rounded" />
          </div>
          <div className="h-10 w-24 bg-white/20 rounded-xl shrink-0" />
        </div>
      </div>

      <div className="p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Desktop Welcome Bar Skeleton */}
        <div className="hidden md:flex justify-between items-center gap-4 pb-1 animate-pulse">
          <div className="space-y-2">
            <div className="h-8 bg-[#E1EAF4] rounded-xl w-72" />
            <div className="h-4 bg-[#E1EAF4]/70 rounded-lg w-52" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 bg-[#E1EAF4] rounded-xl w-32" />
            <div className="h-10 bg-[#E1EAF4] rounded-xl w-32" />
          </div>
        </div>

        {/* Hero Card Skeleton */}
        <div className="h-36 sm:h-44 bg-[#E1EAF4] rounded-2xl sm:rounded-3xl animate-pulse" />

        {/* 4 Metric Cards Skeleton: 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-3 min-[360px]:p-3.5 sm:p-5 rounded-2xl border border-[#E1EAF4] shadow-xs space-y-2.5 h-28 sm:h-32"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#E1EAF4] rounded-xl" />
              <div className="space-y-1.5">
                <div className="h-3 bg-[#E1EAF4]/80 rounded w-16" />
                <div className="h-6 bg-[#E1EAF4] rounded w-12" />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Skeleton */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#E1EAF4] h-48 animate-pulse" />
      </div>
    </div>
  );
}
