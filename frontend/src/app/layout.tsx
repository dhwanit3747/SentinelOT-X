import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'SentinelOT X — Industrial OT Security & PLC Safety Platform',
  description: 'Self-explaining industrial cybersecurity platform: plain-English PLC drift detection, 5-tier AI copilot, digital twin simulator.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#070A0F" />
      </head>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0, minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", transition: 'background-color 0.25s ease, color 0.25s ease' }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
