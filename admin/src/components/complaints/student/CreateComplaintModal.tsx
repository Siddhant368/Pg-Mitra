'use client';

import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  AlertCircle, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { 
  Complaint, 
  ComplaintCategory, 
  ComplaintPriority, 
  ComplaintImage 
} from '@/types/complaint';
import { CURRENT_STUDENT } from '@/lib/mockComplaints';

interface CreateComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newComplaint: Complaint) => void;
}

const CATEGORIES: ComplaintCategory[] = [
  'Electricity',
  'Water Supply',
  'Room Maintenance',
  'Cleaning',
  'Wi-Fi / Internet',
  'Food Quality',
  'Security',
  'Other',
];

const SAMPLE_PRESET_IMAGES = [
  {
    name: 'AC Leak Water Stains',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    size: '1.4 MB',
  },
  {
    name: 'Bathroom Tap Dripping',
    url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80',
    size: '2.1 MB',
  },
  {
    name: 'Wi-Fi Speed Drop',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
    size: '850 KB',
  },
];

export default function CreateComplaintModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateComplaintModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Room Maintenance');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');
  const [images, setImages] = useState<ComplaintImage[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'Complaint title is required.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please provide details of the complaint.';
    } else if (description.trim().length < 15) {
      newErrors.description = 'Please describe the issue in at least 15 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const newImg: ComplaintImage = {
            id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            url: uploadEvent.target.result as string,
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          };
          setImages((prev) => [...prev, newImg]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPresetImage = (preset: { name: string; url: string; size: string }) => {
    if (images.some((img) => img.url === preset.url)) return;
    setImages((prev) => [
      ...prev,
      {
        id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: preset.name,
        url: preset.url,
        size: preset.size,
      },
    ]);
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const now = new Date();
    const formattedNow = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const newTicketId = `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const complaintData: Complaint = {
      id: newTicketId,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: 'Pending',
      submittedDate: now.toISOString(),
      updatedDate: now.toISOString(),
      student: CURRENT_STUDENT,
      assignedTo: null,
      images,
      timeline: [
        {
          id: `tl-new-1`,
          step: 1,
          title: 'Complaint Submitted',
          description: `Ticket submitted by ${CURRENT_STUDENT.name} (${CURRENT_STUDENT.pgName}, Room ${CURRENT_STUDENT.roomNumber}).`,
          timestamp: formattedNow,
          actor: CURRENT_STUDENT.name,
          actorRole: 'Student',
          completed: true,
        },
        {
          id: `tl-new-2`,
          step: 2,
          title: 'Complaint Reviewed',
          description: 'Awaiting triage and staff assignment by management.',
          timestamp: 'Pending Review',
          actor: 'System',
          actorRole: 'System',
          completed: false,
        },
        {
          id: `tl-new-3`,
          step: 3,
          title: 'Work In Progress',
          description: 'Technician dispatched to inspect and repair.',
          timestamp: 'Pending Execution',
          actor: 'System',
          actorRole: 'System',
          completed: false,
        },
        {
          id: `tl-new-4`,
          step: 4,
          title: 'Complaint Resolved',
          description: 'Work completed and student verification pending.',
          timestamp: 'Pending',
          actor: 'System',
          actorRole: 'System',
          completed: false,
        },
      ],
      adminResponse: null,
      internalNotes: [],
      comments: [],
    };

    setTimeout(() => {
      onSubmit(complaintData);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="pgm-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pgm-modal-window size-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="pgm-modal-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--pgm-maroon)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              New Resident Ticket • {CURRENT_STUDENT.roomNumber} ({CURRENT_STUDENT.pgName})
            </span>
            <h2 className="pgm-modal-title">Create Complaint</h2>
          </div>
          <button
            onClick={onClose}
            className="pgm-drawer-close-btn"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="pgm-modal-body">
            {/* Title */}
            <div className="pgm-form-group">
              <label htmlFor="complaint-title" className="pgm-form-label">
                Complaint Title <span style={{ color: 'var(--pgm-maroon)' }}>*</span>
              </label>
              <input
                id="complaint-title"
                type="text"
                className="pgm-input"
                placeholder="e.g. Bathroom geyser not heating water or AC water leaking"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
              />
              {errors.title && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--pgm-maroon)', fontSize: '12px' }}>
                  <AlertCircle size={13} />
                  <span>{errors.title}</span>
                </div>
              )}
            </div>

            {/* Category & Priority Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Category */}
              <div className="pgm-form-group">
                <label htmlFor="complaint-category" className="pgm-form-label">
                  Category <span style={{ color: 'var(--pgm-maroon)' }}>*</span>
                </label>
                <select
                  id="complaint-category"
                  className="pgm-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Display / Helper */}
              <div className="pgm-form-group">
                <label className="pgm-form-label">
                  Selected Urgency: <span style={{ color: 'var(--pgm-maroon)' }}>{priority}</span>
                </label>
                <span className="pgm-form-helper">
                  Choose how soon this issue needs on-site attention.
                </span>
              </div>
            </div>

            {/* Priority Selector Pills */}
            <div className="pgm-form-group">
              <label className="pgm-form-label">Priority Level</label>
              <div className="pgm-priority-selector">
                {(['Low', 'Medium', 'High', 'Urgent'] as ComplaintPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`pgm-priority-option p-${p} ${priority === p ? 'selected' : ''}`}
                  >
                    {priority === p && <Check size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="pgm-form-group">
              <label htmlFor="complaint-desc" className="pgm-form-label">
                Detailed Description <span style={{ color: 'var(--pgm-maroon)' }}>*</span>
              </label>
              <textarea
                id="complaint-desc"
                rows={4}
                className="pgm-textarea"
                placeholder="Explain the issue clearly (e.g. location in room, when it started, any strange sound or smell, etc.)..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {errors.description ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--pgm-maroon)', fontSize: '12px' }}>
                    <AlertCircle size={13} />
                    <span>{errors.description}</span>
                  </div>
                ) : (
                  <span className="pgm-form-helper">Minimum 15 characters. Be as specific as possible.</span>
                )}
                <span style={{ fontSize: '11px', color: 'var(--pgm-navy-subtle)' }}>
                  {description.length} chars
                </span>
              </div>
            </div>

            {/* Upload Images */}
            <div className="pgm-form-group">
              <label className="pgm-form-label">
                Upload Images <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--pgm-navy-muted)' }}>(Optional, max 5 images)</span>
              </label>

              {/* Dropzone */}
              <label className="pgm-dropzone">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <UploadCloud className="pgm-dropzone-icon" />
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--pgm-navy)' }}>
                  Click or drag photos here to attach
                </div>
                <div style={{ fontSize: '12px', color: 'var(--pgm-navy-muted)' }}>
                  Supports PNG, JPG, JPEG up to 10MB each
                </div>
              </label>

              {/* Sample Photo Presets for Easy Testing */}
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--pgm-navy-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} color="var(--pgm-maroon)" />
                  Or attach sample test photos:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {SAMPLE_PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      className="pgm-btn pgm-btn-secondary pgm-btn-sm"
                      style={{ fontSize: '11px', padding: '4px 8px' }}
                      onClick={() => handleAddPresetImage(preset)}
                    >
                      <ImageIcon size={12} />
                      + {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Uploaded Previews */}
              {images.length > 0 && (
                <div className="pgm-uploaded-previews">
                  {images.map((img) => (
                    <div key={img.id} className="pgm-preview-item" title={img.name}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={img.name} className="pgm-preview-img" />
                      <button
                        type="button"
                        className="pgm-preview-remove"
                        onClick={() => handleRemoveImage(img.id)}
                        aria-label="Remove image"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pgm-modal-footer">
            <button
              type="button"
              className="pgm-btn pgm-btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pgm-btn pgm-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
