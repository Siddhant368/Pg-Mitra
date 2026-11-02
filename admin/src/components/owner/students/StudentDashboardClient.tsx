"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Student, 
  StudentNavTab, 
  QuickFilter, 
  StudentDocument, 
  AdminNote 
} from "@/types/student";
import { 
  getStoredStudents, 
  saveStoredStudents, 
  calculateStudentStats, 
  exportStudentsToCSV 
} from "@/lib/mockStudents";
import { fetchApi } from "@/lib/api";

// Subcomponents
import StudentHeader from "./StudentHeader";
import StudentAnalyticsCards from "./StudentAnalyticsCards";
import StudentTabsAndFilters from "./StudentTabsAndFilters";
import StudentTable, { SortField, SortOrder } from "./StudentTable";
import BulkActionsBar from "./BulkActionsBar";
import StudentProfileDrawer from "./StudentProfileDrawer";
import AddStudentModal from "./AddStudentModal";
import EditStudentModal from "./EditStudentModal";
import AssignRoomModal from "./AssignRoomModal";
import RecordRentModal from "./RecordRentModal";
import SendNotificationModal from "./SendNotificationModal";
import ImportStudentsModal from "./ImportStudentsModal";
import DocumentPreviewModal from "./DocumentPreviewModal";
import ConfirmationModal from "./ConfirmationModal";
import StudentSkeleton from "./StudentSkeleton";
import StudentEmptyState from "./StudentEmptyState";
import { useToast } from "./ToastNotification";

