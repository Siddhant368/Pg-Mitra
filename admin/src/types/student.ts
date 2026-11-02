export type RentStatus = "PAID" | "PENDING" | "OVERDUE" | "PARTIAL";
export type VerificationStatus = "VERIFIED" | "PENDING" | "REJECTED";
export type AccountStatus = "ACTIVE" | "INACTIVE" | "NOTICE" | "CHECKED_OUT" | "BLACKLISTED";

export interface StudentDocument {
  id: string;
  type: "AADHAAR" | "COLLEGE_ID" | "STUDENT_ID" | "ADDRESS_PROOF" | "OTHER";
  title: string;
  fileName: string;
  fileSize: string;
  fileUrl?: string;
  uploadedAt: string;
  status: VerificationStatus;
  rejectionReason?: string;
}

export interface RentRecord {
  id: string;
  month: string;
  year: number;
  amount: number;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: "UPI" | "CASH" | "BANK_TRANSFER" | "DEBIT_CARD" | "OTHER";
  transactionId?: string;
  status: RentStatus;
  receiptNumber?: string;
  collectedBy?: string;
  notes?: string;
}

export interface AttendanceRecord {
  date: string;
  status: "PRESENT" | "ABSENT" | "LEAVE" | "LATE";
  inTime?: string;
  outTime?: string;
  notes?: string;
}

export interface StudentComplaint {
  id: string;
  ticketId: string;
  category: "WiFi / Internet" | "Plumbing & Bath" | "Electricity / AC" | "Food / Mess" | "Housekeeping" | "Security / Noise" | "Other";
  title: string;
  description: string;
  createdAt: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  resolvedAt?: string;
}

export interface ActivityTimelineItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "ADMISSION" | "PAYMENT" | "VERIFICATION" | "ROOM_CHANGE" | "NOTICE" | "GENERAL" | "COMPLAINT";
  actor: string;
}

export interface AdminNote {
  id: string;
  content: string;
  createdAt: string;
  author: string;
  priority: "NORMAL" | "HIGH" | "URGENT";
}

export interface Student {
  id: string;
  studentId: string; // e.g., "PGM-2026-0101"
  name: string;
  avatarUrl?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  bloodGroup?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };

  // Academic Info
  academic: {
    college: string;
    course: string;
    branch: string;
    year: string;
    rollNumber?: string;
  };

  // Guardian Info
  guardian: {
    name: string;
    relation: string;
    phone: string;
    occupation?: string;
    address?: string;
  };

  // Accommodation Info
  accommodation: {
    pgId: string;
    pgName: string;
    building?: string;
    floor: string;
    roomNumber: string;
    bedNumber: string;
    sharingType: "Single" | "Double" | "Triple" | "Four-Sharing";
    joiningDate: string;
    expectedLeavingDate?: string;
    monthlyRent: number;
    securityDeposit: number;
    depositStatus: "Paid" | "Pending" | "Refunded";
    noticePeriodDays?: number;
  };

  // Statuses
  rentStatus: RentStatus;
  rentDueAmount: number;
  nextRentDueDate: string;
  verificationStatus: VerificationStatus;
  accountStatus: AccountStatus;

  // Sub-collections
  documents: StudentDocument[];
  rentHistory: RentRecord[];
  attendance: {
    monthlyPercentage: number;
    presentDays: number;
    totalDays: number;
    lastPunchIn?: string;
    records: AttendanceRecord[];
  };
  complaints: StudentComplaint[];
  timeline: ActivityTimelineItem[];
  adminNotes: AdminNote[];

  createdAt: string;
  updatedAt: string;
}

export type StudentNavTab =
  | "ALL"
  | "ACTIVE"
  | "PENDING_VERIFICATION"
  | "PAYMENT_PENDING"
  | "CHECKED_OUT"
  | "BLACKLISTED";

export type QuickFilter =
  | "THIS_MONTH"
  | "LAST_30_DAYS"
  | "RENT_OVERDUE"
  | "DOCS_PENDING"
  | "LEAVING_SOON";

export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  pendingVerification: number;
  pendingRentCount: number;
  pendingRentAmount: number;
  vacantRoomRequests: number;
  studentsLeavingSoon: number;
  totalMonthlyCollection: number;
}
