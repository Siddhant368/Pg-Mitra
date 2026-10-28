import { Building2, BedDouble, UsersRound, CheckCircle2, UserCheck, ArrowRight } from "lucide-react";
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
    <div className="space-y-3.5 sm:space-y-5">
      {/* 1. Prominent "Total PGs" Card (Visual Hero on Mobile) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0F8B83] via-[#0B756E] to-[#052E26] p-4.5 sm:p-6 lg:p-7 text-white shadow-md shadow-[#0F8B83]/20 border border-[#0F8B83]/30">
        {/* Subtle decorative circles */}
        <div className="absolute -top-10 -right-10 w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-black/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Building2 className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] sm:text-xs font-bold tracking-wider text-white/85 uppercase block">
                Total PGs
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-none">
                  {totalPgs}
                </h2>
                <span className="text-xs sm:text-sm font-medium text-white/80">
                  {totalPgs === 1 ? "Property Active" : "Properties Active"}
                </span>
              </div>
              <p className="text-xs text-white/75 mt-1 font-normal line-clamp-1 sm:line-clamp-none max-w-md">
                {totalPgs > 0
                  ? `Managing ${totalRooms} rooms across your properties.`
                  : "No properties registered yet. Get started by adding your first PG."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/15 self-stretch sm:self-auto justify-end">
            <Link
              href="/owner/pgs"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-[#0B756E] hover:bg-[#E8F7F5] font-bold text-xs sm:text-sm shadow-xs transition-all min-h-[44px] w-full sm:w-auto"
            >
              <span>Manage Properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Compact 2-Column Metric Grid on Mobile, 4-Column on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
        {/* Metric 1 — Total Rooms */}
        <StatCard
          label="Total Rooms"
          value={totalRooms}
          supportingText={totalPgs > 0 ? `${totalPgs} ${totalPgs === 1 ? "PG" : "PGs"}` : "All properties"}
          icon={BedDouble}
          accentColor="teal"
          href="/owner/rooms"
        />

        {/* Metric 2 — Occupied Beds */}
        <StatCard
          label="Occupied Beds"
          value={occupiedBeds}
          supportingText={`${occupancyPercentage}% capacity`}
          icon={UsersRound}
          accentColor="amber"
          href="/owner/rooms"
        />

        {/* Metric 3 — Available Beds */}
        <StatCard
          label="Available Beds"
          value={availableBeds}
          supportingText="Ready for booking"
          icon={CheckCircle2}
          accentColor="teal"
          href="/owner/rooms"
        />

        {/* Metric 4 — Total Tenants */}
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
  );
}
