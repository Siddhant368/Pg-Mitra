'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Eye, 
  MoreVertical, 
  CheckCircle2, 
  Trash2, 
  Flame, 
  Tag, 
  Phone,
  MessageCircle,
  Clock,
  User,
  AlertCircle,
  Inbox,
  ChevronRight
} from 'lucide-react';
import { Complaint, ComplaintPriority, ComplaintStatus, StaffMember } from '@/types/complaint';
import { AVAILABLE_STAFF } from '@/lib/mockComplaints';

interface OwnerComplaintTableProps {
  complaints: Complaint[];
  onViewDetails: (complaint: Complaint) => void;
  onQuickStatusChange: (complaint: Complaint, status: ComplaintStatus) => void;
  onQuickPriorityChange: (complaint: Complaint, priority: ComplaintPriority) => void;
  onQuickAssignStaff: (complaint: Complaint, staffId: string) => void;
  onRequestResolve: (complaint: Complaint) => void;
  onRequestDelete: (complaint: Complaint) => void;
}

export default function OwnerComplaintTable({
  complaints,
  onViewDetails,
  onQuickStatusChange,
  onQuickPriorityChange,
  onQuickAssignStaff,
  onRequestResolve,
  onRequestDelete,
}: OwnerComplaintTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  // Helper for priority styling
  const getPriorityBadge = (priority: ComplaintPriority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'High':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Helper for status styling
  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-[#E8F7F5] text-[#0F8B83] border-[#0F8B83]/30';
      case 'Reviewed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Helper for status dot color
  const getStatusDot = (status: ComplaintStatus) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-500';
      case 'In Progress':
        return 'bg-[#0F8B83]';
      case 'Reviewed':
        return 'bg-blue-500';
      case 'Pending':
        return 'bg-amber-500';
      case 'Rejected':
        return 'bg-rose-500';
      default:
        return 'bg-slate-400';
    }
  };

  // Card Left Accent Border based on priority & status
  const getCardAccentBorder = (item: Complaint) => {
    if (item.status === 'Resolved') return 'border-l-4 border-l-emerald-500';
    if (item.priority === 'Urgent') return 'border-l-4 border-l-rose-500';
    if (item.priority === 'High') return 'border-l-4 border-l-amber-500';
    if (item.status === 'In Progress') return 'border-l-4 border-l-[#0F8B83]';
    return 'border-l-4 border-l-blue-400';
  };

  if (complaints.length === 0) {
    return (
      <div className="bg-white border border-[#E1EAF4] rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center w-full max-w-full">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E8F7F5] text-[#0F8B83] flex items-center justify-center mb-4 shadow-2xs">
          <Inbox className="w-7 h-7" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-[#102A56] mb-1">No Complaints Found</h3>
        <p className="text-xs sm:text-sm text-[#7186A5] max-w-sm mx-auto">
          No complaints match your active filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E1EAF4] rounded-2xl sm:rounded-3xl shadow-xs w-full max-w-full overflow-hidden">
      {/* ========================================================== */}
      {/* 1. DESKTOP VIEW: Zero-Horizontal-Scroll Fluid Table (lg+) */}
      {/* ========================================================== */}
      <div className="hidden lg:block w-full overflow-hidden">
        <table className="w-full table-fixed text-left border-collapse">
          <thead>
            <tr className="bg-[#F5F8FC] border-b border-[#E1EAF4] text-[11px] font-black uppercase tracking-wider text-[#7186A5]">
              <th className="py-3.5 px-4 w-[28%]">Resident & Room</th>
              <th className="py-3.5 px-4 w-[36%]">Complaint & Category</th>
              <th className="py-3.5 px-4 w-[16%]">Priority & Status</th>
              <th className="py-3.5 px-4 w-[10%]">Date</th>
              <th className="py-3.5 px-4 w-[10%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E1EAF4] text-xs">
            {complaints.map((item) => {
              const formattedDate = new Date(item.submittedDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
              });

              return (
                <tr
                  key={item.id}
                  onClick={() => onViewDetails(item)}
                  className="hover:bg-[#F5F8FC]/70 transition-colors cursor-pointer group"
                >
                  {/* Resident & Room */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F8B83]/20 to-[#08756E]/40 text-[#0F8B83] flex items-center justify-center font-bold text-xs shrink-0 border border-[#0F8B83]/20">
                        {item.student.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-[#102A56] group-hover:text-[#0F8B83] transition-colors truncate">
                            {item.student.name}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-[#0F8B83] bg-[#E8F7F5] px-1.5 py-0.2 rounded border border-[#0F8B83]/20">
                            #{item.student.roomNumber}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#7186A5] truncate">
                          {item.student.pgName}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Complaint Title & Details */}
                  <td className="py-3.5 px-4">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {item.id}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F7F5] text-[#0F8B83] border border-[#0F8B83]/20">
                          <Tag className="w-2.5 h-2.5" />
                          {item.category}
                        </span>
                      </div>
                      <div className="font-bold text-[#102A56] truncate text-xs sm:text-sm">
                        {item.title}
                      </div>
                      <p className="text-[11px] text-[#7186A5] truncate max-w-full">
                        {item.description}
                      </p>
                    </div>
                  </td>

                  {/* Priority & Status */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1.5 items-start">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[10px] border ${getPriorityBadge(item.priority)}`}>
                        {item.priority === 'Urgent' && <Flame className="w-3 h-3 text-rose-600" />}
                        {item.priority}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold text-[10px] border ${getStatusBadge(item.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(item.status)}`} />
                        {item.status}
                      </span>
                    </div>
                  </td>

                  {/* Date & Staff */}
                  <td className="py-3.5 px-4">
                    <div className="text-[11px] font-medium text-[#102A56]">
                      {formattedDate}
                    </div>
                    <div className="text-[10px] text-[#7186A5] truncate">
                      {item.assignedTo ? item.assignedTo.name : 'Unassigned'}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-1.5 relative">
                      <button
                        onClick={() => onViewDetails(item)}
                        className="px-2.5 py-1.5 rounded-xl bg-[#E8F7F5] hover:bg-[#0F8B83] text-[#0F8B83] hover:text-white font-bold text-xs transition-colors cursor-pointer"
                        title="View & Edit Complaint"
                      >
                        View
                      </button>

                      <button
                        onClick={(e) => toggleMenu(item.id, e)}
                        className="p-1.5 text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] rounded-lg transition-colors cursor-pointer"
                        aria-label="Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === item.id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#E1EAF4] rounded-2xl shadow-xl z-50 py-1.5 text-left divide-y divide-[#F5F8FC]"
                        >
                          {/* Quick Assign */}
                          <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7186A5]">
                            Assign Staff
                          </div>
                          <div className="py-1">
                            {AVAILABLE_STAFF.slice(0, 3).map((staff) => (
                              <button
                                key={staff.id}
                                onClick={() => {
                                  onQuickAssignStaff(item, staff.id);
                                  setActiveMenuId(null);
                                }}
                                className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-[#F5F8FC] flex items-center justify-between cursor-pointer ${
                                  item.assignedTo?.id === staff.id
                                    ? 'text-[#0F8B83] font-bold bg-[#E8F7F5]/50'
                                    : 'text-[#102A56]'
                                }`}
                              >
                                <span className="truncate">{staff.name}</span>
                                <span className="text-[10px] text-[#7186A5]">{staff.role.split(' ')[0]}</span>
                              </button>
                            ))}
                          </div>

                          {/* Quick Status */}
                          <div className="py-1">
                            <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7186A5]">
                              Change Status
                            </div>
                            {(['Pending', 'Reviewed', 'In Progress', 'Resolved'] as ComplaintStatus[]).map((st) => (
                              <button
                                key={st}
                                onClick={() => {
                                  onQuickStatusChange(item, st);
                                  setActiveMenuId(null);
                                }}
                                className={`w-full text-left px-3 py-1 text-xs transition-colors hover:bg-[#F5F8FC] flex items-center gap-1.5 cursor-pointer ${
                                  item.status === st ? 'text-[#0F8B83] font-bold' : 'text-[#102A56]'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(st)}`} />
                                {st}
                              </button>
                            ))}
                          </div>

                          {/* Resolve & Delete */}
                          <div className="py-1">
                            {item.status !== 'Resolved' && (
                              <button
                                onClick={() => {
                                  onRequestResolve(item);
                                  setActiveMenuId(null);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50 font-semibold flex items-center gap-1.5 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Mark as Resolved
                              </button>
                            )}

                            <button
                              onClick={() => {
                                onRequestDelete(item);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-1.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete Complaint
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================================================== */}
      {/* 2. ADVANCED MOBILE APP CARDS (lg:hidden - 100% Mobile UX)   */}
      {/* ========================================================== */}
      <div className="lg:hidden p-2.5 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-full overflow-hidden">
        {complaints.map((item) => {
          const formattedDate = new Date(item.submittedDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
          });

          const cleanPhone = item.student.phone.replace(/[^0-9]/g, '');

          return (
            <div
              key={item.id}
              onClick={() => onViewDetails(item)}
              className={`bg-white border border-[#E1EAF4] hover:border-[#0F8B83] rounded-2xl p-3.5 space-y-3 transition-all shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer w-full max-w-full overflow-hidden ${getCardAccentBorder(item)}`}
            >
              {/* Row 1: ID, Category, Priority, and Status */}
              <div className="flex items-center justify-between gap-1.5 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F5F8FC] text-[#0F8B83] border border-[#0F8B83]/20">
                    {item.id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F7F5] text-[#0F8B83] border border-[#0F8B83]/20">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${getPriorityBadge(item.priority)}`}>
                    {item.priority === 'Urgent' && <Flame className="w-3 h-3 inline mr-0.5" />}
                    {item.priority}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] border ${getStatusBadge(item.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(item.status)}`} />
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Row 2: Title and Description Preview */}
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[#102A56] line-clamp-1 leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-[#7186A5] line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Row 3: Resident Dossier Bar */}
              <div className="p-2.5 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4] flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0F8B83]/20 to-[#08756E]/40 text-[#0F8B83] flex items-center justify-center font-bold text-[11px] shrink-0 border border-[#0F8B83]/20">
                    {item.student.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-[#102A56] truncate text-xs">
                      {item.student.name}
                    </div>
                    <div className="text-[10px] text-[#7186A5] truncate">
                      Room #{item.student.roomNumber} · {item.student.pgName}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-[#7186A5] shrink-0 font-mono">
                  {formattedDate}
                </span>
              </div>

              {/* Row 4: Advanced Quick Action Bar (WhatsApp, Call, View, Resolve) */}
              <div className="flex items-center gap-1.5 pt-0.5" onClick={(e) => e.stopPropagation()}>
                {/* Direct WhatsApp button */}
                <a
                  href={`https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(item.student.name)},%20regarding%20your%20complaint%20%23${item.id}%20(${encodeURIComponent(item.title)}):%20`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors shrink-0"
                  title="WhatsApp Resident"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                {/* Direct Call button */}
                <a
                  href={`tel:${item.student.phone}`}
                  className="p-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors shrink-0"
                  title="Call Resident"
                >
                  <Phone className="w-4 h-4" />
                </a>

                {/* Open Ticket Details button */}
                <button
                  onClick={() => onViewDetails(item)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Ticket</span>
                </button>

                {/* Mark Resolved Quick Action */}
                {item.status !== 'Resolved' && (
                  <button
                    onClick={() => onRequestResolve(item)}
                    className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    title="Mark resolved"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
