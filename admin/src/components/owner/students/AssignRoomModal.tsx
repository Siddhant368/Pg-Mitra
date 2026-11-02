"use client";

import React, { useState } from "react";
import { X, BedDouble, CheckCircle2 } from "lucide-react";
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-[#102A56]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-[#F5F8FC] rounded-3xl shadow-2xl border border-[#E1EAF4] overflow-hidden z-10 flex flex-col">
        {/* Header */}
        <div className="bg-white p-5 border-b border-[#E1EAF4] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8F7F5] text-[#0F8B83] flex items-center justify-center font-bold">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#102A56]">
                Transfer / Assign Room
              </h2>
              <p className="text-xs text-[#7186A5]">{student.name} ({student.studentId})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7B8C9E] hover:text-[#102A56] hover:bg-[#F5F8FC]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Info */}
        <div className="p-4 bg-[#F5F8FC] border-b border-[#E1EAF4] text-xs">
          <span className="text-[#7186A5] font-medium">Currently Allocated:</span>
          <p className="font-bold text-[#102A56] mt-0.5">
            {student.accommodation.pgName} • Room {student.accommodation.roomNumber} ({student.accommodation.bedNumber})
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#102A56]">
              Target PG / Hostel
            </label>
            <select
              value={selectedPg.name}
              onChange={(e) => {
                const target = availablePgs.find((p) => p.name === e.target.value);
                if (target) setSelectedPg(target);
              }}
              className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] font-semibold"
            >
              {availablePgs.map((pg) => (
                <option key={pg.id} value={pg.name}>
                  {pg.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#102A56]">New Room No</label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. 305"
                className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] font-bold focus:border-[#0F8B83]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#102A56]">New Bed</label>
              <select
                value={bedNumber}
                onChange={(e) => setBedNumber(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] font-bold focus:border-[#0F8B83]"
              >
                <option value="Bed A">Bed A</option>
                <option value="Bed B">Bed B</option>
                <option value="Bed C">Bed C</option>
                <option value="Bed D">Bed D</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#102A56]">
              Monthly Rent for New Room (₹)
            </label>
            <input
              type="number"
              value={newRent}
              onChange={(e) => setNewRent(Number(e.target.value))}
              className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] font-bold focus:border-[#0F8B83]"
            />
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#E1EAF4] text-[11px] text-[#7186A5]">
            Note: An automated timeline entry and notification will be created documenting this room transfer.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7186A5] hover:text-[#102A56]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs font-bold shadow-md shadow-[#0F8B83]/25 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Transfer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
