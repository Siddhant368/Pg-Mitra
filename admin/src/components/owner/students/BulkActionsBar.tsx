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
  Layers
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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[92%] sm:w-auto bg-[#102A56] text-white rounded-2xl shadow-2xl border border-[#0F8B83]/30 px-4 py-3 flex items-center justify-between gap-3 sm:gap-6 animate-in slide-in-from-bottom-5 fade-in duration-200">
      {/* Count pill & Clear button */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 text-xs font-bold text-[#34D399]">
          <Layers className="w-3.5 h-3.5" />
          <span>{selectedCount} Selected</span>
        </div>
        <button
          onClick={onClearSelection}
          className="text-xs text-[#7186A5] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          title="Deselect all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        {/* Approve Verification */}
        <button
          onClick={onBulkApproveVerification}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          title="Approve verification for selected students"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Verify</span>
        </button>

        {/* Send Reminder */}
        <button
          onClick={onBulkSendReminder}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs font-semibold shadow-xs transition-colors"
          title="Send rent payment reminder"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Remind</span>
        </button>

        {/* Activate */}
        <button
          onClick={onBulkActivate}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
          title="Mark active"
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Activate</span>
        </button>

        {/* Deactivate */}
        <button
          onClick={onBulkDeactivate}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
          title="Deactivate"
        >
          <UserX className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Deactivate</span>
        </button>

        {/* Export */}
        <button
          onClick={onBulkExport}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
          title="Export selected as CSV"
        >
          <Download className="w-3.5 h-3.5 text-[#34D399]" />
          <span className="hidden md:inline">Export</span>
        </button>

        {/* Delete */}
        <button
          onClick={onBulkDelete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold transition-colors"
          title="Delete selected"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>
  );
}
