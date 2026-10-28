"use client";

import { useEffect } from "react";
import { X, BedDouble, UserCheck, Info } from "lucide-react";
import { Room, Bed } from "@/types";

interface ViewBedsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  pgName?: string;
}

export default function ViewBedsModal({
  isOpen,
  onClose,
  room,
  pgName,
}: ViewBedsModalProps) {
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

  // If real beds array exists in room, use it; otherwise generate beds based on capacity
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A56]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#E1EAF4] shadow-2xl relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bed-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E1EAF4]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center text-[#0F8B83]">
              <BedDouble className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="bed-modal-title"
                  className="text-lg sm:text-xl font-bold text-[#102A56]"
                >
                  Room {room.roomNumber} — Beds & Capacity
                </h3>
                {room.floor !== undefined && room.floor !== null && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-[#F5F8FC] border border-[#E1EAF4] text-[#7186A5] font-medium">
                    Floor {room.floor}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7186A5] mt-0.5">
                {pgName ? `${pgName} • ` : ""}
                {capacity}-Sharing ({availableCount} of {capacity} beds available)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Room Snapshot Header Stats */}
        <div className="grid grid-cols-3 gap-3 my-4 p-3.5 rounded-2xl bg-[#F5F8FC] border border-[#E1EAF4]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7186A5] block">
              Bed Capacity
            </span>
            <span className="text-base font-bold text-[#102A56]">
              {capacity} {capacity === 1 ? "Bed" : "Beds"}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7186A5] block">
              Monthly Rent
            </span>
            <span className="text-base font-bold text-[#0F8B83]">
              {rent > 0 ? `₹${rent.toLocaleString()}/mo` : "Not specified"}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7186A5] block">
              Occupancy Status
            </span>
            <span
              className={`text-xs font-bold inline-flex items-center px-2 py-0.5 rounded-full mt-0.5 ${
                availableCount === 0
                  ? "bg-slate-100 text-slate-700"
                  : occupiedCount > 0
                  ? "bg-amber-50 text-amber-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {availableCount === 0
                ? "Fully Occupied"
                : occupiedCount > 0
                ? "Partially Occupied"
                : "All Vacant"}
            </span>
          </div>
        </div>

        {/* Beds List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 my-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#7186A5]">
            Configured Beds ({bedsList.length})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bedsList.map((bed, idx) => {
              const isOccupied = bed.isOccupied || bed.status === "OCCUPIED";
              return (
                <div
                  key={bed._id || idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    isOccupied
                      ? "border-amber-200 bg-amber-50/40"
                      : "border-[#E1EAF4] bg-white hover:border-[#0F8B83]/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isOccupied
                            ? "bg-amber-100 text-amber-700"
                            : "bg-[#E8F7F5] text-[#0F8B83]"
                        }`}
                      >
                        <BedDouble className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#102A56] block">
                          {bed.bedNumber || `Bed ${idx + 1}`}
                        </span>
                        <span className="text-[11px] text-[#7186A5]">
                          Slot #{idx + 1}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        isOccupied
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {isOccupied ? "Occupied" : "Vacant"}
                    </span>
                  </div>

                  {isOccupied && bed.tenantName ? (
                    <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center gap-1.5 text-xs text-amber-900 font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                      <span>Tenant: {bed.tenantName}</span>
                    </div>
                  ) : (
                    <div className="mt-2 pt-2 border-t border-[#E1EAF4] text-[11px] text-[#7186A5]">
                      Available for tenant allocation
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Backend API Status Banner */}
          <div className="mt-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex items-start gap-3">
            <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-xs text-sky-900 leading-relaxed">
              <strong className="font-semibold block mb-0.5">
                Bed Allocation API Notice
              </strong>
              Individual bed assignment and student tenant management backend APIs
              are pending backend implementation. Beds are displayed according to
              this room&apos;s verified {capacity}-bed capacity. No unverified mock
              assignments have been saved.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E1EAF4] mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
