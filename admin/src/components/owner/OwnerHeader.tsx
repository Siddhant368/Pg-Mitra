"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Bell, 
  MessageCircle, 
  Search, 
  HelpCircle, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  ChevronRight,
  Clock,
  ExternalLink,
  CheckCheck,
  Home,
  X,
  Building2,
  BedDouble,
  UsersRound,
  CreditCard,
  MessageSquare,
  LayoutDashboard
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  role?: string;
}

interface OwnerHeaderProps {
  user: UserProfile;
  logout: () => void;
  onMobileMenuToggle?: () => void;
  breadcrumbs?: { label: string; href?: string }[];
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
    id: "1",
    title: "New student registration",
    description: "Rahul Sharma joined PG Tower 1",
    time: "10m ago",
    unread: true,
  },
  {
    id: "2",
    title: "Payment received",
    description: "₹8,500 received from Room 204",
    time: "1h ago",
    unread: true,
  },
  {
    id: "3",
    title: "Complaint resolved",
    description: "AC servicing marked completed",
    time: "1d ago",
    unread: false,
  },
];

const sampleWhatsAppNotifications = [
  {
    id: "w1",
    sender: "Rahul Sharma (Room 102)",
    message: "Sir, rent receipt submitted via WhatsApp.",
    time: "5m ago",
    unread: true,
  },
  {
    id: "w2",
    sender: "Aman Gupta (Room 305)",
    message: "Can we get guest permission for Saturday?",
    time: "25m ago",
    unread: true,
  },
  {
    id: "w3",
    sender: "Priya (Room 201)",
    message: "WiFi connection is working smoothly now. Thanks!",
    time: "3h ago",
    unread: false,
  },
];

