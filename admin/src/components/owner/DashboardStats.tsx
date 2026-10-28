import { Building2, BedDouble, UsersRound, IndianRupee } from "lucide-react";
import StatCard from "./StatCard";

interface DashboardStatsProps {
  totalPgs: number;
  totalRooms: number;
  activeStudents: number;
  pendingPayments: number;
}

export default function DashboardStats({
  totalPgs,
  totalRooms,
  activeStudents,
  pendingPayments,
}: DashboardStatsProps) {
  // Format currency with Indian Numbering System (e.g. ₹0, ₹15,000)
  const formattedPendingAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(pendingPayments);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Card 1 — Total PGs */}
      <StatCard
        label="Total PGs"
        value={totalPgs}
        supportingText="Properties you manage"
        icon={Building2}
        accentColor="teal"
        href="/owner/pgs"
      />

      {/* Card 2 — Total Rooms */}
      <StatCard
        label="Total Rooms"
        value={totalRooms}
        supportingText="Across all properties"
        icon={BedDouble}
        accentColor="blue"
        href="/owner/rooms"
      />

      {/* Card 3 — Active Students */}
      <StatCard
        label="Active Students"
        value={activeStudents}
        supportingText="Currently staying"
        icon={UsersRound}
        accentColor="purple"
        href="/owner/students"
      />

      {/* Card 4 — Pending Payments */}
      <StatCard
        label="Pending Payments"
        value={formattedPendingAmount}
        supportingText="Awaiting collection"
        icon={IndianRupee}
        accentColor="amber"
        href="/owner/payments"
      />
    </div>
  );
}
