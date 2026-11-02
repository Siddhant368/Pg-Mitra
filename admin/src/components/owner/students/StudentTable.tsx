"use client";

import React, { useState, useRef, useEffect } from "react";
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
  ChevronRight 
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close actions dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Helper badge renderers
  const renderRentBadge = (status: RentStatus, dueAmount: number) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
            Paid
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
            Pending (₹{dueAmount.toLocaleString("en-IN")})
          </span>
        );
      case "OVERDUE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            Overdue (₹{dueAmount.toLocaleString("en-IN")})
          </span>
        );
      case "PARTIAL":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
            Partial (₹{dueAmount.toLocaleString("en-IN")})
          </span>
        );
    }
  };

  const renderVerificationBadge = (status: VerificationStatus) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#16A34A]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#D97706]">
            <ShieldAlert className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldX className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
    }
  };

  const renderAccountBadge = (status: AccountStatus) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D]">
            Active
          </span>
        );
      case "INACTIVE":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-700">
            Inactive
          </span>
        );
      case "NOTICE":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Notice
          </span>
        );
      case "CHECKED_OUT":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
            Checked Out
          </span>
        );
      case "BLACKLISTED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-600 text-white">
            Blacklisted
          </span>
        );
    }
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-[#7186A5] opacity-40 group-hover:opacity-100" />;
    }
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 text-[#0F8B83]" />
    ) : (
      <ChevronDown className="w-4 h-4 text-[#0F8B83]" />
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E1EAF4] shadow-xs overflow-hidden flex flex-col">
      {/* 1. Desktop & Tablet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-[#102A56]">
          <thead className="bg-[#F5F8FC] text-[#7186A5] border-b border-[#E1EAF4] select-none text-[11px] font-bold uppercase tracking-wider">
            <tr>
              {/* Checkbox column */}
              <th scope="col" className="w-12 px-4 py-3.5 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded text-[#0F8B83] border-[#E1EAF4] focus:ring-[#0F8B83] cursor-pointer accent-[#0F8B83]"
                  aria-label="Select all students on current page"
                />
              </th>

              {/* Student Profile */}
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => onSort("name")}
                  className="flex items-center gap-1.5 hover:text-[#102A56] group cursor-pointer"
                >
                  <span>Student Profile</span>
                  {renderSortIndicator("name")}
                </button>
              </th>

              {/* Contact */}
              <th scope="col" className="px-4 py-3.5">
                <span>Contact Info</span>
              </th>

              {/* PG / Hostel */}
              <th scope="col" className="px-4 py-3.5">
                <span>PG / Hostel</span>
              </th>

              {/* Room Number */}
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => onSort("room")}
                  className="flex items-center gap-1.5 hover:text-[#102A56] group cursor-pointer"
                >
                  <span>Room & Bed</span>
                  {renderSortIndicator("room")}
                </button>
              </th>

              {/* Joining Date */}
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => onSort("joiningDate")}
                  className="flex items-center gap-1.5 hover:text-[#102A56] group cursor-pointer"
                >
                  <span>Joining Date</span>
                  {renderSortIndicator("joiningDate")}
                </button>
              </th>

              {/* Rent Status */}
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => onSort("rentAmount")}
                  className="flex items-center gap-1.5 hover:text-[#102A56] group cursor-pointer"
                >
                  <span>Rent Status</span>
                  {renderSortIndicator("rentAmount")}
                </button>
              </th>

              {/* Verification Status */}
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => onSort("verificationStatus")}
                  className="flex items-center gap-1.5 hover:text-[#102A56] group cursor-pointer"
                >
                  <span>Verification</span>
                  {renderSortIndicator("verificationStatus")}
                </button>
              </th>

              {/* Account Status */}
              <th scope="col" className="px-4 py-3.5 text-center">
                <span>Status</span>
              </th>

              {/* Actions */}
              <th scope="col" className="px-4 py-3.5 text-right">
                <span>Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E1EAF4]/70">
            {students.map((student) => {
              const isSelected = selectedIds.includes(student.id);
              const initials = student.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <tr
                  key={student.id}
                  className={`hover:bg-[#F5F8FC]/70 transition-colors group ${
                    isSelected ? "bg-[#E8F7F5]/50" : ""
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

                  {/* Student Profile (Avatar, Name, ID, College) */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => onViewStudent(student)}
                        className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F8B83] to-[#08756E] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs cursor-pointer hover:scale-105 transition-transform"
                        title="Click to view profile drawer"
                      >
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onViewStudent(student)}
                            className="font-bold text-[#102A56] hover:text-[#0F8B83] transition-colors truncate text-left cursor-pointer"
                          >
                            {student.name}
                          </button>
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-[#E8F7F5] text-[#0F8B83] border border-[#0F8B83]/15">
                            {student.studentId}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#7186A5] truncate flex items-center gap-1.5 mt-0.5">
                          <span>{student.academic.course}</span>
                          <span>•</span>
                          <span className="truncate max-w-[130px]">{student.academic.college}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info (Phone & Email with quick copy) */}
                  <td className="px-4 py-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#102A56]">
                        <Phone className="w-3.5 h-3.5 text-[#7186A5] shrink-0" />
                        <span className="font-mono text-xs">{student.phone}</span>
                        <button
                          onClick={() => copyToClipboard(student.phone, `phone-${student.id}`)}
                          className="text-[#7186A5] hover:text-[#0F8B83] p-0.5 rounded-sm"
                          title="Copy phone"
                        >
                          {copiedId === `phone-${student.id}` ? (
                            <Check className="w-3 h-3 text-[#16A34A]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-[#7186A5]">
                        <Mail className="w-3.5 h-3.5 text-[#7186A5] shrink-0" />
                        <span className="truncate max-w-[140px]">{student.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* PG / Hostel Name */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#0F8B83] shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-[#102A56] truncate">
                          {student.accommodation.pgName}
                        </div>
                        <div className="text-[11px] text-[#7186A5] truncate">
                          {student.accommodation.building || "Main Block"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Room Number & Bed */}
                  <td className="px-4 py-3.5">
                    <div className="inline-flex flex-col">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#F5F8FC] text-[#102A56] border border-[#E1EAF4] font-bold text-xs">
                        <BedDouble className="w-3.5 h-3.5 text-[#0F8B83]" />
                        <span>Room {student.accommodation.roomNumber}</span>
                        <span className="text-[#0F8B83]">({student.accommodation.bedNumber})</span>
                      </div>
                      <span className="text-[10px] text-[#7186A5] mt-0.5 pl-1">
                        {student.accommodation.sharingType} Sharing
                      </span>
                    </div>
                  </td>

                  {/* Joining Date */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-xs text-[#7186A5]">
                      <Calendar className="w-3.5 h-3.5 text-[#7186A5]" />
                      <span>{student.accommodation.joiningDate}</span>
                    </div>
                  </td>

                  {/* Rent Status */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="space-y-0.5">
                      {renderRentBadge(student.rentStatus, student.rentDueAmount)}
                      <div className="text-[10px] text-[#7186A5] pl-1">
                        ₹{student.accommodation.monthlyRent.toLocaleString("en-IN")}/mo
                      </div>
                    </div>
                  </td>

                  {/* Verification Status */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {renderVerificationBadge(student.verificationStatus)}
                  </td>

                  {/* Account Status */}
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    {renderAccountBadge(student.accountStatus)}
                  </td>

                  {/* Actions Column */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap relative">
                    <div className="flex items-center justify-end gap-1">
                      {/* Direct View Drawer Button */}
                      <button
                        onClick={() => onViewStudent(student)}
                        className="p-1.5 rounded-lg text-[#7186A5] hover:text-[#0F8B83] hover:bg-[#E8F7F5] transition-colors cursor-pointer"
                        title="View Full Profile Drawer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu Trigger */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(activeDropdownId === student.id ? null : student.id);
                          }}
                          className="p-1.5 rounded-lg text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-colors cursor-pointer"
                          aria-label="More actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu Popup */}
                        {activeDropdownId === student.id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 top-8 w-52 bg-white rounded-xl shadow-xl border border-[#E1EAF4] py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150 text-left"
                          >
                            <button
                              onClick={() => {
                                onViewStudent(student);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#102A56] hover:bg-[#F5F8FC] transition-colors"
                            >
                              <Eye className="w-4 h-4 text-[#0F8B83]" />
                              <span>View Profile</span>
                            </button>

                            <button
                              onClick={() => {
                                onEditStudent(student);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#102A56] hover:bg-[#F5F8FC] transition-colors"
                            >
                              <Edit3 className="w-4 h-4 text-[#0F8B83]" />
                              <span>Edit Details</span>
                            </button>

                            <button
                              onClick={() => {
                                onAssignRoom(student);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#102A56] hover:bg-[#F5F8FC] transition-colors"
                            >
                              <BedDouble className="w-4 h-4 text-sky-600" />
                              <span>Transfer / Assign Room</span>
                            </button>

                            <button
                              onClick={() => {
                                onRecordRent(student);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#102A56] hover:bg-[#F5F8FC] transition-colors"
                            >
                              <CreditCard className="w-4 h-4 text-emerald-600" />
                              <span>Collect Rent</span>
                            </button>

                            <button
                              onClick={() => {
                                onSendNotification(student);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#102A56] hover:bg-[#F5F8FC] transition-colors"
                            >
                              <Send className="w-4 h-4 text-[#0F8B83]" />
                              <span>Send Notification</span>
                            </button>

                            <div className="h-px bg-[#E1EAF4] my-1" />

                            {student.verificationStatus !== "VERIFIED" && (
                              <button
                                onClick={() => {
                                  onApproveVerification(student);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#16A34A] hover:bg-[#DCFCE7]/40 transition-colors"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Approve Verification</span>
                              </button>
                            )}

                            {student.verificationStatus !== "REJECTED" && (
                              <button
                                onClick={() => {
                                  onRejectVerification(student);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>Reject Verification</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                onToggleActiveStatus(student);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#7186A5] hover:bg-[#F5F8FC] transition-colors"
                            >
                              {student.accountStatus === "ACTIVE" ? (
                                <>
                                  <UserX className="w-4 h-4 text-amber-600" />
                                  <span>Deactivate Account</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 text-emerald-600" />
                                  <span>Activate Account</span>
                                </>
                              )}
                            </button>

                            <div className="h-px bg-[#E1EAF4] my-1" />

                            <button
                              onClick={() => {
                                onDeleteStudent(student);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete Student</span>
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

      {/* 2. Mobile Responsive Card View */}
      <div className="block md:hidden divide-y divide-[#E1EAF4]">
        {students.map((student) => {
          const isSelected = selectedIds.includes(student.id);
          const initials = student.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div
              key={student.id}
              className={`p-4 space-y-3 transition-colors ${
                isSelected ? "bg-[#E8F7F5]/50" : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(student.id)}
                    className="w-4 h-4 rounded text-[#0F8B83] border-[#E1EAF4] accent-[#0F8B83] shrink-0"
                  />
                  <div
                    onClick={() => onViewStudent(student)}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F8B83] to-[#08756E] text-white flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer"
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <button
                      onClick={() => onViewStudent(student)}
                      className="font-bold text-sm text-[#102A56] hover:text-[#0F8B83] text-left truncate block cursor-pointer"
                    >
                      {student.name}
                    </button>
                    <div className="flex items-center gap-1.5 text-xs text-[#7186A5]">
                      <span>{student.studentId}</span>
                      <span>•</span>
                      <span>{student.gender}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {renderAccountBadge(student.accountStatus)}
                </div>
              </div>

              {/* PG & Room badge */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F5F8FC]">
                <div className="flex items-center gap-1 text-[#102A56] font-medium truncate">
                  <Building2 className="w-3.5 h-3.5 text-[#0F8B83] shrink-0" />
                  <span className="truncate">{student.accommodation.pgName}</span>
                </div>
                <div className="px-2 py-0.5 rounded-lg bg-[#F5F8FC] border border-[#E1EAF4] font-bold text-[#0F8B83] shrink-0">
                  Room {student.accommodation.roomNumber} ({student.accommodation.bedNumber})
                </div>
              </div>

              {/* Rent & Verification Status */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div>{renderRentBadge(student.rentStatus, student.rentDueAmount)}</div>
                <div>{renderVerificationBadge(student.verificationStatus)}</div>
              </div>

              {/* Mobile Quick Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F5F8FC]">
                <button
                  onClick={() => onViewStudent(student)}
                  className="py-1.5 px-2 rounded-xl text-xs font-semibold bg-[#F5F8FC] text-[#102A56] border border-[#E1EAF4] flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-[#0F8B83]" />
                  <span>Details</span>
                </button>

                <button
                  onClick={() => onRecordRent(student)}
                  className="py-1.5 px-2 rounded-xl text-xs font-semibold bg-[#F5F8FC] text-[#102A56] border border-[#E1EAF4] flex items-center justify-center gap-1"
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Rent</span>
                </button>

                <button
                  onClick={() => onEditStudent(student)}
                  className="py-1.5 px-2 rounded-xl text-xs font-semibold bg-[#F5F8FC] text-[#102A56] border border-[#E1EAF4] flex items-center justify-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#0F8B83]" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Pagination Controls Bar */}
      <div className="p-4 bg-[#F5F8FC] border-t border-[#E1EAF4] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#7186A5]">
        {/* Left: Total counts & page size selector */}
        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="text-[#102A56]">{totalItems > 0 ? startItem : 0}</strong> to{" "}
            <strong className="text-[#102A56]">{endItem}</strong> of{" "}
            <strong className="text-[#102A56]">{totalItems}</strong> students
          </span>

          <div className="flex items-center gap-1.5 pl-3 border-l border-[#E1EAF4]">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white border border-[#E1EAF4] rounded-lg px-2 py-1 text-xs text-[#102A56] font-semibold focus:outline-hidden focus:border-[#0F8B83] cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Right: Page navigation buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg border border-[#E1EAF4] bg-white text-[#7186A5] hover:text-[#102A56] hover:border-[#0F8B83]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            if (
              p === 1 ||
              p === totalPages ||
              (p >= currentPage - 1 && p <= currentPage + 1)
            ) {
              const isCurrent = p === currentPage;
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-[#0F8B83] text-white shadow-xs"
                      : "bg-white border border-[#E1EAF4] text-[#7186A5] hover:text-[#102A56] hover:border-[#0F8B83]/30"
                  }`}
                >
                  {p}
                </button>
              );
            } else if (p === currentPage - 2 || p === currentPage + 2) {
              return <span key={p} className="px-1 text-xs text-[#7186A5]">...</span>;
            }
            return null;
          })}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg border border-[#E1EAF4] bg-white text-[#7186A5] hover:text-[#102A56] hover:border-[#0F8B83]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