export default function OwnerHeader({ 
  user, 
  logout, 
  onMobileMenuToggle,
  breadcrumbs
}: OwnerHeaderProps) {
  const pathname = usePathname();

  // Desktop states
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mobile states
  const [mobileNotifOpen, setMobileNotifOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);

  // Notifications state (shared between desktop & mobile)
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Desktop refs
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const whatsappRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  // Mobile refs
  const mobileNotifRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);

  // Outside click listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) setProfileOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(target)) setNotificationOpen(false);
      if (whatsappRef.current && !whatsappRef.current.contains(target)) setWhatsappOpen(false);
      if (helpRef.current && !helpRef.current.contains(target)) setHelpOpen(false);
      if (mobileNotifRef.current && !mobileNotifRef.current.contains(target)) setMobileNotifOpen(false);
      if (mobileProfileRef.current && !mobileProfileRef.current.contains(target)) setMobileProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileNotifOpen(false);
    setMobileProfileOpen(false);
    setProfileOpen(false);
    setNotificationOpen(false);
    setWhatsappOpen(false);
    setHelpOpen(false);
  }, [pathname]);

  const displayName = user?.name?.trim() || "Owner";

  // Calculate initials (e.g. "SS" for Siddhant Singh)
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || "OW";
  };
  const userInitials = getInitials(displayName);

  const unreadBellCount = notifications.filter((n) => n.unread).length;
  const unreadWhatsappCount = sampleWhatsAppNotifications.filter((w) => w.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Breadcrumbs calculation for desktop header
  const computedBreadcrumbs = useMemo(() => {
    if (breadcrumbs && breadcrumbs.length > 0 && breadcrumbs[0].label !== "Dashboard") {
      return breadcrumbs;
    }
    if (pathname === "/owner/dashboard") {
      return [{ label: "Dashboard", href: "/owner/dashboard" }, { label: "Overview" }];
    }
    if (pathname === "/owner/pgs") {
      return [{ label: "Dashboard", href: "/owner/dashboard" }, { label: "Properties & PGs" }];
    }
    if (pathname === "/owner/pgs/add") {
      return [
        { label: "Dashboard", href: "/owner/dashboard" },
        { label: "Properties", href: "/owner/pgs" },
        { label: "Add New PG" }
      ];
    }
    if (pathname.startsWith("/owner/pgs/") && pathname.endsWith("/edit")) {
      return [
        { label: "Dashboard", href: "/owner/dashboard" },
        { label: "Properties", href: "/owner/pgs" },
        { label: "Edit Property" }
      ];
    }
    if (pathname.startsWith("/owner/pgs/") && pathname.endsWith("/rooms")) {
      return [
        { label: "Dashboard", href: "/owner/dashboard" },
        { label: "Properties", href: "/owner/pgs" },
        { label: "Rooms" }
      ];
    }
    if (pathname.startsWith("/owner/pgs/")) {
      return [
        { label: "Dashboard", href: "/owner/dashboard" },
        { label: "Properties", href: "/owner/pgs" },
        { label: "Property Details" }
      ];
    }
    if (pathname === "/owner/rooms") {
      return [{ label: "Dashboard", href: "/owner/dashboard" }, { label: "Rooms & Beds" }];
    }
    if (pathname === "/owner/students") {
      return [{ label: "Dashboard", href: "/owner/dashboard" }, { label: "Students & Tenants" }];
    }
    if (pathname === "/owner/payments") {
      return [{ label: "Dashboard", href: "/owner/dashboard" }, { label: "Payments & Revenue" }];
    }
    if (pathname === "/owner/complaints") {
      return [{ label: "Dashboard", href: "/owner/dashboard" }, { label: "Complaints & Support" }];
    }
    if (pathname === "/owner/settings") {
      return [{ label: "Dashboard", href: "/owner/dashboard" }, { label: "Account Settings" }];
    }
    return breadcrumbs || [{ label: "Dashboard", href: "/owner/dashboard" }, { label: "Overview" }];
  }, [pathname, breadcrumbs]);

  return (
    <>
      {/* 1. Mobile Common Branded Top Header (Visible on ALL Admin Pages for Mobile < md) */}
      <div className="md:hidden sticky top-0 z-30 bg-gradient-to-r from-[#052E26] via-[#08756E] to-[#0B5A4B] text-white px-4 py-3 rounded-b-2xl shadow-lg shadow-[#052E26]/20 border-b border-white/10">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Left: White house logo + PGMitra brand + ADMIN SUITE */}
          <Link href="/owner/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xs">
              <Home className="w-4 h-4 text-white stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-white leading-none">
                PG<span className="text-[#34D399]">Mitra</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#A7F3D0] font-semibold mt-0.5">
                ADMIN SUITE
              </span>
            </div>
          </Link>

          {/* Right Action Controls: Green/Mint Notification Bell & Avatar with Dropdown Arrow */}
          <div className="flex items-center gap-2">
            {/* Notification Bell in translucent container with red notification dot */}
            <button
              onClick={() => {
                setMobileNotifOpen(!mobileNotifOpen);
                setMobileProfileOpen(false);
              }}
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-white transition-all min-h-[40px] min-w-[40px] flex items-center justify-center focus:outline-hidden focus:ring-2 focus:ring-[#34D399]"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4 text-white" />
              {unreadBellCount > 0 && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                </span>
              )}
            </button>

            {/* Circular profile avatar with initials + dropdown arrow */}
            <button
              onClick={() => {
                setMobileProfileOpen(!mobileProfileOpen);
                setMobileNotifOpen(false);
              }}
              className="flex items-center gap-1.5 p-1 pr-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition-all active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-[#34D399] min-h-[40px]"
              aria-label="Open user profile menu"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#0F8B83] to-[#34D399] text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                {userInitials}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-white/80" />
            </button>
          </div>
        </div>

        {/* Mobile Notification Popover Modal */}
        {mobileNotifOpen && (
          <div
            ref={mobileNotifRef}
            className="absolute top-14 left-3 right-3 z-50 bg-white rounded-2xl shadow-2xl border border-[#E1EAF4] p-4 text-[#102A56] animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E1EAF4]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E8F7F5] text-[#0F8B83] flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-sm text-[#102A56]">Notifications</h3>
                {unreadBellCount > 0 && (
                  <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-bold">
                    {unreadBellCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setMobileNotifOpen(false)}
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
                    n.unread ? "bg-[#E8F7F5]/50" : "hover:bg-[#F5F8FC]"
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
                onClick={() => setMobileNotifOpen(false)}
                className="text-xs text-[#7186A5] font-semibold hover:text-[#0F8B83]"
              >
                View all
              </Link>
            </div>
          </div>
        )}

        {/* Mobile Profile & Account Menu Modal */}
        {mobileProfileOpen && (
          <div
            ref={mobileProfileRef}
            className="absolute top-14 right-3 left-3 sm:left-auto sm:w-72 z-50 bg-white rounded-2xl shadow-2xl border border-[#E1EAF4] p-4 text-[#102A56] animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <div className="flex items-start justify-between pb-3 border-b border-[#E1EAF4]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F8B83] to-[#34D399] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#102A56] truncate">{displayName}</p>
                  <p className="text-[11px] text-[#7186A5] truncate">{user?.email || "admin@pgmitra.com"}</p>
                  <span className="inline-block mt-0.5 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-[#E8F7F5] text-[#0F8B83] rounded">
                    Admin Owner
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileProfileOpen(false)}
                className="p-1 rounded-lg text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC]"
                aria-label="Close profile menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-2 space-y-1">
              <Link
                href="/owner/dashboard"
                onClick={() => setMobileProfileOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC] hover:text-[#0F8B83] transition-colors min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-[#7186A5]" />
                  <span>Dashboard Overview</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#7186A5]" />
              </Link>

              <Link
                href="/owner/pgs"
                onClick={() => setMobileProfileOpen(false)}
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
                onClick={() => setMobileProfileOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC] hover:text-[#0F8B83] transition-colors min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <BedDouble className="w-4 h-4 text-[#7186A5]" />
                  <span>Manage Rooms & Beds</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#7186A5]" />
              </Link>

              <Link
                href="/owner/students"
                onClick={() => setMobileProfileOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC] hover:text-[#0F8B83] transition-colors min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <UsersRound className="w-4 h-4 text-[#7186A5]" />
                  <span>Students & Tenants</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#7186A5]" />
              </Link>

              <Link
                href="/owner/payments"
                onClick={() => setMobileProfileOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC] hover:text-[#0F8B83] transition-colors min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-[#7186A5]" />
                  <span>Payments & Revenue</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#7186A5]" />
              </Link>

              <Link
                href="/owner/complaints"
                onClick={() => setMobileProfileOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC] hover:text-[#0F8B83] transition-colors min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-[#7186A5]" />
                  <span>Complaints & Requests</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#7186A5]" />
              </Link>

              <Link
                href="/owner/settings"
                onClick={() => setMobileProfileOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC] hover:text-[#0F8B83] transition-colors min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-[#7186A5]" />
                  <span>Account & Settings</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#7186A5]" />
              </Link>
            </div>

            <div className="pt-2 border-t border-[#E1EAF4]">
              <button
                onClick={() => {
                  setMobileProfileOpen(false);
                  logout();
                }}
                className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50/50 hover:bg-rose-50 transition-colors min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Desktop Top Header (Visible ONLY on Desktop md+) */}
      <header className="hidden md:flex h-20 bg-white border-b border-[#E1EAF4] px-6 lg:px-8 items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Left side: Desktop Breadcrumbs Navigation */}
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs md:text-sm font-medium">
            {computedBreadcrumbs.map((crumb, idx) => {
              const isLast = idx === computedBreadcrumbs.length - 1;
              return (
                <div key={idx} className="flex items-center gap-2">
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#7186A5]/60 shrink-0" />}
                  {crumb.href && !isLast ? (
                    <Link 
                      href={crumb.href} 
                      className="text-[#7186A5] hover:text-[#0F8B83] transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "text-[#102A56] font-semibold" : "text-[#7186A5]"}>
                      {crumb.label}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right side: Search, Actions, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3 ml-auto">
          {/* Desktop Search Field */}
          <div className="hidden lg:flex items-center relative w-64 xl:w-72">
            <Search className="w-4 h-4 text-[#7186A5] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anything..."
              className="w-full pl-9 pr-3.5 py-2 text-xs md:text-sm bg-[#F5F8FC] border border-[#E1EAF4] rounded-xl text-[#102A56] placeholder-[#7186A5] focus:outline-hidden focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] transition-all"
            />
          </div>

          {/* WhatsApp Notification Icon & Dropdown */}
          <div className="relative" ref={whatsappRef}>
            <button
              onClick={() => {
                setWhatsappOpen(!whatsappOpen);
                setNotificationOpen(false);
                setProfileOpen(false);
                setHelpOpen(false);
              }}
              className="relative p-2.5 rounded-xl border border-[#E1EAF4] text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 transition-all focus:outline-hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="WhatsApp Alerts"
              aria-label="WhatsApp alerts"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-100" />
              {unreadWhatsappCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white shadow-xs">
                  {unreadWhatsappCount}
                </span>
              )}
            </button>

            {whatsappOpen && (
              <div className="absolute right-0 mt-3 w-96 max-w-sm rounded-2xl bg-white shadow-xl border border-[#E1EAF4] py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-2.5 border-b border-[#E1EAF4] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-[#102A56] text-sm">WhatsApp Alerts</span>
                  </div>
                  {unreadWhatsappCount > 0 && (
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                      {unreadWhatsappCount} new
                    </span>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#F5F8FC]">
                  {sampleWhatsAppNotifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 hover:bg-[#F5F8FC] transition-colors cursor-pointer ${
                        item.unread ? "bg-emerald-50/30" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-[#102A56]">{item.sender}</p>
                        <span className="text-[10px] text-[#7186A5] shrink-0 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#7186A5] mt-1 line-clamp-2">{item.message}</p>
                    </div>
                  ))}
                </div>

                <div className="px-4 pt-2.5 border-t border-[#E1EAF4] text-center">
                  <a
                    href="https://web.whatsapp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#0F8B83] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Open WhatsApp Web</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Regular Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                setWhatsappOpen(false);
                setProfileOpen(false);
                setHelpOpen(false);
              }}
              className="relative p-2.5 rounded-xl border border-[#E1EAF4] text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-all focus:outline-hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Notifications"
              aria-label="System notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadBellCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-xs">
                  {unreadBellCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-3 w-96 max-w-sm rounded-2xl bg-white shadow-xl border border-[#E1EAF4] py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-2.5 border-b border-[#E1EAF4] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#E8F7F5] text-[#0F8B83]">
                      <Bell className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-[#102A56] text-sm">Notifications</span>
                  </div>
                  {unreadBellCount > 0 && (
                    <span className="text-[11px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-semibold">
                      {unreadBellCount} unread
                    </span>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#F5F8FC]">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 hover:bg-[#F5F8FC] transition-colors cursor-pointer ${
                        item.unread ? "bg-[#E8F7F5]/30" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-[#102A56]">{item.title}</p>
                        <span className="text-[10px] text-[#7186A5] shrink-0 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#7186A5] mt-1 line-clamp-2">{item.description}</p>
                    </div>
                  ))}
                </div>

                <div className="px-4 pt-2.5 border-t border-[#E1EAF4] text-center">
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs text-[#0F8B83] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all as read</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help Icon (Desktop/Tablet) */}
          <div className="relative" ref={helpRef}>
            <button
              onClick={() => {
                setHelpOpen(!helpOpen);
                setNotificationOpen(false);
                setWhatsappOpen(false);
                setProfileOpen(false);
              }}
              className="p-2.5 rounded-xl border border-[#E1EAF4] text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-all focus:outline-hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Help & Support"
              aria-label="Help & Support"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {helpOpen && (
              <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white shadow-xl border border-[#E1EAF4] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <h4 className="text-xs font-bold text-[#102A56] uppercase tracking-wider mb-2">Help & Documentation</h4>
                <p className="text-xs text-[#7186A5] mb-3">
                  Need guidance setting up your PGs, rooms, or managing student rent?
                </p>
                <div className="space-y-1.5">
                  <Link
                    href="/owner/dashboard"
                    onClick={() => setHelpOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-[#102A56] hover:bg-[#F5F8FC] transition-colors"
                  >
                    <span>Quick Setup Guide</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#7186A5]" />
                  </Link>
                  <Link
                    href="/owner/settings"
                    onClick={() => setHelpOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-[#102A56] hover:bg-[#F5F8FC] transition-colors"
                  >
                    <span>Account & Support</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#7186A5]" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-7 w-px bg-[#E1EAF4] mx-0.5"></div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationOpen(false);
                setWhatsappOpen(false);
                setHelpOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-xl border border-[#E1EAF4] hover:bg-[#F5F8FC] transition-all focus:outline-hidden min-h-[44px]"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-lg bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center text-[#0F8B83] font-bold text-xs shrink-0">
                {user.name?.charAt(0)?.toUpperCase() || "O"}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-[#102A56] leading-tight max-w-[110px] truncate">
                  {user.name || "Owner"}
                </span>
                <span className="text-[10px] text-[#0F8B83] font-semibold leading-tight capitalize">
                  Owner
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#7186A5] transition-transform ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white shadow-xl border border-[#E1EAF4] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-[#E1EAF4]">
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-[#7186A5]">Signed in as</p>
                  <p className="text-xs font-bold text-[#102A56] truncate mt-0.5">{user.name}</p>
                  <p className="text-[11px] text-[#7186A5] truncate">{user.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    href="/owner/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center px-4 py-2.5 text-xs font-medium text-[#102A56] hover:bg-[#F5F8FC] hover:text-[#0F8B83] transition-colors"
                  >
                    <User className="mr-2.5 w-4 h-4 text-[#7186A5]" />
                    My Profile
                  </Link>
                  <Link
                    href="/owner/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center px-4 py-2.5 text-xs font-medium text-[#102A56] hover:bg-[#F5F8FC] hover:text-[#0F8B83] transition-colors"
                  >
                    <Settings className="mr-2.5 w-4 h-4 text-[#7186A5]" />
                    Settings
                  </Link>
                </div>

                <div className="pt-1 border-t border-[#E1EAF4]">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="flex items-center w-full px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="mr-2.5 w-4 h-4 text-rose-500" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
