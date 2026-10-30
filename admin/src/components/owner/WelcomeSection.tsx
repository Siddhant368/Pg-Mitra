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
    <div className="relative overflow-hidden bg-gradient-to-br from-[#E8F7F5] via-white to-[#F0FAF7] border border-[#CCEAE3] rounded-3xl p-5 sm:p-6 lg:p-7 shadow-xs w-full">
      {/* Subtle ambient mint decoration */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#34D399]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[#0F8B83]/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="min-w-0 pr-4">
          <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-xs tracking-wider uppercase mb-1">
            <Sun className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
            <span>{greeting.toUpperCase()}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-[#052E26] tracking-tight truncate">
            {greeting}, {displayName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#08756E]/80 mt-1 font-medium max-w-lg">
            Here&apos;s what&apos;s happening with your properties today.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3 mt-3 self-center">
          <Link
            href="/owner/pgs/add"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0F8B83] to-[#08756E] hover:from-[#0B5A4B] hover:to-[#052E26] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0F8B83]/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add PG</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
