'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  MessageSquare, 
  BedDouble, 
  Utensils, 
  Bell, 
  LogOut,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { CURRENT_STUDENT } from '@/lib/mockComplaints';
import RoleSwitcher from '@/components/complaints/RoleSwitcher';
import '@/styles/complaintsTheme.css';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--pgm-ivory)', display: 'flex', flexDirection: 'column' }}>
      {/* Student Portal Top Navigation Bar */}
      <nav
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--pgm-beige-border)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: 'var(--pgm-shadow-xs)',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '0 20px',
            height: '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link
              href="/student/complaints"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--pgm-maroon)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 6px var(--pgm-maroon-glow)',
                }}
              >
                <Building2 size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--pgm-navy)', lineHeight: 1.1 }}>
                  PG Mitra <span style={{ color: 'var(--pgm-maroon)', fontSize: '14px', fontWeight: 600 }}>Resident</span>
                </span>
                <span style={{ fontSize: '10.5px', color: 'var(--pgm-navy-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Smart Living Suite
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              className="student-nav-desktop"
            >
              <Link
                href="/student/complaints"
                className={`pgm-btn pgm-btn-sm ${
                  pathname.startsWith('/student/complaints') ? 'pgm-btn-primary' : 'pgm-btn-secondary'
                }`}
                style={{ borderRadius: '8px' }}
              >
                <MessageSquare size={14} />
                My Complaints
              </Link>

              <span
                className="pgm-btn pgm-btn-secondary pgm-btn-sm"
                style={{ opacity: 0.65, cursor: 'default' }}
                title="Room details"
              >
                <BedDouble size={14} />
                Room 204
              </span>
            </div>
          </div>

          {/* Right Header Section: Student Profile & Role Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <RoleSwitcher />

            {/* Resident Avatar Chip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                paddingLeft: '12px',
                borderLeft: '1px solid var(--pgm-beige-border)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CURRENT_STUDENT.avatar}
                alt={CURRENT_STUDENT.name}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--pgm-beige)',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--pgm-navy)' }}>
                  {CURRENT_STUDENT.name}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--pgm-navy-muted)' }}>
                  {CURRENT_STUDENT.pgName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
