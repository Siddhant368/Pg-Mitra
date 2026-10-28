"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OwnerSidebar from "@/components/owner/OwnerSidebar";
import OwnerHeader from "@/components/owner/OwnerHeader";
import MobileBottomNavigation from "@/components/owner/MobileBottomNavigation";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && user && user.role !== "OWNER" && user.role !== "SUPER_ADMIN") {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F8FC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#0F8B83] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-[#7186A5] tracking-wide uppercase">Loading PGMitra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex text-[#102A56] overflow-x-hidden">
      {/* 276px Fixed Desktop & Drawer Sidebar */}
      <OwnerSidebar
        user={user}
        logout={logout}
        isMobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header with Breadcrumbs, Search, Alerts, Profile */}
        <OwnerHeader
          user={user}
          logout={logout}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Scrollable Page Viewport with safe mobile bottom spacing for fixed bottom navigation */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#F5F8FC] pb-28 sm:pb-32 md:pb-8">
          {children}
        </main>

        {/* Mobile Fixed Bottom Navigation Bar */}
        <MobileBottomNavigation />
      </div>
    </div>
  );
}
