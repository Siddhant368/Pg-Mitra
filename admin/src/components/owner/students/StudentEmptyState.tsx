"use client";

import React from "react";
import { Users, SearchX, RotateCcw, UserPlus, Sparkles, FilterX } from "lucide-react";

interface StudentEmptyStateProps {
  searchQuery: string;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onOpenAddModal: () => void;
}

export default function StudentEmptyState({
  searchQuery,
  hasActiveFilters,
  onResetFilters,
  onOpenAddModal,
}: StudentEmptyStateProps) {
  const isSearchEmpty = Boolean(searchQuery || hasActiveFilters);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-[#F8FBFC] rounded-3xl border border-[#E1EAF4] p-8 sm:p-14 text-center shadow-sm flex flex-col items-center justify-center max-w-xl mx-auto my-6 space-y-5">
      {/* Ambient background blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-[#0F8B83]/10 to-[#34D399]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Modern Icon Ring */}
      <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#E8F7F5] to-white border border-[#0F8B83]/30 text-[#0F8B83] flex items-center justify-center shadow-lg shadow-[#0F8B83]/10">
        {isSearchEmpty ? (
          <FilterX className="w-8 h-8 sm:w-10 sm:h-10 text-[#0F8B83]" />
        ) : (
          <Users className="w-8 h-8 sm:w-10 sm:h-10 text-[#0F8B83]" />
        )}
      </div>

      <div className="relative z-10 space-y-2">
        <h3 className="text-lg sm:text-xl font-black text-[#102A56] tracking-tight">
          {isSearchEmpty ? "No Matching Residents Found" : "No Residents Registered Yet"}
        </h3>
        <p className="text-xs sm:text-sm text-[#7186A5] leading-relaxed max-w-md mx-auto font-medium">
          {isSearchEmpty
            ? `We couldn't find any residents matching your active search query or filter parameters. Try clearing applied filters or refining your search.`
            : "Get started by admitting your first resident or importing batch student records via CSV."}
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-3 pt-2">
        {isSearchEmpty ? (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#0F8B83] to-[#0B5A4B] hover:from-[#08756E] hover:to-[#052E26] text-white text-xs sm:text-sm font-black shadow-md shadow-[#0F8B83]/20 transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Active Filters</span>
          </button>
        ) : (
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0F8B83] to-[#0B5A4B] hover:from-[#08756E] hover:to-[#052E26] text-white text-xs sm:text-sm font-black shadow-md shadow-[#0F8B83]/20 transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Admit First Resident</span>
          </button>
        )}
      </div>
    </div>
  );
}