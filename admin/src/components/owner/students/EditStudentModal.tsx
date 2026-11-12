"use client";

import React, { useState, useEffect } from "react";
import { X, Save, User, GraduationCap, Building2 } from "lucide-react";
import { Student } from "@/types/student";

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onUpdateStudent: (updated: Student) => void;
}

export default function EditStudentModal({
  isOpen,
  onClose,
  student,
  onUpdateStudent,
}: EditStudentModalProps) {
  const [formData, setFormData] = useState<Student | null>(null);

  useEffect(() => {
    if (student) {
      setFormData(JSON.parse(JSON.stringify(student)));
    }
  }, [student]);

  if (!isOpen || !formData) return null;

  const handleChange = (section: string, field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      if (section === "root") {
        return { ...prev, [field]: value };
      }
      return {
        ...prev,
        [section]: {
          ...(prev as any)[section],
          [field]: value,
        },
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onUpdateStudent({
      ...formData,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2.5 sm:p-6 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-[#102A56]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#F5F8FC] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E1EAF4] overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-white p-4 sm:p-5 border-b border-[#E1EAF4] flex items-center justify-between shrink-0">
          <div className="min-w-0 pr-2">
            <h2 className="text-base sm:text-lg font-extrabold text-[#102A56] truncate">
              Edit Student: {formData.name}
            </h2>
            <p className="text-xs text-[#7186A5] truncate">
              Update personal, academic, or accommodation records.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4 sm:space-y-5">
          {/* Section 1: Personal */}
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#E1EAF4] space-y-3">
            <h3 className="text-xs font-bold text-[#0F8B83] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Personal Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[#7186A5] font-medium">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("root", "name", e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-[#E1EAF4] text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[#7186A5] font-medium">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("root", "email", e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-[#E1EAF4] text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[#7186A5] font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("root", "phone", e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-[#E1EAF4] text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[#7186A5] font-medium">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleChange("root", "dob", e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-[#E1EAF4] text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic */}
          <div className="p-4 rounded-2xl bg-white border border-[#E1EAF4] space-y-3">
            <h3 className="text-xs font-bold text-[#0F8B83] uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              Academic Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[#7186A5] font-medium">College / University</label>
                <input
                  type="text"
                  value={formData.academic.college}
                  onChange={(e) => handleChange("academic", "college", e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-[#E1EAF4] text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[#7186A5] font-medium">Course</label>
                <input
                  type="text"
                  value={formData.academic.course}
                  onChange={(e) => handleChange("academic", "course", e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-[#E1EAF4] text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[#7186A5] font-medium">Branch</label>
                <input
                  type="text"
                  value={formData.academic.branch}
                  onChange={(e) => handleChange("academic", "branch", e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-[#E1EAF4] text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[#7186A5] font-medium">Year</label>
                <input
                  type="text"
                  value={formData.academic.year}
                  onChange={(e) => handleChange("academic", "year", e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-[#E1EAF4] text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Accommodation */}
          <div className="p-4 rounded-2xl bg-white border border-[#E1EAF4] space-y-3">
            <h3 className="text-xs font-bold text-[#0F8B83] uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Accommodation Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[#7186A5] font-medium">Room Number</label>
                <input
                  type="text"
                  value={formData.accommodation.roomNumber}
                  onChange={(e) => handleChange("accommodation", "roomNumber", e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-[#E1EAF4] text-[#102A56] font-bold focus:border-[#0F8B83] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[#7186A5] font-medium">Bed Number</label>
                <input
                  type="text"
                  value={formData.accommodation.bedNumber}
                  onChange={(e) => handleChange("accommodation", "bedNumber", e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-[#E1EAF4] text-[#102A56] font-bold focus:border-[#0F8B83] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[#7186A5] font-medium">Monthly Rent (₹)</label>
                <input
                  type="number"
                  value={formData.accommodation.monthlyRent}
                  onChange={(e) =>
                    handleChange("accommodation", "monthlyRent", Number(e.target.value))
                  }
                  className="w-full mt-1 p-2 rounded-xl border border-[#E1EAF4] text-[#102A56] font-bold focus:border-[#0F8B83] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[#7186A5] font-medium">Security Deposit (₹)</label>
                <input
                  type="number"
                  value={formData.accommodation.securityDeposit}
                  onChange={(e) =>
                    handleChange("accommodation", "securityDeposit", Number(e.target.value))
                  }
                  className="w-full mt-1 p-2 rounded-xl border border-[#E1EAF4] text-[#102A56] font-bold focus:border-[#0F8B83] focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-white p-3.5 sm:p-4 border-t border-[#E1EAF4] flex flex-col-reverse sm:flex-row justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-[#7186A5] hover:text-[#102A56] text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs font-bold shadow-md shadow-[#0F8B83]/25 transition-all text-center"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
