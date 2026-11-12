"use client";

import React, { useState } from "react";
import { X, Send, MessageSquare, Mail, Phone } from "lucide-react";
import { Student } from "@/types/student";

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSend: (studentId: string, channel: string, message: string) => void;
}

export default function SendNotificationModal({
  isOpen,
  onClose,
  student,
  onSend,
}: SendNotificationModalProps) {
  if (!isOpen || !student) return null;

  const [channel, setChannel] = useState<"WHATSAPP" | "SMS" | "EMAIL">("WHATSAPP");
  const [template, setTemplate] = useState("rent_reminder");
  const [message, setMessage] = useState(
    `Dear ${student.name}, this is a gentle reminder from ${student.accommodation.pgName} regarding your monthly rent of ₹${student.accommodation.monthlyRent}. Please clear before the due date.`
  );

  const handleTemplateChange = (t: string) => {
    setTemplate(t);
    if (t === "rent_reminder") {
      setMessage(
        `Dear ${student.name}, this is a gentle reminder from ${student.accommodation.pgName} regarding your monthly rent of ₹${student.accommodation.monthlyRent}. Please clear before the due date.`
      );
    } else if (t === "docs_pending") {
      setMessage(
        `Dear ${student.name}, your Aadhaar / college ID verification is still pending at ${student.accommodation.pgName}. Kindly submit or re-upload your document at the admin desk.`
      );
    } else if (t === "room_inspection") {
      setMessage(
        `Dear ${student.name}, monthly room maintenance & AC servicing for Room ${student.accommodation.roomNumber} is scheduled for tomorrow between 11 AM - 1 PM.`
      );
    } else if (t === "custom") {
      setMessage("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSend(student.id, channel, message.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-[#102A56]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-[#F5F8FC] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E1EAF4] overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-white p-4 sm:p-5 border-b border-[#E1EAF4] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#E8F7F5] text-[#0F8B83] flex items-center justify-center font-bold shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-[#102A56] truncate">
                Send Student Notification
              </h2>
              <p className="text-xs text-[#7186A5] truncate">To: {student.name} ({student.phone})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7B8C9E] hover:text-[#102A56] hover:bg-[#F5F8FC] shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
          <div>
            <label className="text-xs font-semibold text-[#102A56]">Delivery Channel</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {[
                { id: "WHATSAPP", label: "WhatsApp", icon: MessageSquare },
                { id: "SMS", label: "SMS", icon: Phone },
                { id: "EMAIL", label: "Email", icon: Mail },
              ].map((c) => {
                const isSelected = channel === c.id;
                const Icon = c.icon;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setChannel(c.id as any)}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? "bg-[#0F8B83] text-white border-[#0F8B83]"
                        : "bg-white text-[#7186A5] border-[#E1EAF4] hover:bg-[#F5F8FC]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#102A56]">Select Template</label>
            <select
              value={template}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] font-semibold"
            >
              <option value="rent_reminder">Rent Due Reminder</option>
              <option value="docs_pending">Document Pending Notice</option>
              <option value="room_inspection">Room Inspection & Maintenance</option>
              <option value="custom">Custom Blank Message</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#102A56]">Message Content</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full mt-1 p-2.5 rounded-xl border border-[#E1EAF4] bg-white text-xs text-[#102A56] focus:border-[#0F8B83] resize-none"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-[#7186A5] hover:text-[#102A56] text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs font-bold shadow-md shadow-[#0F8B83]/25 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
