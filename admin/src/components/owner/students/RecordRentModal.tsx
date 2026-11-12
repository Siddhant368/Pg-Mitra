"use client";

import React, { useState } from "react";
import { X, CreditCard, CheckCircle2, QrCode, Banknote, Building, Sparkles } from "lucide-react";
import { Student } from "@/types/student";

interface RecordRentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onRecordPayment: (
    studentId: string,
    amount: number,
    month: string,
    paymentMethod: "UPI" | "CASH" | "BANK_TRANSFER" | "DEBIT_CARD" | "OTHER",
    transactionId?: string,
    notes?: string
  ) => void;
}

export default function RecordRentModal({
  isOpen,
  onClose,
  student,
  onRecordPayment,
}: RecordRentModalProps) {
  if (!isOpen || !student) return null;

  const currentMonthName = new Date().toLocaleString("default", { month: "long" });

  const [amount, setAmount] = useState<number>(
    student.rentDueAmount > 0 ? student.rentDueAmount : student.accommodation.monthlyRent
  );
  const [month, setMonth] = useState(currentMonthName);
  const [paymentMethod, setPaymentMethod] = useState<
    "UPI" | "CASH" | "BANK_TRANSFER" | "DEBIT_CARD" | "OTHER"
  >("UPI");
  const [transactionId, setTransactionId] = useState(
    "UPI/" + Date.now().toString().slice(-8)
  );
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    onRecordPayment(student.id, amount, month, paymentMethod, transactionId, notes);
    onClose();
  };

  const methods: { id: "UPI" | "CASH" | "BANK_TRANSFER"; label: string; icon: any }[] = [
    { id: "UPI", label: "UPI (GPay / PhonePe)", icon: QrCode },
    { id: "CASH", label: "Cash in Hand", icon: Banknote },
    { id: "BANK_TRANSFER", label: "Bank Transfer", icon: Building },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-[#102A56]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E1EAF4] overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-white to-[#F5F8FC] p-5 border-b border-[#E1EAF4] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F7F5] text-[#0F8B83] border border-[#0F8B83]/20 flex items-center justify-center font-bold shadow-xs shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-black text-[#102A56] truncate">
                Collect & Record Rent
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Rate Summary Card */}
          <div className="p-3.5 rounded-2xl bg-[#F5F8FC] border border-[#E1EAF4] flex items-center justify-between text-xs">
            <div>
              <span className="text-[#7186A5] font-semibold">Allocated Room:</span>
              <p className="font-extrabold text-[#102A56]">Room {student.accommodation.roomNumber} ({student.accommodation.bedNumber})</p>
            </div>
            <div className="text-right">
              <span className="text-[#7186A5] font-semibold">Monthly Tariff:</span>
              <p className="text-sm font-black text-[#102A56] font-mono">
                ₹{student.accommodation.monthlyRent.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Month Selection */}
          <div>
            <label className="text-xs font-bold text-[#102A56]">Billing Cycle / Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full mt-1.5 p-2.5 rounded-xl border border-[#E1EAF4] bg-[#F5F8FC]/50 text-xs text-[#102A56] font-bold focus:border-[#0F8B83] focus:bg-white transition-all cursor-pointer"
            >
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((m) => (
                <option key={m} value={m}>
                  {m} 2026
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-xs font-bold text-[#102A56]">
              Amount Received (₹)
            </label>
            <div className="relative mt-1.5">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-sm text-[#7186A5]">
                ₹
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#E1EAF4] bg-white text-sm font-black text-[#102A56] font-mono focus:border-[#0F8B83] focus:ring-2 focus:ring-[#0F8B83]/15 transition-all"
                required
              />
            </div>
          </div>

          {/* Payment Mode Pills */}
          <div>
            <label className="text-xs font-bold text-[#102A56]">Payment Method</label>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              {methods.map((m) => {
                const IconComponent = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#0F8B83] text-white border-[#0F8B83] shadow-xs"
                        : "bg-white text-[#7186A5] border-[#E1EAF4] hover:bg-[#F5F8FC] hover:text-[#102A56]"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="truncate text-[11px]">{m.label.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reference ID */}
          {paymentMethod !== "CASH" && (
            <div>
              <label className="text-xs font-bold text-[#102A56]">
                Transaction / UTR Reference ID
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="UTR or UPI reference number"
                className="w-full mt-1.5 p-2.5 rounded-xl border border-[#E1EAF4] bg-[#F5F8FC]/50 text-xs text-[#102A56] font-mono font-bold focus:border-[#0F8B83] focus:bg-white transition-all"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-[#102A56]">Notes / Remarks</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Paid via QR scan in manager office"
              className="w-full mt-1.5 p-2.5 rounded-xl border border-[#E1EAF4] bg-[#F5F8FC]/50 text-xs text-[#102A56] font-medium focus:border-[#0F8B83] focus:bg-white transition-all"
            />
          </div>

          {/* Footer Action */}
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0F8B83] to-[#0B5A4B] hover:from-[#08756E] hover:to-[#052E26] text-white text-xs font-black shadow-md shadow-[#0F8B83]/20 transition-all active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record & Log Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}