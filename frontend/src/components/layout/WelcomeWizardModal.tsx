'use client';
import React, { useState } from 'react';
import { Award, Cpu, ShieldCheck, Check, Sparkles, X, ChevronRight } from 'lucide-react';

interface WelcomeWizardModalProps {
  isOpen: boolean;
  onClose: (role: string) => void;
}

export const WelcomeWizardModal: React.FC<WelcomeWizardModalProps> = ({ isOpen, onClose }) => {
  const [selectedRole, setSelectedRole] = useState<'judge' | 'engineer' | 'security'>('judge');

  if (!isOpen) return null;

  const roles = [
    {
      id: 'judge',
      title: 'Hackathon Judge / Executive',
      tagline: 'Instant 30-Second Understanding',
      desc: 'Plain English explanations of every technical concept. Business downtime costs prominently shown. 60-second guided demo walkthrough included.',
      icon: Award,
      color: '#00C8FF',
      badge: '★ RECOMMENDED FOR DEMO',
    },
    {
      id: 'engineer',
      title: 'Industrial Control Engineer',
      tagline: 'Equipment & Logic Drift Focused',
      desc: 'Side-by-side ladder logic comparisons, PLC memory registers, physical twin simulation, and 1-click code rollback.',
      icon: Cpu,
      color: '#22C55E',
      badge: 'TECHNICAL FLOOR VIEW',
    },
    {
      id: 'security',
      title: 'OT Cybersecurity Specialist',
      tagline: 'Threat Triage & Standards Compliance',
      desc: 'Rogue device analysis, IEC 62443 compliance violations, user access audit trails, and multi-tier AI root cause analysis.',
      icon: ShieldCheck,
      color: '#F59E0B',
      badge: 'SOC DEFENDER VIEW',
    },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        width: '100%', maxWidth: 660,
        background: 'var(--bg-card)',
        border: '1px solid rgba(0,200,255,0.40)',
        boxShadow: '0 0 60px rgba(0,200,255,0.20)',
        borderRadius: 20, padding: 28,
        color: 'var(--text-main)',
        position: 'relative', maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-cyan)', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontFamily: 'monospace' }}>
              <Sparkles style={{ width: 14, height: 14 }} /> WELCOME TO SENTINELOT X
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: 'var(--text-main)' }}>
              Select Your Viewing Experience
            </h2>
          </div>
          <button
            onClick={() => onClose(selectedRole)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, lineHeight: 1, flexShrink: 0 }}
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        <p style={{ color: 'var(--text-slate)', fontSize: 13, marginBottom: 20, lineHeight: 1.5 }}>
          SentinelOT X adapts its language and emphasis to your background. Choose the view that matches you:
        </p>

        {/* Role Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;

            return (
              <div
                key={r.id}
                onClick={() => setSelectedRole(r.id as 'judge' | 'engineer' | 'security')}
                style={{
                  padding: 14, borderRadius: 12,
                  border: `2px solid ${isSelected ? r.color : 'var(--border-color)'}`,
                  background: isSelected ? `${r.color}12` : 'var(--bg-inner)',
                  boxShadow: isSelected ? `0 0 18px ${r.color}20` : 'none',
                  cursor: 'pointer', transition: 'all 0.18s ease',
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: `${r.color}18`, border: `1px solid ${r.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ width: 20, height: 20, color: r.color }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-main)' }}>{r.title}</span>
                      <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 800, background: `${r.color}20`, color: r.color, border: `1px solid ${r.color}40`, padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                        {r.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: r.color, marginBottom: 4 }}>{r.tagline}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-slate)', lineHeight: 1.4 }}>{r.desc}</div>
                  </div>
                </div>

                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                  border: `2px solid ${isSelected ? r.color : 'var(--border-color)'}`,
                  background: isSelected ? r.color : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isSelected && <Check style={{ width: 13, height: 13, color: '#070A0F', strokeWidth: 3 }} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            onClick={() => onClose(selectedRole)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 10,
              background: 'var(--accent-cyan)', color: '#070A0F',
              fontWeight: 900, fontSize: 14, border: 'none', cursor: 'pointer',
              boxShadow: '0 0 22px rgba(0,200,255,0.35)',
            }}
          >
            ENTER SENTINELOT X <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
    </div>
  );
};
