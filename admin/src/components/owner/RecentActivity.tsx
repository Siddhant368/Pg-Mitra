import Link from "next/link";
import { 
  Activity, 
  Clock, 
  Building2, 
  BedDouble, 
  UsersRound, 
  CreditCard, 
  ArrowRight, 
  PlusCircle,
  type LucideIcon 
} from "lucide-react";

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time?: string;
  type?: "pg" | "room" | "student" | "payment" | "complaint";
}

interface RecentActivityProps {
  activities?: ActivityItem[];
  viewAllHref?: string;
}

const typeConfig: Record<string, { icon: LucideIcon; bg: string; text: string; border: string }> = {
  pg: {
    icon: Building2,
    bg: "bg-[#E8F7F5]",
    text: "text-[#0F8B83]",
    border: "border-[#0F8B83]/20",
  },
  room: {
    icon: BedDouble,
    bg: "bg-sky-50",
    text: "text-sky-600",
    border: "border-sky-200/60",
  },
  student: {
    icon: UsersRound,
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200/60",
  },
  payment: {
    icon: CreditCard,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200/60",
  },
};

export default function RecentActivity({ 
  activities = [],
  viewAllHref = "/owner/pgs"
}: RecentActivityProps) {
  const hasActivities = activities.length > 0;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E1EAF4] shadow-xs p-4 sm:p-6 flex flex-col justify-between h-full">
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E1EAF4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center text-[#0F8B83] shrink-0">
              <Activity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#102A56] leading-tight">
                Recent Activity
              </h3>
              <p className="text-[11px] text-[#7186A5]">Latest property updates</p>
            </div>
          </div>

          {hasActivities && viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-xs font-bold text-[#0F8B83] hover:text-[#08756E] inline-flex items-center gap-1 hover:underline min-h-[44px] px-2 -mr-2"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* List of activities or clean empty state */}
        {!hasActivities ? (
          <div className="py-6 sm:py-9 px-3 flex flex-col items-center justify-center text-center">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#F5F8FC] border border-[#E1EAF4] flex items-center justify-center text-[#7186A5] mb-2.5 shadow-2xs">
              <Clock className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#102A56] mb-1">
              No recent activity yet
            </h4>
            <p className="text-[11px] sm:text-xs text-[#7186A5] max-w-xs leading-relaxed mb-4">
              Updates for PG registrations, room configurations, and tenant assignments will appear here.
            </p>
            <Link
              href="/owner/pgs/add"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#F5CA38] via-[#FFDF68] via-[#FFD700] via-[#F2BA1D] to-[#E2A612] text-[#052E26] hover:brightness-105 text-xs font-extrabold shadow-xs min-h-[40px] transition-all active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Your First PG</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-2.5">
            {activities.map((act) => {
              const conf = (act.type && typeConfig[act.type]) || {
                icon: Activity,
                bg: "bg-[#F5F8FC]",
                text: "text-[#7186A5]",
                border: "border-[#E1EAF4]",
              };
              const Icon = conf.icon;

              return (
                <div
                  key={act.id}
                  className="p-2.5 sm:p-3 rounded-xl border border-[#E1EAF4] bg-[#F5F8FC]/60 hover:bg-[#F5F8FC] transition-colors flex items-start gap-2.5"
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${conf.bg} ${conf.text} ${conf.border}`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-[#102A56] truncate">{act.title}</p>
                      {act.time && (
                        <span className="text-[10px] text-[#7186A5] shrink-0 font-medium flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5 opacity-70" />
                          {act.time}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#7186A5] mt-0.5 line-clamp-1 leading-tight">
                      {act.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-3 mt-3 border-t border-[#E1EAF4] text-center">
        <span className="text-[10px] sm:text-[11px] text-[#7186A5] font-medium">
          Real-time activity tracking powered by PGMitra
        </span>
      </div>
    </div>
  );
}
