"use client";

import React, { useState } from "react";
import { X, UploadCloud, Download, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { Student } from "@/types/student";

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedStudents: Student[]) => void;
}

export default function ImportStudentsModal({
  isOpen,
  onClose,
  onImportSuccess,
}: ImportStudentsModalProps) {
  const [fileSelected, setFileSelected] = useState<string | null>(null);
  const [parsedCount, setParsedCount] = useState<number>(3);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const templateCSV = `Student ID,Full Name,Email,Phone,Gender,College,Course,PG Name,Room No,Bed No,Monthly Rent,Security Deposit,Joining Date
PGM-2026-0201,Kunal Verma,kunal.v@gmail.com,+91 98111 22334,Male,DTU,B.Tech,Green Valley PG,108,Bed A,8500,17000,2026-11-01
PGM-2026-0202,Pooja Hegde,pooja.h@gmail.com,+91 98222 33445,Female,Miranda House,B.A.,Zenith Girls PG,204,Bed B,10000,20000,2026-11-01
PGM-2026-0203,Nikhil Menon,nikhil.m@gmail.com,+91 98333 44556,Male,IIT Delhi,M.Tech,Sunrise Luxury PG,302,Bed A,12000,24000,2026-11-01`;

    const blob = new Blob([templateCSV], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pgmitra_student_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSimulateImport = () => {
    const sampleBatch: Student[] = [
      {
        id: "std-imp-1",
        studentId: "PGM-2026-0201",
        name: "Kunal Verma",
        email: "kunal.v@gmail.com",
        phone: "+91 98111 22334",
        dob: "2003-04-10",
        gender: "Male",
        bloodGroup: "B+",
        address: {
          street: "Sector 15",
          city: "Noida",
          state: "Uttar Pradesh",
          pincode: "201301",
        },
        emergencyContact: {
          name: "Ramesh Verma",
          relation: "Father",
          phone: "+91 98111 22300",
        },
        academic: {
          college: "DTU Delhi",
          course: "B.Tech",
          branch: "Electrical Engineering",
          year: "2nd Year",
          rollNumber: "24EE102",
        },
        guardian: {
          name: "Ramesh Verma",
          relation: "Father",
          phone: "+91 98111 22300",
          occupation: "Public Sector Officer",
        },
        accommodation: {
          pgId: "pg-01",
          pgName: "Green Valley PG",
          floor: "1st Floor",
          roomNumber: "108",
          bedNumber: "Bed A",
          sharingType: "Double",
          joiningDate: "2026-11-01",
          monthlyRent: 8500,
          securityDeposit: 17000,
          depositStatus: "Paid",
        },
        rentStatus: "PAID",
        rentDueAmount: 0,
        nextRentDueDate: "2026-12-05",
        verificationStatus: "VERIFIED",
        accountStatus: "ACTIVE",
        documents: [],
        rentHistory: [],
        attendance: {
          monthlyPercentage: 100,
          presentDays: 2,
          totalDays: 2,
          records: [],
        },
        complaints: [],
        timeline: [
          {
            id: "tl-imp-1",
            title: "Imported via CSV Batch",
            description: "Bulk imported into student management system",
            timestamp: "Just now",
            type: "ADMISSION",
            actor: "Admin",
          },
        ],
        adminNotes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "std-imp-2",
        studentId: "PGM-2026-0202",
        name: "Pooja Hegde",
        email: "pooja.h@gmail.com",
        phone: "+91 98222 33445",
        dob: "2004-06-18",
        gender: "Female",
        bloodGroup: "O+",
        address: {
          street: "Jayanagar 4th Block",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560011",
        },
        emergencyContact: {
          name: "Girish Hegde",
          relation: "Father",
          phone: "+91 98222 33400",
        },
        academic: {
          college: "Miranda House",
          course: "B.A. (Hons)",
          branch: "History",
          year: "1st Year",
          rollNumber: "24MH092",
        },
        guardian: {
          name: "Girish Hegde",
          relation: "Father",
          phone: "+91 98222 33400",
        },
        accommodation: {
          pgId: "pg-02",
          pgName: "Zenith Girls PG",
          floor: "2nd Floor",
          roomNumber: "204",
          bedNumber: "Bed B",
          sharingType: "Double",
          joiningDate: "2026-11-01",
          monthlyRent: 10000,
          securityDeposit: 20000,
          depositStatus: "Paid",
        },
        rentStatus: "PENDING",
        rentDueAmount: 10000,
        nextRentDueDate: "2026-11-05",
        verificationStatus: "PENDING",
        accountStatus: "ACTIVE",
        documents: [],
        rentHistory: [],
        attendance: {
          monthlyPercentage: 100,
          presentDays: 2,
          totalDays: 2,
          records: [],
        },
        complaints: [],
        timeline: [
          {
            id: "tl-imp-2",
            title: "Imported via CSV Batch",
            description: "Bulk imported into student management system",
            timestamp: "Just now",
            type: "ADMISSION",
            actor: "Admin",
          },
        ],
        adminNotes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    onImportSuccess(sampleBatch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-[#102A56]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#F5F8FC] rounded-3xl shadow-2xl border border-[#E1EAF4] overflow-hidden z-10 flex flex-col">
        {/* Header */}
        <div className="bg-white p-5 border-b border-[#E1EAF4] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8F7F5] text-[#0F8B83] flex items-center justify-center font-bold">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#102A56]">
                Import Students (CSV)
              </h2>
              <p className="text-xs text-[#7186A5]">Bulk upload student admissions & room allocations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E1EAF4] flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-[#102A56]">Download Standard Template</p>
              <p className="text-[11px] text-[#7186A5] mt-0.5">
                Pre-formatted CSV with required columns & sample rows
              </p>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#0F8B83]/20 bg-[#E8F7F5] text-[#0F8B83] font-bold text-xs hover:bg-[#D7EFEA] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get CSV</span>
            </button>
          </div>

          {/* Drag & Drop Simulation */}
          <div
            onClick={() => setFileSelected("students_admissions_batch_nov.csv")}
            className="border-2 border-dashed border-[#0F8B83]/30 rounded-2xl p-6 text-center bg-white hover:bg-[#E8F7F5]/20 transition-colors cursor-pointer space-y-2"
          >
            <FileSpreadsheet className="w-8 h-8 text-[#0F8B83] mx-auto" />
            <p className="text-xs font-bold text-[#102A56]">
              {fileSelected || "Click here to choose CSV file or drop it here"}
            </p>
            <p className="text-[11px] text-[#7186A5]">Supports UTF-8 CSV up to 10MB</p>
          </div>

          {fileSelected && (
            <div className="p-3.5 rounded-xl bg-[#DCFCE7]/70 border border-[#16A34A]/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span className="font-semibold text-[#102A56]">
                  {fileSelected} (Ready to import {parsedCount} rows)
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7186A5] hover:text-[#102A56]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSimulateImport}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs font-bold shadow-md shadow-[#0F8B83]/25 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Execute Import</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
