"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  Users,
  BarChart3,
  User,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  matchPrefix?: string[];
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/owner/dashboard",
    icon: Home,
  },
  {
    name: "PGs",
    href: "/owner/pgs",
    icon: Building2,
    matchPrefix: ["/owner/pgs"],
  },
  {
    name: "Tenants",
    href: "/owner/students",
    icon: Users,
    matchPrefix: ["/owner/students"],
  },
  {
    name: "Reports",
    href: "/owner/payments",
    icon: BarChart3,
    matchPrefix: ["/owner/payments"],
  },
  {
    name: "Profile",
    href: "/owner/settings",
    icon: User,
    matchPrefix: ["/owner/settings", "/owner/rooms", "/owner/complaints"],
  },
];

export default function MobileBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-x-2 border-[#D8E4F0] rounded-t-3xl overflow-hidden shadow-[0_-6px_22px_rgba(16,42,86,0.08)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      {/* 2D Bottom Sheet Top Indicator Notch */}
      <div className="flex justify-center pt-2 pb-0.5 pointer-events-none">
        <div className="w-9 h-1 rounded-full bg-[#E1EAF4]" />
      </div>

      <div className="flex items-center justify-around h-15 max-w-lg mx-auto px-1 sm:px-2 pb-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/owner/dashboard"
              ? pathname === "/owner/dashboard"
              : (item.matchPrefix?.some((prefix) => pathname.startsWith(prefix)) ?? pathname === item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-label={item.name}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 min-w-[48px] min-h-[48px] transition-all relative focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0F8B83] rounded-xl active:scale-95 group ${
                isActive ? "text-[#0F8B83]" : "text-[#7186A5] hover:text-[#102A56]"
              }`}
            >
              {/* Icon Container with 2D soft mint badge on active */}
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#E8F7F5] border border-[#0F8B83]/30 text-[#0F8B83] shadow-xs scale-105"
                    : "bg-transparent text-[#7186A5] group-hover:text-[#102A56] group-hover:bg-[#F5F8FC]"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? "stroke-[2.2] text-[#0F8B83]" : "stroke-[1.8] text-[#7186A5]"
                  }`}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[10px] mt-0.5 tracking-tight transition-all leading-none ${
                  isActive ? "font-bold text-[#0F8B83]" : "font-medium text-[#7186A5]"
                }`}
              >
                {item.name}
              </span>

              {/* 2D Pill Indicator */}
              {isActive ? (
                <span className="w-4 h-0.5 rounded-full bg-[#0F8B83] mt-1 shadow-xs" />
              ) : (
                <span className="w-4 h-0.5 mt-1 bg-transparent" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
