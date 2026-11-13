'use client';

import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  Building2, 
  Tag, 
  AlertTriangle, 
  Clock, 
  X, 
  SlidersHorizontal,
  Flame,
  Check,
  Calendar
} from 'lucide-react';

interface OwnerFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedPg: string;
  onPgChange: (pg: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedPriority: string;
  onPriorityChange: (p: string) => void;
  selectedStatus: string;
  onStatusChange: (s: string) => void;
  selectedDateRange: string;
  onDateRangeChange: (r: string) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  totalCount?: number;
}

const CATEGORIES = [
  'Electricity',
  'Water Supply',
  'Room Maintenance',
  'Cleaning',
  'Wi-Fi / Internet',
  'Food Quality',
  'Security',
  'Other',
];

const PRIORITIES = [
  { id: 'Urgent', label: '🔥 Urgent', color: 'rose' },
  { id: 'High', label: '⚠️ High', color: 'amber' },
  { id: 'Medium', label: '🔹 Medium', color: 'blue' },
  { id: 'Low', label: '🌱 Low', color: 'emerald' },
];

const STATUSES = [
  { id: 'Pending', label: '⏳ Pending' },
  { id: 'Reviewed', label: '👀 Reviewed' },
  { id: 'In Progress', label: '🔄 In Progress' },
  { id: 'Resolved', label: '✅ Resolved' },
  { id: 'Rejected', label: '❌ Rejected' },
];

