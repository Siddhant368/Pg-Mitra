export type ComplaintCategory =
  | 'Electricity'
  | 'Water Supply'
  | 'Room Maintenance'
  | 'Cleaning'
  | 'Wi-Fi / Internet'
  | 'Food Quality'
  | 'Security'
  | 'Other';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type ComplaintStatus = 'Pending' | 'Reviewed' | 'In Progress' | 'Resolved' | 'Rejected';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  avatar: string;
  status: 'Available' | 'On Duty' | 'Busy';
}

export interface ActivityTimelineItem {
  id: string;
  step: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  actorRole: 'Student' | 'Owner' | 'Staff' | 'System';
  avatar?: string;
  completed: boolean;
}

export interface InternalNote {
  id: string;
  author: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

export interface CommentReply {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'Student' | 'Owner' | 'Staff';
  avatar?: string;
  message: string;
  createdAt: string;
}

export interface ComplaintImage {
  id: string;
  url: string;
  name: string;
  size?: string;
}

export interface Complaint {
  id: string; // e.g. CMP-2026-0842
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  submittedDate: string; // ISO date string or formatted date
  updatedDate: string;
  student: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    roomNumber: string;
    bedNumber: string;
    pgId: string;
    pgName: string;
  };
  assignedTo?: StaffMember | null;
  images: ComplaintImage[];
  timeline: ActivityTimelineItem[];
  adminResponse?: {
    message: string;
    responderName: string;
    responderRole: string;
    timestamp: string;
  } | null;
  internalNotes: InternalNote[];
  comments: CommentReply[];
}

export interface ComplaintStats {
  total: number;
  newComplaints: number;
  pending: number;
  inProgress: number;
  resolved: number;
  urgentCount: number;
}
