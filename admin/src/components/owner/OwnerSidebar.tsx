"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Building2, 
  BedDouble, 
  UsersRound, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  LogOut,
  Home,
  X
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  role?: string;
}

interface OwnerSidebarProps {
  user: UserProfile;
  logout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const navItems = [
  { name: "Overview", href: "/owner/dashboard", icon: LayoutDashboard },
  { name: "PGs / Hostels", href: "/owner/pgs", icon: Building2 },
  { name: "Rooms", href: "/owner/rooms", icon: BedDouble },
  { name: "Students", href: "/owner/students", icon: UsersRound },
  { name: "Payments", href: "/owner/payments", icon: CreditCard },
  { name: "Complaints", href: "/owner/complaints", icon: MessageSquare },
  { name: "Settings", href: "/owner/settings", icon: Settings },
];

export default function OwnerSidebar({ user, logout, isMobileOpen, onCloseMobile }: OwnerSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#E1EAF4] w-full">
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-[#E1EAF4]">
        <Link href="/owner/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F8B83] to-[#08756E] flex items-center justify-center text-white shadow-sm shadow-[#0F8B83]/20 group-hover:scale-105 transition-transform">
            <Home className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="text-xl font-bold tracking-tight">
              <span className="text-[#102A56]">PGMitra</span>
              <span className="text-[#0F8B83] font-semibold">Owner</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-[#7186A5] font-medium">Property Suite</span>
          </div>
        </Link>
        {onCloseMobile && (
          <button 
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3.5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#7186A5]">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-[#0F8B83] text-white shadow-sm shadow-[#0F8B83]/25 font-semibold"
                  : "text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC]"
              }`}
            >
              <Icon 
                className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-white" : "text-[#7186A5] group-hover:text-[#0F8B83]"
                }`} 
              />
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>

      {/* User Card & Logout at Bottom */}
      <div className="p-4 border-t border-[#E1EAF4] bg-[#FAFCFE]/60">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-[#E1EAF4] shadow-xs mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center text-[#0F8B83] font-bold text-base shrink-0">
            {user.name?.charAt(0)?.toUpperCase() || "O"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#102A56] truncate leading-tight">
              {user.name || "Owner User"}
            </p>
            <p className="text-xs text-[#0F8B83] font-medium leading-tight mt-0.5">
              Owner
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 text-xs font-semibold text-rose-600 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors focus:outline-hidden"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar (approx 276px) */}
      <aside className="w-[276px] hidden md:flex flex-col shrink-0 h-screen sticky top-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#102A56]/40 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-[276px] bg-white z-50 flex flex-col md:hidden transform transition-transform duration-300 ease-out shadow-2xl ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
