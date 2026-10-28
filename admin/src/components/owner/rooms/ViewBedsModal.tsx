"use client";

import { useEffect, useState } from "react";
import { 
  X, 
  BedDouble, 
  UserCheck, 
  Info, 
  DoorClosed, 
  FileText,
  Edit3
} from "lucide-react";
import { Room, Bed } from "@/types";

interface ViewBedsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  pgName?: string;
  onEditRoom?: (room: Room) => void;
}

export default function ViewBedsModal({
  isOpen,
  onClose,
  room,
  pgName,
  onEditRoom,
}: ViewBedsModalProps) {
  const [activeTab, setActiveTab] = useState<"beds" | "details">("beds");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !room) return null;

  const capacity =
    room.bedCapacity ||
    room.sharing ||
    room.totalBeds ||
    (room.beds ? room.beds.length : 1);

  // If real beds array exists in room, use it; otherwise generate slots based on capacity
  const bedsList: Bed[] =
    room.beds && room.beds.length > 0
      ? room.beds
      : Array.from({ length: capacity }, (_, i) => ({
          _id: `bed-${i + 1}`,
          bedNumber: `Bed ${i + 1}`,
          isOccupied: false,
          status: "VACANT",
        }));

  const occupiedCount = bedsList.filter(
    (b) => b.isOccupied || b.status === "OCCUPIED"
  ).length;
  const availableCount = Math.max(0, capacity - occupiedCount);
  const rent = room.monthlyRent || room.rentPerBed || 0;

  let occupancyStatusLabel = "All Vacant";
  let occupancyBadgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";

  if (availableCount === 0 && capacity > 0) {
    occupancyStatusLabel = "Fully Occupied";
    occupancyBadgeStyle = "bg-rose-50 text-rose-700 border-rose-200";
  } else if (occupiedCount > 0) {
    occupancyStatusLabel = "Partially Occupied";
    occupancyBadgeStyle = "bg-amber-50 text-amber-800 border-amber-200";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#102A56]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl p-4 sm:p-7 border border-[#E1EAF4] shadow-2xl relative max-h-[92vh] flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bed-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-[#E1EAF4]">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center text-[#0F8B83] shrink-0">
              <DoorClosed className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3
                  id="bed-modal-title"
                  className="text-base sm:text-lg font-bold text-[#102A56] truncate"
                >
                  Room {room.roomNumber}
                </h3>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${occupancyBadgeStyle}`}
                >
                  {occupancyStatusLabel}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#7186A5] mt-0.5 truncate">
                {pgName ? `${pgName} • ` : ""}
                {room.floor !== undefined && room.floor !== null ? `Floor ${room.floor} • ` : ""}
                {capacity} Bed Sharing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: [Bed Management (Screen 8) | Room Details (Screen 7)] */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F5F8FC] border border-[#E1EAF4] rounded-2xl my-3">
          <button
            onClick={() => setActiveTab("beds")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all min-h-[38px] flex items-center justify-center gap-1.5 ${
              activeTab === "beds"
                ? "bg-white text-[#0F8B83] shadow-xs"
                : "text-[#7186A5] hover:text-[#102A56]"
            }`}
          >
            <BedDouble className="w-4 h-4" />
            <span>Bed Management ({bedsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all min-h-[38px] flex items-center justify-center gap-1.5 ${
              activeTab === "details"
                ? "bg-white text-[#0F8B83] shadow-xs"
                : "text-[#7186A5] hover:text-[#102A56]"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Room Details</span>
          </button>
        </div>

        {/* Compact 3-Column Summary Strip */}
        <div className="grid grid-cols-3 gap-2 p-2.5 sm:p-3 rounded-2xl bg-[#F5F8FC] border border-[#E1EAF4] text-center mb-3 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#7186A5] block">Capacity</span>
            <span className="text-sm sm:text-base font-bold text-[#102A56]">{capacity} Beds</span>
          </div>
          <div className="border-x border-[#E1EAF4]">
            <span className="text-[10px] uppercase font-bold text-[#7186A5] block">Available</span>
            <span className="text-sm sm:text-base font-bold text-emerald-600">{availableCount} Beds</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#7186A5] block">Monthly Rent</span>
            <span className="text-sm sm:text-base font-bold text-[#0F8B83]">
              {rent > 0 ? `₹${rent.toLocaleString()}` : "Not set"}
            </span>
          </div>
        </div>

        {/* Tab 1: Bed Management View (Screen 8) */}
        {activeTab === "beds" && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7186A5]">
                Individual Bed Allocation
              </span>
              <span className="text-[11px] text-[#7186A5]">
                {occupiedCount} occupied · {availableCount} available
              </span>
            </div>

            {/* Individual Bed Cards (Screen 8 Layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {bedsList.map((bed, idx) => {
                const isOccupied = bed.isOccupied || bed.status === "OCCUPIED";
                const isReserved = bed.status === "RESERVED";
                const isMaintenance = bed.status === "MAINTENANCE";

                let statusText = "Available";
                let statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
                let iconBg = "bg-[#E8F7F5] text-[#0F8B83]";

                if (isOccupied) {
                  statusText = "Occupied";
                  statusBadge = "bg-rose-50 text-rose-700 border-rose-200";
                  iconBg = "bg-rose-100 text-rose-700";
                } else if (isReserved) {
                  statusText = "Reserved";
                  statusBadge = "bg-amber-50 text-amber-800 border-amber-200";
                  iconBg = "bg-amber-100 text-amber-700";
                } else if (isMaintenance) {
                  statusText = "Maintenance";
                  statusBadge = "bg-slate-100 text-slate-700 border-slate-200";
                  iconBg = "bg-slate-100 text-slate-700";
                }

                return (
                  <div
                    key={bed._id || idx}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isOccupied
                        ? "border-rose-200 bg-rose-50/20"
                        : "border-[#E1EAF4] bg-white hover:border-[#0F8B83]/30"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
                          >
                            <BedDouble className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-bold text-[#102A56] block">
                              {bed.bedNumber || `Bed ${idx + 1}`}
                            </span>
                            <span className="text-[10px] text-[#7186A5]">
                              Slot #{idx + 1}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${statusBadge}`}
                        >
                          {statusText}
                        </span>
                      </div>

                      {/* Tenant Information or Availability note */}
                      {isOccupied && bed.tenantName ? (
                        <div className="mt-2 pt-2 border-t border-rose-200/60 flex items-center gap-1.5 text-xs text-[#102A56] font-medium">
                          <UserCheck className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span className="truncate">Tenant: {bed.tenantName}</span>
                        </div>
                      ) : (
                        <div className="mt-2 pt-2 border-t border-[#E1EAF4] flex items-center justify-between text-[11px] text-[#7186A5]">
                          <span>Ready for student allocation</span>
                          {rent > 0 && <span className="font-semibold text-[#0F8B83]">₹{rent}/mo</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Backend API Notice */}
            <div className="mt-3 p-3 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex items-start gap-2.5 text-xs text-sky-900">
              <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                Bed allocations reflect this room&apos;s verified capacity of {capacity} bed(s).
                Student check-ins and vacancy status synchronize in real time with your room settings.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Room Details View (Screen 7) */}
        {activeTab === "details" && (
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 animate-in fade-in duration-150 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4]">
                <span className="text-[10px] uppercase font-bold text-[#7186A5] block">Room Number</span>
                <span className="text-sm font-bold text-[#102A56] mt-0.5 block">{room.roomNumber}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4]">
                <span className="text-[10px] uppercase font-bold text-[#7186A5] block">Floor</span>
                <span className="text-sm font-bold text-[#102A56] mt-0.5 block">
                  {room.floor !== undefined && room.floor !== null ? `Floor ${room.floor}` : "Ground Floor"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4]">
                <span className="text-[10px] uppercase font-bold text-[#7186A5] block">Room Type</span>
                <span className="text-sm font-bold text-[#102A56] mt-0.5 block capitalize">
                  {room.roomType ? room.roomType.replace("_", " ").toLowerCase() : "Standard Sharing"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4]">
                <span className="text-[10px] uppercase font-bold text-[#7186A5] block">Bathroom Type</span>
                <span className="text-sm font-bold text-[#102A56] mt-0.5 block capitalize">
                  {room.bathroomType ? room.bathroomType.toLowerCase() : "Attached"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4]">
                <span className="text-[10px] uppercase font-bold text-[#7186A5] block">Furnishing</span>
                <span className="text-sm font-bold text-[#102A56] mt-0.5 block capitalize">
                  {room.furnishing ? room.furnishing.replace("_", " ").toLowerCase() : "Furnished"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4]">
                <span className="text-[10px] uppercase font-bold text-[#7186A5] block">Security Deposit</span>
                <span className="text-sm font-bold text-[#102A56] mt-0.5 block">
                  {room.securityDeposit ? `₹${room.securityDeposit.toLocaleString()}` : "Not specified"}
                </span>
              </div>
            </div>

            {room.description && (
              <div className="p-3.5 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4]">
                <span className="text-[10px] uppercase font-bold text-[#7186A5] block mb-1">
                  Description / Features
                </span>
                <p className="text-slate-700 leading-relaxed italic">
                  &quot;{room.description}&quot;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-[#E1EAF4] mt-2">
          {onEditRoom && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditRoom(room);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#0F8B83] bg-[#E8F7F5] hover:bg-[#0F8B83] hover:text-white transition-all min-h-[40px] flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Room</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors min-h-[40px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
