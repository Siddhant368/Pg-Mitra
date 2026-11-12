"use client";

import React, { useState } from "react";
import { 
  Eye, 
  Edit3, 
  BedDouble, 
  CreditCard, 
  Send, 
  MoreVertical, 
  Phone, 
  Mail, 
  MessageCircle, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  Building2, 
  Calendar, 
  UserCheck, 
  UserX, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Copy,
  Sparkles
} from "lucide-react";
import { Student, RentStatus, VerificationStatus, AccountStatus } from "@/types/student";

interface StudentGridViewProps {
  students: Student[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onAssignRoom: (student: Student) => void;
  onRecordRent: (student: Student) => void;
  onSendNotification: (student: Student) => void;
  onApproveVerification: (student: Student) => void;
  onRejectVerification: (student: Student) => void;
  onToggleActiveStatus: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;

  // Pagination
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function StudentGridView({
  students,
  selectedIds,
  onToggleSelect,
  onViewStudent,
  onEditStudent,
  onAssignRoom,
  onRecordRent,
  onSendNotification,
  onApproveVerification,
  onRejectVerification,
  onToggleActiveStatus,
  onDeleteStudent,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: StudentGridViewProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const copyToClipboard = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

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

  return (
    <div className="space-y-4">
      {/* Grid of Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {students.map((student, idx) => {
          const isSelected = selectedIds.includes(student.id);
          const initials = getInitials(student.name);
          const cleanPhone = student.phone.replace(/[^0-9]/g, "");

          return (
            <div
              key={student.id}
              className={`group relative bg-white/95 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:shadow-[#102A56]/5 hover:-translate-y-1 flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? "border-[#0F8B83] ring-2 ring-[#0F8B83]/20 shadow-md bg-gradient-to-b from-[#E8F7F5]/20 to-white"
                  : "border-[#E1EAF4] hover:border-[#0F8B83]/40"
              }`}
            >
              {/* Top Accent bar */}
              <div 
                className={`h-1.5 w-full ${
                  student.rentStatus === "OVERDUE"
                    ? "bg-gradient-to-r from-rose-500 to-red-600"
                    : student.rentStatus === "PENDING"
                    ? "bg-gradient-to-r from-amber-400 to-amber-500"
                    : "bg-gradient-to-r from-[#0F8B83] to-[#34D399]"
                }`}
              />

              <div className="p-3.5 sm:p-4.5 space-y-3 sm:space-y-3.5 flex-1 flex flex-col justify-between">
                {/* Header: Avatar, Status, Checkbox */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(student.id)}
                      className="w-4 h-4 rounded text-[#0F8B83] border-[#E1EAF4] focus:ring-[#0F8B83] cursor-pointer accent-[#0F8B83] shrink-0"
                      aria-label={`Select ${student.name}`}
                    />

                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div
                        onClick={() => onViewStudent(student)}
                        className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${getAvatarGradient(
                          idx
                        )} text-white flex items-center justify-center font-extrabold text-sm shadow-md cursor-pointer group-hover:scale-105 transition-transform`}
                      >
                        {initials}
                      </div>
                      {/* Active Status Ring */}
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          student.accountStatus === "ACTIVE"
                            ? "bg-[#16A34A]"
                            : student.accountStatus === "NOTICE"
                            ? "bg-amber-500"
                            : "bg-slate-400"
                        }`}
                        title={student.accountStatus}
                      />
                    </div>

                    {/* Name & ID */}
                    <div className="min-w-0">
                      <h3
                        onClick={() => onViewStudent(student)}
                        className="font-extrabold text-sm text-[#102A56] hover:text-[#0F8B83] transition-colors truncate cursor-pointer"
                        title={student.name}
                      >
                        {student.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#F5F8FC] text-[#0F8B83] border border-[#0F8B83]/20 font-mono">
                          {student.studentId}
                        </span>
                        {student.verificationStatus === "VERIFIED" ? (
                          <span className="text-[10px] font-semibold text-[#16A34A] flex items-center gap-0.5" title="KYC Verified">
                            <ShieldCheck className="w-3 h-3" />
                          </span>
                        ) : student.verificationStatus === "PENDING" ? (
                          <span className="text-[10px] font-semibold text-amber-600 flex items-center gap-0.5" title="KYC Pending">
                            <ShieldAlert className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-rose-600 flex items-center gap-0.5" title="KYC Rejected">
                            <ShieldX className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3-Dot Menu */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(activeDropdownId === student.id ? null : student.id);
                      }}
                      className="p-1.5 rounded-lg text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-colors cursor-pointer"
                      aria-label="Actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeDropdownId === student.id && (
                      <div className="absolute right-0 top-7 w-48 bg-white rounded-xl shadow-xl border border-[#E1EAF4] py-1 z-30 animate-in fade-in zoom-in-95 duration-150 text-left">
                        <button
                          onClick={() => {
                            onViewStudent(student);
                            setActiveDropdownId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC]"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#0F8B83]" />
                          <span>View Profile Dossier</span>
                        </button>
                        <button
                          onClick={() => {
                            onRecordRent(student);
                            setActiveDropdownId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC]"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Collect / Record Rent</span>
                        </button>
                        <button
                          onClick={() => {
                            onAssignRoom(student);
                            setActiveDropdownId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC]"
                        >
                          <BedDouble className="w-3.5 h-3.5 text-sky-600" />
                          <span>Change / Reassign Room</span>
                        </button>
                        <button
                          onClick={() => {
                            onEditStudent(student);
                            setActiveDropdownId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC]"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#7186A5]" />
                          <span>Edit Student Details</span>
                        </button>
                        <button
                          onClick={() => {
                            onSendNotification(student);
                            setActiveDropdownId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC]"
                        >
                          <Send className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Send Notice / Alert</span>
                        </button>
                        <div className="h-px bg-[#E1EAF4] my-1" />
                        <button
                          onClick={() => {
                            onToggleActiveStatus(student);
                            setActiveDropdownId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-50"
                        >
                          {student.accountStatus === "ACTIVE" ? (
                            <>
                              <UserX className="w-3.5 h-3.5" />
                              <span>Set as Inactive</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Set as Active</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            onDeleteStudent(student);
                            setActiveDropdownId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Student</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Room & Accommodation Pill */}
                <div className="p-2.5 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-white border border-[#E1EAF4] text-[#0F8B83] flex items-center justify-center shrink-0">
                      <BedDouble className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-[#102A56] truncate flex items-center gap-1">
                        <span>Room {student.accommodation.roomNumber}</span>
                        <span className="text-[11px] font-semibold text-[#0F8B83]">
                          ({student.accommodation.bedNumber})
                        </span>
                      </div>
                      <div className="text-[10px] text-[#7186A5] truncate">
                        {student.accommodation.pgName}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#7186A5] border border-[#E1EAF4] shrink-0">
                    {student.accommodation.sharingType}
                  </span>
                </div>

                {/* Academic Tag */}
                <div className="text-xs text-[#7186A5] truncate flex items-center gap-1.5">
                  <span className="font-semibold text-[#102A56] truncate">{student.academic.course}</span>
                  <span>•</span>
                  <span className="truncate">{student.academic.college}</span>
                </div>

                {/* Direct Action Quick Contact Dock */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {/* WhatsApp Direct Chat */}
                  <a
                    href={`https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(student.name)},%20this%20is%20from%20PG%20Management.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#16A34A] text-xs font-bold border border-emerald-200 transition-colors"
                    title="Send WhatsApp message"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Direct Call */}
                  <a
                    href={`tel:${student.phone}`}
                    className="inline-flex items-center justify-center gap-1 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold border border-sky-200 transition-colors"
                    title="Call student"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>

                  {/* Copy Phone */}
                  <button
                    onClick={(e) => copyToClipboard(student.phone, `grid-phone-${student.id}`, e)}
                    className="inline-flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#F5F8FC] hover:bg-slate-200/70 text-[#7186A5] hover:text-[#102A56] text-xs font-bold border border-[#E1EAF4] transition-colors"
                    title="Copy phone number"
                  >
                    {copiedId === `grid-phone-${student.id}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                        <span className="text-[#16A34A]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Rent Status & Monthly Fee Bar */}
                <div className="pt-2 border-t border-[#E1EAF4]/80 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#7186A5]">Monthly Rent</div>
                    <div className="text-sm font-extrabold text-[#102A56] font-mono">
                      ₹{student.accommodation.monthlyRent.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div>
                    {student.rentStatus === "PAID" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                        Paid
                      </span>
                    )}
                    {student.rentStatus === "PENDING" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
                        Due ₹{student.rentDueAmount.toLocaleString("en-IN")}
                      </span>
                    )}
                    {student.rentStatus === "OVERDUE" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                        Overdue ₹{student.rentDueAmount.toLocaleString("en-IN")}
                      </span>
                    )}
                    {student.rentStatus === "PARTIAL" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                        Part Due ₹{student.rentDueAmount.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onViewStudent(student)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#F5F8FC] hover:bg-[#E8F7F5] text-[#102A56] hover:text-[#0F8B83] border border-[#E1EAF4] hover:border-[#0F8B83]/30 text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Dossier</span>
                  </button>
                  <button
                    onClick={() => onRecordRent(student)}
                    className="py-2 px-3 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1 shadow-sm shadow-[#0F8B83]/20"
                    title="Collect or record rent"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Rent</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern 2026 Pagination Controls */}
      <div className="bg-white rounded-2xl border border-[#E1EAF4] p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 text-xs text-[#7186A5]">
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
              className="py-1 px-2 rounded-lg border border-[#E1EAF4] bg-white text-xs font-semibold text-[#102A56] focus:border-[#0F8B83] focus:ring-1 focus:ring-[#0F8B83] cursor-pointer"
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
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
            // Only show nearby pages if many
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
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