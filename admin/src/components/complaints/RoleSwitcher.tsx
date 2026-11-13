'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserCheck, ShieldCheck, ArrowRightLeft } from 'lucide-react';

export default function RoleSwitcher() {
  const pathname = usePathname();
  const isOwner = pathname.includes('/owner');

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--pgm-beige-border)',
        borderRadius: '9999px',
        padding: '3px 4px',
        boxShadow: 'var(--pgm-shadow-xs)',
      }}
    >
      <Link
        href="/student/complaints"
        className={`pgm-btn pgm-btn-sm ${!isOwner ? 'pgm-btn-primary' : 'pgm-btn-secondary'}`}
        style={{
          borderRadius: '9999px',
          border: 'none',
          padding: '5px 12px',
          textDecoration: 'none',
        }}
      >
        <UserCheck size={14} />
        Student View
      </Link>

      <div
        style={{
          padding: '0 4px',
          color: 'var(--pgm-navy-subtle)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ArrowRightLeft size={12} />
      </div>

      <Link
        href="/owner/complaints"
        className={`pgm-btn pgm-btn-sm ${isOwner ? 'pgm-btn-primary' : 'pgm-btn-secondary'}`}
        style={{
          borderRadius: '9999px',
          border: 'none',
          padding: '5px 12px',
          textDecoration: 'none',
        }}
      >
        <ShieldCheck size={14} />
        PG Owner View
      </Link>
    </div>
  );
}
