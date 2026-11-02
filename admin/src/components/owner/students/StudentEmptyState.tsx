"use client";

import React from "react";
import { Users, SearchX, RotateCcw, UserPlus } from "lucide-react";

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
    <div className="bg-white rounded-3xl border border-[#E1EAF4] p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-lg mx-auto my-8 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-[#E8F7F5] text-[#0F8B83] flex items-center justify-center shadow-inner">
        {isSearchEmpty ? (
          <SearchX className="w-8 h-8" />
        ) : (
          <Users className="w-8 h-8" />
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-extrabold text-[#102A56]">
          {isSearchEmpty ? "No Matching Students Found" : "No Students Registered Yet"}
        </h3>
        <p className="text-xs text-[#7186A5] leading-relaxed max-w-sm">
          {isSearchEmpty
            ? `We couldn't find any students matching your active search query or filter criteria. Try resetting filters or adjusting search terms.`
            : "Get started by adding your first student registration or importing batch admissions via CSV."}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        {isSearchEmpty ? (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs font-bold transition-all shadow-md shadow-[#0F8B83]/25"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        ) : (
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs font-bold transition-all shadow-md shadow-[#0F8B83]/25"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Student</span>
          </button>
        )}
      </div>
    </div>
  );
}
