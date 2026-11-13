'use client';

import OwnerComplaintDashboard from '@/components/complaints/owner/OwnerComplaintDashboard';
import { ComplaintToastProvider } from '@/components/complaints/ComplaintToast';
import '@/styles/complaintsTheme.css';

export default function OwnerComplaintsPage() {
  return (
    <ComplaintToastProvider>
      <OwnerComplaintDashboard />
    </ComplaintToastProvider>
  );
}
