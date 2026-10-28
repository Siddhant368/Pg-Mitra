"use client";

import { useState, useRef, useEffect } from "react";
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
  Menu,
  ChevronRight,
  Clock,
  ExternalLink,
  CheckCheck,
  Home,
  X
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

const sampleNotifications = [
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
  breadcrumbs = [{ label: "Dashboard", href: "/owner/dashboard" }, { label: "Overview" }]
}: OwnerHeaderProps) {
  const pathname = usePathname();
  const isDashboard = pathname === "/owner/dashboard";

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const whatsappRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) setProfileOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(target)) setNotificationOpen(false);
      if (whatsappRef.current && !whatsappRef.current.contains(target)) setWhatsappOpen(false);
      if (helpRef.current && !helpRef.current.contains(target)) setHelpOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadBellCount = sampleNotifications.filter((n) => n.unread).length;
  const unreadWhatsappCount = sampleWhatsAppNotifications.filter((w) => w.unread).length;

  return (
    <header className={`${isDashboard ? "hidden md:flex" : "flex"} h-16 md:h-20 bg-white border-b border-[#E1EAF4] px-3 sm:px-6 md:px-8 items-center justify-between sticky top-0 z-30 shadow-xs rounded-b-2xl md:rounded-b-none`}>
      {/* Left side: Mobile Toggle & Brand / Desktop Breadcrumbs */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] border border-[#E1EAF4] focus:outline-hidden min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Mobile Brand Link */}
        <Link href="/owner/dashboard" className="flex md:hidden items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0F8B83] to-[#08756E] flex items-center justify-center text-white shadow-xs">
            <Home className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#102A56] tracking-tight leading-none">
              PG<span className="text-[#0F8B83]">Mitra</span>
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#7186A5] font-semibold mt-0.5">
              Owner
            </span>
          </div>
        </Link>

        {/* Desktop Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-2 text-xs md:text-sm font-medium">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
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
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="lg:hidden p-2 rounded-xl border border-[#E1EAF4] text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Toggle search"
        >
          {mobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
        </button>

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
            className="relative p-2 sm:p-2.5 rounded-xl border border-[#E1EAF4] text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 transition-all focus:outline-hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
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
            <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-96 max-w-sm rounded-2xl bg-white shadow-xl border border-[#E1EAF4] py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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
            className="relative p-2 sm:p-2.5 rounded-xl border border-[#E1EAF4] text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-all focus:outline-hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
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
            <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-96 max-w-sm rounded-2xl bg-white shadow-xl border border-[#E1EAF4] py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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
                {sampleNotifications.map((item) => (
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
        <div className="relative hidden sm:block" ref={helpRef}>
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
        <div className="hidden sm:block h-7 w-px bg-[#E1EAF4] mx-0.5"></div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationOpen(false);
              setWhatsappOpen(false);
              setHelpOpen(false);
            }}
            className="flex items-center gap-2 p-1 sm:p-1.5 sm:pl-2 rounded-xl border border-[#E1EAF4] hover:bg-[#F5F8FC] transition-all focus:outline-hidden min-h-[44px]"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-lg bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center text-[#0F8B83] font-bold text-xs shrink-0">
              {user.name?.charAt(0)?.toUpperCase() || "O"}
            </div>
            <div className="hidden sm:flex flex-col text-left">
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

      {/* Mobile Search Expandable Bar */}
      {mobileSearchOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white border-b border-[#E1EAF4] p-3 shadow-md z-20 animate-in slide-in-from-top duration-150">
          <div className="flex items-center relative">
            <Search className="w-4 h-4 text-[#7186A5] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties, rooms, students..."
              autoFocus
              className="w-full pl-9 pr-8 py-2.5 text-xs bg-[#F5F8FC] border border-[#E1EAF4] rounded-xl text-[#102A56] placeholder-[#7186A5] focus:outline-hidden focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-[#7186A5] hover:text-[#102A56] p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
