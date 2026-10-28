"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  UsersRound,
  BarChart3,
  User,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/owner/dashboard", icon: LayoutDashboard },
  { name: "PGs", href: "/owner/pgs", icon: Building2 },
  { name: "Tenants", href: "/owner/students", icon: UsersRound },
  { name: "Reports", href: "/owner/payments", icon: BarChart3 },
  { name: "Profile", href: "/owner/settings", icon: User },
];

export default function MobileBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-[#052E26] via-[#08756E] to-[#0B5A4B] text-white rounded-t-3xl border-t border-white/15 shadow-[0_-8px_30px_rgba(5,46,38,0.28)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1 sm:px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/owner/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-label={item.name}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 min-w-[48px] min-h-[48px] transition-all relative focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white rounded-2xl ${
                isActive ? "text-white" : "text-white/75 hover:text-white"
              }`}
            >
              {isActive && (
                <span className="absolute top-1 w-7 h-1 rounded-full bg-white shadow-xs" />
              )}
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-white/20 text-white scale-105 border border-white/25 shadow-xs"
                    : "bg-transparent text-white/80 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform text-white ${
                    isActive ? "stroke-[2.5]" : "stroke-[1.75]"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight transition-all leading-none ${
                  isActive ? "font-bold text-white" : "font-medium text-white/80"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
