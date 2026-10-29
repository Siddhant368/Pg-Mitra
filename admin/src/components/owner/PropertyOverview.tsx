"use client";

import Link from "next/link";
import { 
  Building2, 
  Plus, 
  MapPin, 
  ArrowRight, 
  BedDouble, 
  Eye, 
  Users, 
  Sparkles
} from "lucide-react";

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

interface PropertyOverviewProps {
  pgs: PgItem[];
}

const typeBadgeStyles: Record<string, { bg: string; text: string; border: string; label: string }> = {
  BOYS: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    label: "Boys PG",
  },
  GIRLS: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    label: "Girls PG",
  },
  COLIVING: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    label: "Co-Living",
  },
};

export default function PropertyOverview({ pgs }: PropertyOverviewProps) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E1EAF4] shadow-xs p-4 sm:p-6 lg:p-7 transition-all">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 mb-5 pb-4 border-b border-[#E1EAF4]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#0F8B83] to-[#08756E] text-white flex items-center justify-center shadow-xs shrink-0">
            <Building2 className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-[#102A56] tracking-tight">
                Your Managed Properties
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F7F5] text-[#0F8B83] border border-[#0F8B83]/20">
                {pgs.length}
              </span>
            </div>
            <p className="text-xs text-[#7186A5] mt-0.5 font-medium">
              Real-time inventory and room configuration overview.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-between sm:justify-end">
          <Link
            href="/owner/pgs"
            className="text-xs font-bold text-[#0F8B83] hover:text-[#08756E] inline-flex items-center gap-1 hover:underline min-h-[40px] px-2"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/owner/pgs/add"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F5CA38] via-[#FFDF68] via-[#FFD700] via-[#F2BA1D] to-[#E2A612] text-[#052E26] hover:brightness-105 text-xs font-extrabold shadow-xs transition-all active:scale-95 min-h-[40px]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add PG</span>
          </Link>
        </div>
      </div>

      {/* Grid of properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {pgs.slice(0, 3).map((pg) => {
          const pgId = pg._id || pg.id;
          const totalRooms = Number(pg.totalRooms) || 0;
          const totalBeds = Number(pg.totalBeds) || 0;
          const occupiedBeds = Number(pg.occupiedBeds) || 0;
          const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
          const typeBadge = (pg.type && typeBadgeStyles[pg.type]) || {
            bg: "bg-[#E8F7F5]",
            text: "text-[#0F8B83]",
            border: "border-[#0F8B83]/20",
            label: pg.type || "Property",
          };

          const initials = pg.name
            ? pg.name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0].toUpperCase())
                .join("")
            : "PG";

          return (
            <div
              key={pgId}
              className="group relative bg-[#FAFCFE] hover:bg-white rounded-2xl border border-[#E1EAF4] hover:border-[#0F8B83]/40 p-4 sm:p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle top hover gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0F8B83] via-[#34D399] to-[#08756E] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Header Row: Initials Badge, Name, Location & Type Pill */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0F8B83] via-[#08756E] to-[#052E26] text-white font-black text-xs sm:text-sm tracking-wide flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-sm sm:text-base text-[#102A56] group-hover:text-[#0F8B83] transition-colors truncate leading-tight">
                        {pg.name}
                      </h3>
                      <p className="text-xs text-[#7186A5] flex items-center gap-1 mt-0.5 font-medium truncate">
                        <MapPin className="w-3 h-3 text-[#0F8B83] shrink-0" />
                        <span>
                          {pg.city
                            ? `${pg.city}${pg.state ? `, ${pg.state}` : ""}`
                            : pg.address || "Location registered"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border shrink-0 ${typeBadge.bg} ${typeBadge.text} ${typeBadge.border}`}
                  >
                    {typeBadge.label}
                  </span>
                </div>

                {/* Key Metrics Chips */}
                <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-white border border-[#E1EAF4] shadow-2xs">
                  <div className="text-center">
                    <span className="text-[10px] font-semibold text-[#7186A5] uppercase tracking-wider block">
                      Rooms
                    </span>
                    <span className="text-sm font-black text-[#102A56] mt-0.5 block">
                      {totalRooms}
                    </span>
                  </div>
                  <div className="text-center border-x border-[#E1EAF4]">
                    <span className="text-[10px] font-semibold text-[#7186A5] uppercase tracking-wider block">
                      Beds
                    </span>
                    <span className="text-sm font-black text-[#102A56] mt-0.5 block">
                      {totalBeds}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-semibold text-[#7186A5] uppercase tracking-wider block">
                      Rent
                    </span>
                    <span className="text-xs font-bold text-[#0F8B83] mt-1 block truncate">
                      {pg.rentRange ? `₹${pg.rentRange}` : "Standard"}
                    </span>
                  </div>
                </div>

                {/* Occupancy Micro Progress Bar */}
                {totalBeds > 0 ? (
                  <div className="space-y-1 my-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#7186A5] font-semibold flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#0F8B83]" />
                        <span>Occupancy</span>
                      </span>
                      <span className="font-extrabold text-[#102A56]">
                        {occupancyRate}%{" "}
                        <span className="text-[#7186A5] font-normal">
                          ({occupiedBeds}/{totalBeds} beds)
                        </span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E1EAF4] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0F8B83] to-[#34D399] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, occupancyRate))}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="py-2 text-[11px] text-[#7186A5] font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Ready for rooms and bed setup</span>
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-[#E1EAF4] flex items-center gap-2 mt-2">
                <Link
                  href={`/owner/rooms?pgId=${pgId}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#E8F7F5] hover:bg-[#0F8B83] text-[#0F8B83] hover:text-white font-bold text-xs transition-all duration-200 min-h-[38px] shadow-2xs"
                >
                  <BedDouble className="w-3.5 h-3.5" />
                  <span>Rooms ({totalRooms})</span>
                </Link>

                <Link
                  href={`/owner/pgs/${pgId}`}
                  className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-[#E1EAF4] bg-white hover:bg-[#F5F8FC] text-[#102A56] font-semibold text-xs transition-all min-h-[38px]"
                >
                  <Eye className="w-3.5 h-3.5 text-[#7186A5]" />
                  <span>Details</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
