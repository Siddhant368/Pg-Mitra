"use client";

import React, { useState } from "react";
import { 
  X, 
  Edit3, 
  BedDouble, 
  CreditCard, 
  Send, 
  Download, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  User, 
  GraduationCap, 
  Building2, 
  FileText, 
  Calendar, 
  Phone, 
  HeartHandshake, 
  Plus, 
  Trash2, 
  Eye, 
  Clock, 
  MessageSquare 
} from "lucide-react";
import { 
  Student, 
  AdminNote, 
  StudentDocument 
} from "@/types/student";

interface StudentProfileDrawerProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onEditStudent: (student: Student) => void;
  onAssignRoom: (student: Student) => void;
  onRecordRent: (student: Student) => void;
  onSendNotification: (student: Student) => void;
  onApproveDocument: (studentId: string, docId: string) => void;
  onRejectDocument: (studentId: string, docId: string, reason: string) => void;
  onAddAdminNote: (studentId: string, note: Omit<AdminNote, "id" | "createdAt">) => void;
  onDeleteAdminNote: (studentId: string, noteId: string) => void;
  onPreviewDocument: (doc: StudentDocument) => void;
}

type DrawerTab = "overview" | "academic" | "accommodation" | "documents" | "payments" | "attendance" | "activity";

export default function StudentProfileDrawer({
  student,
  isOpen,
  onClose,
  onEditStudent,
  onAssignRoom,
  onRecordRent,
  onSendNotification,
  onApproveDocument,
  onRejectDocument,
  onAddAdminNote,
  onDeleteAdminNote,
  onPreviewDocument,
}: StudentProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>("overview");
  const [newNoteText, setNewNoteText] = useState("");
  const [newNotePriority, setNewNotePriority] = useState<"NORMAL" | "HIGH" | "URGENT">("NORMAL");
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  if (!isOpen || !student) return null;

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddAdminNote(student.id, {
      content: newNoteText.trim(),
      author: "Admin",
      priority: newNotePriority,
    });
    setNewNoteText("");
  };

  const handleDownloadDetails = () => {
    const summaryText = `
PGMitra Student Details Report
Generated: ${new Date().toLocaleString()}
----------------------------------------
Student ID: ${student.studentId}
Full Name: ${student.name}
Email: ${student.email}
Phone: ${student.phone}
Date of Birth: ${student.dob}
Gender: ${student.gender}
Blood Group: ${student.bloodGroup || "N/A"}

ACCOMMODATION
PG / Hostel: ${student.accommodation.pgName}
Room: ${student.accommodation.roomNumber} (${student.accommodation.bedNumber})
Sharing: ${student.accommodation.sharingType}
Monthly Rent: ₹${student.accommodation.monthlyRent}
Security Deposit: ₹${student.accommodation.securityDeposit} (${student.accommodation.depositStatus})
Joining Date: ${student.accommodation.joiningDate}
Rent Status: ${student.rentStatus} (Due: ₹${student.rentDueAmount})

ACADEMIC
College: ${student.academic.college}
Course: ${student.academic.course}
Branch: ${student.academic.branch}
Year: ${student.academic.year}
Roll No: ${student.academic.rollNumber || "N/A"}

GUARDIAN
Name: ${student.guardian.name} (${student.guardian.relation})
Contact: ${student.guardian.phone}
Occupation: ${student.guardian.occupation || "N/A"}

EMERGENCY CONTACT
Name: ${student.emergencyContact.name} (${student.emergencyContact.relation})
Phone: ${student.emergencyContact.phone}
    `.trim();

    const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${student.studentId}_profile_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#102A56]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-2xl bg-[#F5F8FC] shadow-2xl flex flex-col border-l border-[#E1EAF4] animate-in slide-in-from-right duration-300">
          
          {/* 1. Header (Sticky) */}
          <div className="bg-white border-b border-[#E1EAF4] p-4 sm:p-6 shrink-0 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F8B83] to-[#08756E] text-white flex items-center justify-center font-extrabold text-lg shadow-md shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-extrabold text-[#102A56] truncate">
                      {student.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#E8F7F5] text-[#0F8B83] border border-[#0F8B83]/20">
                      {student.studentId}
                    </span>
                  </div>
                  <p className="text-xs text-[#7186A5] mt-0.5 truncate">
                    {student.academic.course} • {student.academic.college}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#F5F8FC] text-[#102A56] border border-[#E1EAF4]">
                      {student.accommodation.pgName} (Room {student.accommodation.roomNumber})
                    </span>
                    {student.verificationStatus === "VERIFIED" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#16A34A]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#D97706]">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Pending Verification
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700">
                      {student.accountStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Buttons Bar */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-[#F5F8FC]">
              <button
                onClick={() => onEditStudent(student)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#E1EAF4] text-[#102A56] hover:bg-[#F5F8FC] hover:border-[#0F8B83] transition-all shadow-xs shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#0F8B83]" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => onAssignRoom(student)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#E1EAF4] text-[#102A56] hover:bg-[#F5F8FC] hover:border-[#0F8B83] transition-all shadow-xs shrink-0"
              >
                <BedDouble className="w-3.5 h-3.5 text-sky-600" />
                <span>Assign Room</span>
              </button>

              <button
                onClick={() => onRecordRent(student)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F8B83] text-white hover:bg-[#08756E] transition-all shadow-xs shrink-0"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Collect Rent</span>
              </button>

              <button
                onClick={() => onSendNotification(student)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#E1EAF4] text-[#102A56] hover:bg-[#F5F8FC] transition-all shadow-xs shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-[#0F8B83]" />
                <span>Send Notice</span>
              </button>

              <button
                onClick={handleDownloadDetails}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#E1EAF4] text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-all shadow-xs shrink-0"
                title="Download text summary"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* 2. Sub-Navigation Tabs */}
          <div className="bg-white px-4 sm:px-6 border-b border-[#E1EAF4] flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: "overview", label: "Overview & Personal", icon: User },
              { id: "academic", label: "Academic & Guardian", icon: GraduationCap },
              { id: "accommodation", label: "Accommodation", icon: Building2 },
              { id: "documents", label: `Documents (${student.documents.length})`, icon: FileText },
              { id: "payments", label: "Rent & Payments", icon: CreditCard },
              { id: "attendance", label: "Attendance", icon: Calendar },
              { id: "activity", label: `Notes & Logs (${student.adminNotes.length})`, icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DrawerTab)}
                  className={`flex items-center gap-2 px-3 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? "border-[#0F8B83] text-[#0F8B83]"
                      : "border-transparent text-[#7186A5] hover:text-[#102A56]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 3. Drawer Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

            {/* TAB 1: OVERVIEW & PERSONAL */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Highlights Card */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-white border border-[#E1EAF4] shadow-xs">
                    <span className="text-[11px] text-[#7186A5] font-medium">Monthly Rent</span>
                    <p className="text-base font-extrabold text-[#102A56] mt-0.5">
                      ₹{student.accommodation.monthlyRent.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-[#E1EAF4] shadow-xs">
                    <span className="text-[11px] text-[#7186A5] font-medium">Rent Status</span>
                    <p className="text-base font-extrabold text-[#0F8B83] mt-0.5">
                      {student.rentStatus}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-[#E1EAF4] shadow-xs">
                    <span className="text-[11px] text-[#7186A5] font-medium">Security Deposit</span>
                    <p className="text-base font-extrabold text-[#102A56] mt-0.5">
                      ₹{student.accommodation.securityDeposit.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-[#E1EAF4] shadow-xs">
                    <span className="text-[11px] text-[#7186A5] font-medium">Attendance Rate</span>
                    <p className="text-base font-extrabold text-emerald-600 mt-0.5">
                      {student.attendance.monthlyPercentage}%
                    </p>
                  </div>
                </div>

                {/* Personal Information Card */}
                <div className="p-5 rounded-2xl bg-white border border-[#E1EAF4] shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-[#102A56] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0F8B83]" />
                    <span>Personal Information</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[#7186A5]">Full Name</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">{student.name}</p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Student ID</span>
                      <p className="font-semibold text-[#102A56] mt-0.5 font-mono">{student.studentId}</p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Email Address</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">{student.email}</p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Phone Number</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">{student.phone}</p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Date of Birth</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">{student.dob}</p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Gender & Blood Group</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">
                        {student.gender} {student.bloodGroup ? `• Blood Group: ${student.bloodGroup}` : ""}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[#7186A5]">Permanent Address</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">
                        {student.address.street}, {student.address.city}, {student.address.state} - {student.address.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Card */}
                <div className="p-5 rounded-2xl bg-white border border-[#E1EAF4] shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-[#102A56] flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-[#0F8B83]" />
                    <span>Emergency Contact</span>
                  </h3>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4]">
                    <div>
                      <p className="font-bold text-xs text-[#102A56]">
                        {student.emergencyContact.name} ({student.emergencyContact.relation})
                      </p>
                      <p className="text-xs text-[#7186A5] mt-0.5">{student.emergencyContact.phone}</p>
                    </div>
                    <a
                      href={`tel:${student.emergencyContact.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-[#0F8B83] text-white text-xs font-semibold hover:bg-[#08756E] transition-colors"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ACADEMIC & GUARDIAN */}
            {activeTab === "academic" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="p-5 rounded-2xl bg-white border border-[#E1EAF4] shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-[#102A56] flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#0F8B83]" />
                    <span>Academic Information</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[#7186A5]">College / University</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">{student.academic.college}</p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Course</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">{student.academic.course}</p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Branch / Department</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">{student.academic.branch}</p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Year / Semester</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">{student.academic.year}</p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Roll Number</span>
                      <p className="font-semibold text-[#102A56] mt-0.5 font-mono">
                        {student.academic.rollNumber || "Not recorded"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E1EAF4] shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-[#102A56] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0F8B83]" />
                    <span>Guardian / Parent Details</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[#7186A5]">Guardian Name</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">{student.guardian.name}</p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Relationship</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">{student.guardian.relation}</p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Contact Phone</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">{student.guardian.phone}</p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Occupation</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">
                        {student.guardian.occupation || "Not specified"}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[#7186A5]">Guardian Address</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">
                        {student.guardian.address || "Same as student permanent address"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ACCOMMODATION */}
            {activeTab === "accommodation" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="p-5 rounded-2xl bg-white border border-[#E1EAF4] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#102A56] flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#0F8B83]" />
                      <span>Current Accommodation</span>
                    </h3>
                    <button
                      onClick={() => onAssignRoom(student)}
                      className="text-xs font-bold text-[#0F8B83] hover:underline"
                    >
                      Change / Transfer Room
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[#7186A5]">PG / Hostel Name</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">{student.accommodation.pgName}</p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Building & Floor</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">
                        {student.accommodation.building || "Main Block"} • {student.accommodation.floor}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Room & Bed</span>
                      <p className="font-bold text-sm text-[#0F8B83] mt-0.5">
                        Room {student.accommodation.roomNumber} ({student.accommodation.bedNumber})
                      </p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Sharing Type</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">
                        {student.accommodation.sharingType} Sharing
                      </p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Joining Date</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">{student.accommodation.joiningDate}</p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Expected Leaving Date</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">
                        {student.accommodation.expectedLeavingDate || "Open Agreement"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Monthly Rent</span>
                      <p className="font-extrabold text-[#102A56] text-sm mt-0.5">
                        ₹{student.accommodation.monthlyRent.toLocaleString("en-IN")} / month
                      </p>
                    </div>
                    <div>
                      <span className="text-[#7186A5]">Security Deposit</span>
                      <p className="font-semibold text-[#102A56] mt-0.5">
                        ₹{student.accommodation.securityDeposit.toLocaleString("en-IN")} (
                        <span className="text-emerald-600 font-bold">
                          {student.accommodation.depositStatus}
                        </span>
                        )
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: DOCUMENTS */}
            {activeTab === "documents" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#102A56]">
                    Uploaded Identity & College Documents
                  </h3>
                  <span className="text-xs text-[#7186A5]">
                    {student.documents.length} document{student.documents.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="space-y-3">
                  {student.documents.map((doc) => {
                    const isVerified = doc.status === "VERIFIED";
                    const isPending = doc.status === "PENDING";
                    const isRejected = doc.status === "REJECTED";

                    return (
                      <div
                        key={doc.id}
                        className="p-4 rounded-xl bg-white border border-[#E1EAF4] shadow-xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#E8F7F5] text-[#0F8B83] flex items-center justify-center font-bold text-xs shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-xs text-[#102A56]">{doc.title}</p>
                              <p className="text-[11px] text-[#7186A5] mt-0.5">
                                {doc.fileName} • {doc.fileSize} • Uploaded {doc.uploadedAt}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {isVerified && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#16A34A]">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Verified
                              </span>
                            )}
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#D97706]">
                                <ShieldAlert className="w-3.5 h-3.5" />
                                Pending Review
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                <ShieldX className="w-3.5 h-3.5" />
                                Rejected
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Rejection reason display if rejected */}
                        {isRejected && doc.rejectionReason && (
                          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                            <strong>Reason:</strong> {doc.rejectionReason}
                          </div>
                        )}

                        {/* Actions for Document */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#F5F8FC]">
                          <button
                            onClick={() => onPreviewDocument(doc)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F8B83] hover:underline"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview Document</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => onApproveDocument(student.id, doc.id)}
                                  className="px-2.5 py-1 rounded-lg bg-[#16A34A] text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => setRejectingDocId(doc.id)}
                                  className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Rejection Input Inline Form */}
                        {rejectingDocId === doc.id && (
                          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-2 mt-2 animate-in fade-in">
                            <label className="text-xs font-bold text-rose-800">
                              Rejection Reason:
                            </label>
                            <input
                              type="text"
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder="e.g. Document image is blurry or expired"
                              className="w-full text-xs p-2 rounded-lg bg-white border border-[#E1EAF4] focus:outline-hidden focus:border-[#0F8B83]"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setRejectingDocId(null);
                                  setRejectReason("");
                                }}
                                className="px-2.5 py-1 text-xs text-[#7186A5] hover:text-[#102A56]"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  if (rejectReason.trim()) {
                                    onRejectDocument(student.id, doc.id, rejectReason.trim());
                                    setRejectingDocId(null);
                                    setRejectReason("");
                                  }
                                }}
                                className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700"
                              >
                                Confirm Rejection
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: PAYMENTS */}
            {activeTab === "payments" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#102A56]">Rent & Payment History</h3>
                  <button
                    onClick={() => onRecordRent(student)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F8B83] text-white text-xs font-bold hover:bg-[#08756E] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Record Payment</span>
                  </button>
                </div>

                {student.rentHistory.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-white border border-[#E1EAF4] text-[#7186A5] text-xs">
                    No historical payment records logged yet.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {student.rentHistory.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-white border border-[#E1EAF4] shadow-xs flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#102A56]">
                              {item.month} {item.year}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.status === "PAID"
                                  ? "bg-[#DCFCE7] text-[#16A34A]"
                                  : item.status === "OVERDUE"
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-[#FEF3C7] text-[#D97706]"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#7186A5] mt-0.5">
                            {item.paidDate ? `Paid on ${item.paidDate}` : `Due: ${item.dueDate}`}
                            {item.paymentMethod ? ` via ${item.paymentMethod}` : ""}
                          </p>
                          {item.notes && (
                            <p className="text-[11px] text-[#7186A5] italic mt-0.5">{item.notes}</p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-extrabold text-[#102A56]">
                            ₹{item.amount.toLocaleString("en-IN")}
                          </p>
                          {item.receiptNumber && (
                            <p className="text-[10px] text-[#7186A5] font-mono mt-0.5">
                              {item.receiptNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: ATTENDANCE */}
            {activeTab === "attendance" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-5 rounded-2xl bg-white border border-[#E1EAF4] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#102A56]">Monthly Attendance Rate</h3>
                    <span className="text-lg font-extrabold text-emerald-600">
                      {student.attendance.monthlyPercentage}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#F5F8FC] overflow-hidden border border-[#E1EAF4]">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${student.attendance.monthlyPercentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#7186A5] pt-1">
                    <span>Present: {student.attendance.presentDays} days</span>
                    <span>Total recorded: {student.attendance.totalDays} days</span>
                  </div>
                  {student.attendance.lastPunchIn && (
                    <div className="pt-2 border-t border-[#F5F8FC] text-xs text-[#7186A5]">
                      <strong>Last punch-in:</strong> {student.attendance.lastPunchIn}
                    </div>
                  )}
                </div>

                {/* Attendance logs */}
                <h4 className="text-xs font-bold text-[#102A56] uppercase tracking-wider">
                  Recent Daily Logs
                </h4>
                {student.attendance.records.length === 0 ? (
                  <p className="text-xs text-[#7186A5] p-4 bg-white rounded-xl border border-[#E1EAF4]">
                    No recent check-in exceptions logged.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {student.attendance.records.map((rec, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-white border border-[#E1EAF4] shadow-xs flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-semibold text-[#102A56]">{rec.date}</p>
                          {rec.inTime && (
                            <p className="text-[11px] text-[#7186A5]">
                              In: {rec.inTime} {rec.outTime ? `| Out: ${rec.outTime}` : ""}
                            </p>
                          )}
                          {rec.notes && (
                            <p className="text-[11px] text-amber-700 italic">{rec.notes}</p>
                          )}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.status === "PRESENT"
                              ? "bg-[#DCFCE7] text-[#16A34A]"
                              : "bg-[#FEF3C7] text-[#D97706]"
                          }`}
                        >
                          {rec.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 7: ACTIVITY & ADMIN NOTES */}
            {activeTab === "activity" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Admin Notes Section */}
                <div className="p-5 rounded-2xl bg-white border border-[#E1EAF4] shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-[#102A56] flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#0F8B83]" />
                    <span>Internal Admin Notes</span>
                  </h3>

                  {/* Add note form */}
                  <form onSubmit={handleAddNote} className="space-y-2.5">
                    <textarea
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Add an internal note visible only to admins and wardens..."
                      rows={2}
                      className="w-full p-2.5 rounded-xl border border-[#E1EAF4] text-xs text-[#102A56] focus:outline-hidden focus:border-[#0F8B83] resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#7186A5]">Priority:</span>
                        <select
                          value={newNotePriority}
                          onChange={(e) => setNewNotePriority(e.target.value as any)}
                          className="text-xs bg-white border border-[#E1EAF4] rounded-lg px-2 py-1"
                        >
                          <option value="NORMAL">Normal</option>
                          <option value="HIGH">High</option>
                          <option value="URGENT">Urgent</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={!newNoteText.trim()}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0F8B83] text-white text-xs font-bold hover:bg-[#08756E] disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        Add Note
                      </button>
                    </div>
                  </form>

                  {/* Notes List */}
                  <div className="space-y-2.5 pt-2">
                    {student.adminNotes.length === 0 ? (
                      <p className="text-xs text-[#7186A5] italic">No internal notes yet.</p>
                    ) : (
                      student.adminNotes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4] text-xs space-y-1 relative group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#102A56]">
                              {note.author} • {note.createdAt}
                            </span>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                  note.priority === "URGENT"
                                    ? "bg-rose-100 text-rose-800"
                                    : note.priority === "HIGH"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {note.priority}
                              </span>
                              <button
                                onClick={() => onDeleteAdminNote(student.id, note.id)}
                                className="text-[#7186A5] hover:text-rose-600 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete note"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-[#102A56] leading-relaxed">{note.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Audit Timeline */}
                <div className="p-5 rounded-2xl bg-white border border-[#E1EAF4] shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-[#102A56] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#0F8B83]" />
                    <span>Activity Audit Timeline</span>
                  </h3>

                  <div className="space-y-4 pl-2 border-l-2 border-[#E1EAF4]">
                    {student.timeline.map((event) => (
                      <div key={event.id} className="relative pl-5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0F8B83] absolute -left-[1.35rem] top-1 ring-4 ring-white" />
                        <div>
                          <p className="font-bold text-xs text-[#102A56]">{event.title}</p>
                          <p className="text-[11px] text-[#7186A5] mt-0.5">{event.description}</p>
                          <span className="text-[10px] text-[#7186A5] mt-1 block">
                            {event.timestamp} • By {event.actor}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
