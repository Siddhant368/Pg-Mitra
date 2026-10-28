import Link from "next/link";
import { Plus } from "lucide-react";

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
    <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center justify-between gap-3 pb-1 w-full">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#102A56] tracking-tight truncate">
          {greeting}, {displayName} 👋
        </h1>
        <p className="text-xs sm:text-sm text-[#7186A5] mt-0.5 font-medium">
          Here’s what’s happening with your properties today.
        </p>
      </div>

      <div className="shrink-0 self-start min-[480px]:self-auto">
        <Link
          href="/owner/pgs/add"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs sm:text-sm font-semibold shadow-xs shadow-[#0F8B83]/20 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New PG</span>
        </Link>
      </div>
    </div>
  );
}
