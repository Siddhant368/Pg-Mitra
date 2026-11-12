"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  X, 
  RotateCcw,
  ChevronDown,
  Building2,
  BedDouble,
  CreditCard,
  ShieldCheck,
  SlidersHorizontal,
  Clock,
  AlertTriangle,
  Check
} from "lucide-react";
import { 
  StudentNavTab, 
  QuickFilter 
} from "@/types/student";

interface FilterCounts {
  all: number;
  active: number;
  pendingVerification: number;
  paymentPending: number;
  checkedOut: number;
  blacklisted: number;
}

interface StudentTabsAndFiltersProps {
  activeTab: StudentNavTab;
  onSelectTab: (tab: StudentNavTab) => void;
  counts: FilterCounts;

  searchQuery: string;
  onSearchChange: (q: string) => void;

  quickFilter: QuickFilter | null;
  onQuickFilterChange: (f: QuickFilter | null) => void;

  // Dropdown filters
  selectedPg: string;
  onPgChange: (pg: string) => void;
  pgList: string[];

  selectedRoom: string;
  onRoomChange: (room: string) => void;
  roomList: string[];

  selectedRentStatus: string;
  onRentStatusChange: (status: string) => void;

  selectedVerificationStatus: string;
  onVerificationStatusChange: (status: string) => void;

