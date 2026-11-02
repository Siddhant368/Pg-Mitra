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
  TrendingDown, 
  Clock,
  ArrowUpRight
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
  const cards = [
    {
      id: "total",
      label: "Total Students",
      value: stats.totalStudents.toString(),
      subtext: "+12% from last month",
      trend: { direction: "up", text: "+12%", positive: true },
      icon: Users,
      cardBg: "bg-gradient-to-br from-white to-[#E8F7F5]/40",
      iconBg: "bg-[#E8F7F5] text-[#0F8B83] border border-[#0F8B83]/20",
      borderColor: "border-[#E1EAF4] hover:border-[#0F8B83]/40",
      active: activeTab === "ALL",
      onClick: () => {
        onSelectTab("ALL");
        onSelectQuickFilter(null);
      },
    },
    {
      id: "active",
      label: "Active Students",
      value: stats.activeStudents.toString(),
      subtext: "90.2% occupancy rate",
      trend: { direction: "up", text: "+4 this mo", positive: true },
      icon: UserCheck,
      cardBg: "bg-gradient-to-br from-white to-emerald-50/40",
      iconBg: "bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20",
      borderColor: "border-[#E1EAF4] hover:border-[#16A34A]/50",
      active: activeTab === "ACTIVE",
      onClick: () => {
        onSelectTab("ACTIVE");
        onSelectQuickFilter(null);
      },
    },
    {
      id: "verification",
      label: "Pending Verification",
      value: stats.pendingVerification.toString(),
      subtext: "Aadhaar & college ID check",
      trend: { direction: "neutral", text: "Action req", positive: false },
      icon: ShieldAlert,
      cardBg: "bg-gradient-to-br from-white to-amber-50/40",
      iconBg: "bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/20",
      borderColor: "border-[#E1EAF4] hover:border-[#D97706]/50",
      active: activeTab === "PENDING_VERIFICATION",
      onClick: () => {
        onSelectTab("PENDING_VERIFICATION");
        onSelectQuickFilter("DOCS_PENDING");
      },
    },
    {
      id: "pending_rent",
      label: "Pending Rent",
      value: stats.pendingRentCount.toString(),
      subtext: `₹${(stats.pendingRentAmount / 1000).toFixed(1)}k awaiting collection`,
      trend: { direction: "down", text: "Overdue", positive: false },
      icon: CreditCard,
      cardBg: "bg-gradient-to-br from-white to-rose-50/40",
      iconBg: "bg-rose-100 text-rose-600 border border-rose-200",
      borderColor: "border-[#E1EAF4] hover:border-rose-400",
      active: activeTab === "PAYMENT_PENDING",
      onClick: () => {
        onSelectTab("PAYMENT_PENDING");
        onSelectQuickFilter("RENT_OVERDUE");
      },
    },
    {
      id: "vacant_beds",
      label: "Vacant Room Requests",
      value: stats.vacantRoomRequests.toString(),
      subtext: "Across 4 active properties",
      trend: { direction: "up", text: "6 bed shifts", positive: true },
      icon: BedDouble,
      cardBg: "bg-gradient-to-br from-white to-sky-50/40",
      iconBg: "bg-sky-100 text-sky-600 border border-sky-200",
      borderColor: "border-[#E1EAF4] hover:border-sky-400",
      active: false,
      onClick: () => {
        onSelectTab("ALL");
      },
    },
    {
      id: "leaving_soon",
      label: "Students Leaving Soon",
      value: stats.studentsLeavingSoon.toString(),
      subtext: "Notice period active (< 20d)",
      trend: { direction: "neutral", text: "Checkout", positive: false },
      icon: CalendarClock,
      cardBg: "bg-gradient-to-br from-white to-orange-50/40",
      iconBg: "bg-orange-100 text-orange-600 border border-orange-200",
      borderColor: "border-[#E1EAF4] hover:border-orange-400",
      active: false,
      onClick: () => {
        onSelectTab("ALL");
        onSelectQuickFilter("LEAVING_SOON");
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isUp = card.trend.direction === "up";
        const isDown = card.trend.direction === "down";

        return (
          <button
            key={card.id}
            onClick={card.onClick}
            className={`flex flex-col justify-between p-4 rounded-2xl border text-left shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 relative group ${
              card.cardBg
            } ${card.borderColor} ${
              card.active ? "ring-2 ring-[#0F8B83] border-[#0F8B83]" : ""
            }`}
          >
            {/* Top row: Icon and Trend Pill */}
            <div className="flex items-center justify-between w-full mb-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${card.iconBg}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  card.trend.positive
                    ? "bg-[#DCFCE7] text-[#16A34A]"
                    : card.trend.direction === "down"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-[#FEF3C7] text-[#D97706]"
                }`}
              >
                {isUp && <TrendingUp className="w-3 h-3" />}
                {isDown && <TrendingDown className="w-3 h-3" />}
                {!isUp && !isDown && <Clock className="w-3 h-3" />}
                <span>{card.trend.text}</span>
              </div>
            </div>

            {/* Bottom info: Value, Title, Subtext */}
            <div className="w-full">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102A56]">
                  {card.value}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#7186A5]/60 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xs font-semibold text-[#102A56] mt-1 truncate">
                {card.label}
              </h3>
              <p className="text-[11px] text-[#7186A5] mt-0.5 truncate leading-relaxed">
                {card.subtext}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
