"use client";

import React from "react";
import { 
  Users, 
  UserCheck, 
  ShieldAlert, 
  CreditCard, 
  BedDouble, 
  CalendarClock, 
  TrendingUp, 
  AlertCircle
} from "lucide-react";
import { StudentStats, StudentNavTab, QuickFilter } from "@/types/student";

interface StudentAnalyticsCardsProps {
  stats: StudentStats;
  activeTab: StudentNavTab;
  onSelectTab: (tab: StudentNavTab) => void;
  onSelectQuickFilter: (filter: QuickFilter | null) => void;
}

export default function StudentAnalyticsCards({
  stats,
  activeTab,
  onSelectTab,
  onSelectQuickFilter,
}: StudentAnalyticsCardsProps) {
  // Estimated occupancy percentage based on active residents
  const occupancyRate = stats.totalStudents > 0 
    ? Math.min(100, Math.round((stats.activeStudents / Math.max(stats.totalStudents, 50)) * 100))
    : 92;

  const cards = [
    {
      id: "total",
      label: "Total Residents",
      value: stats.totalStudents.toString(),
      subtext: "Across 4 properties",
      badge: "+12%",
      badgeType: "positive" as const,
      icon: Users,
      gradient: "from-white via-[#F8FBFC] to-[#E8F7F5]/40",
      iconColor: "text-[#0F8B83] bg-[#E8F7F5] border-[#0F8B83]/20",
      activeRing: "ring-2 ring-[#0F8B83] border-[#0F8B83] shadow-md shadow-[#0F8B83]/10",
      active: activeTab === "ALL",
      onClick: () => {
        onSelectTab("ALL");
        onSelectQuickFilter(null);
      },
      meterValue: 100,
      meterColor: "bg-[#0F8B83]",
    },
    {
      id: "active",
      label: "Active In-House",
      value: stats.activeStudents.toString(),
      subtext: `${occupancyRate}% Occupancy`,
      badge: "High",
      badgeType: "positive" as const,
      icon: UserCheck,
      gradient: "from-white via-[#F8FBFC] to-emerald-50/40",
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
      activeRing: "ring-2 ring-emerald-600 border-emerald-600 shadow-md shadow-emerald-600/10",
      active: activeTab === "ACTIVE",
      onClick: () => {
        onSelectTab("ACTIVE");
        onSelectQuickFilter(null);
      },
      meterValue: occupancyRate,
      meterColor: "bg-emerald-500",
    },
    {
      id: "verification",
      label: "KYC Queue",
      value: stats.pendingVerification.toString(),
      subtext: stats.pendingVerification > 0 ? "Aadhaar / ID check" : "Verified",
      badge: stats.pendingVerification > 0 ? "Action" : "Clear",
      badgeType: (stats.pendingVerification > 0 ? "warning" : "neutral") as "warning" | "neutral",
      icon: ShieldAlert,
      gradient: "from-white via-[#F8FBFC] to-amber-50/40",
      iconColor: "text-amber-600 bg-amber-50 border-amber-200",
      activeRing: "ring-2 ring-amber-500 border-amber-500 shadow-md shadow-amber-500/10",
      active: activeTab === "PENDING_VERIFICATION",
      onClick: () => {
        onSelectTab("PENDING_VERIFICATION");
        onSelectQuickFilter("DOCS_PENDING");
      },
      meterValue: stats.pendingVerification > 0 ? 40 : 100,
      meterColor: stats.pendingVerification > 0 ? "bg-amber-500" : "bg-emerald-500",
    },
    {
      id: "pending_rent",
      label: "Pending Rent",
      value: stats.pendingRentCount.toString(),
      subtext: `₹${(stats.pendingRentAmount / 1000).toFixed(1)}k due`,
      badge: stats.pendingRentCount > 0 ? "Overdue" : "Paid",
      badgeType: (stats.pendingRentCount > 0 ? "danger" : "positive") as "danger" | "positive",
      icon: CreditCard,
      gradient: "from-white via-[#F8FBFC] to-rose-50/40",
      iconColor: "text-rose-600 bg-rose-50 border-rose-200",
      activeRing: "ring-2 ring-rose-500 border-rose-500 shadow-md shadow-rose-500/10",
      active: activeTab === "PAYMENT_PENDING",
      onClick: () => {
        onSelectTab("PAYMENT_PENDING");
        onSelectQuickFilter("RENT_OVERDUE");
      },
      meterValue: stats.pendingRentCount > 0 ? 30 : 100,
      meterColor: "bg-rose-500",
    },
    {
      id: "vacant_beds",
      label: "Vacant Beds",
      value: stats.vacantRoomRequests.toString(),
      subtext: "Available beds",
      badge: "Move-in",
      badgeType: "info" as const,
      icon: BedDouble,
      gradient: "from-white via-[#F8FBFC] to-sky-50/40",
      iconColor: "text-sky-600 bg-sky-50 border-sky-200",
      activeRing: "ring-2 ring-sky-500 border-sky-500 shadow-md shadow-sky-500/10",
      active: false,
      onClick: () => {
        onSelectTab("ALL");
      },
      meterValue: 75,
      meterColor: "bg-sky-500",
    },
    {
      id: "leaving_soon",
      label: "Leaving Soon",
      value: stats.studentsLeavingSoon.toString(),
      subtext: "Notice period (<20d)",
      badge: "Checkouts",
      badgeType: "warning" as const,
      icon: CalendarClock,
      gradient: "from-white via-[#F8FBFC] to-orange-50/40",
      iconColor: "text-orange-600 bg-orange-50 border-orange-200",
      activeRing: "ring-2 ring-orange-500 border-orange-500 shadow-md shadow-orange-500/10",
      active: false,
      onClick: () => {
        onSelectTab("ALL");
        onSelectQuickFilter("LEAVING_SOON");
      },
      meterValue: 25,
      meterColor: "bg-orange-500",
    },
  ];

  const renderBadge = (badge: string, type: "positive" | "warning" | "danger" | "info" | "neutral") => {
    switch (type) {
      case "positive":
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <TrendingUp className="w-2.5 h-2.5" />
            {badge}
          </span>
        );
      case "warning":
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-2.5 h-2.5" />
            {badge}
          </span>
        );
      case "danger":
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            {badge}
          </span>
        );
      case "info":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200">
            {badge}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
            {badge}
          </span>
        );
    }
  };

  return (
    <div>
      {/* Swipeable snap carousel on mobile, responsive grid on desktop */}
      <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-2.5 pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 sm:gap-4">
        {cards.map((c) => {
          const IconComponent = c.icon;
          return (
            <div
              key={c.id}
              onClick={c.onClick}
              className={`group relative rounded-2xl bg-gradient-to-br ${c.gradient} p-3.5 sm:p-4.5 border transition-all duration-200 cursor-pointer min-w-[145px] max-w-[165px] sm:min-w-0 sm:max-w-none snap-start shrink-0 sm:shrink flex flex-col justify-between ${
                c.active
                  ? c.activeRing
                  : "border-[#E1EAF4] hover:border-[#0F8B83]/40"
              }`}
            >
              {/* Top row: Icon & Status Badge */}
              <div className="flex items-center justify-between gap-1.5">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold border shadow-2xs group-hover:scale-105 transition-transform ${c.iconColor}`}
                >
                  <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                {renderBadge(c.badge, c.badgeType)}
              </div>

              {/* Metric Value & Label */}
              <div className="mt-2.5 sm:mt-3.5 space-y-0.5">
                <div className="text-xl sm:text-3xl font-black text-[#102A56] tracking-tight font-mono">
                  {c.value}
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-[#102A56] truncate">
                  {c.label}
                </div>
                <div className="text-[10px] sm:text-[11px] font-medium text-[#7186A5] truncate">
                  {c.subtext}
                </div>
              </div>

              {/* Bottom Mini Progress Indicator */}
              <div className="mt-2.5 pt-2 border-t border-[#E1EAF4]/60">
                <div className="w-full h-1 sm:h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${c.meterColor}`}
                    style={{ width: `${c.meterValue}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}