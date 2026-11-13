'use client';

import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Phone, 
  Send, 
  User, 
  ShieldCheck, 
  MessageSquare, 
  Tag, 
  Flame, 
  Maximize2 
} from 'lucide-react';
import { Complaint, CommentReply } from '@/types/complaint';
import StudentComplaintTimeline from './StudentComplaintTimeline';
import ImageLightbox from '../ImageLightbox';
import { CURRENT_STUDENT } from '@/lib/mockComplaints';

interface StudentComplaintDetailModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (complaintId: string, comment: CommentReply) => void;
}

export default function StudentComplaintDetailModal({
  complaint,
  isOpen,
  onClose,
  onAddComment,
}: StudentComplaintDetailModalProps) {
  const [newComment, setNewComment] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isOpen || !complaint) return null;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const now = new Date();
    const formattedNow = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const commentObj: CommentReply = {
      id: `comm-${Date.now()}`,
      authorId: CURRENT_STUDENT.id,
      authorName: CURRENT_STUDENT.name,
      authorRole: 'Student',
      avatar: CURRENT_STUDENT.avatar,
      message: newComment.trim(),
      createdAt: formattedNow,
    };

    onAddComment(complaint.id, commentObj);
    setNewComment('');
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
      <div className="pgm-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
        <div
          className="pgm-modal-window size-lg"
          onClick={(e) => e.stopPropagation()}
          style={{ maxHeight: '94vh' }}
        >
          {/* Header */}
          <div className="pgm-modal-header" style={{ padding: '16px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span className="pgm-complaint-id">{complaint.id}</span>
              <span className={`pgm-status-badge status-${complaint.status.replace(/\s+/g, '')}`}>
                <span className="pgm-status-dot" />
                {complaint.status}
              </span>
              <span className={`pgm-priority-badge priority-${complaint.priority}`}>
                {complaint.priority === 'Urgent' && <Flame size={12} />}
                {complaint.priority} Priority
              </span>
            </div>

            <button
              onClick={onClose}
              className="pgm-drawer-close-btn"
              aria-label="Close complaint details"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="pgm-modal-body" style={{ gap: '22px' }}>
            {/* Title & Description Card */}
            <div
              style={{
                backgroundColor: 'var(--pgm-ivory-warm)',
                border: '1px solid var(--pgm-beige-border)',
                borderRadius: 'var(--pgm-radius-md)',
                padding: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '10px',
                }}
              >
                <h1
                  style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    color: 'var(--pgm-navy)',
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {complaint.title}
                </h1>
                <span className="pgm-category-badge">
                  <Tag size={12} />
                  {complaint.category}
                </span>
              </div>

              <p
                style={{
                  fontSize: '14.5px',
                  color: 'var(--pgm-navy-slate)',
                  margin: '0 0 14px 0',
                  lineHeight: '1.6',
                }}
              >
                {complaint.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '12.5px',
                  color: 'var(--pgm-navy-muted)',
                  borderTop: '1px dashed var(--pgm-beige-border)',
                  paddingTop: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color="var(--pgm-maroon)" />
                  <span>Submitted on: {formattedDate}</span>
                </div>
                <div>•</div>
                <div>
                  <span>Property: </span>
                  <strong style={{ color: 'var(--pgm-navy)' }}>
                    {complaint.student.pgName} (Room {complaint.student.roomNumber})
                  </strong>
                </div>
              </div>
            </div>

            {/* Uploaded Images Gallery */}
            {complaint.images && complaint.images.length > 0 && (
              <div className="pgm-drawer-section">
                <div className="pgm-drawer-section-title">
                  <span>Attached Photographs ({complaint.images.length})</span>
                </div>
                <div className="pgm-images-gallery">
                  {complaint.images.map((img) => (
                    <div
                      key={img.id}
                      className="pgm-image-thumb-wrap"
                      onClick={() => setSelectedImage(img.url)}
                      title="Click to zoom image"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={img.name} className="pgm-image-thumb" />
                      <div className="pgm-image-thumb-overlay">
                        <Maximize2 size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assigned Staff Member Card */}
            <div className="pgm-drawer-section">
              <div className="pgm-drawer-section-title">
                <span>Assigned Staff Member</span>
              </div>
              {complaint.assignedTo ? (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--pgm-beige-border)',
                    borderRadius: 'var(--pgm-radius-sm)',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    boxShadow: 'var(--pgm-shadow-xs)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={complaint.assignedTo.avatar}
                      alt={complaint.assignedTo.name}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--pgm-beige)',
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--pgm-navy)' }}>
                        {complaint.assignedTo.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--pgm-navy-muted)' }}>
                        {complaint.assignedTo.role} •{' '}
                        <span style={{ color: '#16A34A', fontWeight: 600 }}>{complaint.assignedTo.status}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`tel:${complaint.assignedTo.phone}`}
                    className="pgm-btn pgm-btn-secondary pgm-btn-sm"
                    style={{ textDecoration: 'none' }}
                  >
                    <Phone size={13} color="var(--pgm-maroon)" />
                    {complaint.assignedTo.phone}
                  </a>
                </div>
              ) : (
                <div
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--pgm-radius-sm)',
                    backgroundColor: 'var(--pgm-ivory-warm)',
                    border: '1px dashed var(--pgm-beige-border)',
                    fontSize: '13px',
                    color: 'var(--pgm-navy-muted)',
                  }}
                >
                  Staff assignment in progress. Management will assign an on-duty technician shortly.
                </div>
              )}
            </div>

            {/* Official Admin / Owner Response */}
            {complaint.adminResponse && (
              <div
                style={{
                  backgroundColor: 'var(--pgm-maroon-light)',
                  border: '1px solid var(--pgm-maroon-border)',
                  borderRadius: 'var(--pgm-radius-md)',
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} color="var(--pgm-maroon)" />
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--pgm-maroon)' }}>
                      Official Management Response
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--pgm-navy-muted)' }}>
                    {complaint.adminResponse.timestamp}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '13.5px',
                    color: 'var(--pgm-navy)',
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  &ldquo;{complaint.adminResponse.message}&rdquo;
                </p>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--pgm-maroon)' }}>
                  — {complaint.adminResponse.responderName} ({complaint.adminResponse.responderRole})
                </div>
              </div>
            )}

            {/* Complaint Activity Timeline */}
            <div className="pgm-drawer-section">
              <div className="pgm-drawer-section-title">
                <span>Status & Activity Timeline</span>
              </div>
              <StudentComplaintTimeline
                timeline={complaint.timeline}
                status={complaint.status}
              />
            </div>

            {/* Conversation / Student Replies Feed */}
            <div className="pgm-drawer-section">
              <div className="pgm-drawer-section-title">
                <MessageSquare size={15} />
                <span>Discussion & Updates ({complaint.comments.length})</span>
              </div>

              {/* Message List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {complaint.comments.length === 0 ? (
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'var(--pgm-navy-subtle)',
                      fontStyle: 'italic',
                      padding: '8px 0',
                    }}
                  >
                    No additional student remarks yet. Use the box below to ask questions or give instructions to the technician.
                  </div>
                ) : (
                  complaint.comments.map((comm) => (
                    <div
                      key={comm.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--pgm-radius-sm)',
                        backgroundColor:
                          comm.authorRole === 'Student'
                            ? 'var(--pgm-ivory-warm)'
                            : '#FFFFFF',
                        border: '1px solid var(--pgm-beige-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: 700,
                              color: 'var(--pgm-navy)',
                            }}
                          >
                            {comm.authorName}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              backgroundColor:
                                comm.authorRole === 'Student'
                                  ? 'var(--pgm-beige)'
                                  : 'var(--pgm-maroon-light)',
                              color:
                                comm.authorRole === 'Student'
                                  ? 'var(--pgm-navy)'
                                  : 'var(--pgm-maroon)',
                              fontWeight: 700,
                            }}
                          >
                            {comm.authorRole}
                          </span>
                        </div>
                        <span style={{ fontSize: '11.5px', color: 'var(--pgm-navy-subtle)' }}>
                          {comm.createdAt}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--pgm-navy-slate)', lineHeight: 1.4 }}>
                        {comm.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Input Form */}
              <form onSubmit={handleSendComment} style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="pgm-input"
                    placeholder="Add a reply, confirmation or instruction..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="pgm-btn pgm-btn-primary"
                    disabled={!newComment.trim()}
                  >
                    <Send size={14} />
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="pgm-modal-footer">
            <button
              type="button"
              className="pgm-btn pgm-btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}
