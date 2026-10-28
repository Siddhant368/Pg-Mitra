import Link from "next/link";
import { Activity, Clock, Bell, ArrowRight } from "lucide-react";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type?: "student" | "payment" | "pg" | "complaint";
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

export default function RecentActivity({ activities = [] }: RecentActivityProps) {
  const hasActivities = activities.length > 0;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E1EAF4] shadow-xs p-6 flex flex-col justify-between h-full">
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E1EAF4]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center text-[#0F8B83]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#102A56]">Recent Activity</h3>
              <p className="text-[11px] text-[#7186A5]">Latest operational updates</p>
            </div>
          </div>

          <Link
            href="/owner/complaints"
            className="text-xs font-semibold text-[#0F8B83] hover:text-[#08756E] inline-flex items-center gap-1 hover:underline"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* List of activities or clean empty state */}
        {!hasActivities ? (
          <div className="py-10 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F8FC] border border-[#E1EAF4] flex items-center justify-center text-[#7186A5] mb-3">
              <Clock className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h4 className="text-sm font-bold text-[#102A56] mb-1">
              Your latest updates will appear here
            </h4>
            <p className="text-xs text-[#7186A5] max-w-xs leading-relaxed">
              Activity like new students, payments and complaints will show up here once you start managing your PGs.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-xl border border-[#E1EAF4] bg-[#F5F8FC]/50 hover:bg-[#F5F8FC] transition-colors flex items-start gap-3"
              >
                <div className="w-7 h-7 rounded-lg bg-[#E8F7F5] text-[#0F8B83] flex items-center justify-center shrink-0 mt-0.5">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-[#102A56] truncate">{act.title}</p>
                    <span className="text-[10px] text-[#7186A5] shrink-0">{act.time}</span>
                  </div>
                  <p className="text-xs text-[#7186A5] mt-0.5 line-clamp-1">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 mt-2 border-t border-[#E1EAF4] text-center">
        <span className="text-[11px] text-[#7186A5]">
          Real-time activity tracking powered by PGMitra
        </span>
      </div>
    </div>
  );
}