  selectedAccountStatus: string;
  onAccountStatusChange: (status: string) => void;

  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export default function StudentTabsAndFilters({
  activeTab,
  onSelectTab,
  counts,
  searchQuery,
  onSearchChange,
  quickFilter,
  onQuickFilterChange,
  selectedPg,
  onPgChange,
  pgList,
  selectedRoom,
  onRoomChange,
  roomList,
  selectedRentStatus,
  onRentStatusChange,
  selectedVerificationStatus,
  onVerificationStatusChange,
  selectedAccountStatus,
  onAccountStatusChange,
  onResetFilters,
  hasActiveFilters,
}: StudentTabsAndFiltersProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const tabs: { id: StudentNavTab; label: string; count: number; dotColor?: string }[] = [
    { id: "ALL", label: "All", count: counts.all },
    { id: "ACTIVE", label: "Active", count: counts.active, dotColor: "bg-[#16A34A]" },
    { id: "PENDING_VERIFICATION", label: "KYC Pending", count: counts.pendingVerification, dotColor: "bg-amber-500" },
    { id: "PAYMENT_PENDING", label: "Rent Due", count: counts.paymentPending, dotColor: "bg-rose-500" },
    { id: "CHECKED_OUT", label: "Checked Out", count: counts.checkedOut },
    { id: "BLACKLISTED", label: "Blacklisted", count: counts.blacklisted, dotColor: "bg-slate-700" },
  ];

  const quickFilterChips: { id: QuickFilter; label: string }[] = [
    { id: "RENT_OVERDUE", label: "⚠️ Overdue Rent" },
    { id: "DOCS_PENDING", label: "📑 KYC Required" },
    { id: "LEAVING_SOON", label: "🗓️ Leaving Soon" },
    { id: "THIS_MONTH", label: "✨ New This Month" },
  ];

  // Count active dropdowns/chips
  const activeFiltersCount = [
    Boolean(searchQuery),
    Boolean(quickFilter),
    Boolean(selectedPg),
    Boolean(selectedRoom),
    Boolean(selectedRentStatus),
    Boolean(selectedVerificationStatus),
    Boolean(selectedAccountStatus),
    activeTab !== "ALL",
  ].filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* 1. Main Navigation Tabs (Touch-scrollable pill bar) */}
      <div className="bg-white/90 backdrop-blur-md p-1 sm:p-1.5 rounded-2xl border border-[#E1EAF4] shadow-2xs flex items-center gap-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#102A56] text-white shadow-sm font-black"
                  : "text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC]"
              }`}
            >
              {tab.dotColor && !isActive && (
                <span className={`w-1.5 h-1.5 rounded-full ${tab.dotColor}`} />
              )}
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-[#E8F7F5] text-[#0F8B83]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Unified Search & Filter Command Bar */}
      <div className="bg-white rounded-2xl border border-[#E1EAF4] p-2.5 sm:p-3.5 shadow-2xs space-y-2.5">
        <div className="flex items-center gap-2">
          {/* Smart Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7186A5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search resident, room, phone, ID..."
              className="w-full pl-9 pr-8 py-2 sm:py-2.5 bg-[#F5F8FC]/60 border border-[#E1EAF4] rounded-xl text-xs sm:text-sm font-medium text-[#102A56] placeholder-[#7186A5] focus:outline-hidden focus:border-[#0F8B83] focus:bg-white transition-all"
            />
            
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#7186A5] hover:text-[#102A56]"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* MOBILE ONLY: Single Clean Filter Trigger Button (sm:hidden) */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className={`sm:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all shrink-0 ${
              activeFiltersCount > 0
                ? "bg-[#0F8B83] text-white border-[#0F8B83] shadow-xs"
                : "bg-[#F5F8FC] text-[#102A56] border-[#E1EAF4] hover:bg-slate-200"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-[#0F8B83] flex items-center justify-center text-[10px] font-black">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* DESKTOP ONLY: Inline Dropdown Matrix (hidden sm:flex) */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {/* PG Filter */}
            <div className="relative min-w-[130px]">
              <select
                value={selectedPg}
                onChange={(e) => onPgChange(e.target.value)}
                className="w-full appearance-none bg-[#F5F8FC]/60 hover:bg-white border border-[#E1EAF4] text-[#102A56] rounded-xl pl-3 pr-7 py-2.5 text-xs font-bold focus:border-[#0F8B83] transition-colors cursor-pointer"
              >
                <option value="">🏢 All PGs</option>
                {pgList.map((pg) => (
                  <option key={pg} value={pg}>
                    {pg}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-[#7186A5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Room Filter */}
            <div className="relative min-w-[100px]">
              <select
                value={selectedRoom}
                onChange={(e) => onRoomChange(e.target.value)}
                className="w-full appearance-none bg-[#F5F8FC]/60 hover:bg-white border border-[#E1EAF4] text-[#102A56] rounded-xl pl-3 pr-7 py-2.5 text-xs font-bold focus:border-[#0F8B83] transition-colors cursor-pointer"
              >
                <option value="">🛏️ Room</option>
                {roomList.map((r) => (
                  <option key={r} value={r}>
                    Room {r}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-[#7186A5] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Rent Status Filter */}
            <div className="relative min-w-[110px]">
              <select
                value={selectedRentStatus}
                onChange={(e) => onRentStatusChange(e.target.value)}
                className="w-full appearance-none bg-[#F5F8FC]/60 hover:bg-white border border-[#E1EAF4] text-[#102A56] rounded-xl pl-3 pr-7 py-2.5 text-xs font-bold focus:border-[#0F8B83] transition-colors cursor-pointer"
              >
                <option value="">💳 Rent: All</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="OVERDUE">Overdue</option>
                <option value="PARTIAL">Partial</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#7186A5] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* KYC Status Filter */}
            <div className="relative min-w-[110px]">
              <select
                value={selectedVerificationStatus}
                onChange={(e) => onVerificationStatusChange(e.target.value)}
                className="w-full appearance-none bg-[#F5F8FC]/60 hover:bg-white border border-[#E1EAF4] text-[#102A56] rounded-xl pl-3 pr-7 py-2.5 text-xs font-bold focus:border-[#0F8B83] transition-colors cursor-pointer"
              >
                <option value="">🛡️ KYC: All</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#7186A5] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Reset All Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#0F8B83] bg-[#E8F7F5] hover:bg-[#D7EFEA] border border-[#0F8B83]/20 transition-all shadow-2xs"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. Quick Smart Filter Chips (Touch scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          {quickFilterChips.map((chip) => {
            const isSelected = quickFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => onQuickFilterChange(isSelected ? null : chip.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[#0F8B83] text-white shadow-2xs"
                    : "bg-[#F5F8FC] text-[#7186A5] hover:text-[#102A56] border border-[#E1EAF4]"
                }`}
              >
                <span>{chip.label}</span>
                {isSelected && <X className="w-3 h-3 text-white" />}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="sm:hidden text-[11px] font-bold text-[#0F8B83] hover:underline shrink-0 ml-1"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. MOBILE FILTER BOTTOM SHEET (Zero clutter on mobile!)  */}
      {/* ======================================================== */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden sm:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[#102A56]/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Bottom Sheet Modal */}
          <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl border-t border-[#E1EAF4] p-5 pb-8 space-y-4 max-h-[85vh] overflow-y-auto z-10 animate-in slide-in-from-bottom duration-300">
            {/* Grab handle */}
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto -mt-1" />

            <div className="flex items-center justify-between border-b border-[#E1EAF4] pb-3">
              <div>
                <h3 className="text-base font-black text-[#102A56]">Filter Residents</h3>
                <p className="text-xs text-[#7186A5]">Refine residents by property, room, and status</p>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* PG / Hostel */}
              <div>
                <label className="font-extrabold text-[#102A56] block mb-1">PG / Hostel Property</label>
                <select
                  value={selectedPg}
                  onChange={(e) => onPgChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E1EAF4] bg-[#F5F8FC] text-xs font-bold text-[#102A56]"
                >
                  <option value="">All PGs / Hostels</option>
                  {pgList.map((pg) => (
                    <option key={pg} value={pg}>
                      {pg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room */}
              <div>
                <label className="font-extrabold text-[#102A56] block mb-1">Room Number</label>
                <select
                  value={selectedRoom}
                  onChange={(e) => onRoomChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E1EAF4] bg-[#F5F8FC] text-xs font-bold text-[#102A56]"
                >
                  <option value="">All Rooms</option>
                  {roomList.map((r) => (
                    <option key={r} value={r}>
                      Room {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rent Status */}
              <div>
                <label className="font-extrabold text-[#102A56] block mb-1">Rent Payment Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "", label: "All Rent Statuses" },
                    { id: "PAID", label: "Paid" },
                    { id: "PENDING", label: "Pending" },
                    { id: "OVERDUE", label: "Overdue" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onRentStatusChange(item.id)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all text-left ${
                        selectedRentStatus === item.id
                          ? "bg-[#0F8B83] text-white border-[#0F8B83]"
                          : "bg-[#F5F8FC] text-[#7186A5] border-[#E1EAF4]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* KYC Status */}
              <div>
                <label className="font-extrabold text-[#102A56] block mb-1">KYC Verification</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "", label: "All" },
                    { id: "VERIFIED", label: "Verified" },
                    { id: "PENDING", label: "Pending" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onVerificationStatusChange(item.id)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                        selectedVerificationStatus === item.id
                          ? "bg-[#0F8B83] text-white border-[#0F8B83]"
                          : "bg-[#F5F8FC] text-[#7186A5] border-[#E1EAF4]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Status */}
              <div>
                <label className="font-extrabold text-[#102A56] block mb-1">Account State</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "", label: "All" },
                    { id: "ACTIVE", label: "Active" },
                    { id: "NOTICE", label: "Notice" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onAccountStatusChange(item.id)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                        selectedAccountStatus === item.id
                          ? "bg-[#0F8B83] text-white border-[#0F8B83]"
                          : "bg-[#F5F8FC] text-[#7186A5] border-[#E1EAF4]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#E1EAF4] flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-[#E1EAF4] text-xs font-bold text-[#7186A5] hover:text-[#102A56] text-center"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#0F8B83] to-[#0B5A4B] text-white text-xs font-black shadow-md shadow-[#0F8B83]/20 text-center"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}