"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Bell, 
  X, 
  User, 
  Settings, 
  LogOut, 
  Building2, 
  BedDouble, 
  ChevronRight, 
  CheckCheck, 
  Clock,
  Plus
} from "lucide-react";
import { Logo } from "@/components/Logo";

interface MobileDashboardHeaderProps {
  userName: string;
  userEmail?: string;
  onLogout?: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "m1",
    title: "New student registration",
    description: "Rahul Sharma joined PG Tower 1",
    time: "10m ago",
    unread: true,
  },
  {
    id: "m2",
    title: "Payment received",
    description: "₹8,500 received from Room 204",
    time: "1h ago",
    unread: true,
  },
  {
    id: "m3",
    title: "Maintenance completed",
    description: "AC servicing marked completed",
    time: "1d ago",
    unread: false,
  },
];

export default function MobileDashboardHeader({
  userName,
  userEmail,
  onLogout,
}: MobileDashboardHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close modals on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Time-based greeting
  const hour = new Date().getHours();
  let greeting = "Good afternoon";
  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour >= 17) {
    greeting = "Good evening";
  }

  const displayName = userName?.trim() || "Owner";
  const userInitial = displayName.charAt(0).toUpperCase();
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="md:hidden">
      {/* 1. Mobile Top Branded Navbar (Distinct Top Bar with Soft Rounded Bottom Curve) */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-[#052E26] via-[#08756E] to-[#0B5A4B] text-white px-4 py-2.5 rounded-b-2xl shadow-md shadow-[#052E26]/15 border-b border-white/10">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* PG Mitra Logo and Brand Name */}
          <Link href="/owner/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center p-1 shadow-xs">
              <Logo className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-white leading-none">
                PG<span className="text-[#34D399]">Mitra</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-white/75 font-semibold mt-0.5">
                Admin Suite
              </span>
            </div>
          </Link>

          {/* Action Controls: Notification Bell & User Avatar */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
              }}
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-white transition-all min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-hidden focus:ring-2 focus:ring-[#34D399]"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4 text-white" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                </span>
              )}
            </button>

            {/* User Avatar with Profile Fallback */}
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              className="relative p-0.5 rounded-full border-2 border-white/30 hover:border-white transition-all active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-[#34D399] min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open user profile menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#34D399] to-white/90 text-[#052E26] font-extrabold text-xs flex items-center justify-center shadow-xs">
                {userInitial}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Notification Popover Modal */}
        {notificationsOpen && (
          <div
            ref={notifRef}
            className="absolute top-14 left-3 right-3 z-50 bg-white rounded-2xl shadow-2xl border border-[#E1EAF4] p-4 text-[#102A56] animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E1EAF4]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E8F7F5] text-[#0F8B83] flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-sm text-[#102A56]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="p-1.5 rounded-lg text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC]"
                aria-label="Close notifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-[#F5F8FC] my-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`py-2.5 px-2 rounded-xl transition-colors ${
                    n.unread ? "bg-[#E8F7F5]/40" : "hover:bg-[#F5F8FC]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-[#102A56] truncate">{n.title}</p>
                    <span className="text-[10px] text-[#7186A5] shrink-0 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {n.time}
                    </span>
                  </div>
                  <p className="text-xs text-[#7186A5] mt-0.5 line-clamp-1">{n.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E1EAF4] flex items-center justify-between">
              <button
                onClick={markAllRead}
                className="text-xs text-[#0F8B83] font-semibold hover:underline inline-flex items-center gap-1 min-h-[36px]"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all as read</span>
              </button>
              <Link
                href="/owner/complaints"
                onClick={() => setNotificationsOpen(false)}
                className="text-xs text-[#7186A5] font-semibold hover:text-[#102A56]"
              >
                View all
              </Link>
            </div>
          </div>
        )}

        {/* Mobile Profile & Account Menu Modal */}
        {profileOpen && (
          <div
            ref={profileRef}
            className="absolute top-14 right-3 left-3 sm:left-auto sm:w-72 z-50 bg-white rounded-2xl shadow-2xl border border-[#E1EAF4] p-4 text-[#102A56] animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <div className="flex items-start justify-between pb-3 border-b border-[#E1EAF4]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center text-[#0F8B83] font-bold text-sm shrink-0">
                  {userInitial}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#102A56] truncate">{displayName}</p>
                  <p className="text-[11px] text-[#7186A5] truncate">{userEmail || "admin@pgmitra.com"}</p>
                  <span className="inline-block mt-0.5 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-[#E8F7F5] text-[#0F8B83] rounded">
                    Admin Owner
                  </span>
                </div>
              </div>
              <button
                onClick={() => setProfileOpen(false)}
                className="p-1 rounded-lg text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC]"
                aria-label="Close profile menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-2 space-y-1">
              <Link
                href="/owner/dashboard"
                onClick={() => setProfileOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC] hover:text-[#0F8B83] transition-colors min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-[#7186A5]" />
                  <span>Dashboard Overview</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#7186A5]" />
              </Link>

              <Link
                href="/owner/pgs"
                onClick={() => setProfileOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC] hover:text-[#0F8B83] transition-colors min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-[#7186A5]" />
                  <span>Manage Properties</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#7186A5]" />
              </Link>

              <Link
                href="/owner/rooms"
                onClick={() => setProfileOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC] hover:text-[#0F8B83] transition-colors min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <BedDouble className="w-4 h-4 text-[#7186A5]" />
                  <span>Manage Rooms & Beds</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#7186A5]" />
              </Link>

              <Link
                href="/owner/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC] hover:text-[#0F8B83] transition-colors min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-[#7186A5]" />
                  <span>Account & Settings</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#7186A5]" />
              </Link>
            </div>

            {onLogout && (
              <div className="pt-2 border-t border-[#E1EAF4]">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50/50 hover:bg-rose-50 transition-colors min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Gap + Separate Good Morning Greeting Card (Original Green Gradient with Soft Rounded Corners) */}
      <div className="px-3.5 pt-3 pb-0.5">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#052E26] via-[#08756E] to-[#0B5A4B] text-white p-4.5 rounded-2xl shadow-md shadow-[#052E26]/15 border border-[#0F8B83]/30">
          {/* Subtle ambient decorative glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#34D399]/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-black/20 blur-xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider block">
                {greeting} 👋
              </span>
              <h1 className="text-xl font-extrabold text-white tracking-tight mt-0.5 truncate">
                {displayName}
              </h1>
              <p className="text-xs text-white/75 mt-0.5 font-normal">
                Here’s what’s happening with your properties today.
              </p>
            </div>

            <Link
              href="/owner/pgs/add"
              className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#0B5A4B] hover:bg-[#E8F7F5] font-bold text-xs shadow-xs transition-all active:scale-95 min-h-[42px]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add PG</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
