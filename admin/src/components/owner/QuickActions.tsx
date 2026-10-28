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
    title: "Add a PG",
    description: "Register a new PG / hostel",
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
    title: "Add a Room",
    description: "Create rooms for your PG",
    href: "/owner/rooms",
    icon: BedDouble,
    color: {
      bg: "bg-sky-50",
      text: "text-sky-600",
      border: "border-sky-100",
    },
  },
  {
    id: "invite-student",
    title: "Manage Tenants",
    description: "View student directory",
    href: "/owner/students",
    icon: UserPlus,
    color: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-100",
    },
  },
  {
    id: "record-payment",
    title: "Record Payment",
    description: "Update rent & ledger",
    href: "/owner/payments",
    icon: CreditCard,
    color: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-100",
    },
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E1EAF4] shadow-xs p-4 sm:p-6 flex flex-col justify-between h-full">
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#E1EAF4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center text-[#0F8B83]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#102A56]">Quick Actions</h3>
              <p className="text-[11px] text-[#7186A5]">Common management shortcuts</p>
            </div>
          </div>
        </div>

        {/* 4 Compact Action Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <Link
                key={act.id}
                href={act.href}
                className="p-3 sm:p-3.5 rounded-xl border border-[#E1EAF4] bg-[#F5F8FC]/50 hover:bg-white hover:border-[#0F8B83]/30 hover:shadow-xs transition-all duration-200 group flex items-center justify-between gap-3 min-h-[48px]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${act.color.bg} ${act.color.text} ${act.color.border} group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div className="min-w-0">
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

      <div className="pt-3.5 mt-3.5 border-t border-[#E1EAF4] text-center">
        <span className="text-[11px] text-[#7186A5]">
          Manage rooms and properties in one tap
        </span>
      </div>
    </div>
  );
}
