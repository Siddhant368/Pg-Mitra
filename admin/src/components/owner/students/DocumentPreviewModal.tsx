"use client";

import React, { useState } from "react";
import { 
  X, 
  Download, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  CheckCircle2, 
  FileText 
} from "lucide-react";
import { StudentDocument } from "@/types/student";

interface DocumentPreviewModalProps {
  document: StudentDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (docId: string) => void;
  onReject: (docId: string, reason: string) => void;
}

export default function DocumentPreviewModal({
  document: doc,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: DocumentPreviewModalProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  if (!isOpen || !doc) return null;

  const handleDownload = () => {
    const content = `PGMitra Document Inspection Preview\nDocument: ${doc.title}\nFile: ${doc.fileName}\nUploaded: ${doc.uploadedAt}\nStatus: ${doc.status}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.fileName || "document_preview.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-[#102A56]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#F5F8FC] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E1EAF4] overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-white p-3.5 sm:p-5 border-b border-[#E1EAF4] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#E8F7F5] text-[#0F8B83] flex items-center justify-center font-bold shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-extrabold text-[#102A56] truncate">
                {doc.title}
              </h2>
              <p className="text-[11px] sm:text-xs text-[#7186A5] truncate">
                {doc.fileName} • {doc.fileSize}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={handleDownload}
              className="p-1.5 sm:p-2 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC]"
              title="Download Document"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Visualizer Canvas */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E1EAF4] shadow-md p-4 sm:p-6 space-y-4 text-center">
            {/* Visual simulation of Identity Card */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-teal-50 via-white to-emerald-50 border border-gray-200 shadow-inner space-y-3 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 gap-2">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#102A56] leading-tight">
                  {doc.type === "AADHAAR" ? "Government of India - UIDAI" : "Educational Institution ID Card"}
                </span>
                <span className="w-5 h-5 rounded-full bg-[#0F8B83]/10 text-[#0F8B83] flex items-center justify-center text-[10px] font-bold shrink-0">
                  ✓
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-start text-center sm:text-left">
                <div className="w-20 h-24 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                  PHOTO
                </div>
                <div className="space-y-1 text-xs min-w-0">
                  <p className="font-bold text-[#102A56] text-sm break-words">{doc.title}</p>
                  <p className="text-[#7186A5] font-mono text-[11px] break-all">DOC ID: {doc.id.toUpperCase()}</p>
                  <p className="text-[#7186A5]">Verification Status: <strong className="text-[#0F8B83]">{doc.status}</strong></p>
                  <p className="text-[11px] text-[#7186A5]">Cryptographically verified secure document</p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[11px] font-mono text-[#7186A5]">
                <span>XXXX - XXXX - 4092</span>
                <span>AUTHENTIC</span>
              </div>
            </div>

            {/* Current status info */}
            <div className="flex items-center justify-center gap-2 pt-2 flex-wrap text-xs">
              <span className="text-[#7186A5]">Status:</span>
              {doc.status === "VERIFIED" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#16A34A]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
              {doc.status === "PENDING" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#D97706]">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Pending Review
                </span>
              )}
              {doc.status === "REJECTED" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <ShieldX className="w-3.5 h-3.5" />
                  Rejected
                </span>
              )}
            </div>

            {doc.rejectionReason && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 text-left break-words">
                <strong>Rejection Note:</strong> {doc.rejectionReason}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white p-3.5 sm:p-5 border-t border-[#E1EAF4] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 shrink-0">
          {isRejecting ? (
            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejecting document..."
                className="flex-1 text-xs p-2.5 rounded-xl border border-[#E1EAF4] bg-[#F5F8FC] focus:border-[#0F8B83]"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (rejectReason.trim()) {
                      onReject(doc.id, rejectReason.trim());
                      onClose();
                    }
                  }}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 text-center"
                >
                  Confirm Reject
                </button>
                <button
                  onClick={() => setIsRejecting(false)}
                  className="px-3 py-2.5 text-xs text-[#7186A5] hover:text-[#102A56]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between w-full gap-2">
              <button
                onClick={() => setIsRejecting(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors text-center"
              >
                Reject Document
              </button>

              <button
                onClick={() => {
                  onApprove(doc.id);
                  onClose();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs font-bold shadow-md shadow-[#0F8B83]/20 transition-all text-center"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Verification</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
