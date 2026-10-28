"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { 
  AlertCircle, 
  RefreshCw, 
  X, 
  ArrowRight, 
  LayoutDashboard, 
  BarChart3 
} from "lucide-react";
import Link from "next/link";

// Dashboard Modular Components
import MobileDashboardHeader from "@/components/owner/MobileDashboardHeader";
import WelcomeSection from "@/components/owner/WelcomeSection";
import DashboardStats from "@/components/owner/DashboardStats";
import AnalyticsOverview from "@/components/owner/AnalyticsOverview";
import PropertyOnboardingCard from "@/components/owner/PropertyOnboardingCard";
import PropertyOverview from "@/components/owner/PropertyOverview";
import RecentActivity, { type ActivityItem } from "@/components/owner/RecentActivity";
import QuickActions from "@/components/owner/QuickActions";
import DashboardSkeleton from "@/components/owner/DashboardSkeleton";

interface OwnerProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt?: string;
}

interface PgItem {
  _id?: string;
  id?: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  type?: string;
  totalRooms?: number;
  totalBeds?: number;
  occupiedBeds?: number;
  rentRange?: string;
  createdAt?: string;
  updatedAt?: string;
}

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Recently";
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function DashboardClient() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "overview">("dashboard");
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [pgs, setPgs] = useState<PgItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // Concurrently fetch real API data
        const [profileData, pgsData] = await Promise.allSettled([
          fetchApi("/owner/profile"),
          fetchApi("/owner/pgs"),
        ]);

        if (profileData.status === "fulfilled" && profileData.value) {
          setProfile(profileData.value);
        }

        if (pgsData.status === "fulfilled" && Array.isArray(pgsData.value)) {
          setPgs(pgsData.value);
        } else if (pgsData.status === "rejected") {
          console.warn("Could not load PGs list:", pgsData.reason);
        }

        // If both failed completely, trigger error banner
        if (profileData.status === "rejected" && pgsData.status === "rejected") {
          const reason = profileData.reason;
          throw new Error(reason instanceof Error ? reason.message : "Failed to load dashboard data");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load owner dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Compute stats from real backend data
  const totalPgsCount = pgs.length;
  const totalRoomsCount = pgs.reduce((acc, pg) => acc + (Number(pg.totalRooms) || 0), 0);
  const totalBedsCount = pgs.reduce((acc, pg) => acc + (Number(pg.totalBeds) || 0), 0);
  const occupiedBedsCount = pgs.reduce((acc, pg) => acc + (Number(pg.occupiedBeds) || 0), 0);
  const availableBedsCount = Math.max(0, totalBedsCount - occupiedBedsCount);

  // In the current backend, active students are managed per PG room beds
  const activeStudentsCount = 0;

  // Derive real activities from actual backend property and room events
  const activities: ActivityItem[] = useMemo(() => {
    const list: ActivityItem[] = [];
    pgs.forEach((pg, index) => {
      const pgId = pg._id || pg.id || `pg-${index}`;
      
      // PG registration event
      list.push({
        id: `pg-reg-${pgId}`,
        title: `PG Registered: ${pg.name}`,
        description: `${pg.totalRooms || 0} rooms · ${pg.city || pg.address || "Property active"}`,
        time: formatRelativeTime(pg.createdAt),
        type: "pg",
      });

      // Room setup event
      if (pg.totalRooms && pg.totalRooms > 0) {
        list.push({
          id: `pg-rooms-${pgId}`,
          title: `Rooms Configured`,
          description: `${pg.totalRooms} rooms set up for ${pg.name}`,
          time: formatRelativeTime(pg.updatedAt || pg.createdAt),
          type: "room",
        });
      }

      // Tenant bed assignment event
      if (pg.occupiedBeds && pg.occupiedBeds > 0) {
        list.push({
          id: `pg-beds-${pgId}`,
          title: `Bed Occupancy Updated`,
          description: `${pg.occupiedBeds} occupied beds in ${pg.name}`,
          time: formatRelativeTime(pg.updatedAt || pg.createdAt),
          type: "student",
        });
      }
    });

    return list.slice(0, 5);
  }, [pgs]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
        <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-[#102A56] mb-2">Error Loading Dashboard</h3>
          <p className="text-sm text-[#7186A5] mb-6 max-w-md">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F8B83] text-white rounded-xl hover:bg-[#08756E] transition-colors font-semibold text-sm shadow-sm min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  const effectiveUserName = profile?.name || user?.name || "Owner";
  const effectiveUserEmail = profile?.email || user?.email;

  return (
    <div className="w-full">
      {/* 1. Mobile-Specific Branded Header (Visible ONLY on Mobile < md) */}
      <MobileDashboardHeader
        userName={effectiveUserName}
        userEmail={effectiveUserEmail}
        onLogout={logout}
      />

      {/* 2. Main Dashboard Content Body */}
      <div className="p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Desktop Header Row: Greeting & View Switcher (Visible ONLY on Desktop md+) */}
        <div className="hidden md:flex flex-row items-center justify-between gap-3 pb-1">
          <WelcomeSection userName={effectiveUserName} />

          <div className="flex items-center p-1 bg-white border border-[#E1EAF4] rounded-2xl shadow-xs shrink-0">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[40px] ${
                activeTab === "dashboard"
                  ? "bg-[#0F8B83] text-white shadow-xs"
                  : "text-[#7186A5] hover:text-[#102A56]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[40px] ${
                activeTab === "overview"
                  ? "bg-[#0F8B83] text-white shadow-xs"
                  : "text-[#7186A5] hover:text-[#102A56]"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </button>
          </div>
        </div>

        {/* Mobile View Switcher (Visible ONLY on Mobile < md) */}
        <div className="md:hidden flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center p-1 bg-white border border-[#E1EAF4] rounded-2xl shadow-xs w-full">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
                activeTab === "dashboard"
                  ? "bg-[#0F8B83] text-white shadow-xs"
                  : "text-[#7186A5] hover:text-[#102A56]"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
                activeTab === "overview"
                  ? "bg-[#0F8B83] text-white shadow-xs"
                  : "text-[#7186A5] hover:text-[#102A56]"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
          </div>
        </div>

        {activeTab === "dashboard" ? (
          /* Screen 1: Admin Dashboard */
          <>
            {/* MOBILE LAYOUT (< md): Compact Single-Column Flow */}
            <div className="md:hidden space-y-3.5 animate-in fade-in duration-150">
              {/* 1. Main Dashboard Summary Card: Total PGs Hero */}
              <DashboardStats
                totalPgs={totalPgsCount}
                totalRooms={totalRoomsCount}
                totalBeds={totalBedsCount}
                occupiedBeds={occupiedBedsCount}
                availableBeds={availableBedsCount}
                totalTenants={activeStudentsCount}
              />

              {/* 2. Compact Recent Activity Section (beneath metric cards as specified in Section 6) */}
              <RecentActivity activities={activities} viewAllHref="/owner/pgs" />

              {/* 3. Managed Properties or Onboarding Card */}
              {totalPgsCount === 0 ? (
                <PropertyOnboardingCard onOpenSetupGuide={() => setShowGuideModal(true)} />
              ) : (
                <PropertyOverview pgs={pgs} />
              )}
            </div>

            {/* DESKTOP LAYOUT (md+): Preserved Existing Layout */}
            <div className="hidden md:block space-y-6 lg:space-y-7 animate-in fade-in duration-150">
              {/* Prominent Hero Total PGs + 4-Col Metrics */}
              <DashboardStats
                totalPgs={totalPgsCount}
                totalRooms={totalRoomsCount}
                totalBeds={totalBedsCount}
                occupiedBeds={occupiedBedsCount}
                availableBeds={availableBedsCount}
                totalTenants={activeStudentsCount}
              />

              {/* Main Onboarding Card or Property Overview */}
              {totalPgsCount === 0 ? (
                <PropertyOnboardingCard onOpenSetupGuide={() => setShowGuideModal(true)} />
              ) : (
                <PropertyOverview pgs={pgs} />
              )}

              {/* Bottom Grid: Recent Activity & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
                <RecentActivity activities={activities} viewAllHref="/owner/pgs" />
                <QuickActions />
              </div>
            </div>
          </>
        ) : (
          /* Screen 2: Admin Overview Analytics (Mobile & Desktop) */
          <div className="animate-in fade-in duration-150">
            <AnalyticsOverview
              pgs={pgs}
              totalRooms={totalRoomsCount}
              totalBeds={totalBedsCount}
              totalTenants={activeStudentsCount}
              occupiedBeds={occupiedBedsCount}
              availableBeds={availableBedsCount}
            />
          </div>
        )}
      </div>

      {/* Interactive Setup Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A56]/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E1EAF4] shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close guide"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#E8F7F5] text-[#0F8B83] flex items-center justify-center font-bold">
                PG
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#102A56]">PG Setup Guide</h3>
                <p className="text-xs text-[#7186A5]">3 simple steps to get started</p>
              </div>
            </div>

            <div className="space-y-3.5 my-5">
              <div className="p-3.5 rounded-2xl bg-[#F5F8FC] border border-[#E1EAF4] flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0F8B83] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#102A56]">Add Your PG / Hostel</h4>
                  <p className="text-xs text-[#7186A5] mt-0.5">
                    Enter property name, address, contact phone, total rooms, and amenities.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F8FC] border border-[#E1EAF4] flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0F8B83] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#102A56]">Configure Rooms & Beds</h4>
                  <p className="text-xs text-[#7186A5] mt-0.5">
                    Set up room numbers, floor levels, bed capacities, and individual rent pricing.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F8FC] border border-[#E1EAF4] flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0F8B83] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#102A56]">Manage Tenants & Occupancy</h4>
                  <p className="text-xs text-[#7186A5] mt-0.5">
                    Track check-ins, bed assignments, and monitor real-time occupancy.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E1EAF4]">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#7186A5] hover:bg-[#F5F8FC] min-h-[44px]"
              >
                Close
              </button>
              <Link
                href="/owner/pgs/add"
                onClick={() => setShowGuideModal(false)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs font-semibold shadow-xs min-h-[44px]"
              >
                <span>Add PG Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
