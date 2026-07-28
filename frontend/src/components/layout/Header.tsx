'use client';
import React from 'react';
import { Cpu, Bot, Activity, BookOpen, Moon, Sun, UserCheck } from 'lucide-react';

interface HeaderProps {
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
  onToggleLightMode: () => void;
  isLightMode: boolean;
  onOpenGlossary: () => void;
  onOpenWizard: () => void;
  userRole: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleCopilot, isCopilotOpen,
  onToggleLightMode, isLightMode,
  onOpenGlossary, onOpenWizard,
  userRole,
}) => {
  return (
    <header style={{
      height: 64,
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-header)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    }}>
      {/* ── Left: Brand + Status ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, minWidth: 0 }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(0,240,255,0.10)',
            border: '1px solid rgba(0,240,255,0.40)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px rgba(0,240,255,0.2)',
          }}>
            <Cpu style={{ width: 18, height: 18, color: 'var(--accent-cyan)' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: '0.06em', color: 'var(--text-main)' }}>
                SENTINEL<span style={{ color: 'var(--accent-cyan)' }}>OT X</span>
              </span>
            </div>
            <p style={{ fontSize: 9, fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: 1, lineHeight: 1 }}>
              SELF-EXPLAINING OT CYBERSECURITY PLATFORM
            </p>
          </div>
        </div>

        {/* Live status pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 16, borderLeft: '1px solid var(--border-color)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--bg-card)', borderRadius: 50, padding: '4px 10px',
            border: '1px solid var(--border-color)', fontSize: 10, fontFamily: 'monospace',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-red)', display: 'inline-block', boxShadow: '0 0 6px var(--accent-red)' }} />
            <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>2 MACHINES COMPROMISED</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'var(--bg-card)', borderRadius: 50, padding: '4px 10px',
            border: '1px solid var(--border-color)', fontSize: 10, fontFamily: 'monospace', color: 'var(--text-slate)',
          }}>
            <Activity style={{ width: 12, height: 12, color: 'var(--accent-cyan)' }} />
            <span>4 FACTORY CONTROLLERS</span>
          </div>
        </div>
      </div>

      {/* ── Right: Action Buttons ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {/* Role / Wizard trigger */}
        <button
          onClick={onOpenWizard}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 8, fontSize: 11, fontFamily: 'monospace',
            fontWeight: 700, cursor: 'pointer',
            background: 'rgba(0,240,255,0.10)', color: 'var(--accent-cyan)',
            border: '1px solid rgba(0,240,255,0.28)',
          }}
        >
          <UserCheck style={{ width: 13, height: 13 }} />
          {userRole}
        </button>

        {/* Light/Dark toggle */}
        <button
          onClick={onToggleLightMode}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 8, fontSize: 11, fontFamily: 'monospace',
            fontWeight: 700, cursor: 'pointer',
            background: isLightMode ? 'rgba(2,132,199,0.12)' : 'rgba(255,255,255,0.07)',
            color: 'var(--text-main)',
            border: `1px solid var(--border-color)`,
          }}
        >
          {isLightMode
            ? <Sun style={{ width: 13, height: 13, color: '#D97706' }} />
            : <Moon style={{ width: 13, height: 13, color: 'var(--accent-cyan)' }} />
          }
          {isLightMode ? 'LIGHT' : 'DARK'}
        </button>

        {/* Dictionary */}
        <button
          onClick={onOpenGlossary}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 8, fontSize: 11, fontFamily: 'monospace',
            fontWeight: 700, cursor: 'pointer',
            background: 'rgba(255,184,0,0.10)', color: 'var(--accent-amber)',
            border: '1px solid rgba(255,184,0,0.30)',
          }}
        >
          <BookOpen style={{ width: 13, height: 13 }} />
          DICTIONARY
        </button>

        {/* AI Copilot */}
        <button
          onClick={onToggleCopilot}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 8, fontSize: 11, fontFamily: 'monospace',
            fontWeight: 800, cursor: 'pointer', border: 'none',
            background: isCopilotOpen ? 'var(--accent-cyan)' : 'rgba(0,240,255,0.14)',
            color: isCopilotOpen ? '#000' : 'var(--accent-cyan)',
            boxShadow: isCopilotOpen ? '0 0 18px rgba(0,240,255,0.4)' : '0 0 10px rgba(0,240,255,0.15)',
          }}
        >
          <Bot style={{ width: 14, height: 14 }} />
          AI COPILOT
        </button>
      </div>
    </header>
  );
};
