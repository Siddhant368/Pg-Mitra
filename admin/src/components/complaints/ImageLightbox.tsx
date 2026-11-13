'use client';

import React, { useEffect } from 'react';
import { X, ZoomIn, Download } from 'lucide-react';

interface ImageLightboxProps {
  imageUrl: string | null;
  imageTitle?: string;
  onClose: () => void;
}

export default function ImageLightbox({
  imageUrl,
  imageTitle = 'Complaint Attachment',
  onClose,
}: ImageLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (imageUrl) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  return (
    <div
      className="pgm-modal-backdrop"
      style={{ zIndex: 1300, backgroundColor: 'rgba(11, 29, 51, 0.88)' }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '92vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            color: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ZoomIn size={18} color="var(--pgm-beige)" />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{imageTitle}</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="pgm-btn pgm-btn-secondary pgm-btn-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              <Download size={14} />
              Open Original
            </a>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label="Close image preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            maxHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={imageTitle}
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      </div>
    </div>
  );
}
