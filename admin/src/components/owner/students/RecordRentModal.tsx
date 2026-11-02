"use client";

import React, { useState } from "react";
import { X, CreditCard, CheckCircle2 } from "lucide-react";
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
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#102A56]">
                Collect / Record Rent
              </h2>
              <p className="text-xs text-[#7186A5]">{student.name} ({student.studentId})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-white border border-[#E1EAF4] flex items-center justify-between text-xs">
            <span className="text-[#7186A5]">Monthly Rate:</span>
            <strong className="text-sm font-extrabold text-[#102A56]">
              ₹{student.accommodation.monthlyRent.toLocaleString("en-IN")}
            </strong>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#102A56]">Payment Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] font-semibold"
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

          <div>
            <label className="text-xs font-semibold text-[#102A56]">
              Collected Amount (₹)
            </label>
            <div className="relative mt-1">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-sm font-bold text-[#102A56] focus:border-[#0F8B83]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#102A56]">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] font-semibold"
            >
              <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
              <option value="CASH">Cash in Hand</option>
              <option value="BANK_TRANSFER">Bank IMPS / NEFT Transfer</option>
              <option value="DEBIT_CARD">Debit / Credit Card</option>
              <option value="OTHER">Other / Cheque</option>
            </select>
          </div>

          {paymentMethod !== "CASH" && (
            <div>
              <label className="text-xs font-semibold text-[#102A56]">
                Transaction / Reference ID
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="UTR or UPI reference number"
                className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] font-mono"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-[#102A56]">Notes / Remarks</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Paid via scanner in office"
              className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56]"
            />
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
              <span>Record & Issue Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
