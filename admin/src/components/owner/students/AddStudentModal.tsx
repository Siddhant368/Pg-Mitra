"use client";

import React, { useState } from "react";
import { 
  X, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  GraduationCap, 
  HeartHandshake, 
  Building2, 
  FileText, 
  CheckCircle2, 
  UploadCloud 
} from "lucide-react";
import { Student, StudentDocument } from "@/types/student";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (newStudent: Omit<Student, "id" | "studentId" | "createdAt" | "updatedAt">) => void;
  availablePgs?: { id: string; name: string }[];
}

const DEFAULT_PGS = [
  { id: "pg-01", name: "Green Valley PG" },
  { id: "pg-02", name: "Zenith Girls PG" },
  { id: "pg-03", name: "Sunrise Luxury PG" },
  { id: "pg-04", name: "St. Jude Men's Hostel" },
];

export default function AddStudentModal({
  isOpen,
  onClose,
  onAddStudent,
  availablePgs = DEFAULT_PGS,
}: AddStudentModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
    dob: "",
    gender: "Male" as "Male" | "Female" | "Other",
    bloodGroup: "B+",
    street: "",
    city: "",
    state: "",
    pincode: "",
    emergencyName: "",
    emergencyRelation: "Father",
    emergencyPhone: "",

    // Step 2: Academic
    college: "",
    course: "",
    branch: "",
    year: "1st Year",
    rollNumber: "",

    // Step 3: Guardian
    guardianName: "",
    guardianRelation: "Father",
    guardianPhone: "",
    guardianOccupation: "",
    guardianAddress: "",

    // Step 4: Accommodation
    pgId: availablePgs[0]?.id || "pg-01",
    pgName: availablePgs[0]?.name || "Green Valley PG",
    building: "Main Wing",
    floor: "2nd Floor",
    roomNumber: "201",
    bedNumber: "Bed A",
    sharingType: "Double" as "Single" | "Double" | "Triple" | "Four-Sharing",
    joiningDate: new Date().toISOString().split("T")[0],
    expectedLeavingDate: "",
    monthlyRent: 8500,
    securityDeposit: 17000,
    depositStatus: "Paid" as "Paid" | "Pending",

    // Step 5: Documents
    aadhaarFileName: "aadhaar_scan.pdf",
    collegeIdFileName: "college_id_card.png",
  });

  if (!isOpen) return null;

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleAutoFill = () => {
    setFormData({
      name: "Arjun Verma",
      email: "arjun.verma@example.com",
      phone: "+91 98765 43210",
      alternatePhone: "+91 98765 43211",
      dob: "2003-05-14",
      gender: "Male",
      bloodGroup: "O+",
      street: "Flat 402, Royal Palms, Bannerghatta Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560076",
      emergencyName: "Ramesh Verma",
      emergencyRelation: "Father",
      emergencyPhone: "+91 98765 00000",
      college: "PES University",
      course: "B.Tech Computer Science",
      branch: "Computer Science & Engg",
      year: "3rd Year",
      rollNumber: "PESU-2023-CS089",
      guardianName: "Ramesh Verma",
      guardianRelation: "Father",
      guardianPhone: "+91 98765 00000",
      guardianOccupation: "Chartered Accountant",
      guardianAddress: "Flat 402, Royal Palms, Bannerghatta Road, Bengaluru",
      pgId: availablePgs[0]?.id || "pg-01",
      pgName: availablePgs[0]?.name || "Green Valley PG",
      building: "East Block",
      floor: "2nd Floor",
      roomNumber: "204",
      bedNumber: "Bed B",
      sharingType: "Double",
      joiningDate: new Date().toISOString().split("T")[0],
      expectedLeavingDate: "2027-06-30",
      monthlyRent: 9500,
      securityDeposit: 19000,
      depositStatus: "Paid",
      aadhaarFileName: "arjun_aadhaar_card.pdf",
      collegeIdFileName: "pesu_college_id.png",
    });
    setErrors({});
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) errs.name = "Full name is required";
      if (!formData.email.trim() || !formData.email.includes("@")) {
        errs.email = "Valid email is required";
      }
      if (!formData.phone.trim() || formData.phone.length < 10) {
        errs.phone = "10-digit phone number is required";
      }
      if (!formData.dob) errs.dob = "Date of birth is required";
      if (!formData.emergencyPhone) errs.emergencyPhone = "Emergency contact phone is required";
    }

    if (step === 2) {
      if (!formData.college.trim()) errs.college = "College / University is required";
      if (!formData.course.trim()) errs.course = "Course is required";
      if (!formData.branch.trim()) errs.branch = "Branch / Specialization is required";
    }

    if (step === 3) {
      if (!formData.guardianName.trim()) errs.guardianName = "Guardian name is required";
      if (!formData.guardianPhone.trim()) errs.guardianPhone = "Guardian phone is required";
    }

    if (step === 4) {
      if (!formData.roomNumber.trim()) errs.roomNumber = "Room number is required";
      if (!formData.bedNumber.trim()) errs.bedNumber = "Bed number is required";
      if (formData.monthlyRent <= 0) errs.monthlyRent = "Enter valid monthly rent";
      if (!formData.joiningDate) errs.joiningDate = "Joining date is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) {
      setCurrentStep(4);
      return;
    }

    const initialDocs: StudentDocument[] = [
      {
        id: "doc-" + Date.now() + "-1",
        type: "AADHAAR",
        title: "Aadhaar Card",
        fileName: formData.aadhaarFileName || "aadhaar_card.pdf",
        fileSize: "1.4 MB",
        uploadedAt: new Date().toISOString().split("T")[0],
        status: "PENDING",
      },
      {
        id: "doc-" + Date.now() + "-2",
        type: "COLLEGE_ID",
        title: "College Identity Card",
        fileName: formData.collegeIdFileName || "college_id.png",
        fileSize: "850 KB",
        uploadedAt: new Date().toISOString().split("T")[0],
        status: "PENDING",
      },
    ];

    const newStudentPayload: Omit<Student, "id" | "studentId" | "createdAt" | "updatedAt"> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone.startsWith("+91") ? formData.phone : `+91 ${formData.phone}`,
      alternatePhone: formData.alternatePhone,
      dob: formData.dob,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      address: {
        street: formData.street || "Not specified",
        city: formData.city || "Delhi",
        state: formData.state || "Delhi",
        pincode: formData.pincode || "110001",
      },
      emergencyContact: {
        name: formData.emergencyName || formData.guardianName || "Emergency Contact",
        relation: formData.emergencyRelation,
        phone: formData.emergencyPhone || formData.guardianPhone,
      },
      academic: {
        college: formData.college,
        course: formData.course,
        branch: formData.branch,
        year: formData.year,
        rollNumber: formData.rollNumber,
      },
      guardian: {
        name: formData.guardianName,
        relation: formData.guardianRelation,
        phone: formData.guardianPhone,
        occupation: formData.guardianOccupation,
        address: formData.guardianAddress || formData.street,
      },
      accommodation: {
        pgId: formData.pgId,
        pgName: formData.pgName,
        building: formData.building,
        floor: formData.floor,
        roomNumber: formData.roomNumber,
        bedNumber: formData.bedNumber,
        sharingType: formData.sharingType,
        joiningDate: formData.joiningDate,
        expectedLeavingDate: formData.expectedLeavingDate || undefined,
        monthlyRent: Number(formData.monthlyRent),
        securityDeposit: Number(formData.securityDeposit),
        depositStatus: formData.depositStatus,
        noticePeriodDays: 30,
      },
      rentStatus: "PENDING",
      rentDueAmount: Number(formData.monthlyRent),
      nextRentDueDate: formData.joiningDate,
      verificationStatus: "PENDING",
      accountStatus: "ACTIVE",
      documents: initialDocs,
      rentHistory: [],
      attendance: {
        monthlyPercentage: 100,
        presentDays: 1,
        totalDays: 1,
        lastPunchIn: "Just now",
        records: [
          {
            date: formData.joiningDate,
            status: "PRESENT",
            inTime: "10:00 AM",
            notes: "Initial check-in on admission",
          },
        ],
      },
      complaints: [],
      timeline: [
        {
          id: "tl-" + Date.now(),
          title: "Student Admitted",
          description: `Registered at ${formData.pgName}, Room ${formData.roomNumber} (${formData.bedNumber})`,
          timestamp: "Just now",
          type: "ADMISSION",
          actor: "Admin",
        },
      ],
      adminNotes: [],
    };

    onAddStudent(newStudentPayload);
    onClose();
  };

  const steps = [
    { number: 1, label: "Personal", icon: User },
    { number: 2, label: "Academic", icon: GraduationCap },
    { number: 3, label: "Guardian", icon: HeartHandshake },
    { number: 4, label: "Accommodation", icon: Building2 },
    { number: 5, label: "Documents", icon: FileText },
    { number: 6, label: "Review", icon: CheckCircle2 },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#102A56]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-[#F5F8FC] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E1EAF4] overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-white p-4 sm:p-6 border-b border-[#E1EAF4] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#102A56]">
                Add New Student Registration
              </h2>
              <button
                type="button"
                onClick={handleAutoFill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E8F7F5] hover:bg-[#D7EFEA] text-[#0F8B83] text-xs font-bold border border-[#0F8B83]/20 transition-colors shadow-2xs"
                title="Fill sample student data instantly"
              >
                <span>⚡ Auto-fill Demo</span>
              </button>
            </div>
            <p className="text-xs text-[#7186A5] mt-0.5 hidden sm:block">
              Complete the multi-step admission form to register student & assign accommodation.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator Bar */}
        <div className="bg-white px-4 sm:px-5 py-2.5 sm:py-3 border-b border-[#E1EAF4] shrink-0">
          {/* Mobile view (< 640px) */}
          <div className="sm:hidden space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#102A56]">
              <span className="text-[#0F8B83]">Step {currentStep} of 6</span>
              <span className="text-[#7186A5]">{steps[currentStep - 1].label}</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-[#E1EAF4] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0F8B83] transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>
            {/* Step indicators */}
            <div className="flex items-center justify-between pt-0.5">
              {steps.map((s) => {
                const isPassed = currentStep > s.number;
                const isCurrent = currentStep === s.number;
                return (
                  <button
                    type="button"
                    key={s.number}
                    disabled={!isPassed && !isCurrent}
                    onClick={() => {
                      if (isPassed) setCurrentStep(s.number);
                    }}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold transition-colors ${
                      isPassed
                        ? "bg-[#16A34A] text-white"
                        : isCurrent
                        ? "bg-[#0F8B83] text-white shadow-xs"
                        : "bg-[#F5F8FC] text-[#7186A5] border border-[#E1EAF4]"
                    }`}
                  >
                    {isPassed ? <Check className="w-3 h-3" /> : s.number}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop view (>= 640px) */}
          <div className="hidden sm:grid grid-cols-6 gap-2">
            {steps.map((s) => {
              const isPassed = currentStep > s.number;
              const isCurrent = currentStep === s.number;

              return (
                <div
                  key={s.number}
                  onClick={() => {
                    if (isPassed) setCurrentStep(s.number);
                  }}
                  className={`flex items-center gap-1.5 cursor-pointer ${
                    isPassed ? "opacity-90 hover:opacity-100" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isPassed
                        ? "bg-[#16A34A] text-white"
                        : isCurrent
                        ? "bg-[#0F8B83] text-white shadow-sm shadow-[#0F8B83]/30"
                        : "bg-[#F5F8FC] text-[#7186A5] border border-[#E1EAF4]"
                    }`}
                  >
                    {isPassed ? <Check className="w-3.5 h-3.5" /> : s.number}
                  </div>
                  <span
                    className={`text-[11px] font-semibold truncate hidden sm:inline ${
                      isCurrent
                        ? "text-[#0F8B83] font-bold"
                        : isPassed
                        ? "text-[#102A56]"
                        : "text-[#7186A5]"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-3.5 sm:p-7 space-y-4 sm:space-y-5">
          
          {/* STEP 1: PERSONAL DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E1EAF4]">
                <User className="w-4 h-4 text-[#0F8B83]" />
                <h3 className="text-sm font-bold text-[#102A56]">Step 1: Personal Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#102A56]">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  />
                  {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">
                    Email Address <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="e.g. rahul.sharma@gmail.com"
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  />
                  {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A43] text-[#102A56]">
                    Mobile Phone <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  />
                  {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">
                    Alternate Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.alternatePhone}
                    onChange={(e) => handleChange("alternatePhone", e.target.value)}
                    placeholder="Optional second number"
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">
                    Date of Birth <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleChange("dob", e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  />
                  {errors.dob && <p className="text-[11px] text-rose-600 mt-1">{errors.dob}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-[#102A56]">Permanent Street Address</label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => handleChange("street", e.target.value)}
                    placeholder="House/Flat number, Colony, Area"
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="City"
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">State & Pincode</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      placeholder="State"
                      className="p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                    />
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => handleChange("pincode", e.target.value)}
                      placeholder="Pincode"
                      className="p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-[#E1EAF4]">
                  <h4 className="text-xs font-bold text-[#102A56] mb-2">Emergency Contact</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={formData.emergencyName}
                      onChange={(e) => handleChange("emergencyName", e.target.value)}
                      placeholder="Contact Person Name"
                      className="p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56]"
                    />
                    <input
                      type="text"
                      value={formData.emergencyRelation}
                      onChange={(e) => handleChange("emergencyRelation", e.target.value)}
                      placeholder="Relationship (e.g. Father)"
                      className="p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56]"
                    />
                    <input
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleChange("emergencyPhone", e.target.value)}
                      placeholder="Emergency Phone *"
                      className="p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56]"
                    />
                  </div>
                  {errors.emergencyPhone && (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.emergencyPhone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ACADEMIC DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E1EAF4]">
                <GraduationCap className="w-4 h-4 text-[#0F8B83]" />
                <h3 className="text-sm font-bold text-[#102A56]">Step 2: Academic Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-[#102A56]">
                    College / University <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => handleChange("college", e.target.value)}
                    placeholder="e.g. Delhi University / IIT Delhi"
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  />
                  {errors.college && <p className="text-[11px] text-rose-600 mt-1">{errors.college}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">
                    Course / Degree <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) => handleChange("course", e.target.value)}
                    placeholder="e.g. B.Tech / MBA / MBBS"
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  />
                  {errors.course && <p className="text-[11px] text-rose-600 mt-1">{errors.course}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">
                    Branch / Specialization <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => handleChange("branch", e.target.value)}
                    placeholder="e.g. Computer Science / Finance"
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  />
                  {errors.branch && <p className="text-[11px] text-rose-600 mt-1">{errors.branch}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">Year / Semester</label>
                  <select
                    value={formData.year}
                    onChange={(e) => handleChange("year", e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Post Graduate">Post Graduate</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">College Roll / Enrollment No</label>
                  <input
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) => handleChange("rollNumber", e.target.value)}
                    placeholder="e.g. 2026CS1092"
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: GUARDIAN DETAILS */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E1EAF4]">
                <HeartHandshake className="w-4 h-4 text-[#0F8B83]" />
                <h3 className="text-sm font-bold text-[#102A56]">Step 3: Guardian Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#102A56]">
                    Guardian Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.guardianName}
                    onChange={(e) => handleChange("guardianName", e.target.value)}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  />
                  {errors.guardianName && (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.guardianName}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">Relationship</label>
                  <select
                    value={formData.guardianRelation}
                    onChange={(e) => handleChange("guardianRelation", e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Local Guardian">Local Guardian</option>
                    <option value="Sibling">Sibling</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">
                    Guardian Phone <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.guardianPhone}
                    onChange={(e) => handleChange("guardianPhone", e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  />
                  {errors.guardianPhone && (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.guardianPhone}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">Occupation</label>
                  <input
                    type="text"
                    value={formData.guardianOccupation}
                    onChange={(e) => handleChange("guardianOccupation", e.target.value)}
                    placeholder="e.g. Government Officer, Doctor, Business"
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-[#102A56]">Guardian Address</label>
                  <input
                    type="text"
                    value={formData.guardianAddress}
                    onChange={(e) => handleChange("guardianAddress", e.target.value)}
                    placeholder="Leave empty if same as student permanent address"
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ACCOMMODATION DETAILS */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E1EAF4]">
                <Building2 className="w-4 h-4 text-[#0F8B83]" />
                <h3 className="text-sm font-bold text-[#102A56]">Step 4: Accommodation Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#102A56]">Select PG / Hostel</label>
                  <select
                    value={formData.pgName}
                    onChange={(e) => {
                      const selected = availablePgs.find((p) => p.name === e.target.value);
                      handleChange("pgName", e.target.value);
                      if (selected) handleChange("pgId", selected.id);
                    }}
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  >
                    {availablePgs.map((pg) => (
                      <option key={pg.id} value={pg.name}>
                        {pg.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">Building Wing / Floor</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <input
                      type="text"
                      value={formData.building}
                      onChange={(e) => handleChange("building", e.target.value)}
                      placeholder="Wing A"
                      className="p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56]"
                    />
                    <input
                      type="text"
                      value={formData.floor}
                      onChange={(e) => handleChange("floor", e.target.value)}
                      placeholder="Floor (e.g. 2nd)"
                      className="p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">
                    Room Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => handleChange("roomNumber", e.target.value)}
                    placeholder="e.g. 204"
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  />
                  {errors.roomNumber && (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.roomNumber}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">
                    Bed Allocation <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formData.bedNumber}
                    onChange={(e) => handleChange("bedNumber", e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  >
                    <option value="Bed A">Bed A</option>
                    <option value="Bed B">Bed B</option>
                    <option value="Bed C">Bed C</option>
                    <option value="Bed D">Bed D</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">Sharing Type</label>
                  <select
                    value={formData.sharingType}
                    onChange={(e) => handleChange("sharingType", e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  >
                    <option value="Single">Single Room</option>
                    <option value="Double">Double Sharing</option>
                    <option value="Triple">Triple Sharing</option>
                    <option value="Four-Sharing">Four Sharing</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">
                    Move-in / Joining Date <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => handleChange("joiningDate", e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">
                    Monthly Rent (₹) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyRent}
                    onChange={(e) => handleChange("monthlyRent", Number(e.target.value))}
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#102A56]">
                    Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.securityDeposit}
                    onChange={(e) => handleChange("securityDeposit", Number(e.target.value))}
                    className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] focus:outline-hidden font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: DOCUMENT UPLOAD */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E1EAF4]">
                <FileText className="w-4 h-4 text-[#0F8B83]" />
                <h3 className="text-sm font-bold text-[#102A56]">Step 5: Document Upload</h3>
              </div>

              <div className="space-y-3">
                {/* Aadhaar Upload Simulator */}
                <div className="p-4 rounded-2xl bg-white border border-[#E1EAF4] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#102A56]">
                      Aadhaar Card / Government Identity Proof
                    </span>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                      Required for Police Verification
                    </span>
                  </div>
                  <div className="border-2 border-dashed border-[#0F8B83]/30 rounded-xl p-4 text-center bg-[#E8F7F5]/30 hover:bg-[#E8F7F5]/60 transition-colors cursor-pointer">
                    <UploadCloud className="w-6 h-6 text-[#0F8B83] mx-auto mb-1" />
                    <p className="text-xs font-semibold text-[#102A56]">
                      {formData.aadhaarFileName || "Click or drag & drop Aadhaar Card (PDF / JPG)"}
                    </p>
                    <p className="text-[11px] text-[#7186A5] mt-0.5">Max size: 5MB</p>
                  </div>
                </div>

                {/* College ID Upload Simulator */}
                <div className="p-4 rounded-2xl bg-white border border-[#E1EAF4] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#102A56]">
                      College / University Student ID
                    </span>
                    <span className="text-[10px] text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                      Optional at Admission
                    </span>
                  </div>
                  <div className="border-2 border-dashed border-[#0F8B83]/30 rounded-xl p-4 text-center bg-[#E8F7F5]/30 hover:bg-[#E8F7F5]/60 transition-colors cursor-pointer">
                    <UploadCloud className="w-6 h-6 text-[#0F8B83] mx-auto mb-1" />
                    <p className="text-xs font-semibold text-[#102A56]">
                      {formData.collegeIdFileName || "Click or drag & drop College ID Card (PNG / JPG)"}
                    </p>
                    <p className="text-[11px] text-[#7186A5] mt-0.5">Max size: 5MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW & SUBMIT */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E1EAF4]">
                <CheckCircle2 className="w-4 h-4 text-[#0F8B83]" />
                <h3 className="text-sm font-bold text-[#102A56]">
                  Step 6: Review & Final Confirmation
                </h3>
              </div>

              {/* Review card */}
              <div className="p-4 rounded-2xl bg-white border border-[#E1EAF4] shadow-xs space-y-4 text-xs">
                {/* Personal Section */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#0F8B83] pb-1 border-b border-[#F5F8FC]">
                    <span>Personal Details</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-[#0F8B83] hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                    <div>
                      <strong>Name:</strong> {formData.name} ({formData.gender})
                    </div>
                    <div>
                      <strong>Phone:</strong> {formData.phone}
                    </div>
                    <div>
                      <strong>Email:</strong> {formData.email}
                    </div>
                    <div>
                      <strong>DOB:</strong> {formData.dob}
                    </div>
                  </div>
                </div>

                {/* Academic Section */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#0F8B83] pb-1 border-b border-[#F5F8FC]">
                    <span>Academic & Guardian</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-[#0F8B83] hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                    <div>
                      <strong>College:</strong> {formData.college}
                    </div>
                    <div>
                      <strong>Course:</strong> {formData.course} ({formData.branch})
                    </div>
                    <div>
                      <strong>Guardian:</strong> {formData.guardianName} ({formData.guardianRelation})
                    </div>
                    <div>
                      <strong>Guardian Phone:</strong> {formData.guardianPhone}
                    </div>
                  </div>
                </div>

                {/* Accommodation Section */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#0F8B83] pb-1 border-b border-[#F5F8FC]">
                    <span>Accommodation & Pricing</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="text-[#0F8B83] hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                    <div>
                      <strong>Property:</strong> {formData.pgName}
                    </div>
                    <div>
                      <strong>Room:</strong> Room {formData.roomNumber} ({formData.bedNumber})
                    </div>
                    <div>
                      <strong>Monthly Rent:</strong> ₹{formData.monthlyRent.toLocaleString("en-IN")}
                    </div>
                    <div>
                      <strong>Security Deposit:</strong> ₹{formData.securityDeposit.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Modal Footer (Next, Back, Submit) */}
        <div className="bg-white p-4 sm:p-5 border-t border-[#E1EAF4] flex items-center justify-between shrink-0">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E1EAF4] text-xs font-semibold text-[#102A56] hover:bg-[#F5F8FC] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#7186A5] hover:text-[#102A56] cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          <div>
            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs font-bold shadow-md shadow-[#0F8B83]/25 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs font-extrabold shadow-md shadow-[#0F8B83]/30 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Register Student</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
