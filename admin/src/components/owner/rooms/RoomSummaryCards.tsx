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
      supportingText: "Configured rooms",
      icon: DoorClosed,
      accentColor: "teal",
      bg: "bg-[#E8F7F5]",
      text: "text-[#0F8B83]",
      border: "border-[#0F8B83]/20",
    },
    {
      label: "Total Beds",
      value: totalBeds,
      supportingText: "Full capacity",
      icon: BedDouble,
      accentColor: "blue",
      bg: "bg-sky-50",
      text: "text-sky-600",
      border: "border-sky-100",
    },
    {
      label: "Occupied Beds",
      value: occupiedBeds,
      supportingText: occupiedBeds > 0 ? `${Math.round((occupiedBeds / (totalBeds || 1)) * 100)}% occupied` : "0% occupied",
      icon: Users,
      accentColor: "amber",
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-100",
    },
    {
      label: "Available Beds",
      value: availableBeds,
      supportingText: "Ready for tenants",
      icon: CheckCircle2,
      accentColor: "teal",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#E1EAF4] shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
              <span className="text-[11px] sm:text-xs font-semibold text-[#7186A5] truncate">
                {c.label}
              </span>
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${c.bg} ${c.text} border ${c.border}`}
              >
                <Icon className="w-4 h-4 stroke-[2]" />
              </div>
            </div>
            <div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-[#102A56] tracking-tight">
                {c.value}
              </p>
              <p className="text-[10px] sm:text-[11px] text-[#7186A5] mt-0.5 font-medium truncate">
                {c.supportingText}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
