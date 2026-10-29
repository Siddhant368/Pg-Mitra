import Link from "next/link";
import { Plus, Sun } from "lucide-react";

interface WelcomeSectionProps {
  userName?: string;
}

export default function WelcomeSection({ userName }: WelcomeSectionProps) {
  // Determine greeting based on local time
  const hour = new Date().getHours();
  let greeting = "Good afternoon";
  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour >= 17) {
    greeting = "Good evening";
  }

  const displayName = userName || "Owner";

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#EBF3FC] via-[#F0F6FD] to-[#E2EFFF] border border-[#CDE0F7] rounded-3xl p-5 sm:p-6 lg:p-7 shadow-xs w-full">
      {/* Right-side Hostel Landscape Illustration */}
      <div className="absolute right-0 top-0 bottom-0 w-2/5 max-w-sm pointer-events-none overflow-hidden select-none">
        <img
          src="/images/Blue Morning Hostel Landscape.png"
          alt="PG Morning Landscape"
          className="w-full h-full object-cover object-bottom opacity-90"
        />
        {/* Smooth gradient blend into card background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#EBF3FC] via-[#EBF3FC]/40 to-transparent" />
      </div>

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="min-w-0 pr-4">
          <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-xs tracking-wider uppercase mb-1">
            <Sun className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
            <span>{greeting.toUpperCase()}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-[#0B1E3D] tracking-tight truncate">
            {greeting}, {displayName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#526484] mt-1 font-medium max-w-lg">
            Here&apos;s what&apos;s happening with your properties today.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3 mt-3 self-center">
          <Link
            href="/owner/pgs/add"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add PG</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
