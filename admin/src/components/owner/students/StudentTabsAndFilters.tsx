"use client";

import React from "react";
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  Building2, 
  BedDouble, 
  CreditCard, 
  ShieldCheck, 
  UserCheck, 
  RotateCcw,
  ChevronDown
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
  const tabs: { id: StudentNavTab; label: string; count: number }[] = [
    { id: "ALL", label: "All Students", count: counts.all },
    { id: "ACTIVE", label: "Active", count: counts.active },
    { id: "PENDING_VERIFICATION", label: "Pending Verification", count: counts.pendingVerification },
    { id: "PAYMENT_PENDING", label: "Payment Pending", count: counts.paymentPending },
    { id: "CHECKED_OUT", label: "Checked Out", count: counts.checkedOut },
    { id: "BLACKLISTED", label: "Blacklisted", count: counts.blacklisted },
  ];

  const quickFilterChips: { id: QuickFilter; label: string }[] = [
    { id: "THIS_MONTH", label: "This Month" },
    { id: "LAST_30_DAYS", label: "Last 30 Days" },
    { id: "RENT_OVERDUE", label: "Rent Overdue" },
    { id: "DOCS_PENDING", label: "Documents Pending" },
    { id: "LEAVING_SOON", label: "Leaving Soon" },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Main Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-[#E1EAF4]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                onSelectTab(tab.id);
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#0F8B83] text-white shadow-sm shadow-[#0F8B83]/25 font-bold"
                  : "text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
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

      {/* 2. Search Bar & Dropdown Filters Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Search input with clean styled container */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7186A5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by student name, email, phone, or ID (e.g. PGM-2026)..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#E1EAF4] rounded-xl text-xs sm:text-sm text-[#102A56] placeholder-[#7186A5] focus:outline-hidden focus:border-[#0F8B83] focus:ring-2 focus:ring-[#0F8B83]/10 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#7186A5] hover:text-[#102A56]"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters Group */}
        <div className="flex items-center flex-wrap gap-2">
          {/* PG / Hostel Filter */}
          <div className="relative min-w-[130px]">
            <select
              value={selectedPg}
              onChange={(e) => onPgChange(e.target.value)}
              className="w-full appearance-none bg-white border border-[#E1EAF4] text-[#102A56] rounded-xl pl-3 pr-8 py-2 text-xs font-semibold focus:outline-hidden focus:border-[#0F8B83] shadow-xs cursor-pointer"
            >
              <option value="">All PGs / Hostels</option>
              {pgList.map((pg) => (
                <option key={pg} value={pg}>
                  {pg}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#7186A5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Room Filter */}
          <div className="relative min-w-[100px]">
            <select
              value={selectedRoom}
              onChange={(e) => onRoomChange(e.target.value)}
              className="w-full appearance-none bg-white border border-[#E1EAF4] text-[#102A56] rounded-xl pl-3 pr-8 py-2 text-xs font-semibold focus:outline-hidden focus:border-[#0F8B83] shadow-xs cursor-pointer"
            >
              <option value="">All Rooms</option>
              {roomList.map((r) => (
                <option key={r} value={r}>
                  Room {r}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#7186A5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Rent Status Filter */}
          <div className="relative min-w-[110px]">
            <select
              value={selectedRentStatus}
              onChange={(e) => onRentStatusChange(e.target.value)}
              className="w-full appearance-none bg-white border border-[#E1EAF4] text-[#102A56] rounded-xl pl-3 pr-8 py-2 text-xs font-semibold focus:outline-hidden focus:border-[#0F8B83] shadow-xs cursor-pointer"
            >
              <option value="">Rent: All</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="OVERDUE">Overdue</option>
              <option value="PARTIAL">Partial</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#7186A5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Verification Status Filter */}
          <div className="relative min-w-[120px]">
            <select
              value={selectedVerificationStatus}
              onChange={(e) => onVerificationStatusChange(e.target.value)}
              className="w-full appearance-none bg-white border border-[#E1EAF4] text-[#102A56] rounded-xl pl-3 pr-8 py-2 text-xs font-semibold focus:outline-hidden focus:border-[#0F8B83] shadow-xs cursor-pointer"
            >
              <option value="">Verify: All</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#7186A5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Account Status Filter */}
          <div className="relative min-w-[120px]">
            <select
              value={selectedAccountStatus}
              onChange={(e) => onAccountStatusChange(e.target.value)}
              className="w-full appearance-none bg-white border border-[#E1EAF4] text-[#102A56] rounded-xl pl-3 pr-8 py-2 text-xs font-semibold focus:outline-hidden focus:border-[#0F8B83] shadow-xs cursor-pointer"
            >
              <option value="">Account: All</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="NOTICE">Notice Period</option>
              <option value="CHECKED_OUT">Checked Out</option>
              <option value="BLACKLISTED">Blacklisted</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#7186A5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#0F8B83] bg-[#E8F7F5] hover:bg-[#D7EFEA] border border-[#0F8B83]/20 transition-colors shadow-xs"
              title="Reset all search and dropdown filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Quick Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#7186A5] shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3" />
          Quick Filters:
        </span>

        {quickFilterChips.map((chip) => {
          const isSelected = quickFilter === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => onQuickFilterChange(isSelected ? null : chip.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-[#0F8B83] text-white border border-[#0F8B83] shadow-xs font-bold"
                  : "bg-white text-[#7186A5] border border-[#E1EAF4] hover:border-[#0F8B83]/30 hover:text-[#102A56] hover:bg-[#F5F8FC]"
              }`}
            >
              <span>{chip.label}</span>
              {isSelected && <X className="w-3 h-3 text-white" />}
            </button>
          );
        })}

        {quickFilter && (
          <button
            onClick={() => onQuickFilterChange(null)}
            className="text-[11px] font-medium text-[#0F8B83] hover:underline underline-offset-2 shrink-0 ml-1"
          >
            Clear Quick Filter
          </button>
        )}
      </div>
    </div>
  );
}
