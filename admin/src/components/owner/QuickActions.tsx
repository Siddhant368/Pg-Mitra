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
    title: "Invite Student",
    description: "Add a new student to your PG",
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
    description: "Update rent or fees",
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
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E1EAF4] shadow-xs p-6 flex flex-col justify-between h-full">
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E1EAF4]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center text-[#0F8B83]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#102A56]">Quick Actions</h3>
              <p className="text-[11px] text-[#7186A5]">Common management shortcuts</p>
            </div>
          </div>
        </div>

        {/* 4 Compact Action Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <Link
                key={act.id}
                href={act.href}
                className="p-3.5 rounded-xl border border-[#E1EAF4] bg-[#F5F8FC]/50 hover:bg-white hover:border-[#0F8B83]/30 hover:shadow-sm transition-all duration-200 group flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl ${act.color.bg} ${act.color.text} border ${act.color.border} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105`}
                  >
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#102A56] group-hover:text-[#0F8B83] transition-colors truncate">
                      {act.title}
                    </h4>
                    <p className="text-[11px] text-[#7186A5] truncate mt-0.5">
                      {act.description}
                    </p>
                  </div>
                </div>

                <div className="p-1 rounded-lg text-[#7186A5] group-hover:text-[#0F8B83] transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="pt-4 mt-2 border-t border-[#E1EAF4] text-center">
        <span className="text-[11px] text-[#7186A5]">
          Manage your hostels faster with instant shortcuts
        </span>
      </div>
    </div>
  );
}
