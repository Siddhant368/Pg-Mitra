'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  Phone, 
  Send, 
  User, 
  ShieldCheck, 
  MessageSquare, 
  Tag, 
  Flame, 
  Maximize2,
  Clock
} from 'lucide-react';
import { Complaint, CommentReply } from '@/types/complaint';
import { getStoredComplaints, saveStoredComplaints, CURRENT_STUDENT } from '@/lib/mockComplaints';
import StudentComplaintTimeline from '@/components/complaints/student/StudentComplaintTimeline';
import ImageLightbox from '@/components/complaints/ImageLightbox';
import { ComplaintToastProvider, useComplaintToast } from '@/components/complaints/ComplaintToast';
import RoleSwitcher from '@/components/complaints/RoleSwitcher';

export default function StudentComplaintDetailPage() {
  return (
    <ComplaintToastProvider>
      <ComplaintDetailContent />
    </ComplaintToastProvider>
  );
}

function ComplaintDetailContent() {
  const params = useParams();
  const router = useRouter();
  const complaintId = params?.id as string;
  const { showToast } = useToastContext();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const list = getStoredComplaints();
    const found = list.find((c) => c.id.toLowerCase() === complaintId?.toLowerCase());
    setComplaint(found || null);
    setLoading(false);
  }, [complaintId]);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !complaint) return;

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

    const updatedComplaint: Complaint = {
      ...complaint,
      comments: [...complaint.comments, commentObj],
      updatedDate: now.toISOString(),
    };

    const allComplaints = getStoredComplaints();
    const nextList = allComplaints.map((c) => (c.id === complaint.id ? updatedComplaint : c));
    saveStoredComplaints(nextList);

    setComplaint(updatedComplaint);
    setNewComment('');
    showToast('Your comment has been added to the ticket log.', 'info');
  };

  if (loading) {
    return (
      <div className="pgm-dashboard-root">
        <div className="pgm-container" style={{ padding: '40px 20px' }}>
          <div className="pgm-skeleton" style={{ height: '40px', width: '200px', marginBottom: '20px' }} />
          <div className="pgm-skeleton" style={{ height: '300px', width: '100%' }} />
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="pgm-dashboard-root">
        <div className="pgm-container" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--pgm-navy)' }}>Complaint Not Found</h2>
          <p style={{ color: 'var(--pgm-navy-muted)', margin: '10px 0 20px 0' }}>
            Ticket ID &ldquo;{complaintId}&rdquo; does not exist or has been removed.
          </p>
          <Link href="/student/complaints" className="pgm-btn pgm-btn-primary">
            <ArrowLeft size={14} /> Back to My Complaints
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(complaint.submittedDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="pgm-dashboard-root">
      <div className="pgm-container">
        {/* Navigation & Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <Link
            href="/student/complaints"
            className="pgm-btn pgm-btn-secondary pgm-btn-sm"
          >
            <ArrowLeft size={14} />
            Back to My Complaints
          </Link>

          <RoleSwitcher />
        </div>

        {/* Top Badges & ID */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--pgm-radius-md)',
            border: '1px solid var(--pgm-beige-border)',
            padding: '24px',
            boxShadow: 'var(--pgm-shadow-sm)',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span className="pgm-complaint-id">{complaint.id}</span>
            <span className={`pgm-status-badge status-${complaint.status.replace(/\s+/g, '')}`}>
              <span className="pgm-status-dot" />
              {complaint.status}
            </span>
            <span className={`pgm-priority-badge priority-${complaint.priority}`}>
              {complaint.priority === 'Urgent' && <Flame size={12} />}
              {complaint.priority} Priority
            </span>
            <span className="pgm-category-badge">
              <Tag size={12} />
              {complaint.category}
            </span>
          </div>

          <h1
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: 'var(--pgm-navy)',
              margin: '0 0 12px 0',
              lineHeight: 1.3,
            }}
          >
            {complaint.title}
          </h1>

          <p
            style={{
              fontSize: '15px',
              color: 'var(--pgm-navy-slate)',
              lineHeight: 1.6,
              margin: '0 0 18px 0',
            }}
          >
            {complaint.description}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '13px',
              color: 'var(--pgm-navy-muted)',
              borderTop: '1px dashed var(--pgm-beige-border)',
              paddingTop: '14px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} color="var(--pgm-maroon)" />
              <span>Submitted: {formattedDate}</span>
            </div>
            <div>•</div>
            <div>
              <span>Property: </span>
              <strong style={{ color: 'var(--pgm-navy)' }}>
                {complaint.student.pgName} (Room #{complaint.student.roomNumber})
              </strong>
            </div>
          </div>
        </div>

        {/* 2-Column Grid for Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
          {/* Left Column: Photos, Admin Response & Discussion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Uploaded Photos */}
            {complaint.images && complaint.images.length > 0 && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--pgm-radius-md)',
                  border: '1px solid var(--pgm-beige-border)',
                  padding: '20px',
                  boxShadow: 'var(--pgm-shadow-xs)',
                }}
              >
                <h3 className="pgm-drawer-section-title" style={{ marginBottom: '14px' }}>
                  Uploaded Issue Photos ({complaint.images.length})
                </h3>
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

            {/* Official Admin / Owner Response */}
            {complaint.adminResponse && (
              <div
                style={{
                  backgroundColor: 'var(--pgm-maroon-light)',
                  border: '1px solid var(--pgm-maroon-border)',
                  borderRadius: 'var(--pgm-radius-md)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: 'var(--pgm-shadow-xs)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={20} color="var(--pgm-maroon)" />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--pgm-maroon)' }}>
                      Official Management Response
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--pgm-navy-muted)' }}>
                    {complaint.adminResponse.timestamp}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--pgm-navy)', lineHeight: 1.5 }}>
                  &ldquo;{complaint.adminResponse.message}&rdquo;
                </p>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--pgm-maroon)' }}>
                  — {complaint.adminResponse.responderName} ({complaint.adminResponse.responderRole})
                </div>
              </div>
            )}

            {/* Discussion Thread */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--pgm-radius-md)',
                border: '1px solid var(--pgm-beige-border)',
                padding: '20px',
                boxShadow: 'var(--pgm-shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <h3 className="pgm-drawer-section-title" style={{ margin: 0 }}>
                <MessageSquare size={16} />
                <span>Comments & Inquiries ({complaint.comments.length})</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {complaint.comments.length === 0 ? (
                  <div style={{ fontSize: '13px', color: 'var(--pgm-navy-subtle)', fontStyle: 'italic' }}>
                    No messages yet. Send a message below to communicate with the maintenance desk.
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--pgm-navy)' }}>
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

              {/* Add Comment Input */}
              <form onSubmit={handleSendComment} style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <input
                  type="text"
                  className="pgm-input"
                  placeholder="Post an update or question for management..."
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
              </form>
            </div>
          </div>

          {/* Right Column: Timeline & Assigned Staff */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Status Timeline */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--pgm-radius-md)',
                border: '1px solid var(--pgm-beige-border)',
                padding: '20px',
                boxShadow: 'var(--pgm-shadow-xs)',
              }}
            >
              <h3 className="pgm-drawer-section-title" style={{ marginBottom: '16px' }}>
                <Clock size={16} />
                <span>Status Timeline</span>
              </h3>
              <StudentComplaintTimeline
                timeline={complaint.timeline}
                status={complaint.status}
              />
            </div>

            {/* Assigned Staff Member */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--pgm-radius-md)',
                border: '1px solid var(--pgm-beige-border)',
                padding: '20px',
                boxShadow: 'var(--pgm-shadow-xs)',
              }}
            >
              <h3 className="pgm-drawer-section-title" style={{ marginBottom: '14px' }}>
                <User size={16} />
                <span>Assigned Staff Member</span>
              </h3>

              {complaint.assignedTo ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={complaint.assignedTo.avatar}
                      alt={complaint.assignedTo.name}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--pgm-beige)',
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--pgm-navy)' }}>
                        {complaint.assignedTo.name}
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--pgm-navy-muted)' }}>
                        {complaint.assignedTo.role}
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#16A34A',
                          backgroundColor: '#DCFCE7',
                          padding: '1px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        {complaint.assignedTo.status}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`tel:${complaint.assignedTo.phone}`}
                    className="pgm-btn pgm-btn-secondary"
                    style={{ textDecoration: 'none', width: '100%' }}
                  >
                    <Phone size={14} color="var(--pgm-maroon)" />
                    Call {complaint.assignedTo.phone}
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
                  No staff member has been assigned yet. Management will allocate an available technician during regular maintenance hours.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}

function useToastContext() {
  try {
    return useComplaintToast();
  } catch {
    return {
      showToast: (msg: string) => {
        if (typeof window !== 'undefined') {
          // eslint-disable-next-line no-alert
          alert(msg);
        }
      },
    };
  }
}
