'use client';

import React from 'react';
import { Check, Clock, ShieldAlert, Sparkles } from 'lucide-react';
import { ActivityTimelineItem, ComplaintStatus } from '@/types/complaint';

interface StudentComplaintTimelineProps {
  timeline: ActivityTimelineItem[];
  status: ComplaintStatus;
}

export default function StudentComplaintTimeline({
  timeline,
  status,
}: StudentComplaintTimelineProps) {
  const stepsDef = [
    { step: 1, title: 'Complaint Submitted', defaultDesc: 'Ticket registered by student.' },
    { step: 2, title: 'Complaint Reviewed', defaultDesc: 'Reviewed by management and priority evaluated.' },
    { step: 3, title: 'Work In Progress', defaultDesc: 'Assigned technician on-site executing repairs.' },
    { step: 4, title: 'Complaint Resolved', defaultDesc: 'Issue rectified and verified.' },
  ];

  return (
    <div className="pgm-timeline">
      {stepsDef.map((def) => {
        const matchingItem = timeline.find((t) => t.step === def.step);
        let isCompleted = matchingItem?.completed ?? false;
        
        let isActive = false;
        if (!isCompleted) {
          if (status === 'Pending' && def.step === 2) isActive = true;
          if (status === 'Reviewed' && def.step === 3) isActive = true;
          if (status === 'In Progress' && def.step === 3) isActive = true;
          if (status === 'Resolved' && def.step === 4) isCompleted = true;
        }

        const stepClass = isCompleted
          ? 'completed'
          : isActive
          ? 'active'
          : '';

        return (
          <div key={def.step} className={`pgm-timeline-step ${stepClass}`}>
            <div className="pgm-timeline-dot">
              {isCompleted ? (
                <Check size={13} strokeWidth={3} />
              ) : isActive ? (
                <Clock size={12} strokeWidth={2.5} />
              ) : (
                <span>{def.step}</span>
              )}
            </div>

            <div>
              <div
                className="pgm-timeline-step-title"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: isCompleted
                    ? 'var(--pgm-navy)'
                    : isActive
                    ? 'var(--pgm-maroon)'
                    : 'var(--pgm-navy-muted)',
                }}
              >
                <span>{def.title}</span>
                {isActive && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--pgm-beige)',
                      color: 'var(--pgm-navy)',
                    }}
                  >
                    Current Stage
                  </span>
                )}
              </div>

              <p className="pgm-timeline-step-desc">
                {matchingItem ? matchingItem.description : def.defaultDesc}
              </p>

              {matchingItem && (
                <div className="pgm-timeline-step-time">
                  <span>{matchingItem.timestamp}</span>
                  {matchingItem.actor && (
                    <span style={{ marginLeft: '8px', fontWeight: 600, color: 'var(--pgm-maroon)' }}>
                      • {matchingItem.actor} ({matchingItem.actorRole})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
