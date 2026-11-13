'use client';

import StudentComplaintDashboard from '@/components/complaints/student/StudentComplaintDashboard';
import { ComplaintToastProvider } from '@/components/complaints/ComplaintToast';

export default function StudentComplaintsPage() {
  return (
    <ComplaintToastProvider>
      <StudentComplaintDashboard />
    </ComplaintToastProvider>
  );
}
