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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-[#DCE7F5] shadow-[0_-4px_20px_rgba(11,30,61,0.06)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1 sm:px-2">
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
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 min-w-[48px] min-h-[48px] transition-all relative focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-xl active:scale-95 group ${
                isActive ? "text-[#2563EB]" : "text-[#7186A5] hover:text-[#0B1E3D]"
              }`}
            >
              {/* Icon Container with soft royal-blue tint on active */}
              <div
                className={`p-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#EBF3FC] text-[#2563EB] scale-105"
                    : "bg-transparent text-[#7186A5] group-hover:text-[#0B1E3D] group-hover:bg-[#F5F8FC]"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? "stroke-[2.2] text-[#2563EB]" : "stroke-[1.8] text-[#7186A5]"
                  }`}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[10px] mt-0.5 tracking-tight transition-all leading-none ${
                  isActive ? "font-bold text-[#2563EB]" : "font-medium text-[#7186A5]"
                }`}
              >
                {item.name}
              </span>

              {/* Small blue underline indicator for active item */}
              {isActive ? (
                <span className="w-5 h-0.5 rounded-full bg-[#2563EB] mt-0.5 shadow-xs" />
              ) : (
                <span className="w-5 h-0.5 mt-0.5 bg-transparent" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
