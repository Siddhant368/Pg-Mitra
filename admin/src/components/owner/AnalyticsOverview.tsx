"use client";

import { useState, useMemo } from "react";
import { 
  Building2, 
  BedDouble, 
  UsersRound, 
  PieChart, 
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Percent
} from "lucide-react";
import Link from "next/link";

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
}

interface AnalyticsOverviewProps {
  pgs: PgItem[];
  totalRooms: number;
  totalBeds: number;
  totalTenants: number;
  occupiedBeds: number;
  availableBeds: number;
}

export default function AnalyticsOverview({
  pgs,
  totalRooms,
  totalBeds,
  totalTenants,
  occupiedBeds,
  availableBeds,
}: AnalyticsOverviewProps) {
  const [selectedRange, setSelectedRange] = useState<"month" | "quarter" | "all">("month");

  // Calculate actual PG Type distribution
  const typeDistribution = useMemo(() => {
    if (pgs.length === 0) return [];

    const counts: Record<string, number> = {};
    pgs.forEach((pg) => {
      const type = (pg.type || "OTHER").toUpperCase();
      counts[type] = (counts[type] || 0) + 1;
    });

    const colors: Record<string, { bg: string; fill: string; text: string; badge: string }> = {
      BOYS: { bg: "bg-sky-500", fill: "#0ea5e9", text: "text-sky-700", badge: "bg-sky-50 border-sky-200" },
      GIRLS: { bg: "bg-rose-500", fill: "#f43f5e", text: "text-rose-700", badge: "bg-rose-50 border-rose-200" },
      COED: { bg: "bg-emerald-500", fill: "#10b981", text: "text-emerald-700", badge: "bg-emerald-50 border-emerald-200" },
      COLIVING: { bg: "bg-indigo-500", fill: "#6366f1", text: "text-indigo-700", badge: "bg-indigo-50 border-indigo-200" },
      OTHER: { bg: "bg-slate-400", fill: "#94a3b8", text: "text-slate-700", badge: "bg-slate-50 border-slate-200" },
    };

    return Object.entries(counts).map(([type, count]) => {
      const percentage = Math.round((count / pgs.length) * 100);
      const style = colors[type] || colors.OTHER;
      return {
        type,
        count,
        percentage,
        ...style,
      };
    });
  }, [pgs]);

  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Header Toolbar with Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#E1EAF4] shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#102A56]">
            Operational Overview & Analytics
          </h2>
          <p className="text-xs text-[#7186A5] mt-0.5">
            Key capacity metrics across your registered properties.
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1 bg-[#F5F8FC] p-1 rounded-xl border border-[#E1EAF4] self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5 text-[#7186A5] ml-2 mr-1 shrink-0" />
          <button
            onClick={() => setSelectedRange("month")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              selectedRange === "month"
                ? "bg-white text-[#0F8B83] shadow-xs"
                : "text-[#7186A5] hover:text-[#102A56]"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setSelectedRange("quarter")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              selectedRange === "quarter"
                ? "bg-white text-[#0F8B83] shadow-xs"
                : "text-[#7186A5] hover:text-[#102A56]"
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setSelectedRange("all")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              selectedRange === "all"
                ? "bg-white text-[#0F8B83] shadow-xs"
                : "text-[#7186A5] hover:text-[#102A56]"
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* 2. Compact 2-Column Metrics (collapses to 1-col on <340px) */}
      <div className="grid grid-cols-1 min-[340px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total PGs */}
        <div className="bg-white p-4 rounded-2xl border border-[#E1EAF4] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#7186A5]">Total Properties</span>
            <div className="w-8 h-8 rounded-lg bg-[#E8F7F5] text-[#0F8B83] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#102A56]">{pgs.length}</h3>
            <p className="text-[11px] text-[#7186A5] mt-0.5">Active listings</p>
          </div>
        </div>

        {/* Metric 2: Total Rooms */}
        <div className="bg-white p-4 rounded-2xl border border-[#E1EAF4] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#7186A5]">Total Rooms</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#102A56]">{totalRooms}</h3>
            <p className="text-[11px] text-[#7186A5] mt-0.5">
              Avg {pgs.length > 0 ? (totalRooms / pgs.length).toFixed(1) : 0} / PG
            </p>
          </div>
        </div>

        {/* Metric 3: Total Tenants */}
        <div className="bg-white p-4 rounded-2xl border border-[#E1EAF4] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#7186A5]">Total Tenants</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <UsersRound className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#102A56]">{totalTenants}</h3>
            <p className="text-[11px] text-[#7186A5] mt-0.5">Occupying beds</p>
          </div>
        </div>

        {/* Metric 4: Occupancy Rate */}
        <div className="bg-white p-4 rounded-2xl border border-[#E1EAF4] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#7186A5]">Occupancy Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-2xl font-black text-[#102A56]">{occupancyRate}%</h3>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                Live
              </span>
            </div>
            <p className="text-[11px] text-[#7186A5] mt-0.5">
              {occupiedBeds} of {totalBeds} beds
            </p>
          </div>
        </div>
      </div>

      {/* 3. Stacked Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Card A: PG Type Distribution (Real Data) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#E1EAF4] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E1EAF4]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E8F7F5] text-[#0F8B83] flex items-center justify-center">
                  <PieChart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#102A56]">Property Type Distribution</h3>
                  <p className="text-[11px] text-[#7186A5]">Breakdown of your PG portfolio</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#0F8B83]">
                {pgs.length} {pgs.length === 1 ? "Property" : "Properties"}
              </span>
            </div>

            {typeDistribution.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#7186A5]">
                No properties registered yet.
              </div>
            ) : (
              <div className="space-y-3.5">
                {typeDistribution.map((item) => (
                  <div key={item.type} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#102A56] capitalize">
                        {item.type.toLowerCase()} PG
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#7186A5] font-medium">
                          {item.count} {item.count === 1 ? "unit" : "units"}
                        </span>
                        <span className="font-bold text-[#102A56]">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-[#F5F8FC] border border-[#E1EAF4] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.bg} transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#E1EAF4] flex items-center justify-between text-xs">
            <span className="text-[#7186A5]">Categorized by tenant profile</span>
            <Link
              href="/owner/pgs"
              className="text-[#0F8B83] font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>View PGs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card B: Bed Capacity & Occupancy Status (Real Data) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#E1EAF4] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E1EAF4]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E8F7F5] text-[#0F8B83] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#102A56]">Bed Capacity & Occupancy</h3>
                  <p className="text-[11px] text-[#7186A5]">Current availability status</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#0F8B83]">
                {totalBeds} Total Beds
              </span>
            </div>

            {totalBeds === 0 ? (
              <div className="py-8 text-center text-xs text-[#7186A5]">
                No beds configured yet. Add rooms to view bed occupancy metrics.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Visual Dual-Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-700">Available: {availableBeds} beds</span>
                    <span className="font-semibold text-amber-700">Occupied: {occupiedBeds} beds</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-emerald-500 overflow-hidden flex">
                    <div
                      className="bg-amber-500 h-full transition-all duration-500"
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </div>

                {/* Status Tiles */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider">
                      Available Beds
                    </span>
                    <span className="text-xl font-bold text-emerald-800">
                      {availableBeds}
                    </span>
                    <p className="text-[10px] text-emerald-700 mt-0.5">
                      {totalBeds > 0 ? Math.round((availableBeds / totalBeds) * 100) : 0}% of capacity
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-[10px] uppercase font-bold text-amber-700 block tracking-wider">
                      Occupied Beds
                    </span>
                    <span className="text-xl font-bold text-amber-800">
                      {occupiedBeds}
                    </span>
                    <p className="text-[10px] text-amber-700 mt-0.5">
                      {occupancyRate}% of capacity
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#E1EAF4] flex items-center justify-between text-xs">
            <span className="text-[#7186A5]">Real-time room & bed sync</span>
            <Link
              href="/owner/rooms"
              className="text-[#0F8B83] font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>Manage Rooms</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
