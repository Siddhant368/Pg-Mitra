import Link from "next/link";
import { 
  Building2, 
  BedDouble, 
  UserPlus, 
  CreditCard, 
  ArrowRight,
  Zap
} from "lucide-react";

interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: typeof Building2;
  color: {
    bg: string;
    text: string;
    border: string;
  };
}

const actions: QuickActionItem[] = [
  {
    id: "add-pg",
    title: "Add PG",
    description: "Register a new PG property",
    href: "/owner/pgs/add",
    icon: Building2,
    color: {
      bg: "bg-[#E8F7F5]",
      text: "text-[#0F8B83]",
      border: "border-[#0F8B83]/20",
    },
  },
  {
    id: "add-room",
    title: "Add Room",
    description: "Configure rooms & bed setup",
    href: "/owner/rooms",
    icon: BedDouble,
    color: {
      bg: "bg-teal-50",
      text: "text-teal-700",
      border: "border-teal-200",
    },
  },
  {
    id: "invite-student",
    title: "Tenants",
    description: "Manage tenant directory",
    href: "/owner/students",
    icon: UserPlus,
    color: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
  },
  {
    id: "record-payment",
    title: "Payments",
    description: "Track rent & dues",
    href: "/owner/payments",
    icon: CreditCard,
    color: {
      bg: "bg-[#ECFDF5]",
      text: "text-[#059669]",
      border: "border-[#A7F3D0]",
    },
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E1EAF4] shadow-xs p-3 sm:p-5 flex flex-col justify-between">
      <div>
        {/* Compact Section Header */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#F0F4FA]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center text-[#0F8B83]">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-[#102A56]">Quick Actions</h3>
            </div>
          </div>
          <span className="text-[10px] text-[#7186A5] font-medium hidden sm:inline">Shortcuts</span>
        </div>

        {/* MOBILE (< md): Ultra-Compact 4-Column App-Style Grid (Saves 60% Vertical Space) */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 md:hidden">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <Link
                key={act.id}
                href={act.href}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-xl hover:bg-[#F5F8FC] transition-all active:scale-95 group text-center min-h-[72px]"
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${act.color.bg} ${act.color.text} ${act.color.border} group-hover:scale-105 transition-transform shadow-2xs`}
                >
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[11px] font-bold text-[#102A56] mt-1.5 leading-tight truncate w-full group-hover:text-[#0F8B83] transition-colors">
                  {act.title}
                </span>
              </Link>
            );
          })}
        </div>

        {/* DESKTOP (md+): 2x2 Grid with Titles & Descriptions */}
        <div className="hidden md:grid grid-cols-2 gap-3">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <Link
                key={act.id}
                href={act.href}
                className="p-3 rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] hover:bg-white hover:border-[#0F8B83]/40 hover:shadow-xs transition-all duration-200 group flex items-center justify-between gap-3 min-h-[48px]"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${act.color.bg} ${act.color.text} ${act.color.border} group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#102A56] group-hover:text-[#0F8B83] transition-colors leading-tight truncate">
                      {act.title}
                    </p>
                    <p className="text-[10px] text-[#7186A5] truncate mt-0.5">
                      {act.description}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-[#7186A5] opacity-60 group-hover:opacity-100 group-hover:text-[#0F8B83] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
