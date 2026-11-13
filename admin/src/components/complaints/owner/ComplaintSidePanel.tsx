'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Tag,
  Flame,
  Calendar,
  Save,
  MessageSquare,
  MessageCircle
} from 'lucide-react';
import { 
  Complaint, 
  ComplaintPriority, 
  ComplaintStatus, 
  StaffMember, 
  InternalNote 
} from '@/types/complaint';
import { AVAILABLE_STAFF } from '@/lib/mockComplaints';
import ImageLightbox from '../ImageLightbox';

interface ComplaintSidePanelProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateComplaint: (updated: Complaint) => void;
  onResolveQuick: (complaint: Complaint) => void;
}

export default function ComplaintSidePanel({
  complaint,
  isOpen,
  onClose,
  onUpdateComplaint,
  onResolveQuick,
}: ComplaintSidePanelProps) {
  // Local form state
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>('Pending');
  const [selectedPriority, setSelectedPriority] = useState<ComplaintPriority>('Medium');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [newInternalNote, setNewInternalNote] = useState('');
  const [responseText, setResponseText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Sync state whenever complaint opens
  useEffect(() => {
    if (complaint) {
      setSelectedStatus(complaint.status);
      setSelectedPriority(complaint.priority);
      setSelectedStaffId(complaint.assignedTo ? complaint.assignedTo.id : '');
      setResponseText(complaint.adminResponse ? complaint.adminResponse.message : '');
      setNewInternalNote('');
    }
  }, [complaint]);

  if (!isOpen || !complaint) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternalNote.trim()) return;

    const note: InternalNote = {
      id: `note-${Date.now()}`,
      author: 'Vikramaditya (Owner)',
      authorRole: 'Owner',
      content: newInternalNote.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated: Complaint = {
      ...complaint,
      internalNotes: [...(complaint.internalNotes || []), note],
      updatedDate: new Date().toISOString(),
    };

    onUpdateComplaint(updated);
    setNewInternalNote('');
  };

  const handleSaveChanges = () => {
    const staffObj = AVAILABLE_STAFF.find((s) => s.id === selectedStaffId) || null;

    const now = new Date();
    const formattedNow = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const updatedTimeline = (complaint.timeline || []).map((step) => {
      if (step.step === 2 && (selectedStatus === 'Reviewed' || selectedStatus === 'In Progress' || selectedStatus === 'Resolved')) {
        return {
          ...step,
          completed: true,
          timestamp: step.completed ? step.timestamp : formattedNow,
          actor: 'Management',
          actorRole: 'Owner' as const,
        };
      }
      if (step.step === 3 && (selectedStatus === 'In Progress' || selectedStatus === 'Resolved')) {
        return {
          ...step,
          completed: true,
          timestamp: step.completed ? step.timestamp : formattedNow,
          actor: staffObj ? staffObj.name : 'Maintenance Crew',
          actorRole: 'Staff' as const,
        };
      }
      if (step.step === 4 && selectedStatus === 'Resolved') {
        return {
          ...step,
          completed: true,
          timestamp: step.completed ? step.timestamp : formattedNow,
          actor: 'Management',
          actorRole: 'Owner' as const,
        };
      }
      return step;
    });

    const updated: Complaint = {
      ...complaint,
      status: selectedStatus,
      priority: selectedPriority,
      assignedTo: staffObj,
      timeline: updatedTimeline,
      updatedDate: new Date().toISOString(),
      adminResponse: responseText.trim()
        ? {
            message: responseText.trim(),
            responderName: 'Property Owner',
            responderRole: 'Management',
            timestamp: formattedNow,
          }
        : complaint.adminResponse,
    };

    onUpdateComplaint(updated);
  };

  const formattedDate = new Date(complaint.submittedDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#102A56]/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Panel */}
      <div 
        className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col border-l border-[#E1EAF4] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile top grab handle */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-0.5 bg-[#F5F8FC]/50 pointer-events-none">
          <div className="w-10 h-1.5 rounded-full bg-[#D8E4F0]" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E1EAF4] flex items-center justify-between gap-3 bg-[#F5F8FC]/50">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white text-[#0F8B83] border border-[#0F8B83]/30 shadow-2xs">
                {complaint.id}
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F7F5] text-[#0F8B83] border border-[#0F8B83]/20">
                {complaint.category}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#102A56] truncate">
              {complaint.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-white border border-transparent hover:border-[#E1EAF4] transition-all cursor-pointer"
            aria-label="Close side panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Section 1: Resident & Property Box */}
          <div className="bg-[#F5F8FC] border border-[#E1EAF4] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#7186A5] uppercase tracking-wider">
              <span>Resident Information</span>
              <span className="text-[#0F8B83]">Room #{complaint.student.roomNumber}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#0F8B83] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                {complaint.student.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-[#102A56] text-sm truncate">
                  {complaint.student.name}
                </div>
                <div className="text-xs text-[#7186A5] truncate">
                  {complaint.student.pgName} · Bed {complaint.student.bedNumber}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-[#E1EAF4] text-xs">
              <a
                href={`tel:${complaint.student.phone}`}
                className="flex-1 py-1.5 px-3 rounded-xl bg-white hover:bg-[#E8F7F5] text-[#0F8B83] font-bold border border-[#E1EAF4] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
              <a
                href={`https://wa.me/91${complaint.student.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(complaint.student.name)},%20regarding%20your%20complaint%20%23${complaint.id}%20(${encodeURIComponent(complaint.title)}):%20`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors"
                title="WhatsApp Resident"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`mailto:${complaint.student.email}`}
                className="p-1.5 rounded-xl bg-white hover:bg-[#F5F8FC] text-[#7186A5] border border-[#E1EAF4] flex items-center justify-center transition-colors"
                title={complaint.student.email}
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Section 2: Complaint Details & Photos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7186A5]">
              <span className="font-bold uppercase tracking-wider">Complaint Description</span>
              <span>{formattedDate}</span>
            </div>
            <div className="bg-white border border-[#E1EAF4] rounded-2xl p-4 text-xs sm:text-sm text-[#102A56] leading-relaxed">
              {complaint.description}
            </div>

            {/* Attached Photos */}
            {complaint.images && complaint.images.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-[#7186A5]">Attached Photos ({complaint.images.length})</span>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {complaint.images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img.url)}
                      className="w-16 h-16 rounded-xl overflow-hidden border border-[#E1EAF4] hover:border-[#0F8B83] transition-all shrink-0 cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Status, Priority & Staff Controls */}
          <div className="bg-white border border-[#E1EAF4] rounded-2xl p-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7186A5]">
              Manage Ticket Status & Assignment
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Status Select */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#102A56]">Ticket Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
                  className="w-full bg-[#F5F8FC] border border-[#E1EAF4] focus:border-[#0F8B83] text-[#102A56] rounded-xl px-3 py-2 text-xs font-bold cursor-pointer"
                >
                  <option value="Pending">Pending Review</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Priority Select */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#102A56]">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as ComplaintPriority)}
                  className="w-full bg-[#F5F8FC] border border-[#E1EAF4] focus:border-[#0F8B83] text-[#102A56] rounded-xl px-3 py-2 text-xs font-bold cursor-pointer"
                >
                  <option value="Low">🌱 Low</option>
                  <option value="Medium">🔹 Medium</option>
                  <option value="High">⚠️ High</option>
                  <option value="Urgent">🔥 Urgent</option>
                </select>
              </div>
            </div>

            {/* Staff Assignment */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#102A56]">Assign Technician / Staff</label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full bg-[#F5F8FC] border border-[#E1EAF4] focus:border-[#0F8B83] text-[#102A56] rounded-xl px-3 py-2 text-xs font-bold cursor-pointer"
              >
                <option value="">Unassigned</option>
                {AVAILABLE_STAFF.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} — {staff.role} ({staff.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 4: Resolution / Owner Response to Student */}
          <div className="bg-white border border-[#E1EAF4] rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7186A5]">
              Response to Resident
            </h4>
            <textarea
              rows={3}
              placeholder="Type update message for the resident (e.g. Electrician scheduled for 3 PM)..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="w-full bg-[#F5F8FC] border border-[#E1EAF4] focus:border-[#0F8B83] rounded-xl p-3 text-xs sm:text-sm text-[#102A56] placeholder:text-[#7186A5] resize-none"
            />
          </div>

          {/* Section 5: Internal Notes */}
          <div className="bg-white border border-[#E1EAF4] rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7186A5]">
              Internal Staff Notes
            </h4>
            <div className="space-y-2">
              {(complaint.internalNotes || []).map((note) => (
                <div key={note.id} className="p-2.5 rounded-xl bg-[#F5F8FC] border border-[#E1EAF4] text-xs space-y-1">
                  <div className="flex items-center justify-between text-[#7186A5]">
                    <span className="font-bold text-[#102A56]">{note.author}</span>
                    <span className="text-[10px]">{new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[#102A56]">{note.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add private note for management..."
                value={newInternalNote}
                onChange={(e) => setNewInternalNote(e.target.value)}
                className="flex-1 bg-[#F5F8FC] border border-[#E1EAF4] focus:border-[#0F8B83] rounded-xl px-3 py-2 text-xs text-[#102A56]"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-[#102A56] text-white text-xs font-bold hover:bg-[#0C2144] transition-colors"
              >
                Add
              </button>
            </form>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-[#E1EAF4] bg-white flex items-center justify-between gap-3">
          {complaint.status !== 'Resolved' && (
            <button
              onClick={() => onResolveQuick(complaint)}
              className="py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Resolved</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-[#E1EAF4] hover:bg-[#F5F8FC] text-[#102A56] text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleSaveChanges();
                onClose();
              }}
              className="py-2.5 px-5 rounded-xl bg-[#0F8B83] hover:bg-[#08756E] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox for attached photos */}
      {selectedImage && (
        <ImageLightbox
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}
