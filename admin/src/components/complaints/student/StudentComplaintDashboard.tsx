'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RotateCw, 
  Eye, 
  Tag, 
  Building2, 
  Flame, 
  ShieldAlert,
  Inbox,
  User,
  Phone
} from 'lucide-react';
import { 
  Complaint, 
  ComplaintCategory, 
  ComplaintStatus, 
  CommentReply 
} from '@/types/complaint';
import { 
  getStoredComplaints, 
  saveStoredComplaints, 
  calculateStudentStats, 
  CURRENT_STUDENT 
} from '@/lib/mockComplaints';
import CreateComplaintModal from './CreateComplaintModal';
import StudentComplaintDetailModal from './StudentComplaintDetailModal';
import { useComplaintToast } from '../ComplaintToast';
import RoleSwitcher from '../RoleSwitcher';

export default function StudentComplaintDashboard() {
  const { showToast } = useToastContext();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'Pending' | 'In Progress' | 'Resolved'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Sync data
  const loadComplaints = () => {
    setLoading(true);
    setTimeout(() => {
      const data = getStoredComplaints();
      setComplaints(data);
      setLoading(false);
    }, 350);
  };

  useEffect(() => {
    loadComplaints();

    const handleStorageUpdate = () => {
      setComplaints(getStoredComplaints());
    };
    window.addEventListener('pgmitra_complaints_updated', handleStorageUpdate);
    return () => window.removeEventListener('pgmitra_complaints_updated', handleStorageUpdate);
  }, []);

  // Filter for student's own complaints
  const studentComplaints = useMemo(() => {
    return complaints.filter((c) => c.student.id === CURRENT_STUDENT.id);
  }, [complaints]);

  // Statistics
  const stats = useMemo(() => {
    return calculateStudentStats(complaints, CURRENT_STUDENT.id);
  }, [complaints]);

  // Filtered complaints based on active filters
  const filteredComplaints = useMemo(() => {
    return studentComplaints.filter((c) => {
      // Tab filter
      if (activeTab === 'Pending' && c.status !== 'Pending' && c.status !== 'Reviewed') return false;
      if (activeTab === 'In Progress' && c.status !== 'In Progress') return false;
      if (activeTab === 'Resolved' && c.status !== 'Resolved') return false;

      // Category filter
      if (selectedCategory !== 'ALL' && c.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchId = c.id.toLowerCase().includes(query);
        const matchTitle = c.title.toLowerCase().includes(query);
        const matchDesc = c.description.toLowerCase().includes(query);
        const matchCategory = c.category.toLowerCase().includes(query);
        if (!matchId && !matchTitle && !matchDesc && !matchCategory) return false;
      }

      return true;
    });
  }, [studentComplaints, activeTab, selectedCategory, searchQuery]);

  // Handlers
  const handleCreateSubmit = (newComplaint: Complaint) => {
    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    saveStoredComplaints(updated);
    showToast(`Ticket ${newComplaint.id} submitted successfully! Our PG maintenance team has been notified.`, 'success');
  };

  const handleAddComment = (complaintId: string, comment: CommentReply) => {
    const updated = complaints.map((c) => {
      if (c.id === complaintId) {
        return {
          ...c,
          comments: [...c.comments, comment],
          updatedDate: new Date().toISOString(),
        };
      }
      return c;
    });

    setComplaints(updated);
    saveStoredComplaints(updated);

    if (selectedComplaint && selectedComplaint.id === complaintId) {
      setSelectedComplaint((prev) =>
        prev ? { ...prev, comments: [...prev.comments, comment] } : null
      );
    }
    showToast('Your message has been posted to the activity log.', 'info');
  };

  return (
    <div className="pgm-dashboard-root">
      <div className="pgm-container">
        {/* Top bar with resident badge & role switcher */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '18px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CURRENT_STUDENT.avatar}
              alt={CURRENT_STUDENT.name}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--pgm-beige)',
              }}
            />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--pgm-navy)' }}>
                {CURRENT_STUDENT.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--pgm-navy-muted)' }}>
                {CURRENT_STUDENT.pgName} • Room {CURRENT_STUDENT.roomNumber} ({CURRENT_STUDENT.bedNumber})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--pgm-navy-muted)' }}>Portal Navigation:</span>
            <RoleSwitcher />
          </div>
        </div>

        {/* Header */}
        <div className="pgm-header">
          <div className="pgm-header-left">
            <span className="pgm-header-badge">Student Care Portal</span>
            <h1 className="pgm-header-title">My Complaints</h1>
            <p className="pgm-header-subtitle">
              Raise and track your complaints easily.
            </p>
          </div>

          <div className="pgm-header-actions">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="pgm-btn pgm-btn-primary"
            >
              <Plus size={16} strokeWidth={2.5} />
              + Create Complaint
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="pgm-stats-grid">
          {/* Total Complaints */}
          <div className="pgm-stat-card stat-total">
            <div className="pgm-stat-icon-wrap">
              <Building2 size={24} />
            </div>
            <div className="pgm-stat-info">
              <span className="pgm-stat-label">Total Complaints</span>
              <span className="pgm-stat-value">{stats.total}</span>
              <span className="pgm-stat-meta">Lifetime raised in PG</span>
            </div>
          </div>

          {/* Pending Complaints */}
          <div className="pgm-stat-card stat-pending">
            <div className="pgm-stat-icon-wrap">
              <Clock size={24} />
            </div>
            <div className="pgm-stat-info">
              <span className="pgm-stat-label">Pending Complaints</span>
              <span className="pgm-stat-value">{stats.pending}</span>
              <span className="pgm-stat-meta">Awaiting review or dispatch</span>
            </div>
          </div>

          {/* In Progress */}
          <div className="pgm-stat-card stat-progress">
            <div className="pgm-stat-icon-wrap">
              <RotateCw size={24} />
            </div>
            <div className="pgm-stat-info">
              <span className="pgm-stat-label">In Progress</span>
              <span className="pgm-stat-value">{stats.inProgress}</span>
              <span className="pgm-stat-meta">Staff actively working</span>
            </div>
          </div>

          {/* Resolved Complaints */}
          <div className="pgm-stat-card stat-resolved">
            <div className="pgm-stat-icon-wrap">
              <CheckCircle2 size={24} />
            </div>
            <div className="pgm-stat-info">
              <span className="pgm-stat-label">Resolved Complaints</span>
              <span className="pgm-stat-value">{stats.resolved}</span>
              <span className="pgm-stat-meta">Successfully closed</span>
            </div>
          </div>
        </div>

        {/* Tabs & Search Toolbar */}
        <div className="pgm-toolbar-card">
          {/* Status Tabs */}
          <div className="pgm-tabs-row">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`pgm-tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
            >
              All Complaints
              <span className="pgm-tab-count">{studentComplaints.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('Pending')}
              className={`pgm-tab-btn ${activeTab === 'Pending' ? 'active' : ''}`}
            >
              Pending
              <span className="pgm-tab-count">{stats.pending}</span>
            </button>
            <button
              onClick={() => setActiveTab('In Progress')}
              className={`pgm-tab-btn ${activeTab === 'In Progress' ? 'active' : ''}`}
            >
              In Progress
              <span className="pgm-tab-count">{stats.inProgress}</span>
            </button>
            <button
              onClick={() => setActiveTab('Resolved')}
              className={`pgm-tab-btn ${activeTab === 'Resolved' ? 'active' : ''}`}
            >
              Resolved
              <span className="pgm-tab-count">{stats.resolved}</span>
            </button>
          </div>

          {/* Search & Category Filter Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px' }}>
            {/* Search */}
            <div className="pgm-input-wrapper">
              <Search className="pgm-input-icon" size={16} />
              <input
                type="text"
                className="pgm-input with-icon"
                placeholder="Search complaints by ID, title, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Dropdown */}
            <select
              className="pgm-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ minWidth: '180px' }}
            >
              <option value="ALL">All Categories</option>
              <option value="Electricity">Electricity</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Room Maintenance">Room Maintenance</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Wi-Fi / Internet">Wi-Fi / Internet</option>
              <option value="Food Quality">Food Quality</option>
              <option value="Security">Security</option>
              <option value="Other">Other</option>
            </select>

            {/* Refresh */}
            <button
              onClick={loadComplaints}
              className="pgm-btn pgm-btn-secondary"
              title="Refresh complaints"
            >
              <RotateCw size={15} />
              Refresh
            </button>
          </div>
        </div>

        {/* Complaint List (Table for Desktop, Cards for Mobile) */}
        {loading ? (
          <div className="pgm-table-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="pgm-skeleton" style={{ height: '36px', width: '100%' }} />
              <div className="pgm-skeleton" style={{ height: '60px', width: '100%' }} />
              <div className="pgm-skeleton" style={{ height: '60px', width: '100%' }} />
              <div className="pgm-skeleton" style={{ height: '60px', width: '100%' }} />
            </div>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="pgm-table-card">
            <div className="pgm-empty-state">
              <div className="pgm-empty-icon">
                <Inbox size={34} />
              </div>
              <h3 className="pgm-empty-title">No complaints found</h3>
              <p className="pgm-empty-desc">
                {searchQuery || selectedCategory !== 'ALL' || activeTab !== 'ALL'
                  ? 'No complaints matched your search criteria. Try adjusting your filters.'
                  : 'You do not have any complaints logged right now. Tap "+ Create Complaint" if you need maintenance assistance.'}
              </p>
              {(searchQuery || selectedCategory !== 'ALL' || activeTab !== 'ALL') ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                    setActiveTab('ALL');
                  }}
                  className="pgm-btn pgm-btn-secondary pgm-btn-sm"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="pgm-btn pgm-btn-primary"
                >
                  <Plus size={16} />
                  + Create First Complaint
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="pgm-table-card">
              <div className="pgm-table-responsive">
                <table className="pgm-table">
                  <thead>
                    <tr>
                      <th>Complaint ID</th>
                      <th>Complaint Title</th>
                      <th>Category</th>
                      <th>Submitted Date</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Assigned To</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map((item) => {
                      const dateStr = new Date(item.submittedDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      });

                      return (
                        <tr key={item.id}>
                          {/* ID */}
                          <td>
                            <span className="pgm-complaint-id">{item.id}</span>
                          </td>

                          {/* Title */}
                          <td>
                            <div className="pgm-complaint-title-cell">
                              <span className="pgm-complaint-title">{item.title}</span>
                              <span className="pgm-complaint-desc-snippet">
                                {item.description}
                              </span>
                            </div>
                          </td>

                          {/* Category */}
                          <td>
                            <span className="pgm-category-badge">
                              <Tag size={12} />
                              {item.category}
                            </span>
                          </td>

                          {/* Submitted Date */}
                          <td>
                            <span style={{ fontSize: '13px', color: 'var(--pgm-navy-slate)' }}>
                              {dateStr}
                            </span>
                          </td>

                          {/* Priority */}
                          <td>
                            <span className={`pgm-priority-badge priority-${item.priority}`}>
                              {item.priority === 'Urgent' && <Flame size={12} />}
                              {item.priority}
                            </span>
                          </td>

                          {/* Status */}
                          <td>
                            <span className={`pgm-status-badge status-${item.status.replace(/\s+/g, '')}`}>
                              <span className="pgm-status-dot" />
                              {item.status}
                            </span>
                          </td>

                          {/* Assigned To */}
                          <td>
                            {item.assignedTo ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.assignedTo.avatar}
                                  alt={item.assignedTo.name}
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '1px solid var(--pgm-beige-border)',
                                  }}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--pgm-navy)' }}>
                                    {item.assignedTo.name}
                                  </span>
                                  <span style={{ fontSize: '11px', color: 'var(--pgm-navy-muted)' }}>
                                    {item.assignedTo.role}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <span style={{ fontSize: '12px', color: 'var(--pgm-navy-subtle)', fontStyle: 'italic' }}>
                                Unassigned
                              </span>
                            )}
                          </td>

                          {/* Action */}
                          <td style={{ textAlign: 'right' }}>
                            <button
                              onClick={() => setSelectedComplaint(item)}
                              className="pgm-btn pgm-btn-secondary pgm-btn-sm"
                            >
                              <Eye size={13} color="var(--pgm-maroon)" />
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="pgm-mobile-cards-grid">
                {filteredComplaints.map((item) => (
                  <div key={item.id} className="pgm-mobile-card">
                    <div className="pgm-mobile-card-header">
                      <span className="pgm-complaint-id">{item.id}</span>
                      <span className={`pgm-status-badge status-${item.status.replace(/\s+/g, '')}`}>
                        <span className="pgm-status-dot" />
                        {item.status}
                      </span>
                    </div>

                    <div className="pgm-mobile-card-title">{item.title}</div>
                    <div className="pgm-mobile-card-desc">{item.description}</div>

                    <div className="pgm-mobile-card-meta">
                      <span className="pgm-category-badge">
                        <Tag size={12} />
                        {item.category}
                      </span>
                      <span className={`pgm-priority-badge priority-${item.priority}`}>
                        {item.priority}
                      </span>
                      <span>
                        {new Date(item.submittedDate).toLocaleDateString()}
                      </span>
                    </div>

                    {item.assignedTo && (
                      <div style={{ fontSize: '12px', color: 'var(--pgm-navy-slate)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={13} color="var(--pgm-maroon)" />
                        Assigned: <strong>{item.assignedTo.name}</strong> ({item.assignedTo.role})
                      </div>
                    )}

                    <div className="pgm-mobile-card-actions">
                      <button
                        onClick={() => setSelectedComplaint(item)}
                        className="pgm-btn pgm-btn-secondary pgm-btn-sm"
                        style={{ width: '100%' }}
                      >
                        <Eye size={14} color="var(--pgm-maroon)" />
                        View Details & Updates
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Create Complaint Modal */}
        <CreateComplaintModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateSubmit}
        />

        {/* Student Complaint Details Modal */}
        <StudentComplaintDetailModal
          complaint={selectedComplaint}
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onAddComment={handleAddComment}
        />
      </div>
    </div>
  );
}

// Fallback helper for Toast
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
