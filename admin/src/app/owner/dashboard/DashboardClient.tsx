"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, RefreshCw, X, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

// Dashboard Modular Components
import WelcomeSection from "@/components/owner/WelcomeSection";
import DashboardStats from "@/components/owner/DashboardStats";
import PropertyOnboardingCard from "@/components/owner/PropertyOnboardingCard";
import PropertyOverview from "@/components/owner/PropertyOverview";
import RecentActivity from "@/components/owner/RecentActivity";
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
  rentRange?: string;
}

export default function DashboardClient() {
  const { user } = useAuth();
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
          // If profile succeeded but pgs failed, keep empty pgs array
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

  // In the current backend, active students and payments are managed per PG room beds
  const activeStudentsCount = 0;
  const pendingPaymentsAmount = 0;

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="bg-white border border-rose-200 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-[#102A56] mb-2">Error Loading Dashboard</h3>
          <p className="text-sm text-[#7186A5] mb-6 max-w-md">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F8B83] text-white rounded-xl hover:bg-[#08756E] transition-colors font-semibold text-sm shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  const effectiveUserName = profile?.name || user?.name || "Owner";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* 1. Welcome Section */}
      <WelcomeSection userName={effectiveUserName} />

      {/* 2. Dashboard Statistics Cards (Real API Data) */}
      <DashboardStats
        totalPgs={totalPgsCount}
        totalRooms={totalRoomsCount}
        activeStudents={activeStudentsCount}
        pendingPayments={pendingPaymentsAmount}
      />

      {/* 3. Main Onboarding Card or Property Overview */}
      {totalPgsCount === 0 ? (
        <PropertyOnboardingCard onOpenSetupGuide={() => setShowGuideModal(true)} />
      ) : (
        <PropertyOverview pgs={pgs} />
      )}

      {/* 4. Bottom Grid: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <RecentActivity />
        <QuickActions />
      </div>

      {/* Interactive Setup Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A56]/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E1EAF4] shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC]"
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

            <div className="space-y-4 my-6">
              <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-[#E1EAF4] flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0F8B83] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#102A56]">Add Your PG / Hostel</h4>
                  <p className="text-xs text-[#7186A5] mt-0.5">
                    Enter the property name, address, contact phone, total rooms, and amenities.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-[#E1EAF4] flex items-start gap-3">
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

              <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-[#E1EAF4] flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0F8B83] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#102A56]">Assign Students & Collect Rent</h4>
                  <p className="text-xs text-[#7186A5] mt-0.5">
                    Track check-ins, record rent payments, and receive tenant WhatsApp notifications.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E1EAF4]">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#7186A5] hover:bg-[#F5F8FC]"
              >
                Close
              </button>
              <Link
                href="/owner/pgs/add"
                onClick={() => setShowGuideModal(false)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs font-semibold shadow-xs"
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
