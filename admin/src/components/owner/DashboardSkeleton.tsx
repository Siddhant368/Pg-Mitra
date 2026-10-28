export default function DashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-pulse">
      {/* Welcome Bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="space-y-2">
          <div className="h-8 bg-[#E1EAF4] rounded-xl w-64 sm:w-80" />
          <div className="h-4 bg-[#E1EAF4]/70 rounded-lg w-48 sm:w-60" />
        </div>
        <div className="h-10 bg-[#E1EAF4] rounded-xl w-36" />
      </div>

      {/* 4 Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-[#E1EAF4] shadow-xs space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 bg-[#E1EAF4] rounded-xl" />
              <div className="w-4 h-4 bg-[#E1EAF4] rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-[#E1EAF4]/80 rounded-md w-24" />
              <div className="h-8 bg-[#E1EAF4] rounded-lg w-16" />
              <div className="h-3 bg-[#E1EAF4]/60 rounded-md w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Large Card Skeleton */}
      <div className="bg-white rounded-3xl border border-[#E1EAF4] p-8 sm:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 h-64 bg-[#E1EAF4]/60 rounded-2xl" />
          <div className="lg:col-span-7 space-y-4">
            <div className="w-12 h-1.5 bg-[#E1EAF4] rounded-full" />
            <div className="h-8 bg-[#E1EAF4] rounded-xl w-3/4" />
            <div className="h-4 bg-[#E1EAF4]/80 rounded-lg w-full" />
            <div className="h-4 bg-[#E1EAF4]/80 rounded-lg w-2/3" />
            <div className="pt-4 flex gap-4">
              <div className="h-12 bg-[#E1EAF4] rounded-xl w-44" />
              <div className="h-12 bg-[#E1EAF4]/60 rounded-xl w-36" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 2 Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E1EAF4] h-72 shadow-xs" />
        <div className="bg-white p-6 rounded-3xl border border-[#E1EAF4] h-72 shadow-xs" />
      </div>
    </div>
  );
}
