import { LucideIcon, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  label: string;
  value: string | number;
  supportingText: string;
  icon: LucideIcon;
  accentColor: "teal" | "blue" | "purple" | "amber";
  href?: string;
}

const colorMap = {
  teal: {
    bg: "bg-[#E8F7F5]",
    text: "text-[#0F8B83]",
    border: "border-[#0F8B83]/20",
    hoverBorder: "hover:border-[#0F8B83]/40",
  },
  blue: {
    bg: "bg-sky-50",
    text: "text-sky-600",
    border: "border-sky-100",
    hoverBorder: "hover:border-sky-300",
  },
  purple: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-100",
    hoverBorder: "hover:border-indigo-300",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
    hoverBorder: "hover:border-amber-300",
  },
};

export default function StatCard({
  label,
  value,
  supportingText,
  icon: Icon,
  accentColor,
  href,
}: StatCardProps) {
  const styling = colorMap[accentColor];

  const content = (
    <div
      className={`relative bg-white p-3 min-[360px]:p-3.5 sm:p-5 rounded-2xl border border-[#E1EAF4] shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group flex flex-col justify-between h-full min-h-[105px] sm:min-h-[125px] ${styling.hoverBorder}`}
    >
      <div className="flex items-center justify-between gap-1.5 mb-2 sm:mb-3">
        <div
          className={`w-8 h-8 min-[360px]:w-9 min-[360px]:h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center ${styling.bg} ${styling.text} border ${styling.border} transition-transform duration-200 group-hover:scale-105 shrink-0`}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
        </div>
        {href && (
          <div className="p-1 rounded-lg text-[#7186A5] group-hover:text-[#0F8B83] transition-colors">
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] sm:text-xs font-semibold text-[#7186A5] tracking-tight mb-0.5 truncate">
          {label}
        </p>
        <h3 className="text-xl min-[360px]:text-2xl sm:text-3xl font-black text-[#102A56] tracking-tight leading-none">
          {value}
        </h3>
        <p className="text-[10px] sm:text-xs text-[#7186A5] mt-1 font-medium truncate">
          {supportingText}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link 
        href={href} 
        aria-label={`${label}: ${value}`}
        className="block h-full min-h-[44px] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0F8B83] rounded-2xl"
      >
        {content}
      </Link>
    );
  }

  return content;
}
