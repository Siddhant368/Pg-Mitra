"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronUp, 
  ChevronDown, 
  MoreVertical, 
  Eye, 
  Edit3, 
  BedDouble, 
  CreditCard, 
  Send, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  Phone, 
  Mail, 
  Copy, 
  Check, 
  Calendar, 
  Building2, 
  ArrowUpDown, 
  UserX, 
  UserCheck, 
  ChevronLeft, 
  ChevronRight,
  MessageCircle,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { Student, RentStatus, VerificationStatus, AccountStatus } from "@/types/student";

export type SortField = "name" | "joiningDate" | "room" | "rentAmount" | "verificationStatus";
export type SortOrder = "asc" | "desc";

interface StudentTableProps {
  students: Student[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  isAllSelected: boolean;
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onAssignRoom: (student: Student) => void;
  onRecordRent: (student: Student) => void;
  onSendNotification: (student: Student) => void;
  onApproveVerification: (student: Student) => void;
  onRejectVerification: (student: Student) => void;
  onToggleActiveStatus: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;

  // Sorting
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;

  // Pagination
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function StudentTable({
  students,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
  onViewStudent,
  onEditStudent,
  onAssignRoom,
  onRecordRent,
  onSendNotification,
  onApproveVerification,
  onRejectVerification,
  onToggleActiveStatus,
  onDeleteStudent,
  sortField,
  sortOrder,
  onSort,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: StudentTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Close actions dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (target && !target.closest("[data-student-action-menu]")) {
        setActiveDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copyToClipboard = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Avatar gradient styles
  const getAvatarGradient = (index: number) => {
    const gradients = [
      "from-[#0F8B83] to-[#08756E]",
      "from-indigo-600 to-blue-700",
      "from-emerald-600 to-teal-700",
      "from-violet-600 to-purple-800",
      "from-teal-600 to-cyan-700",
    ];
    return gradients[index % gradients.length];
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-[#7186A5] opacity-40 group-hover:opacity-100 transition-opacity" />;
    }
    return sortOrder === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5 text-[#0F8B83]" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-[#0F8B83]" />
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E1EAF4] shadow-sm overflow-hidden flex flex-col">
      {/* 1. Desktop & Tablet Modern 2026 Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-[#102A56] border-collapse">
          {/* Frosted / Styled Table Header */}
          <thead className="bg-[#F5F8FC]/90 backdrop-blur-xs text-[#7186A5] border-b border-[#E1EAF4] select-none text-[11px] font-black uppercase tracking-wider">
            <tr>
              {/* Checkbox column */}
              <th scope="col" className="w-12 px-4 py-3.5 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded text-[#0F8B83] border-[#E1EAF4] focus:ring-[#0F8B83] cursor-pointer accent-[#0F8B83]"
                  aria-label="Select all students"
                />
              </th>

              {/* Resident Profile */}
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => onSort("name")}
                  className="flex items-center gap-1.5 hover:text-[#102A56] group cursor-pointer transition-colors"
                >
                  <span>Resident Profile</span>
                  {renderSortIndicator("name")}
                </button>
              </th>

              {/* Instant Contact */}
              <th scope="col" className="px-4 py-3.5">
                <span>Quick Contact</span>
              </th>

              {/* PG / Accommodation */}
              <th scope="col" className="px-4 py-3.5">
                <span>Property</span>
              </th>

              {/* Room & Bed */}
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => onSort("room")}
                  className="flex items-center gap-1.5 hover:text-[#102A56] group cursor-pointer transition-colors"
                >
                  <span>Room & Bed</span>
                  {renderSortIndicator("room")}
                </button>
              </th>

              {/* Rent & Dues */}
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => onSort("rentAmount")}
                  className="flex items-center gap-1.5 hover:text-[#102A56] group cursor-pointer transition-colors"
                >
                  <span>Rent Status</span>
                  {renderSortIndicator("rentAmount")}
                </button>
              </th>

              {/* KYC Status */}
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => onSort("verificationStatus")}
                  className="flex items-center gap-1.5 hover:text-[#102A56] group cursor-pointer transition-colors"
                >
                  <span>KYC Status</span>
                  {renderSortIndicator("verificationStatus")}
                </button>
              </th>

              {/* Account State */}
              <th scope="col" className="px-4 py-3.5 text-center">
                <span>Status</span>
              </th>

              {/* Actions Column */}
              <th scope="col" className="px-4 py-3.5 text-right">
                <span>Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E1EAF4]/70">
            {students.map((student, idx) => {
              const isSelected = selectedIds.includes(student.id);
              const initials = student.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              const cleanPhone = student.phone.replace(/[^0-9]/g, "");

              return (
                <tr
                  key={student.id}
                  className={`group transition-all duration-150 hover:bg-[#F5F8FC] ${
                    isSelected ? "bg-[#E8F7F5]/50 border-l-4 border-l-[#0F8B83]" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(student.id)}
                      className="w-4 h-4 rounded text-[#0F8B83] border-[#E1EAF4] focus:ring-[#0F8B83] cursor-pointer accent-[#0F8B83]"
                      aria-label={`Select ${student.name}`}
                    />
                  </td>

                  {/* Resident Profile (Avatar, Name, ID, Course) */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div
                          onClick={() => onViewStudent(student)}
                          className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${getAvatarGradient(
                            idx
                          )} text-white flex items-center justify-center font-extrabold text-xs shadow-2xs cursor-pointer hover:scale-105 transition-transform`}
                          title="Click to view dossier"
                        >
                          {initials}
                        </div>
                        {/* Status Dot */}
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                            student.accountStatus === "ACTIVE"
                              ? "bg-[#16A34A]"
                              : student.accountStatus === "NOTICE"
                              ? "bg-amber-500"
                              : "bg-slate-400"
                          }`}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onViewStudent(student)}
                            className="font-extrabold text-[#102A56] hover:text-[#0F8B83] transition-colors truncate text-left cursor-pointer text-sm"
                          >
                            {student.name}
                          </button>
                          <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md bg-[#F5F8FC] text-[#0F8B83] border border-[#0F8B83]/20">
                            {student.studentId}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#7186A5] truncate flex items-center gap-1 mt-0.5">
                          <span className="font-semibold text-slate-700">{student.academic.course}</span>
                          <span>•</span>
                          <span className="truncate max-w-[150px]">{student.academic.college}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Quick Contact (WhatsApp, Call, Copy) */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {/* WhatsApp Button */}
                      <a
                        href={`https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(
                          student.name
                        )},%20this%20is%20from%20PG%20Management.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#16A34A] text-[11px] font-bold border border-emerald-200 transition-colors shadow-2xs"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </a>

                      {/* Call Button */}
                      <a
                        href={`tel:${student.phone}`}
                        className="p-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors shadow-2xs"
                        title={`Call ${student.phone}`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>

                      {/* Copy Phone */}
                      <button
                        onClick={(e) => copyToClipboard(student.phone, `table-phone-${student.id}`, e)}
                        className="p-1.5 rounded-xl hover:bg-slate-100 text-[#7186A5] hover:text-[#102A56] transition-colors"
                        title="Copy phone"
                      >
                        {copiedId === `table-phone-${student.id}` ? (
                          <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* PG / Property */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 rounded-lg bg-[#E8F7F5] text-[#0F8B83] flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-[#102A56] truncate">
                          {student.accommodation.pgName}
                        </div>
                        <div className="text-[10px] text-[#7186A5] truncate">
                          {student.accommodation.building || "Main Block"} • Floor {student.accommodation.floor}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Room Number & Bed */}
                  <td className="px-4 py-3.5">
                    <div className="inline-flex flex-col">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F5F8FC] text-[#102A56] border border-[#E1EAF4] font-extrabold text-xs">
                        <BedDouble className="w-3.5 h-3.5 text-[#0F8B83]" />
                        <span>Room {student.accommodation.roomNumber}</span>
                        <span className="text-[#0F8B83]">({student.accommodation.bedNumber})</span>
                      </div>
                      <span className="text-[10px] font-medium text-[#7186A5] mt-0.5 pl-1">
                        {student.accommodation.sharingType} Sharing
                      </span>
                    </div>
                  </td>

                  {/* Rent Status & Dues */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="space-y-1">
                      {student.rentStatus === "PAID" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                          Paid
                        </span>
                      )}
                      {student.rentStatus === "PENDING" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
                          Pending (₹{student.rentDueAmount.toLocaleString("en-IN")})
                        </span>
                      )}
                      {student.rentStatus === "OVERDUE" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                          Overdue (₹{student.rentDueAmount.toLocaleString("en-IN")})
                        </span>
                      )}
                      {student.rentStatus === "PARTIAL" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                          Partial (₹{student.rentDueAmount.toLocaleString("en-IN")})
                        </span>
                      )}
                      <div className="text-[11px] font-mono font-bold text-[#102A56] pl-1">
                        ₹{student.accommodation.monthlyRent.toLocaleString("en-IN")}/mo
                      </div>
                    </div>
                  </td>

                  {/* KYC Verification with 1-Click Approve */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {student.verificationStatus === "VERIFIED" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    ) : student.verificationStatus === "PENDING" ? (
                      <div className="inline-flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#D97706]">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Review
                        </span>
                        <button
                          onClick={() => onApproveVerification(student)}
                          className="px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold shadow-2xs transition-colors"
                          title="Instant Verify Resident"
                        >
                          Approve
                        </button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <ShieldX className="w-3.5 h-3.5" />
                        Rejected
                      </span>
                    )}
                  </td>

                  {/* Account Status */}
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold ${
                        student.accountStatus === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : student.accountStatus === "NOTICE"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : student.accountStatus === "BLACKLISTED"
                          ? "bg-rose-600 text-white"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {student.accountStatus}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap relative">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Profile Drawer */}
                      <button
                        onClick={() => onViewStudent(student)}
                        className="p-1.5 rounded-xl text-[#7186A5] hover:text-[#0F8B83] hover:bg-[#E8F7F5] transition-colors cursor-pointer"
                        title="View Full Profile Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Quick Record Rent */}
                      <button
                        onClick={() => onRecordRent(student)}
                        className="p-1.5 rounded-xl text-[#7186A5] hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="Collect Rent"
                      >
                        <CreditCard className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu Trigger */}
                      <div className="relative" data-student-action-menu>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(activeDropdownId === student.id ? null : student.id);
                          }}
                          className="p-1.5 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-colors cursor-pointer"
                          aria-label="More actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Popup */}
                        {activeDropdownId === student.id && (
                          <div className="absolute right-0 top-8 w-52 bg-white rounded-2xl shadow-2xl border border-[#E1EAF4] py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 text-left">
                            <button
                              onClick={() => {
                                onViewStudent(student);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC]"
                            >
                              <Eye className="w-4 h-4 text-[#0F8B83]" />
                              <span>View Resident Dossier</span>
                            </button>

                            <button
                              onClick={() => {
                                onRecordRent(student);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC]"
                            >
                              <CreditCard className="w-4 h-4 text-emerald-600" />
                              <span>Collect / Record Rent</span>
                            </button>

                            <button
                              onClick={() => {
                                onAssignRoom(student);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC]"
                            >
                              <BedDouble className="w-4 h-4 text-sky-600" />
                              <span>Reassign / Transfer Room</span>
                            </button>

                            <button
                              onClick={() => {
                                onEditStudent(student);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC]"
                            >
                              <Edit3 className="w-4 h-4 text-[#7186A5]" />
                              <span>Edit Resident Info</span>
                            </button>

                            <button
                              onClick={() => {
                                onSendNotification(student);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC]"
                            >
                              <Send className="w-4 h-4 text-indigo-600" />
                              <span>Send Notice / Alert</span>
                            </button>

                            <div className="h-px bg-[#E1EAF4] my-1" />

                            <button
                              onClick={() => {
                                onToggleActiveStatus(student);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-50"
                            >
                              {student.accountStatus === "ACTIVE" ? (
                                <>
                                  <UserX className="w-4 h-4" />
                                  <span>Mark Notice Period</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4" />
                                  <span>Mark Active Resident</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => {
                                onDeleteStudent(student);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Remove / Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 2. Mobile Responsive Streamlined Bento Cards (Zero Clutter) */}
      <div className="md:hidden divide-y divide-[#E1EAF4]/60 p-2 sm:p-0 space-y-2.5 sm:space-y-0">
        {students.map((student, idx) => {
          const isSelected = selectedIds.includes(student.id);
          const initials = student.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          const cleanPhone = student.phone.replace(/[^0-9]/g, "");

          return (
            <div
              key={student.id}
              className={`p-3.5 rounded-2xl border transition-all duration-200 space-y-2.5 ${
                isSelected
                  ? "bg-[#E8F7F5]/40 border-[#0F8B83] shadow-xs"
                  : "bg-white border-[#E1EAF4] shadow-2xs"
              }`}
            >
              {/* Top Row: Checkbox, Avatar, Name & 3-Dot Menu */}
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(student.id)}
                    className="w-4 h-4 rounded text-[#0F8B83] border-[#E1EAF4] focus:ring-[#0F8B83] cursor-pointer accent-[#0F8B83] shrink-0"
                    aria-label={`Select ${student.name}`}
                  />
                  
                  <div className="relative shrink-0">
                    <div
                      onClick={() => onViewStudent(student)}
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${getAvatarGradient(
                        idx
                      )} text-white flex items-center justify-center font-black text-xs shadow-2xs cursor-pointer`}
                    >
                      {initials}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        student.accountStatus === "ACTIVE"
                          ? "bg-[#16A34A]"
                          : student.accountStatus === "NOTICE"
                          ? "bg-amber-500"
                          : "bg-slate-400"
                      }`}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => onViewStudent(student)}
                        className="font-extrabold text-sm text-[#102A56] hover:text-[#0F8B83] truncate text-left"
                      >
                        {student.name}
                      </button>
                      <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded-md bg-[#F5F8FC] text-[#0F8B83] border border-[#0F8B83]/20">
                        {student.studentId}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#7186A5] truncate mt-0.5">
                      {student.academic.course} • {student.accommodation.pgName}
                    </div>
                  </div>
                </div>

                {/* 3-Dot Action Menu */}
                <div className="relative shrink-0" data-student-action-menu>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdownId(activeDropdownId === student.id ? null : student.id);
                    }}
                    className="p-1.5 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC]"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeDropdownId === student.id && (
                    <div className="absolute right-0 top-8 w-48 bg-white rounded-2xl shadow-2xl border border-[#E1EAF4] py-1.5 z-40 text-left">
                      <button
                        onClick={() => {
                          onViewStudent(student);
                          setActiveDropdownId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC]"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#0F8B83]" />
                        <span>View Dossier</span>
                      </button>
                      <button
                        onClick={() => {
                          onRecordRent(student);
                          setActiveDropdownId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC]"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Collect Rent</span>
                      </button>
                      <button
                        onClick={() => {
                          onAssignRoom(student);
                          setActiveDropdownId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC]"
                      >
                        <BedDouble className="w-3.5 h-3.5 text-sky-600" />
                        <span>Transfer Room</span>
                      </button>
                      <button
                        onClick={() => {
                          onEditStudent(student);
                          setActiveDropdownId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC]"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#7186A5]" />
                        <span>Edit Info</span>
                      </button>
                      <div className="h-px bg-[#E1EAF4] my-1" />
                      <button
                        onClick={() => {
                          onDeleteStudent(student);
                          setActiveDropdownId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Middle Row: Room & Financial Status */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4] flex items-center gap-1.5">
                  <BedDouble className="w-3.5 h-3.5 text-[#0F8B83] shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#7186A5] font-semibold">Room & Bed</div>
                    <div className="font-extrabold text-[#102A56] truncate">
                      Room {student.accommodation.roomNumber} ({student.accommodation.bedNumber})
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#0F8B83] shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#7186A5] font-semibold">Rent Status</div>
                    <div className="font-extrabold text-[#102A56] truncate">
                      {student.rentStatus === "PAID" ? (
                        <span className="text-[#16A34A]">Paid (₹{student.accommodation.monthlyRent.toLocaleString("en-IN")})</span>
                      ) : (
                        <span className="text-rose-600">Due ₹{student.rentDueAmount.toLocaleString("en-IN")}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action Strip (Thumb-Friendly Touch Dock) */}
              <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-[#E1EAF4]/70">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(student.name)},%20this%20is%20from%20PG%20Management.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-emerald-50 text-[#16A34A] border border-emerald-200 text-xs font-bold transition-colors active:scale-95"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Chat</span>
                </a>

                {/* Call */}
                <a
                  href={`tel:${student.phone}`}
                  className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold transition-colors active:scale-95"
                  title="Call"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Call</span>
                </a>

                {/* Collect Rent */}
                <button
                  onClick={() => onRecordRent(student)}
                  className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-[#0F8B83] text-white text-xs font-bold transition-colors active:scale-95 shadow-2xs"
                  title="Collect Rent"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Rent</span>
                </button>

                {/* Dossier */}
                <button
                  onClick={() => onViewStudent(student)}
                  className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-[#F5F8FC] text-[#102A56] border border-[#E1EAF4] text-xs font-bold transition-colors active:scale-95"
                  title="View Profile"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Profile</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. 2026 Pagination Controls */}
      <div className="bg-[#F5F8FC]/50 border-t border-[#E1EAF4] p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-[#7186A5]">
          <span>
            Showing <strong className="text-[#102A56]">{startItem}</strong> to{" "}
            <strong className="text-[#102A56]">{endItem}</strong> of{" "}
            <strong className="text-[#102A56]">{totalItems}</strong> residents
          </span>

          <div className="h-4 w-px bg-[#E1EAF4]" />

          <div className="flex items-center gap-1.5">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="py-1 px-2 rounded-lg border border-[#E1EAF4] bg-white text-xs font-bold text-[#102A56] focus:border-[#0F8B83] cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 rounded-xl border border-[#E1EAF4] bg-white text-[#102A56] hover:bg-[#F5F8FC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 rounded-xl text-xs font-extrabold transition-all ${
                    currentPage === pageNum
                      ? "bg-[#0F8B83] text-white shadow-xs"
                      : "text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            }
            if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
              return (
                <span key={pageNum} className="px-1 text-xs text-[#7186A5]">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-xl border border-[#E1EAF4] bg-white text-[#102A56] hover:bg-[#F5F8FC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}