export default function OwnerFilterBar({
  searchQuery,
  onSearchChange,
  selectedPg,
  onPgChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange,
  selectedDateRange,
  onDateRangeChange,
  onResetFilters,
  totalFiltered,
  totalCount,
}: OwnerFilterBarProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeFiltersCount = [
    selectedPg !== 'ALL',
    selectedCategory !== 'ALL',
    selectedPriority !== 'ALL',
    selectedStatus !== 'ALL',
    selectedDateRange !== 'ALL',
  ].filter(Boolean).length;

  const isFiltered = searchQuery.trim() !== '' || activeFiltersCount > 0;

  return (
    <>
      <div className="bg-white border border-[#E1EAF4] rounded-2xl p-2.5 sm:p-4 shadow-xs w-full max-w-full overflow-hidden space-y-2.5 sm:space-y-3">
        {/* Top Command Bar: Search Input + Mobile Filter Button */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#7186A5] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              className="w-full bg-[#F5F8FC]/80 hover:bg-[#F5F8FC] focus:bg-white border border-[#E1EAF4] focus:border-[#0F8B83] focus:ring-2 focus:ring-[#0F8B83]/20 text-[#102A56] rounded-xl pl-9 pr-8 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all placeholder:text-[#7186A5]"
              placeholder="Search resident, room, title or ID..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#7186A5] hover:text-[#102A56] rounded-lg transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* MOBILE ONLY: Advanced Filter Trigger Button (lg:hidden) */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className={`lg:hidden inline-flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl border text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFiltersCount > 0
                ? 'bg-[#0F8B83] text-white border-[#0F8B83] shadow-xs'
                : 'bg-[#F5F8FC] text-[#102A56] border-[#E1EAF4] hover:bg-[#E1EAF4]'
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
        </div>

        {/* DESKTOP ONLY: Inline Dropdown Grid (hidden on mobile, visible lg+) */}
        <div className="hidden lg:grid grid-cols-5 gap-2.5">
          {/* PG Property */}
          <div className="relative">
            <select
              className="w-full appearance-none bg-[#F5F8FC]/80 hover:bg-[#F5F8FC] focus:bg-white border border-[#E1EAF4] focus:border-[#0F8B83] text-[#102A56] rounded-xl pl-3 pr-7 py-2 text-xs font-semibold transition-all cursor-pointer"
              value={selectedPg}
              onChange={(e) => onPgChange(e.target.value)}
            >
              <option value="ALL">🏢 All Properties</option>
              <option value="Green Valley PG">Green Valley PG</option>
              <option value="Zenith Girls PG">Zenith Girls PG</option>
              <option value="Sunrise Luxury PG">Sunrise Luxury PG</option>
              <option value="St. Jude Men's Hostel">St. Jude Men&apos;s Hostel</option>
            </select>
          </div>

          {/* Category */}
          <div className="relative">
            <select
              className="w-full appearance-none bg-[#F5F8FC]/80 hover:bg-[#F5F8FC] focus:bg-white border border-[#E1EAF4] focus:border-[#0F8B83] text-[#102A56] rounded-xl pl-3 pr-7 py-2 text-xs font-semibold transition-all cursor-pointer"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="ALL">🏷️ All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="relative">
            <select
              className="w-full appearance-none bg-[#F5F8FC]/80 hover:bg-[#F5F8FC] focus:bg-white border border-[#E1EAF4] focus:border-[#0F8B83] text-[#102A56] rounded-xl pl-3 pr-7 py-2 text-xs font-semibold transition-all cursor-pointer"
              value={selectedPriority}
              onChange={(e) => onPriorityChange(e.target.value)}
            >
              <option value="ALL">⚡ All Priorities</option>
              <option value="Urgent">🔥 Urgent</option>
              <option value="High">⚠️ High</option>
              <option value="Medium">🔹 Medium</option>
              <option value="Low">🌱 Low</option>
            </select>
          </div>

          {/* Status */}
          <div className="relative">
            <select
              className="w-full appearance-none bg-[#F5F8FC]/80 hover:bg-[#F5F8FC] focus:bg-white border border-[#E1EAF4] focus:border-[#0F8B83] text-[#102A56] rounded-xl pl-3 pr-7 py-2 text-xs font-semibold transition-all cursor-pointer"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="ALL">📌 All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="relative">
            <select
              className="w-full appearance-none bg-[#F5F8FC]/80 hover:bg-[#F5F8FC] focus:bg-white border border-[#E1EAF4] focus:border-[#0F8B83] text-[#102A56] rounded-xl pl-3 pr-7 py-2 text-xs font-semibold transition-all cursor-pointer"
              value={selectedDateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
            >
              <option value="ALL">📅 All Time</option>
              <option value="TODAY">Today</option>
              <option value="WEEK">This Week</option>
              <option value="MONTH">This Month</option>
            </select>
          </div>
        </div>

        {/* Status / Counts Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-[#F5F8FC] text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#7186A5]">
              Showing <strong className="text-[#102A56] font-bold">{totalFiltered}</strong> {totalCount ? `of ${totalCount}` : ''} complaints
            </span>
            {isFiltered && (
              <span className="px-2 py-0.5 rounded-md bg-[#E8F7F5] text-[#0F8B83] font-bold text-[11px] border border-[#0F8B83]/20">
                Filtered
              </span>
            )}
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold text-[#0F8B83] bg-[#E8F7F5] hover:bg-[#D4EFEA] border border-[#0F8B83]/20 transition-all cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. ADVANCED MOBILE FILTER BOTTOM SHEET (Native App Feel)  */}
      {/* ======================================================== */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden animate-in fade-in duration-150">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[#102A56]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Bottom Sheet Drawer */}
          <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl border-t border-[#E1EAF4] p-5 pb-8 space-y-4 max-h-[85vh] overflow-y-auto z-10 animate-in slide-in-from-bottom duration-250">
            {/* Grab Handle */}
            <div className="w-10 h-1.5 bg-[#E1EAF4] rounded-full mx-auto -mt-1 pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E1EAF4] pb-3">
              <div>
                <h3 className="text-base font-black text-[#102A56]">Filter Complaints</h3>
                <p className="text-xs text-[#7186A5]">Select properties, categories, or status</p>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Controls Body */}
            <div className="space-y-4 text-xs">
              {/* PG Property */}
              <div>
                <label className="font-extrabold text-[#102A56] block mb-1.5">Property / PG Hostel</label>
                <select
                  value={selectedPg}
                  onChange={(e) => onPgChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E1EAF4] bg-[#F5F8FC] text-xs font-bold text-[#102A56]"
                >
                  <option value="ALL">🏢 All Properties</option>
                  <option value="Green Valley PG">Green Valley PG</option>
                  <option value="Zenith Girls PG">Zenith Girls PG</option>
                  <option value="Sunrise Luxury PG">Sunrise Luxury PG</option>
                  <option value="St. Jude Men's Hostel">St. Jude Men&apos;s Hostel</option>
                </select>
              </div>

              {/* Priority Chips Grid */}
              <div>
                <label className="font-extrabold text-[#102A56] block mb-1.5">Priority</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onPriorityChange('ALL')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-left ${
                      selectedPriority === 'ALL'
                        ? 'bg-[#102A56] text-white border-[#102A56]'
                        : 'bg-[#F5F8FC] text-[#7186A5] border-[#E1EAF4]'
                    }`}
                  >
                    All Priorities
                  </button>
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onPriorityChange(p.id)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                        selectedPriority === p.id
                          ? 'bg-[#0F8B83] text-white border-[#0F8B83]'
                          : 'bg-[#F5F8FC] text-[#102A56] border-[#E1EAF4]'
                      }`}
                    >
                      <span>{p.label}</span>
                      {selectedPriority === p.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Chips Grid */}
              <div>
                <label className="font-extrabold text-[#102A56] block mb-1.5">Ticket Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onStatusChange('ALL')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-left ${
                      selectedStatus === 'ALL'
                        ? 'bg-[#102A56] text-white border-[#102A56]'
                        : 'bg-[#F5F8FC] text-[#7186A5] border-[#E1EAF4]'
                    }`}
                  >
                    All Statuses
                  </button>
                  {STATUSES.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => onStatusChange(st.id)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                        selectedStatus === st.id
                          ? 'bg-[#0F8B83] text-white border-[#0F8B83]'
                          : 'bg-[#F5F8FC] text-[#102A56] border-[#E1EAF4]'
                      }`}
                    >
                      <span>{st.label}</span>
                      {selectedStatus === st.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="font-extrabold text-[#102A56] block mb-1.5">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E1EAF4] bg-[#F5F8FC] text-xs font-bold text-[#102A56]"
                >
                  <option value="ALL">🏷️ All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="font-extrabold text-[#102A56] block mb-1.5">Date Period</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ALL', label: 'All Time' },
                    { id: 'TODAY', label: 'Today' },
                    { id: 'WEEK', label: 'This Week' },
                    { id: 'MONTH', label: 'This Month' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => onDateRangeChange(d.id)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        selectedDateRange === d.id
                          ? 'bg-[#102A56] text-white border-[#102A56]'
                          : 'bg-[#F5F8FC] text-[#7186A5] border-[#E1EAF4]'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-[#E1EAF4]">
              {isFiltered && (
                <button
                  type="button"
                  onClick={() => {
                    onResetFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="py-3 px-4 rounded-xl border border-[#E1EAF4] bg-[#F5F8FC] text-[#102A56] text-xs font-bold transition-colors"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#0F8B83] text-white text-xs font-bold shadow-xs hover:bg-[#08756E] transition-colors text-center"
              >
                Apply Filters ({totalFiltered} results)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
