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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A56] tracking-tight">
          {greeting}, {displayName} 👋
        </h1>
        <p className="text-sm sm:text-base text-[#7186A5] mt-1 font-medium">
          Here’s what’s happening with your properties today.
        </p>
      </div>

      <div className="shrink-0">
        <Link
          href="/owner/pgs/add"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-sm font-semibold shadow-sm shadow-[#0F8B83]/25 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus:outline-hidden focus:ring-2 focus:ring-[#0F8B83] focus:ring-offset-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Add New PG</span>
        </Link>
      </div>
    </div>
  );
}
