'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ComplaintsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/student/complaints');
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F6F0E4',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            border: '3px solid #820D16',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px auto',
          }}
        />
        <p style={{ color: '#102A43', fontWeight: 600, fontSize: '14px' }}>
          Loading PG Mitra Complaints...
        </p>
      </div>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
