"use client";

import React, { useState } from "react";
import { X, BedDouble, CheckCircle2, Building2, Sparkles } from "lucide-react";
import { Student } from "@/types/student";

interface AssignRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onTransferRoom: (
    studentId: string,
    pgId: string,
    pgName: string,
    roomNumber: string,
    bedNumber: string,
    newRent?: number
  ) => void;
  availablePgs?: { id: string; name: string }[];
}

const DEFAULT_PGS = [
  { id: "pg-01", name: "Green Valley PG" },
  { id: "pg-02", name: "Zenith Girls PG" },
  { id: "pg-03", name: "Sunrise Luxury PG" },
  { id: "pg-04", name: "St. Jude Men's Hostel" },
];

export default function AssignRoomModal({
  isOpen,
  onClose,
  student,
  onTransferRoom,
  availablePgs = DEFAULT_PGS,
}: AssignRoomModalProps) {
  if (!isOpen || !student) return null;

  const [selectedPg, setSelectedPg] = useState(
    availablePgs.find((p) => p.name === student.accommodation.pgName) || availablePgs[0]
  );
  const [roomNumber, setRoomNumber] = useState(student.accommodation.roomNumber);
  const [bedNumber, setBedNumber] = useState(student.accommodation.bedNumber);
  const [newRent, setNewRent] = useState(student.accommodation.monthlyRent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim() || !bedNumber.trim()) return;

    onTransferRoom(
      student.id,
      selectedPg.id,
      selectedPg.name,
      roomNumber.trim(),
      bedNumber.trim(),
      newRent
    );
    onClose();
  };

  const bedOptions = ["Bed A", "Bed B", "Bed C", "Bed D"];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-[#102A56]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E1EAF4] overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-white to-[#F5F8FC] p-5 border-b border-[#E1EAF4] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center font-bold shadow-xs shrink-0">
              <BedDouble className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-black text-[#102A56] truncate">
                Reassign / Transfer Room
              </h2>
              <p className="text-xs font-semibold text-[#7186A5] truncate">
                {student.name} • <span className="font-mono">{student.studentId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Allocation Pill */}
        <div className="p-4 bg-[#F5F8FC] border-b border-[#E1EAF4] text-xs shrink-0 flex items-center justify-between">
          <div>
            <span className="text-[#7186A5] font-semibold text-[11px] uppercase">Currently Occupying:</span>
            <p className="font-extrabold text-[#102A56] mt-0.5 truncate">
              {student.accommodation.pgName}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-white border border-[#E1EAF4] text-xs font-black text-[#0F8B83]">
            Room {student.accommodation.roomNumber} ({student.accommodation.bedNumber})
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#102A56]">
              Target PG / Hostel Property
            </label>
            <select
              value={selectedPg.name}
              onChange={(e) => {
                const target = availablePgs.find((p) => p.name === e.target.value);
                if (target) setSelectedPg(target);
              }}
              className="w-full mt-1.5 p-2.5 rounded-xl border border-[#E1EAF4] bg-[#F5F8FC]/50 text-xs text-[#102A56] focus:border-[#0F8B83] focus:bg-white font-bold transition-all cursor-pointer"
            >
              {availablePgs.map((pg) => (
                <option key={pg.id} value={pg.name}>
                  {pg.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#102A56]">Target Room Number</label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="e.g. 204 or 301"
              className="w-full mt-1.5 p-2.5 rounded-xl border border-[#E1EAF4] bg-[#F5F8FC]/50 text-xs text-[#102A56] font-bold focus:border-[#0F8B83] focus:bg-white transition-all"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#102A56]">Target Bed Allocation</label>
            <div className="grid grid-cols-4 gap-2 mt-1.5">
              {bedOptions.map((bed) => {
                const isSelected = bedNumber === bed;
                return (
                  <button
                    key={bed}
                    type="button"
                    onClick={() => setBedNumber(bed)}
                    className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                      isSelected
                        ? "bg-[#0F8B83] text-white border-[#0F8B83] shadow-xs"
                        : "bg-[#F5F8FC]/50 text-[#7186A5] border-[#E1EAF4] hover:bg-white hover:text-[#102A56]"
                    }`}
                  >
                    {bed}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#102A56]">
              Updated Monthly Rent Tariff (₹)
            </label>
            <div className="relative mt-1.5">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-sm text-[#7186A5]">
                ₹
              </span>
              <input
                type="number"
                value={newRent}
                onChange={(e) => setNewRent(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs font-black text-[#102A56] font-mono focus:border-[#0F8B83] focus:ring-2 focus:ring-[#0F8B83]/15 transition-all"
                required
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#E8F7F5]/50 border border-[#0F8B83]/20 text-[11px] text-[#0F8B83] font-medium leading-relaxed">
            Automatic resident transfer log and accommodation history will be registered in the audit ledger upon confirmation.
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-3 border-t border-[#E1EAF4]/80">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-[#7186A5] hover:text-[#102A56] text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white text-xs font-black shadow-md shadow-sky-600/20 transition-all active:scale-95 cursor-pointer text-center"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Room Transfer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}