export default function StudentDashboardClient() {
  const { showToast } = useToast();

  // Core Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [availablePgs, setAvailablePgs] = useState<{ id: string; name: string }[]>([
    { id: "pg-01", name: "Green Valley PG" },
    { id: "pg-02", name: "Zenith Girls PG" },
    { id: "pg-03", name: "Sunrise Luxury PG" },
    { id: "pg-04", name: "St. Jude Men's Hostel" },
  ]);

  // Tab & Filters State
  const [activeTab, setActiveTab] = useState<StudentNavTab>("ALL");
  const [quickFilter, setQuickFilter] = useState<QuickFilter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPg, setSelectedPg] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedRentStatus, setSelectedRentStatus] = useState("");
  const [selectedVerificationStatus, setSelectedVerificationStatus] = useState("");
  const [selectedAccountStatus, setSelectedAccountStatus] = useState("");

  // Table Selection & Sorting
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("joiningDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals & Drawer State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [activeDrawerStudent, setActiveDrawerStudent] = useState<Student | null>(null);
  const [activeEditStudent, setActiveEditStudent] = useState<Student | null>(null);
  const [activeAssignStudent, setActiveAssignStudent] = useState<Student | null>(null);
  const [activeRentStudent, setActiveRentStudent] = useState<Student | null>(null);
  const [activeNotificationStudent, setActiveNotificationStudent] = useState<Student | null>(null);
  const [activePreviewDoc, setActivePreviewDoc] = useState<StudentDocument | null>(null);

  // Confirmation Dialog
  const [confirmationConfig, setConfirmationConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // 1. Initial Load: Read stored students & fetch real PGs if backend is online
  useEffect(() => {
    let ignore = false;
    const init = async () => {
      try {
        const stored = getStoredStudents();
        if (!ignore) {
          setStudents(stored);
        }

        // Try loading real PGs if backend is online
        try {
          const livePgs = await fetchApi("/owner/pgs");
          if (Array.isArray(livePgs) && livePgs.length > 0 && !ignore) {
            setAvailablePgs(
              livePgs.map((p: any) => ({
                id: p._id || p.id,
                name: p.name,
              }))
            );
          }
        } catch {
          // Gracefully continue with default PGs
        }
      } finally {
        if (!ignore) {
          setTimeout(() => setLoading(false), 300);
        }
      }
    };

    init();
    return () => {
      ignore = true;
    };
  }, []);

  // Sync to localStorage whenever students changes
  const updateStudents = useCallback((updated: Student[]) => {
    setStudents(updated);
    saveStoredStudents(updated);
  }, []);

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const stored = getStoredStudents();
      setStudents(stored);
      setIsRefreshing(false);
      showToast("info", "Data Synchronized", "Student records and payment logs refreshed.");
    }, 600);
  };

  // 2. Computed Lists for Filter Dropdowns
  const pgList = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => set.add(s.accommodation.pgName));
    return Array.from(set);
  }, [students]);

  const roomList = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (!selectedPg || s.accommodation.pgName === selectedPg) {
        set.add(s.accommodation.roomNumber);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [students, selectedPg]);

  // 3. Tab Counts Calculation
  const tabCounts = useMemo(() => {
    return {
      all: students.length,
      active: students.filter((s) => s.accountStatus === "ACTIVE").length,
      pendingVerification: students.filter((s) => s.verificationStatus === "PENDING").length,
      paymentPending: students.filter(
        (s) => s.rentStatus === "OVERDUE" || s.rentStatus === "PENDING" || s.rentStatus === "PARTIAL"
      ).length,
      checkedOut: students.filter((s) => s.accountStatus === "CHECKED_OUT").length,
      blacklisted: students.filter((s) => s.accountStatus === "BLACKLISTED").length,
    };
  }, [students]);

  // 4. Analytics Stats
  const stats = useMemo(() => {
    return calculateStudentStats(students);
  }, [students]);

  // 5. Advanced Filter & Search Logic
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // 1. Tab filter
      if (activeTab === "ACTIVE" && student.accountStatus !== "ACTIVE") return false;
      if (activeTab === "PENDING_VERIFICATION" && student.verificationStatus !== "PENDING")
        return false;
      if (
        activeTab === "PAYMENT_PENDING" &&
        student.rentStatus !== "OVERDUE" &&
        student.rentStatus !== "PENDING" &&
        student.rentStatus !== "PARTIAL"
      )
        return false;
      if (activeTab === "CHECKED_OUT" && student.accountStatus !== "CHECKED_OUT") return false;
      if (activeTab === "BLACKLISTED" && student.accountStatus !== "BLACKLISTED") return false;

      // 2. Quick Filter Chips
      if (quickFilter) {
        const now = new Date();
        const joining = new Date(student.accommodation.joiningDate);

        if (quickFilter === "THIS_MONTH") {
          const isThisMonth =
            joining.getFullYear() === now.getFullYear() &&
            joining.getMonth() === now.getMonth();
          if (!isThisMonth) return false;
        }

        if (quickFilter === "LAST_30_DAYS") {
          const diffDays = (now.getTime() - joining.getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays < 0 || diffDays > 30) return false;
        }

        if (quickFilter === "RENT_OVERDUE") {
          if (student.rentStatus !== "OVERDUE") return false;
        }

        if (quickFilter === "DOCS_PENDING") {
          const hasPendingDocs =
            student.verificationStatus === "PENDING" ||
            student.documents.some((d) => d.status === "PENDING");
          if (!hasPendingDocs) return false;
        }

        if (quickFilter === "LEAVING_SOON") {
          if (student.accountStatus === "NOTICE") return true;
          if (student.accommodation.expectedLeavingDate) {
            const leaveDate = new Date(student.accommodation.expectedLeavingDate);
            const diffDays = (leaveDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays < 0 || diffDays > 25) return false;
          } else {
            return false;
          }
        }
      }

      // 3. Dropdown Filters
      if (selectedPg && student.accommodation.pgName !== selectedPg) return false;
      if (selectedRoom && student.accommodation.roomNumber !== selectedRoom) return false;
      if (selectedRentStatus && student.rentStatus !== selectedRentStatus) return false;
      if (
        selectedVerificationStatus &&
        student.verificationStatus !== selectedVerificationStatus
      )
        return false;
      if (selectedAccountStatus && student.accountStatus !== selectedAccountStatus) return false;

      // 4. Search query (name, email, phone, ID)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = student.name.toLowerCase().includes(query);
        const matchesEmail = student.email.toLowerCase().includes(query);
        const matchesPhone = student.phone.includes(query);
        const matchesId = student.studentId.toLowerCase().includes(query);
        const matchesCollege = student.academic.college.toLowerCase().includes(query);

        if (
          !matchesName &&
          !matchesEmail &&
          !matchesPhone &&
          !matchesId &&
          !matchesCollege
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    students,
    activeTab,
    quickFilter,
    selectedPg,
    selectedRoom,
    selectedRentStatus,
    selectedVerificationStatus,
    selectedAccountStatus,
    searchQuery,
  ]);

  // 6. Sorting Logic
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "joiningDate") {
        comparison =
          new Date(a.accommodation.joiningDate).getTime() -
          new Date(b.accommodation.joiningDate).getTime();
      } else if (sortField === "room") {
        comparison = a.accommodation.roomNumber.localeCompare(
          b.accommodation.roomNumber,
          undefined,
          { numeric: true }
        );
      } else if (sortField === "rentAmount") {
        comparison = a.accommodation.monthlyRent - b.accommodation.monthlyRent;
      } else if (sortField === "verificationStatus") {
        comparison = a.verificationStatus.localeCompare(b.verificationStatus);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [filteredStudents, sortField, sortOrder]);

  // 7. Paginated Students
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedStudents.slice(start, start + pageSize);
  }, [sortedStudents, currentPage, pageSize]);

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    quickFilter,
    searchQuery,
    selectedPg,
    selectedRoom,
    selectedRentStatus,
    selectedVerificationStatus,
    selectedAccountStatus,
    pageSize,
  ]);

  const hasActiveFilters = Boolean(
    searchQuery ||
      quickFilter ||
      selectedPg ||
      selectedRoom ||
      selectedRentStatus ||
      selectedVerificationStatus ||
      selectedAccountStatus ||
      activeTab !== "ALL"
  );

  const handleResetFilters = () => {
    setActiveTab("ALL");
    setQuickFilter(null);
    setSearchQuery("");
    setSelectedPg("");
    setSelectedRoom("");
    setSelectedRentStatus("");
    setSelectedVerificationStatus("");
    setSelectedAccountStatus("");
    showToast("info", "Filters Cleared", "All search queries and filters have been reset.");
  };

  // Sorting Handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Selection Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const pageIds = paginatedStudents.map((s) => s.id);
    const allPageSelected = pageIds.every((id) => selectedIds.includes(id));

    if (allPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const isAllSelected =
    paginatedStudents.length > 0 &&
    paginatedStudents.every((s) => selectedIds.includes(s.id));

  // -------------------------------------------------------------
  // CRUD & ACTION HANDLERS
  // -------------------------------------------------------------

  // Add Student
  const handleAddStudent = (
    newStudentPayload: Omit<Student, "id" | "studentId" | "createdAt" | "updatedAt">
  ) => {
    const id = "std-" + Date.now().toString().slice(-6);
    const studentId = `PGM-2026-${String(students.length + 101).padStart(4, "0")}`;
    const timestamp = new Date().toISOString();

    const createdStudent: Student = {
      ...newStudentPayload,
      id,
      studentId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const updated = [createdStudent, ...students];
    updateStudents(updated);
    showToast(
      "success",
      "Student Admitted Successfully",
      `${createdStudent.name} registered with ID ${createdStudent.studentId}.`
    );
  };

  // Edit Student
  const handleUpdateStudent = (updatedStudent: Student) => {
    const updated = students.map((s) =>
      s.id === updatedStudent.id ? updatedStudent : s
    );
    updateStudents(updated);

    if (activeDrawerStudent?.id === updatedStudent.id) {
      setActiveDrawerStudent(updatedStudent);
    }

    showToast("success", "Student Details Updated", `${updatedStudent.name}'s profile was updated.`);
  };

  // Transfer / Assign Room
  const handleTransferRoom = (
    studentId: string,
    pgId: string,
    pgName: string,
    roomNumber: string,
    bedNumber: string,
    newRent?: number
  ) => {
    const updated = students.map((s) => {
      if (s.id !== studentId) return s;

      const oldRoom = s.accommodation.roomNumber;
      const oldPg = s.accommodation.pgName;

      return {
        ...s,
        accommodation: {
          ...s.accommodation,
          pgId,
          pgName,
          roomNumber,
          bedNumber,
          monthlyRent: newRent !== undefined ? newRent : s.accommodation.monthlyRent,
        },
        timeline: [
          {
            id: "tl-" + Date.now(),
            title: "Room Transfer Completed",
            description: `Transferred from ${oldPg} (Room ${oldRoom}) to ${pgName} (Room ${roomNumber} - ${bedNumber})`,
            timestamp: "Just now",
            type: "ROOM_CHANGE" as const,
            actor: "Admin",
          },
          ...s.timeline,
        ],
        updatedAt: new Date().toISOString(),
      };
    });

    updateStudents(updated);

    const changed = updated.find((s) => s.id === studentId);
    if (activeDrawerStudent?.id === studentId && changed) {
      setActiveDrawerStudent(changed);
    }

    showToast(
      "success",
      "Room Transfer Complete",
      `Student moved to ${pgName} Room ${roomNumber} (${bedNumber}).`
    );
  };

  // Record Rent
  const handleRecordRentPayment = (
    studentId: string,
    amount: number,
    month: string,
    paymentMethod: "UPI" | "CASH" | "BANK_TRANSFER" | "DEBIT_CARD" | "OTHER",
    transactionId?: string,
    notes?: string
  ) => {
    const updated = students.map((s) => {
      if (s.id !== studentId) return s;

      const receiptNumber = "REC-" + Date.now().toString().slice(-6);
      const isFull = amount >= s.rentDueAmount || amount >= s.accommodation.monthlyRent;

      const newRecord = {
        id: "rent-" + Date.now(),
        month,
        year: 2026,
        amount,
        dueDate: s.nextRentDueDate || "2026-11-05",
        paidDate: new Date().toISOString().split("T")[0],
        paymentMethod,
        transactionId,
        status: isFull ? ("PAID" as const) : ("PARTIAL" as const),
        receiptNumber,
        notes,
      };

      return {
        ...s,
        rentStatus: isFull ? ("PAID" as const) : ("PARTIAL" as const),
        rentDueAmount: Math.max(0, (s.rentDueAmount || s.accommodation.monthlyRent) - amount),
        rentHistory: [newRecord, ...s.rentHistory],
        timeline: [
          {
            id: "tl-" + Date.now(),
            title: "Rent Payment Received",
            description: `₹${amount.toLocaleString("en-IN")} collected for ${month} via ${paymentMethod} (${receiptNumber})`,
            timestamp: "Just now",
            type: "PAYMENT" as const,
            actor: "Admin",
          },
          ...s.timeline,
        ],
        updatedAt: new Date().toISOString(),
      };
    });

    updateStudents(updated);

    const changed = updated.find((s) => s.id === studentId);
    if (activeDrawerStudent?.id === studentId && changed) {
      setActiveDrawerStudent(changed);
    }

    showToast(
      "success",
      "Rent Payment Recorded",
      `₹${amount.toLocaleString("en-IN")} logged successfully. Receipt generated.`
    );
  };

  // Send Notification
  const handleSendNotification = (studentId: string, channel: string, message: string) => {
    const updated = students.map((s) => {
      if (s.id !== studentId) return s;
      return {
        ...s,
        timeline: [
          {
            id: "tl-" + Date.now(),
            title: `${channel} Notification Dispatched`,
            description: `Message: "${message.slice(0, 70)}..."`,
            timestamp: "Just now",
            type: "NOTICE" as const,
            actor: "Admin",
          },
          ...s.timeline,
        ],
        updatedAt: new Date().toISOString(),
      };
    });

    updateStudents(updated);
    showToast("success", "Notification Sent", `Delivered message via ${channel}.`);
  };

  // Approve / Reject Document
  const handleApproveDocument = (studentId: string, docId: string) => {
    const updated = students.map((s) => {
      if (s.id !== studentId) return s;

      const docs = s.documents.map((d) => (d.id === docId ? { ...d, status: "VERIFIED" as const } : d));
      const allDocsVerified = docs.every((d) => d.status === "VERIFIED");

      return {
        ...s,
        documents: docs,
        verificationStatus: allDocsVerified ? ("VERIFIED" as const) : s.verificationStatus,
        timeline: [
          {
            id: "tl-" + Date.now(),
            title: "Document Verified",
            description: `Identity proof verified by Admin`,
            timestamp: "Just now",
            type: "VERIFICATION" as const,
            actor: "Admin",
          },
          ...s.timeline,
        ],
        updatedAt: new Date().toISOString(),
      };
    });

    updateStudents(updated);
    const changed = updated.find((s) => s.id === studentId);
    if (activeDrawerStudent?.id === studentId && changed) {
      setActiveDrawerStudent(changed);
    }
    showToast("success", "Document Approved", "Verification status has been updated.");
  };

  const handleRejectDocument = (studentId: string, docId: string, reason: string) => {
    const updated = students.map((s) => {
      if (s.id !== studentId) return s;

      const docs = s.documents.map((d) =>
        d.id === docId ? { ...d, status: "REJECTED" as const, rejectionReason: reason } : d
      );

      return {
        ...s,
        documents: docs,
        verificationStatus: "REJECTED" as const,
        timeline: [
          {
            id: "tl-" + Date.now(),
            title: "Document Verification Rejected",
            description: `Reason: ${reason}`,
            timestamp: "Just now",
            type: "VERIFICATION" as const,
            actor: "Admin",
          },
          ...s.timeline,
        ],
        updatedAt: new Date().toISOString(),
      };
    });

    updateStudents(updated);
    const changed = updated.find((s) => s.id === studentId);
    if (activeDrawerStudent?.id === studentId && changed) {
      setActiveDrawerStudent(changed);
    }
    showToast("warning", "Document Rejected", "Rejection notice saved. Student notified.");
  };

  // Admin Notes
  const handleAddAdminNote = (
    studentId: string,
    noteData: Omit<AdminNote, "id" | "createdAt">
  ) => {
    const newNote: AdminNote = {
      ...noteData,
      id: "note-" + Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updated = students.map((s) => {
      if (s.id !== studentId) return s;
      return {
        ...s,
        adminNotes: [newNote, ...s.adminNotes],
        updatedAt: new Date().toISOString(),
      };
    });

    updateStudents(updated);
    const changed = updated.find((s) => s.id === studentId);
    if (activeDrawerStudent?.id === studentId && changed) {
      setActiveDrawerStudent(changed);
    }
    showToast("success", "Note Added", "Internal administrative note logged.");
  };

  const handleDeleteAdminNote = (studentId: string, noteId: string) => {
    const updated = students.map((s) => {
      if (s.id !== studentId) return s;
      return {
        ...s,
        adminNotes: s.adminNotes.filter((n) => n.id !== noteId),
        updatedAt: new Date().toISOString(),
      };
    });

    updateStudents(updated);
    const changed = updated.find((s) => s.id === studentId);
    if (activeDrawerStudent?.id === studentId && changed) {
      setActiveDrawerStudent(changed);
    }
    showToast("info", "Note Removed", "Internal note deleted.");
  };

  // Toggle Account Active / Inactive
  const handleToggleActiveStatus = (student: Student) => {
    const newStatus = student.accountStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const updated = students.map((s) =>
      s.id === student.id ? { ...s, accountStatus: newStatus as any } : s
    );
    updateStudents(updated);
    showToast(
      "info",
      "Status Changed",
      `${student.name} marked as ${newStatus}.`
    );
  };

  // Delete Single Student
  const handleDeleteStudent = (student: Student) => {
    setConfirmationConfig({
      isOpen: true,
      title: `Delete Student Record?`,
      message: `Are you sure you want to delete ${student.name} (${student.studentId})? This action will remove their room occupancy, payment records, and documents.`,
      confirmText: "Delete Record",
      isDestructive: true,
      onConfirm: () => {
        const updated = students.filter((s) => s.id !== student.id);
        updateStudents(updated);
        setSelectedIds((prev) => prev.filter((id) => id !== student.id));
        if (activeDrawerStudent?.id === student.id) {
          setActiveDrawerStudent(null);
        }
        showToast("error", "Student Deleted", `${student.name} removed from the system.`);
      },
    });
  };

  // -------------------------------------------------------------
  // BULK ACTIONS
  // -------------------------------------------------------------
  const handleBulkApproveVerification = () => {
    const updated = students.map((s) => {
      if (!selectedIds.includes(s.id)) return s;
      return {
        ...s,
        verificationStatus: "VERIFIED" as const,
        documents: s.documents.map((d) => ({ ...d, status: "VERIFIED" as const })),
        updatedAt: new Date().toISOString(),
      };
    });

    updateStudents(updated);
    showToast(
      "success",
      "Bulk Verification Complete",
      `Approved verification for ${selectedIds.length} students.`
    );
    setSelectedIds([]);
  };

  const handleBulkSendReminder = () => {
    showToast(
      "success",
      "Rent Reminders Dispatched",
      `WhatsApp and SMS rent payment reminders sent to ${selectedIds.length} selected students.`
    );
    setSelectedIds([]);
  };

  const handleBulkActivate = () => {
    const updated = students.map((s) => {
      if (!selectedIds.includes(s.id)) return s;
      return { ...s, accountStatus: "ACTIVE" as const };
    });
    updateStudents(updated);
    showToast("success", "Bulk Activated", `${selectedIds.length} students marked Active.`);
    setSelectedIds([]);
  };

  const handleBulkDeactivate = () => {
    const updated = students.map((s) => {
      if (!selectedIds.includes(s.id)) return s;
      return { ...s, accountStatus: "INACTIVE" as const };
    });
    updateStudents(updated);
    showToast("info", "Bulk Deactivated", `${selectedIds.length} students deactivated.`);
    setSelectedIds([]);
  };

  const handleBulkExport = () => {
    const selectedStudents = students.filter((s) => selectedIds.includes(s.id));
    exportStudentsToCSV(selectedStudents, `pgmitra_selected_${selectedStudents.length}_students.csv`);
    showToast("success", "Export Successful", `Downloaded CSV for ${selectedStudents.length} students.`);
  };

  const handleBulkDelete = () => {
    setConfirmationConfig({
      isOpen: true,
      title: `Delete ${selectedIds.length} Selected Students?`,
      message: `Are you sure you want to delete these ${selectedIds.length} student records permanently? This cannot be undone.`,
      confirmText: `Delete ${selectedIds.length} Students`,
      isDestructive: true,
      onConfirm: () => {
        const updated = students.filter((s) => !selectedIds.includes(s.id));
        updateStudents(updated);
        showToast(
          "error",
          "Bulk Deletion Complete",
          `Removed ${selectedIds.length} student records.`
        );
        setSelectedIds([]);
      },
    });
  };

  // CSV Export Handlers
  const handleExportAll = () => {
    exportStudentsToCSV(students, "pgmitra_all_students_master.csv");
    showToast("success", "Export Complete", `Exported all ${students.length} students to CSV.`);
  };

  const handleExportFiltered = () => {
    exportStudentsToCSV(
      filteredStudents,
      `pgmitra_filtered_${filteredStudents.length}_students.csv`
    );
    showToast(
      "success",
      "Export Complete",
      `Exported ${filteredStudents.length} filtered students to CSV.`
    );
  };

  // CSV Import Success Handler
  const handleImportSuccess = (importedBatch: Student[]) => {
    const updated = [...importedBatch, ...students];
    updateStudents(updated);
    showToast(
      "success",
      "Batch Import Successful",
      `Successfully added ${importedBatch.length} new student records into PGMitra.`
    );
  };

  // Document Modal Helper
  const handlePreviewDocument = (doc: StudentDocument) => {
    setActivePreviewDoc(doc);
  };

  const handleDrawerApproveDoc = (docId: string) => {
    if (activeDrawerStudent) {
      handleApproveDocument(activeDrawerStudent.id, docId);
    }
  };

  const handleDrawerRejectDoc = (docId: string, reason: string) => {
    if (activeDrawerStudent) {
      handleRejectDocument(activeDrawerStudent.id, docId, reason);
    }
  };

  return (
    <div className="min-h-full bg-[#F5F8FC] text-[#102A56] p-4 sm:p-6 md:p-8 space-y-6">
      {/* 1. Page Header */}
      <StudentHeader
        totalCount={students.length}
        filteredCount={filteredStudents.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onExportAll={handleExportAll}
        onExportFiltered={handleExportFiltered}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {loading ? (
        <StudentSkeleton />
      ) : (
        <>
          {/* 2. Analytics Statistics Cards (6 Cards) */}
          <StudentAnalyticsCards
            stats={stats}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onSelectQuickFilter={setQuickFilter}
          />

          {/* 3. Navigation Tabs, Search Bar & Dropdown Filters */}
          <div className="bg-white rounded-3xl border border-[#E1EAF4] p-4 sm:p-5 shadow-xs space-y-4">
            <StudentTabsAndFilters
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              counts={tabCounts}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              quickFilter={quickFilter}
              onQuickFilterChange={setQuickFilter}
              selectedPg={selectedPg}
              onPgChange={setSelectedPg}
              pgList={pgList}
              selectedRoom={selectedRoom}
              onRoomChange={setSelectedRoom}
              roomList={roomList}
              selectedRentStatus={selectedRentStatus}
              onRentStatusChange={setSelectedRentStatus}
              selectedVerificationStatus={selectedVerificationStatus}
              onVerificationStatusChange={setSelectedVerificationStatus}
              selectedAccountStatus={selectedAccountStatus}
              onAccountStatusChange={setSelectedAccountStatus}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {/* 4. Student Management Table or Empty State */}
            {filteredStudents.length === 0 ? (
              <StudentEmptyState
                searchQuery={searchQuery}
                hasActiveFilters={hasActiveFilters}
                onResetFilters={handleResetFilters}
                onOpenAddModal={() => setIsAddModalOpen(true)}
              />
            ) : (
              <StudentTable
                students={paginatedStudents}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onToggleSelectAll={handleToggleSelectAll}
                isAllSelected={isAllSelected}
                onViewStudent={(s) => setActiveDrawerStudent(s)}
                onEditStudent={(s) => setActiveEditStudent(s)}
                onAssignRoom={(s) => setActiveAssignStudent(s)}
                onRecordRent={(s) => setActiveRentStudent(s)}
                onSendNotification={(s) => setActiveNotificationStudent(s)}
                onApproveVerification={(s) => {
                  const updated = students.map((std) =>
                    std.id === s.id ? { ...std, verificationStatus: "VERIFIED" as const } : std
                  );
                  updateStudents(updated);
                  showToast("success", "Verification Approved", `${s.name} is now verified.`);
                }}
                onRejectVerification={(s) => {
                  const updated = students.map((std) =>
                    std.id === s.id ? { ...std, verificationStatus: "REJECTED" as const } : std
                  );
                  updateStudents(updated);
                  showToast("warning", "Verification Rejected", `${s.name} marked as rejected.`);
                }}
                onToggleActiveStatus={handleToggleActiveStatus}
                onDeleteStudent={handleDeleteStudent}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={filteredStudents.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            )}
          </div>
        </>
      )}

      {/* Floating Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkApproveVerification={handleBulkApproveVerification}
        onBulkSendReminder={handleBulkSendReminder}
        onBulkActivate={handleBulkActivate}
        onBulkDeactivate={handleBulkDeactivate}
        onBulkExport={handleBulkExport}
        onBulkDelete={handleBulkDelete}
      />

      {/* Student Profile Drawer */}
      <StudentProfileDrawer
        student={activeDrawerStudent}
        isOpen={Boolean(activeDrawerStudent)}
        onClose={() => setActiveDrawerStudent(null)}
        onEditStudent={(s) => {
          setActiveEditStudent(s);
          setActiveDrawerStudent(null);
        }}
        onAssignRoom={(s) => {
          setActiveAssignStudent(s);
          setActiveDrawerStudent(null);
        }}
        onRecordRent={(s) => {
          setActiveRentStudent(s);
          setActiveDrawerStudent(null);
        }}
        onSendNotification={(s) => {
          setActiveNotificationStudent(s);
          setActiveDrawerStudent(null);
        }}
        onApproveDocument={handleApproveDocument}
        onRejectDocument={handleRejectDocument}
        onAddAdminNote={handleAddAdminNote}
        onDeleteAdminNote={handleDeleteAdminNote}
        onPreviewDocument={handlePreviewDocument}
      />

      {/* Add Student Registration Modal (Multi-Step) */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStudent={handleAddStudent}
        availablePgs={availablePgs}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        isOpen={Boolean(activeEditStudent)}
        onClose={() => setActiveEditStudent(null)}
        student={activeEditStudent}
        onUpdateStudent={handleUpdateStudent}
      />

      {/* Transfer / Assign Room Modal */}
      <AssignRoomModal
        isOpen={Boolean(activeAssignStudent)}
        onClose={() => setActiveAssignStudent(null)}
        student={activeAssignStudent}
        onTransferRoom={handleTransferRoom}
        availablePgs={availablePgs}
      />

      {/* Record Rent Modal */}
      <RecordRentModal
        isOpen={Boolean(activeRentStudent)}
        onClose={() => setActiveRentStudent(null)}
        student={activeRentStudent}
        onRecordPayment={handleRecordRentPayment}
      />

      {/* Send Notification Modal */}
      <SendNotificationModal
        isOpen={Boolean(activeNotificationStudent)}
        onClose={() => setActiveNotificationStudent(null)}
        student={activeNotificationStudent}
        onSend={handleSendNotification}
      />

      {/* Import Students Modal */}
      <ImportStudentsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      {/* Document Lightbox Preview Modal */}
      <DocumentPreviewModal
        document={activePreviewDoc}
        isOpen={Boolean(activePreviewDoc)}
        onClose={() => setActivePreviewDoc(null)}
        onApprove={handleDrawerApproveDoc}
        onReject={handleDrawerRejectDoc}
      />

      {/* Reusable Destructive Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationConfig.isOpen}
        onClose={() => setConfirmationConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationConfig.onConfirm}
        title={confirmationConfig.title}
        message={confirmationConfig.message}
        confirmText={confirmationConfig.confirmText}
        isDestructive={confirmationConfig.isDestructive}
      />
    </div>
  );
}
