'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Sparkles, 
  Clock, 
  RotateCw, 
  CheckCircle2, 
  Flame, 
  Download, 
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { 
  Complaint, 
  ComplaintPriority, 
  ComplaintStatus, 
  StaffMember 
} from '@/types/complaint';
import { 
  getStoredComplaints, 
  saveStoredComplaints, 
  calculateOwnerStats, 
  exportComplaintsCSV, 
  AVAILABLE_STAFF 
} from '@/lib/mockComplaints';
import OwnerFilterBar from './OwnerFilterBar';
import OwnerComplaintTable from './OwnerComplaintTable';
import ComplaintSidePanel from './ComplaintSidePanel';
import ConfirmationDialog from '../ConfirmationDialog';
import { useComplaintToast } from '../ComplaintToast';

export default function OwnerComplaintDashboard() {
  const { showToast } = useComplaintToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPg, setSelectedPg] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('ALL');

  // Side Panel State
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  // Confirmation Modals State
  const [resolveTarget, setResolveTarget] = useState<Complaint | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Complaint | null>(null);

  // Load complaints
  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setComplaints(getStoredComplaints());
      setLoading(false);
    }, 200);
  };

  useEffect(() => {
    loadData();

    const handleStorageUpdate = () => {
      setComplaints(getStoredComplaints());
    };
    window.addEventListener('pgmitra_complaints_updated', handleStorageUpdate);
    return () => window.removeEventListener('pgmitra_complaints_updated', handleStorageUpdate);
  }, []);

  // Calculate Owner Stats
  const stats = useMemo(() => {
    return calculateOwnerStats(complaints);
  }, [complaints]);

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    const now = new Date();

    return complaints.filter((c) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = c.id.toLowerCase().includes(q);
        const matchStudent = c.student.name.toLowerCase().includes(q);
        const matchRoom = c.student.roomNumber.toLowerCase().includes(q);
        const matchTitle = c.title.toLowerCase().includes(q);
        if (!matchId && !matchStudent && !matchRoom && !matchTitle) return false;
      }

      // PG Filter
      if (selectedPg !== 'ALL' && c.student.pgName !== selectedPg) return false;

      // Category
      if (selectedCategory !== 'ALL' && c.category !== selectedCategory) return false;

      // Priority
      if (selectedPriority !== 'ALL' && c.priority !== selectedPriority) return false;

      // Status
      if (selectedStatus !== 'ALL' && c.status !== selectedStatus) return false;

      // Date Range Filter
      if (selectedDateRange !== 'ALL') {
        const submitted = new Date(c.submittedDate);
        if (selectedDateRange === 'TODAY') {
          const isToday =
            submitted.getDate() === now.getDate() &&
            submitted.getMonth() === now.getMonth() &&
            submitted.getFullYear() === now.getFullYear();
          if (!isToday) return false;
        } else if (selectedDateRange === 'WEEK') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (submitted < sevenDaysAgo) return false;
        } else if (selectedDateRange === 'MONTH') {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (submitted < thirtyDaysAgo) return false;
        }
      }

      return true;
    });
  }, [
    complaints,
    searchQuery,
    selectedPg,
    selectedCategory,
    selectedPriority,
    selectedStatus,
    selectedDateRange,
  ]);

  // Handlers for side panel updates
  const handleUpdateComplaint = (updated: Complaint) => {
    const nextList = complaints.map((c) => (c.id === updated.id ? updated : c));
    setComplaints(nextList);
    saveStoredComplaints(nextList);
    setActiveComplaint(updated);
    showToast(`Ticket ${updated.id} updated successfully.`, 'success');
  };

  const handleQuickStatusChange = (complaint: Complaint, status: ComplaintStatus) => {
    const now = new Date();
    const formattedNow = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const updatedTimeline = (complaint.timeline || []).map((step) => {
      if (step.step === 2 && (status === 'Reviewed' || status === 'In Progress' || status === 'Resolved')) {
        return {
          ...step,
          completed: true,
          timestamp: step.completed ? step.timestamp : formattedNow,
          actor: 'Management',
          actorRole: 'Owner' as const,
        };
      }
      if (step.step === 4 && status === 'Resolved') {
        return {
          ...step,
          completed: true,
          timestamp: formattedNow,
          actor: 'Management',
          actorRole: 'Owner' as const,
        };
      }
      return step;
    });

    const updated: Complaint = {
      ...complaint,
      status,
      timeline: updatedTimeline,
      updatedDate: now.toISOString(),
    };

    const nextList = complaints.map((c) => (c.id === complaint.id ? updated : c));
    setComplaints(nextList);
    saveStoredComplaints(nextList);

    if (activeComplaint && activeComplaint.id === complaint.id) {
      setActiveComplaint(updated);
    }

    showToast(`Status of ${complaint.id} changed to "${status}".`, 'info');
  };

  const handleQuickPriorityChange = (complaint: Complaint, priority: ComplaintPriority) => {
    const updated: Complaint = {
      ...complaint,
      priority,
      updatedDate: new Date().toISOString(),
    };
    const nextList = complaints.map((c) => (c.id === complaint.id ? updated : c));
    setComplaints(nextList);
    saveStoredComplaints(nextList);

    if (activeComplaint && activeComplaint.id === complaint.id) {
      setActiveComplaint(updated);
    }

    showToast(`Priority of ${complaint.id} set to "${priority}".`, 'info');
  };

  const handleQuickAssignStaff = (complaint: Complaint, staffId: string) => {
    const staff = AVAILABLE_STAFF.find((s) => s.id === staffId) || null;
    const now = new Date();
    const formattedNow = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const updatedTimeline = (complaint.timeline || []).map((step) => {
      if (step.step === 3) {
        return {
          ...step,
          completed: true,
          timestamp: formattedNow,
          actor: staff ? staff.name : 'Maintenance Crew',
          actorRole: 'Staff' as const,
        };
      }
      return step;
    });

    const updated: Complaint = {
      ...complaint,
      assignedTo: staff,
      status: complaint.status === 'Pending' ? 'In Progress' : complaint.status,
      timeline: updatedTimeline,
      updatedDate: now.toISOString(),
    };

    const nextList = complaints.map((c) => (c.id === complaint.id ? updated : c));
    setComplaints(nextList);
    saveStoredComplaints(nextList);

    if (activeComplaint && activeComplaint.id === complaint.id) {
      setActiveComplaint(updated);
    }

    showToast(
      staff
        ? `Assigned ${staff.name} to ticket ${complaint.id}.`
        : `Unassigned staff from ticket ${complaint.id}.`,
      'success'
    );
  };

  const handleConfirmResolve = () => {
    if (!resolveTarget) return;

    const now = new Date();
    const formattedNow = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const updatedTimeline = (resolveTarget.timeline || []).map((step) => {
      if (step.step === 4) {
        return {
          ...step,
          completed: true,
          timestamp: formattedNow,
          actor: 'Management',
          actorRole: 'Owner' as const,
        };
      }
      return { ...step, completed: true };
    });

    const updated: Complaint = {
      ...resolveTarget,
      status: 'Resolved',
      timeline: updatedTimeline,
      updatedDate: now.toISOString(),
      adminResponse: resolveTarget.adminResponse || {
        message: 'This issue has been inspected, repaired, and marked resolved by PG management.',
        responderName: 'PG Management',
        responderRole: 'Property Owner',
        timestamp: formattedNow,
      },
    };

    const nextList = complaints.map((c) => (c.id === resolveTarget.id ? updated : c));
    setComplaints(nextList);
    saveStoredComplaints(nextList);

    if (activeComplaint && activeComplaint.id === resolveTarget.id) {
      setActiveComplaint(updated);
    }

    showToast(`Ticket ${resolveTarget.id} marked as Resolved!`, 'success');
    setResolveTarget(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    const nextList = complaints.filter((c) => c.id !== deleteTarget.id);
    setComplaints(nextList);
    saveStoredComplaints(nextList);

    if (activeComplaint && activeComplaint.id === deleteTarget.id) {
      setActiveComplaint(null);
    }

    showToast(`Complaint ${deleteTarget.id} deleted.`, 'info');
    setDeleteTarget(null);
  };

  const handleExportCSV = () => {
    exportComplaintsCSV(filteredComplaints);
    showToast(`Exported ${filteredComplaints.length} complaints to CSV file.`, 'success');
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedPg('ALL');
    setSelectedCategory('ALL');
    setSelectedPriority('ALL');
    setSelectedStatus('ALL');
    setSelectedDateRange('ALL');
  };

  // Quick mobile tab select
  const handleQuickTabSelect = (tab: 'ALL' | 'URGENT' | 'PENDING' | 'PROGRESS' | 'RESOLVED') => {
    if (tab === 'ALL') {
      setSelectedStatus('ALL');
      setSelectedPriority('ALL');
    } else if (tab === 'URGENT') {
      setSelectedPriority('Urgent');
      setSelectedStatus('ALL');
    } else if (tab === 'PENDING') {
      setSelectedStatus('Pending');
      setSelectedPriority('ALL');
    } else if (tab === 'PROGRESS') {
      setSelectedStatus('In Progress');
      setSelectedPriority('ALL');
    } else if (tab === 'RESOLVED') {
      setSelectedStatus('Resolved');
      setSelectedPriority('ALL');
    }
  };

  const isQuickUrgent = selectedPriority === 'Urgent';
  const isQuickPending = selectedStatus === 'Pending' && selectedPriority !== 'Urgent';
  const isQuickProgress = selectedStatus === 'In Progress' && selectedPriority !== 'Urgent';
  const isQuickResolved = selectedStatus === 'Resolved' && selectedPriority !== 'Urgent';
  const isQuickAll = selectedStatus === 'ALL' && selectedPriority === 'ALL';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-3.5 sm:space-y-6 p-2.5 sm:p-6 lg:p-8 overflow-x-hidden">
      {/* ======================================================== */}
      {/* 1. MOBILE NATIVE APP HEADER (sm:hidden - Ultra-Clean)     */}
      {/* ======================================================== */}
      <div className="sm:hidden bg-white border border-[#E1EAF4] rounded-2xl p-3.5 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black text-[#102A56]">
              Complaints
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#E8F7F5] text-[#0F8B83] border border-[#0F8B83]/20">
              {complaints.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportCSV}
              className="p-2 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4] text-[#102A56] hover:bg-[#E8F7F5] transition-colors"
              title="Export CSV"
            >
              <Download className="w-4 h-4 text-[#0F8B83]" />
            </button>
            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-[#0F8B83] text-white hover:bg-[#08756E] transition-colors shadow-2xs"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#7186A5]">
          <span className="inline-flex items-center gap-1 font-bold text-amber-600">
            <Clock className="w-3 h-3" />
            {stats.pending + stats.newComplaints} pending
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 font-bold text-rose-600">
            <Flame className="w-3 h-3" />
            {stats.urgentCount} urgent
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
            <CheckCircle2 className="w-3 h-3" />
            {stats.resolved} resolved
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. DESKTOP HEADER BANNER (hidden sm:block)               */}
      {/* ======================================================== */}
      <div className="hidden sm:block relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-white via-[#F8FBFC] to-[#F0FAF9] border border-[#E1EAF4] p-6 shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#0F8B83]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F7F5] text-[#0F8B83] border border-[#0F8B83]/20">
                Operations & Maintenance
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#102A56] tracking-tight">
              Complaint Management
            </h1>
            <p className="text-sm text-[#7186A5] max-w-2xl">
              Monitor, triage, assign technicians, and resolve resident complaints across all your PG hostels.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] bg-white hover:bg-[#F5F8FC] text-[#102A56] text-sm font-bold transition-all shadow-2xs cursor-pointer"
              title="Download complaint reports in CSV"
            >
              <Download className="w-4 h-4 text-[#0F8B83]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-sm font-bold transition-all shadow-xs cursor-pointer"
              title="Reload live complaints"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. INTERACTIVE MOBILE FILTER CHIPS (1-Tap Swipeable Row) */}
      {/* ======================================================== */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full">
        {/* All Tab */}
        <button
          onClick={() => handleQuickTabSelect('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            isQuickAll
              ? 'bg-[#102A56] text-white shadow-xs'
              : 'bg-white border border-[#E1EAF4] text-[#7186A5] hover:text-[#102A56]'
          }`}
        >
          <span>All Tickets</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isQuickAll ? 'bg-white/20 text-white' : 'bg-[#E8F7F5] text-[#0F8B83]'}`}>
            {stats.total}
          </span>
        </button>

        {/* Urgent Tab */}
        <button
          onClick={() => handleQuickTabSelect('URGENT')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            isQuickUrgent
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white border border-[#E1EAF4] text-rose-600 hover:bg-rose-50'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Urgent</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isQuickUrgent ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'}`}>
            {stats.urgentCount}
          </span>
        </button>

        {/* Pending Tab */}
        <button
          onClick={() => handleQuickTabSelect('PENDING')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            isQuickPending
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white border border-[#E1EAF4] text-amber-600 hover:bg-amber-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isQuickPending ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
            {stats.pending + stats.newComplaints}
          </span>
        </button>

        {/* In Progress Tab */}
        <button
          onClick={() => handleQuickTabSelect('PROGRESS')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            isQuickProgress
              ? 'bg-[#0F8B83] text-white shadow-xs'
              : 'bg-white border border-[#E1EAF4] text-[#0F8B83] hover:bg-[#E8F7F5]'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>In Progress</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isQuickProgress ? 'bg-white/20 text-white' : 'bg-[#E8F7F5] text-[#0F8B83]'}`}>
            {stats.inProgress}
          </span>
        </button>

        {/* Resolved Tab */}
        <button
          onClick={() => handleQuickTabSelect('RESOLVED')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            isQuickResolved
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-[#E1EAF4] text-emerald-600 hover:bg-emerald-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Resolved</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isQuickResolved ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
            {stats.resolved}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 4. DESKTOP STATS GRID (hidden on mobile, visible sm+)     */}
      {/* ======================================================== */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
        {/* Total */}
        <div 
          onClick={() => handleQuickTabSelect('ALL')}
          className={`bg-white border rounded-2xl p-4 shadow-xs flex items-center gap-3 cursor-pointer transition-all ${
            isQuickAll ? 'border-[#0F8B83] ring-2 ring-[#0F8B83]/20' : 'border-[#E1EAF4] hover:border-[#0F8B83]'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-[#E8F7F5] text-[#0F8B83] border border-[#0F8B83]/20 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#7186A5]">Total</div>
            <div className="text-xl lg:text-2xl font-black text-[#102A56]">{stats.total}</div>
            <div className="text-[10px] text-[#7186A5] truncate">All properties</div>
          </div>
        </div>

        {/* Pending */}
        <div 
          onClick={() => handleQuickTabSelect('PENDING')}
          className={`bg-white border rounded-2xl p-4 shadow-xs flex items-center gap-3 cursor-pointer transition-all ${
            isQuickPending ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-[#E1EAF4] hover:border-amber-400'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#7186A5]">Pending</div>
            <div className="text-xl lg:text-2xl font-black text-amber-600">{stats.pending + stats.newComplaints}</div>
            <div className="text-[10px] text-[#7186A5] truncate">Awaiting review</div>
          </div>
        </div>

        {/* In Progress */}
        <div 
          onClick={() => handleQuickTabSelect('PROGRESS')}
          className={`bg-white border rounded-2xl p-4 shadow-xs flex items-center gap-3 cursor-pointer transition-all ${
            isQuickProgress ? 'border-[#0F8B83] ring-2 ring-[#0F8B83]/20' : 'border-[#E1EAF4] hover:border-[#0F8B83]'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
            <RotateCw className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#7186A5]">In Progress</div>
            <div className="text-xl lg:text-2xl font-black text-blue-600">{stats.inProgress}</div>
            <div className="text-[10px] text-[#7186A5] truncate">Assigned to staff</div>
          </div>
        </div>

        {/* Resolved */}
        <div 
          onClick={() => handleQuickTabSelect('RESOLVED')}
          className={`bg-white border rounded-2xl p-4 shadow-xs flex items-center gap-3 cursor-pointer transition-all ${
            isQuickResolved ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-[#E1EAF4] hover:border-emerald-400'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#7186A5]">Resolved</div>
            <div className="text-xl lg:text-2xl font-black text-emerald-600">{stats.resolved}</div>
            <div className="text-[10px] text-[#7186A5] truncate">Closed tickets</div>
          </div>
        </div>

        {/* Urgent */}
        <div 
          onClick={() => handleQuickTabSelect('URGENT')}
          className={`bg-white border rounded-2xl p-4 shadow-xs flex items-center gap-3 cursor-pointer transition-all ${
            isQuickUrgent ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-[#E1EAF4] hover:border-rose-400'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#7186A5]">Urgent</div>
            <div className="text-xl lg:text-2xl font-black text-rose-600">{stats.urgentCount}</div>
            <div className="text-[10px] text-[#7186A5] truncate">High priority</div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. SEARCH & FILTER BAR                                   */}
      {/* ======================================================== */}
      <OwnerFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPg={selectedPg}
        onPgChange={setSelectedPg}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedDateRange={selectedDateRange}
        onDateRangeChange={setSelectedDateRange}
        onResetFilters={resetAllFilters}
        totalFiltered={filteredComplaints.length}
        totalCount={complaints.length}
      />

      {/* ======================================================== */}
      {/* 6. RESPONSIVE COMPLAINT CARDS / TABLE                    */}
      {/* ======================================================== */}
      <OwnerComplaintTable
        complaints={filteredComplaints}
        onViewDetails={(complaint) => setActiveComplaint(complaint)}
        onQuickStatusChange={handleQuickStatusChange}
        onQuickPriorityChange={handleQuickPriorityChange}
        onQuickAssignStaff={handleQuickAssignStaff}
        onRequestResolve={(complaint) => setResolveTarget(complaint)}
        onRequestDelete={(complaint) => setDeleteTarget(complaint)}
      />

      {/* ======================================================== */}
      {/* 7. DETAIL SLIDE-IN PANEL (Bottom-sheet on mobile)        */}
      {/* ======================================================== */}
      <ComplaintSidePanel
        complaint={activeComplaint}
        isOpen={!!activeComplaint}
        onClose={() => setActiveComplaint(null)}
        onUpdateComplaint={handleUpdateComplaint}
        onResolveQuick={(complaint) => setResolveTarget(complaint)}
      />

      {/* ======================================================== */}
      {/* 8. CONFIRMATION DIALOGS                                  */}
      {/* ======================================================== */}
      <ConfirmationDialog
        isOpen={!!resolveTarget}
        title="Mark Ticket as Resolved?"
        description={`Are you sure you want to resolve complaint "${resolveTarget?.title}"? Resident ${resolveTarget?.student.name} will be notified.`}
        confirmText="Confirm Resolution"
        cancelText="Cancel"
        variant="success"
        onConfirm={handleConfirmResolve}
        onCancel={() => setResolveTarget(null)}
      />

      <ConfirmationDialog
        isOpen={!!deleteTarget}
        title="Delete Complaint Ticket?"
        description={`Are you sure you want to delete ticket ${deleteTarget?.id}? This action removes all notes, photos, and history.`}
        confirmText="Delete Complaint"
        cancelText="Keep Ticket"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
