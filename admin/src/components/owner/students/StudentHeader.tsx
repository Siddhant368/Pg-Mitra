"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  UserPlus, 
  Download, 
  Upload, 
  Users, 
  FileSpreadsheet, 
  ChevronDown,
  RefreshCw,
  LayoutGrid,
  Table as TableIcon,
  Sparkles,
  ShieldCheck,
  MoreHorizontal
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
  viewMode?: "table" | "grid";
  onViewModeChange?: (mode: "table" | "grid") => void;
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
  viewMode = "table",
  onViewModeChange,
}: StudentHeaderProps) {
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setExportDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-white via-[#F8FBFC] to-[#F0FAF9] border border-[#E1EAF4] p-3 sm:p-6 shadow-sm">
      {/* Decorative ambient background mesh */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#0F8B83]/8 via-[#34D399]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-gradient-to-tr from-[#102A56]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* ======================================================== */}
      {/* 1. MOBILE STREAMLINED HEADER (sm:hidden - Zero Clutter) */}
      {/* ======================================================== */}
      <div className="sm:hidden relative z-10 space-y-2.5">
        {/* Top Bar: Title, Count, and Actions */}
        <div className="flex items-center justify-between gap-2">
          {/* Title with Count */}
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-xl font-black tracking-tight text-[#102A56] truncate">
              Residents
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#E8F7F5] text-[#0F8B83] border border-[#0F8B83]/20 shrink-0">
              {totalCount}
            </span>
            {filteredCount !== totalCount && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#7186A5] border border-[#E1EAF4] shrink-0">
                {filteredCount}
              </span>
            )}
          </div>

          {/* Right Action Icons: View Switcher, Overflow Menu, Admit Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* View Mode Toggle Switch */}
            {onViewModeChange && (
              <div className="inline-flex items-center p-0.5 rounded-xl bg-white border border-[#E1EAF4] shadow-2xs">
                <button
                  onClick={() => onViewModeChange("table")}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === "table"
                      ? "bg-[#102A56] text-white shadow-xs"
                      : "text-[#7186A5] hover:text-[#102A56]"
                  }`}
                  title="Table View"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onViewModeChange("grid")}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-[#102A56] text-white shadow-xs"
                      : "text-[#7186A5] hover:text-[#102A56]"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Overflow Menu (Sync, Import, Export) */}
            <div className="relative" ref={mobileMenuRef}>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl border border-[#E1EAF4] bg-white text-[#7186A5] hover:text-[#102A56] transition-colors shadow-2xs"
                title="Tools & Export"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {mobileMenuOpen && (
                <div className="absolute right-0 top-10 w-52 rounded-2xl bg-white border border-[#E1EAF4] shadow-2xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      onRefresh();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC]"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#0F8B83] ${isRefreshing ? "animate-spin" : ""}`} />
                    <span>Sync / Refresh Data</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenImportModal();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC]"
                  >
                    <Upload className="w-3.5 h-3.5 text-sky-600" />
                    <span>Import CSV</span>
                  </button>
                  <div className="h-px bg-[#E1EAF4] my-1" />
                  <button
                    onClick={() => {
                      onExportFiltered();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC]"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#0F8B83]" />
                    <span>Export View ({filteredCount})</span>
                  </button>
                  <button
                    onClick={() => {
                      onExportAll();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC]"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Export All ({totalCount})</span>
                  </button>
                </div>
              )}
            </div>

            {/* Primary Admit Button (Compact Mobile) */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#0F8B83] to-[#0B5A4B] text-white text-xs font-black shadow-sm shadow-[#0F8B83]/30 active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Admit</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. DESKTOP EXPANSIVE HEADER (hidden sm:flex)             */}
      {/* ======================================================== */}
      <div className="hidden sm:flex relative z-10 flex-col xl:flex-row xl:items-center xl:justify-between gap-4 sm:gap-6">
        {/* Left: Title, Badges & Context */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#102A56]">
              Resident Management
            </h1>
            
            {/* Live Count Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#E8F7F5] text-[#0F8B83] border border-[#0F8B83]/25 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0F8B83] animate-pulse" />
              <span>{totalCount} Total Residents</span>
            </div>

            {filteredCount !== totalCount && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-[#7186A5] border border-[#E1EAF4] shadow-2xs">
                <span>Showing {filteredCount} filtered</span>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#7186A5] max-w-2xl font-medium">
            Centralized resident dossiers, digital KYC verification, room allocations & real-time rent collection tracker for 2026.
          </p>
        </div>

        {/* Right: View Switcher & Action Cluster */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          
          {/* View Mode Toggle (Table vs Bento Grid) */}
          {onViewModeChange && (
            <div className="inline-flex items-center p-1 rounded-2xl bg-white border border-[#E1EAF4] shadow-2xs">
              <button
                onClick={() => onViewModeChange("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "table"
                    ? "bg-[#102A56] text-white shadow-xs"
                    : "text-[#7186A5] hover:text-[#102A56]"
                }`}
                title="Data Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>

              <button
                onClick={() => onViewModeChange("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "grid"
                    ? "bg-[#102A56] text-white shadow-xs"
                    : "text-[#7186A5] hover:text-[#102A56]"
                }`}
                title="Bento Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
            </div>
          )}

          {/* Secondary Action Toolbar: Refresh, Import, Export */}
          <div className="flex items-center gap-2">
            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-2xl border border-[#E1EAF4] bg-white text-[#7186A5] hover:text-[#0F8B83] hover:border-[#0F8B83]/40 hover:bg-[#F5F8FC] transition-all shadow-2xs disabled:opacity-50 shrink-0 cursor-pointer"
              title="Synchronize records"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#0F8B83]" : ""}`} />
            </button>

            {/* Import Button */}
            <button
              onClick={onOpenImportModal}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-[#E1EAF4] bg-white text-xs sm:text-sm font-bold text-[#102A56] hover:bg-[#F5F8FC] hover:border-[#0F8B83]/30 shadow-2xs transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#0F8B83]" />
              <span>Import</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-[#E1EAF4] bg-white text-xs sm:text-sm font-bold text-[#102A56] hover:bg-[#F5F8FC] hover:border-[#0F8B83]/30 shadow-2xs transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#0F8B83]" />
                <span>Export</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#7186A5]" />
              </button>

              {exportDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-[#E1EAF4] shadow-2xl py-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#7186A5]">
                    Export Data (CSV)
                  </div>
                  <button
                    onClick={() => {
                      onExportFiltered();
                      setExportDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC] transition-colors text-left"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-[#0F8B83]" />
                    <div>
                      <div className="font-bold">Current Filtered View ({filteredCount})</div>
                      <div className="text-[10px] text-[#7186A5]">Export current active view</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      onExportAll();
                      setExportDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC] transition-colors text-left"
                  >
                    <Download className="w-4 h-4 text-[#16A34A]" />
                    <div>
                      <div className="font-bold">All Master Records ({totalCount})</div>
                      <div className="text-[10px] text-[#7186A5]">Complete database export</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Primary CTA: Admit Student */}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#0F8B83] to-[#0B5A4B] hover:from-[#08756E] hover:to-[#052E26] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-[#0F8B83]/30 hover:shadow-lg hover:shadow-[#0F8B83]/40 transition-all duration-200 active:scale-95 group cursor-pointer"
          >
            <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Admit Resident</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono font-normal">
              +
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}