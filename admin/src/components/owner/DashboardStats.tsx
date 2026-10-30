import { Building2, BedDouble, Users, UsersRound, CheckCircle2, UserCheck, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import StatCard from "./StatCard";

interface DashboardStatsProps {
  totalPgs: number;
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  totalTenants: number;
}

export default function DashboardStats({
  totalPgs,
  totalRooms,
  totalBeds,
  occupiedBeds,
  availableBeds,
  totalTenants,
}: DashboardStatsProps) {
  const occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return (
    <div className="space-y-3 sm:space-y-5">
      {/* =========================================================================
          MOBILE ONLY LAYOUT (md:hidden) — Branded Green Mobile Theme
         ========================================================================= */}
      <div className="md:hidden space-y-3">
        {/* 1. Mobile Total PGs Card (Forest/Teal Gradient Card with Mint Highlights) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#052E26] via-[#08756E] to-[#0B5A4B] p-4 text-white shadow-lg shadow-[#052E26]/20 border border-[#0F8B83]/30">
          {/* Subtle ambient decorative mint glows */}
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#34D399]/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-black/20 blur-xl pointer-events-none" />

          {/* Right Top Badge: Properties Active */}
          <div className="absolute top-3.5 right-3.5 z-20">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#34D399]/20 backdrop-blur-md border border-[#34D399]/40 text-[#34D399] text-[10px] font-bold shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
              <span>{totalPgs === 1 ? "Property Active" : "Properties Active"}</span>
            </span>
          </div>

          <div className="relative z-10 space-y-3">
            {/* Top row: Icon container + Header + Stat */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xs shrink-0">
                <Home className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0 flex-1 pr-24">
                <span className="text-[10px] font-extrabold tracking-widest text-[#A7F3D0] uppercase block">
                  TOTAL PROPERTIES
                </span>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <h2 className="text-3xl font-black text-white leading-none">
                    {totalPgs}
                  </h2>
                </div>
                <p className="text-xs text-white/80 mt-1 font-normal line-clamp-1">
                  {totalPgs > 0
                    ? `Managing ${totalRooms} rooms across your properties.`
                    : "No properties registered yet. Get started by adding your first PG."}
                </p>
              </div>
            </div>

            {/* Full-width white/mint button: "Manage Properties →" */}
            <div className="pt-1">
              <Link
                href="/owner/pgs"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white text-[#0B5A4B] hover:bg-[#E8F7F5] font-bold text-xs shadow-md shadow-[#052E26]/10 transition-all active:scale-98 min-h-[42px]"
              >
                <span>Manage Properties</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Mobile 2-Column Statistics Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Total Rooms with Mint Bed Icon */}
          <Link
            href="/owner/rooms"
            className="group relative overflow-hidden bg-white border border-[#E1EAF4] rounded-2xl p-3.5 shadow-xs transition-all active:scale-98 flex flex-col justify-between min-h-[115px]"
          >
            {/* Subtle mint corner decoration */}
            <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full bg-[#ECFDF5] opacity-70 pointer-events-none" />

            <div className="relative z-10">
              <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] mb-2.5">
                <BedDouble className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-bold text-[#7186A5] block">
                Total Rooms
              </span>
              <div className="text-2xl font-black text-[#102A56] tracking-tight mt-0.5 leading-none">
                {totalRooms}
              </div>
            </div>

            <div className="relative z-10 mt-2">
              <span className="text-[11px] text-[#7186A5] font-medium block">
                {totalPgs} {totalPgs === 1 ? "PG" : "PGs"}
              </span>
            </div>
          </Link>

          {/* Card 2: Occupied Beds with Pale Coral / Orange Users Icon */}
          <Link
            href="/owner/rooms"
            className="group relative overflow-hidden bg-white border border-[#E1EAF4] rounded-2xl p-3.5 shadow-xs transition-all active:scale-98 flex flex-col justify-between min-h-[115px]"
          >
            {/* Subtle pale coral corner decoration */}
            <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full bg-[#FFF1EE] opacity-70 pointer-events-none" />

            <div className="relative z-10">
              <div className="w-9 h-9 rounded-xl bg-[#FFF1EE] border border-[#FFD2C9] flex items-center justify-center text-[#F97316] mb-2.5">
                <Users className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-bold text-[#7186A5] block">
                Occupied Beds
              </span>
              <div className="text-2xl font-black text-[#102A56] tracking-tight mt-0.5 leading-none">
                {occupiedBeds}
              </div>
            </div>

            <div className="relative z-10 mt-2">
              <span className="text-[11px] text-[#7186A5] font-medium block">
                {occupancyPercentage}% capacity
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          DESKTOP ONLY LAYOUT (hidden md:block) — Branded Green Desktop UI
         ========================================================================= */}
      <div className="hidden md:block space-y-5">
        {/* 1. Desktop Prominent "Total PGs" Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#052E26] via-[#08756E] to-[#0B5A4B] p-6 lg:p-7 text-white shadow-xl shadow-[#052E26]/20 border border-[#0F8B83]/30">
          {/* Subtle ambient decorative mint glows */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#34D399]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-black/20 blur-xl pointer-events-none" />

          {/* Right Top Badge: Properties Active */}
          <div className="absolute top-5 right-6 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34D399]/20 backdrop-blur-md border border-[#34D399]/40 text-[#34D399] text-xs font-bold shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
              <span>{totalPgs === 1 ? "Property Active" : "Properties Active"}</span>
            </span>
          </div>

          <div className="relative z-10 flex flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Home className="w-7 h-7 stroke-[2]" />
              </div>
              <div className="min-w-0 pr-36">
                <span className="text-xs font-bold tracking-widest text-[#A7F3D0] uppercase block">
                  TOTAL PROPERTIES
                </span>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <h2 className="text-4xl font-black tracking-tight text-white leading-none">
                    {totalPgs}
                  </h2>
                </div>
                <p className="text-xs text-white/80 mt-1 font-normal line-clamp-none max-w-md">
                  {totalPgs > 0
                    ? `Managing ${totalRooms} rooms across your properties.`
                    : "No properties registered yet. Get started by adding your first PG."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-auto justify-end">
              <Link
                href="/owner/pgs"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-[#0B5A4B] hover:bg-[#E8F7F5] font-bold text-sm shadow-md shadow-[#052E26]/10 transition-all active:scale-95 min-h-[44px] w-auto"
              >
                <span>Manage Properties</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="relative z-10 mt-3.5 pt-3.5 border-t border-white/15 grid grid-cols-2 gap-2 text-white">
            <div className="pr-2 border-r border-white/15">
              <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider block">
                Total Inventory
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg font-black text-white">{totalRooms}</span>
                <span className="text-[11px] text-white/85">Rooms</span>
                <span className="text-white/40">·</span>
                <span className="text-lg font-black text-white">{totalBeds}</span>
                <span className="text-[11px] text-white/85">Beds</span>
              </div>
            </div>

            <div className="pl-2">
              <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider block">
                Occupancy Status
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg font-black text-[#34D399]">{occupancyPercentage}%</span>
                <span className="text-[11px] text-white/85">Occupied</span>
                <span className="text-[10px] text-white/70">({availableBeds} free)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Desktop 4-Column Metric Grid */}
        <div className="grid grid-cols-4 gap-4 md:gap-5">
          <StatCard
            label="Total Rooms"
            value={totalRooms}
            supportingText={totalPgs > 0 ? `${totalPgs} ${totalPgs === 1 ? "PG" : "PGs"}` : "All properties"}
            icon={BedDouble}
            accentColor="teal"
            href="/owner/rooms"
          />
          <StatCard
            label="Occupied Beds"
            value={occupiedBeds}
            supportingText={`${occupancyPercentage}% capacity`}
            icon={UsersRound}
            accentColor="amber"
            href="/owner/rooms"
          />
          <StatCard
            label="Available Beds"
            value={availableBeds}
            supportingText="Ready for booking"
            icon={CheckCircle2}
            accentColor="teal"
            href="/owner/rooms"
          />
          <StatCard
            label="Total Tenants"
            value={totalTenants}
            supportingText="Active residents"
            icon={UserCheck}
            accentColor="purple"
            href="/owner/students"
          />
        </div>
      </div>
    </div>
  );
}
