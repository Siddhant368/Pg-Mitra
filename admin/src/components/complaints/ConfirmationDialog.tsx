'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'success' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export default function ConfirmationDialog({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  onConfirm,
  onCancel,
  children,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-[#102A56]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white border border-[#E1EAF4] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 border-b border-[#E1EAF4] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {variant === 'danger' && (
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            {variant === 'success' && (
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
            {variant === 'warning' && (
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            <h3 className="text-base font-bold text-[#102A56]">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-3">
          <p className="text-xs sm:text-sm text-[#7186A5] leading-relaxed">
            {description}
          </p>
          {children}
        </div>

        <div className="p-4 sm:p-5 border-t border-[#E1EAF4] bg-[#F5F8FC]/50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            className="py-2.5 px-4 rounded-xl border border-[#E1EAF4] bg-white hover:bg-[#F5F8FC] text-[#102A56] text-xs font-bold transition-colors cursor-pointer"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`py-2.5 px-5 rounded-xl text-xs font-bold text-white transition-all shadow-xs cursor-pointer ${
              variant === 'danger'
                ? 'bg-rose-600 hover:bg-rose-700'
                : variant === 'success'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-[#0F8B83] hover:bg-[#08756E]'
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
