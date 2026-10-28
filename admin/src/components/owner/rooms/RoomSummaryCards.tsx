"use client";

import { DoorClosed, BedDouble, Users, CheckCircle2 } from "lucide-react";

interface RoomSummaryCardsProps {
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
}

export default function RoomSummaryCards({
  totalRooms,
  totalBeds,
  occupiedBeds,
  availableBeds,
}: RoomSummaryCardsProps) {
  const cards = [
    {
      label: "Total Rooms",
      value: totalRooms,
      supportingText: "Configured rooms in PG",
      icon: DoorClosed,
      accentColor: "teal",
      bg: "bg-[#E8F7F5]",
      text: "text-[#0F8B83]",
      border: "border-[#0F8B83]/20",
    },
    {
      label: "Total Beds",
      value: totalBeds,
      supportingText: "Maximum student capacity",
      icon: BedDouble,
      accentColor: "blue",
      bg: "bg-sky-50",
      text: "text-sky-600",
      border: "border-sky-100",
    },
    {
      label: "Occupied Beds",
      value: occupiedBeds,
      supportingText: occupiedBeds > 0 ? "Currently checked-in" : "No active students",
      icon: Users,
      accentColor: "purple",
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      border: "border-indigo-100",
    },
    {
      label: "Available Beds",
      value: availableBeds,
      supportingText: availableBeds > 0 ? "Ready for occupancy" : "Full occupancy",
      icon: CheckCircle2,
      accentColor: "amber",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E1EAF4] shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#7186A5]">
                {c.label}
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.bg} ${c.text} border ${c.border}`}
              >
                <Icon className="w-4 h-4 stroke-[2]" />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#102A56] tracking-tight">
                {c.value}
              </p>
              <p className="text-[11px] text-[#7186A5] mt-1 font-medium">
                {c.supportingText}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
