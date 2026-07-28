'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShieldAlert, Cpu, GitCompare, Box,
  CheckCircle2, History, FileText, AlertOctagon
} from 'lucide-react';
import { useApp } from '@/lib/AppContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const pathname = usePathname();
  const { socAlertCount, hasDrift } = useApp();

  const navItems = [
    {
      label: 'Overview & Story',
      sub: '10-Sec Factory Health & Risk',
      href: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'Security Alert Triage',
      sub: 'Real-time Threat Events',
      href: '/soc',
      icon: ShieldAlert,
      badge: socAlertCount > 0 ? String(socAlertCount) : null,
      badgeType: 'alert',
    },
    {
      label: 'Factory Machine List',
      sub: 'All PLC Control Units',
      href: '/engineer',
      icon: Cpu,
      badge: null,
    },
    {
      label: 'What Changed in Code?',
      sub: 'Side-by-Side Code Comparison',
      href: '/logic-diff',
      icon: GitCompare,
      badge: hasDrift ? 'DRIFT' : null,
      badgeType: 'drift',
    },
    {
      label: 'Interactive Equipment Twin',
      sub: 'Physical Plant Simulation',
      href: '/digital-twin',
      icon: Box,
      badge: null,
    },
    {
      label: 'Safety Standards Check',
      sub: 'IEC 62443 / NIST Pass Rate',
      href: '/compliance',
      icon: CheckCircle2,
      badge: null,
    },
    {
      label: 'User Activity History',
      sub: 'Employee & Vendor Access Log',
      href: '/audit',
      icon: History,
      badge: null,
    },
    {
      label: 'Executive PDF Briefing',
      sub: 'Downloadable Security Summary',
      href: '/reports',
      icon: FileText,
      badge: null,
    },
  ];

  return (
    <aside className={`sidebar-container ${isOpen ? 'open' : ''}`} style={{
      width: 256,
      minWidth: 256,
      background: 'var(--bg-header)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '14px 0',
      position: 'sticky',
      top: 64,
      height: 'calc(100vh - 64px)',
      overflowY: 'auto',
      flexShrink: 0,
    }}>
      <div style={{ padding: '0 10px' }}>
        <p style={{
          fontSize: 9, fontFamily: 'monospace', color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700,
          padding: '0 10px 10px',
        }}>
          MAIN WORKFLOW MODULES
        </p>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            const isDrift = item.badgeType === 'drift';

            return (
              <Link key={item.href} href={item.href} onClick={onClose} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 10px',
                  borderRadius: 10,
                  color: active ? 'var(--accent-cyan)' : 'var(--text-slate)',
                  background: active ? 'rgba(0,240,255,0.08)' : 'transparent',
                  border: active ? '1px solid rgba(0,240,255,0.25)' : '1px solid transparent',
                  boxShadow: active ? '0 0 10px rgba(0,240,255,0.12)' : 'none',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                    <Icon style={{ width: 15, height: 15, color: active ? 'var(--accent-cyan)' : 'var(--text-muted)', flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: active ? 800 : 600, lineHeight: 1.3, color: active ? 'var(--accent-cyan)' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.2, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.sub}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span style={{
                      padding: '2px 5px',
                      borderRadius: 4,
                      fontSize: 9,
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      flexShrink: 0,
                      marginLeft: 6,
                      background: isDrift ? 'rgba(255,0,85,0.18)' : 'rgba(255,184,0,0.18)',
                      color: isDrift ? 'var(--accent-red)' : 'var(--accent-amber)',
                      border: `1px solid ${isDrift ? 'rgba(255,0,85,0.35)' : 'rgba(255,184,0,0.35)'}`,
                    }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Plant Safety Footer */}
      <div style={{ padding: '10px 14px' }}>
        <div style={{
          background: 'rgba(255,0,85,0.08)',
          border: '1px solid rgba(255,0,85,0.30)',
          padding: '10px 12px',
          borderRadius: 10,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <AlertOctagon style={{ width: 12, height: 12, color: 'var(--accent-red)', flexShrink: 0 }} />
              PLANT STATUS
            </span>
            <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 800, color: 'var(--accent-red)' }}>
              {hasDrift ? 'ATTACK' : 'SAFE'}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4 }}>
            {hasDrift
              ? '2 controllers have unapproved code. E-Stop disabled.'
              : 'All controllers safe. Baseline verified.'}
          </p>
        </div>
      </div>
    </aside>
  );
};
