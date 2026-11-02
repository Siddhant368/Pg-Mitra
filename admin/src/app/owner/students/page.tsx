"use client";

import StudentDashboardClient from "@/components/owner/students/StudentDashboardClient";
import { ToastProvider } from "@/components/owner/students/ToastNotification";

export default function StudentsPage() {
  return (
    <ToastProvider>
      <StudentDashboardClient />
    </ToastProvider>
  );
}
