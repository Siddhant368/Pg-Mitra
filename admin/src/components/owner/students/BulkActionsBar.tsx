"use client";

import React from "react";
import { 
  CheckCheck, 
  Send, 
  UserCheck, 
  UserX, 
  Download, 
  Trash2, 
  X,
  Layers,
  Sparkles
} from "lucide-react";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkApproveVerification: () => void;
  onBulkSendReminder: () => void;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
  onBulkExport: () => void;
  onBulkDelete: () => void;
}

export default function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkApproveVerification,
  onBulkSendReminder,
  onBulkActivate,
  onBulkDeactivate,
  onBulkExport,
  onBulkDelete,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-[94%] sm:w-auto bg-[#102A56]/95 backdrop-blur-xl text-white rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/15 px-3.5 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-6 animate-in slide-in-from-bottom-6 fade-in duration-300">
      {/* Selected Counter Pill & Clear Action */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-[#0F8B83]/30 to-[#34D399]/20 border border-[#34D399]/40 text-xs font-black text-[#34D399] whitespace-nowrap shadow-xs">
          <Layers className="w-3.5 h-3.5" />
          <span>{selectedCount} Selected</span>
        </div>
        <button
          onClick={onClearSelection}
          className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          title="Deselect all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Action Cluster */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar shrink-0">
        {/* Approve KYC */}
        <button
          onClick={onBulkApproveVerification}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
          title="Approve KYC verification for selected residents"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Verify KYC</span>
        </button>

        {/* Send Rent Reminder */}
        <button
          onClick={onBulkSendReminder}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F8B83] hover:bg-[#0B5A4B] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
          title="Send rent payment reminder"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Remind</span>
        </button>

        {/* Set Active */}
        <button
          onClick={onBulkActivate}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all active:scale-95"
          title="Mark selected as active"
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Active</span>
        </button>

        {/* Set Inactive */}
        <button
          onClick={onBulkDeactivate}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all active:scale-95"
          title="Mark selected as inactive"
        >
          <UserX className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Inactive</span>
        </button>

        {/* Export Selected */}
        <button
          onClick={onBulkExport}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all active:scale-95"
          title="Export selected residents"
        >
          <Download className="w-3.5 h-3.5 text-[#34D399]" />
          <span className="hidden md:inline">Export</span>
        </button>

        {/* Delete Selected */}
        <button
          onClick={onBulkDelete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold transition-all active:scale-95 shadow-xs"
          title="Delete selected residents"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>
  );
}