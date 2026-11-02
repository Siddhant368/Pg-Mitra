"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  UserPlus, 
  Download, 
  Upload, 
  Users, 
  FileSpreadsheet, 
  ChevronDown,
  RefreshCw
} from "lucide-react";

interface StudentHeaderProps {
  totalCount: number;
  filteredCount: number;
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  onExportAll: () => void;
  onExportFiltered: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function StudentHeader({
  totalCount,
  filteredCount,
  onOpenAddModal,
  onOpenImportModal,
  onExportAll,
  onExportFiltered,
  onRefresh,
  isRefreshing = false,
}: StudentHeaderProps) {
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setExportDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-[#E1EAF4]">
      {/* Title & Subtitle */}
      <div className="space-y-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102A56]">
            Student Management
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F7F5] text-[#0F8B83] border border-[#0F8B83]/20 shadow-xs">
            <Users className="w-3.5 h-3.5" />
            <span>{totalCount} Total Students</span>
          </div>
          {filteredCount !== totalCount && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F8FC] text-[#102A56] border border-[#E1EAF4]">
              <span>Showing {filteredCount} filtered</span>
            </div>
          )}
        </div>
        <p className="text-sm text-[#7186A5]">
          Manage students, admissions, payments and accommodation across all properties.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-[#7186A5] hover:text-[#102A56] hover:border-[#0F8B83]/30 hover:bg-[#F5F8FC] transition-all shadow-xs disabled:opacity-50"
          title="Refresh Student Records"
          aria-label="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#0F8B83]" : ""}`} />
        </button>

        {/* Import Students Button */}
        <button
          onClick={onOpenImportModal}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs sm:text-sm font-semibold text-[#102A56] hover:bg-[#F5F8FC] hover:border-[#0F8B83]/30 shadow-xs transition-all duration-200 active:scale-[0.98]"
        >
          <Upload className="w-4 h-4 text-[#0F8B83]" />
          <span>Import</span>
        </button>

        {/* Export Students Dropdown Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs sm:text-sm font-semibold text-[#102A56] hover:bg-[#F5F8FC] hover:border-[#0F8B83]/30 shadow-xs transition-all duration-200 active:scale-[0.98]"
          >
            <Download className="w-4 h-4 text-[#0F8B83]" />
            <span>Export</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#7186A5]" />
          </button>

          {exportDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-[#E1EAF4] shadow-xl py-1.5 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[#7186A5] uppercase tracking-wider">
                Export Options (CSV)
              </div>
              <button
                onClick={() => {
                  onExportFiltered();
                  setExportDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#102A56] hover:bg-[#F5F8FC] transition-colors text-left"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#0F8B83]" />
                <div>
                  <div className="font-semibold">Current View ({filteredCount})</div>
                  <div className="text-[11px] text-[#7186A5]">Export active filtered list</div>
                </div>
              </button>
              <button
                onClick={() => {
                  onExportAll();
                  setExportDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#102A56] hover:bg-[#F5F8FC] transition-colors text-left"
              >
                <Download className="w-4 h-4 text-[#16A34A]" />
                <div>
                  <div className="font-semibold">All Students ({totalCount})</div>
                  <div className="text-[11px] text-[#7186A5]">Complete master dataset</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Add New Student Button (Primary Teal #0F8B83) */}
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs sm:text-sm font-bold shadow-sm shadow-[#0F8B83]/25 transition-all duration-200 active:scale-[0.98] group"
        >
          <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>Add New Student</span>
        </button>
      </div>
    </div>
  );
}
