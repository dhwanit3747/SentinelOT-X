'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Play, CheckCircle2, ChevronRight, ChevronLeft, ShieldAlert,
  Bot, Box, GitCompare, Undo2, Award, X, Sparkles
} from 'lucide-react';

export const presentationSteps = [
  {
    step: 1,
    title: '1. Problem Detected',
    sub: 'Critical Alert on Dashboard',
    path: '/',
    description: 'Factory safety button was turned off without permission in Plant Alpha.',
    actionText: 'Go to SOC Alerts →',
  },
  {
    step: 2,
    title: '2. Rogue Device Found',
    sub: 'SOC Security Alert Triage',
    path: '/soc',
    description: 'An unrecognized laptop (192.168.10.99) connected directly to the control computer.',
    actionText: 'Ask AI Copilot →',
  },
  {
    step: 3,
    title: '3. AI Explanation',
    sub: '5-Tier AI Diagnosis',
    path: '/soc',
    description: 'SentinelOT AI explains the cyber attack in 5 clear perspectives (Simple, Tech, Business, Engineer, Operator).',
    actionText: 'View Digital Twin →',
  },
  {
    step: 4,
    title: '4. Physical Risk Twin',
    sub: 'Digital Twin Simulation',
    path: '/digital-twin',
    description: 'Simulates physical consequences: Tank pressure rising to dangerous levels in 4 minutes.',
    actionText: 'Inspect Code Diff →',
  },
  {
    step: 5,
    title: '5. Code Difference',
    sub: 'Plain English Code Changes',
    path: '/logic-diff',
    description: 'Shows exact safe code vs unapproved code side-by-side in plain English.',
    actionText: 'Perform 1-Click Rollback →',
  },
  {
    step: 6,
    title: '6. 1-Click Rollback',
    sub: 'Restore Safe Version',
    path: '/logic-diff',
    description: 'One click instantly rewinds the machine control software to the certified safe version.',
    actionText: 'Verify Plant Health →',
  },
  {
    step: 7,
    title: '7. Plant Safe!',
    sub: '100% Health Restored',
    path: '/',
    description: 'Factory health returns to 100%. Safety controls re-engaged.',
    actionText: 'Finish Demo ✓',
  },
];

interface PresentationModeBarProps {
  onOpenCopilot?: () => void;
}

export const PresentationModeBar: React.FC<PresentationModeBarProps> = ({ onOpenCopilot }) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const router = useRouter();

  const handleStartDemo = () => {
    setActiveStep(1);
    router.push(presentationSteps[0].path);
  };

  const handleNextStep = () => {
    if (activeStep === null) return;
    if (activeStep >= presentationSteps.length) {
      setActiveStep(null);
      return;
    }
    const nextIdx = activeStep; // 1-indexed to array index
    const nextStep = presentationSteps[nextIdx];
    setActiveStep(nextStep.step);
    router.push(nextStep.path);

    if (nextStep.step === 3 && onOpenCopilot) {
      onOpenCopilot();
    }
  };

  const handlePrevStep = () => {
    if (activeStep === null || activeStep <= 1) return;
    const prevStep = presentationSteps[activeStep - 2];
    setActiveStep(prevStep.step);
    router.push(prevStep.path);
  };

  const handleExit = () => {
    setActiveStep(null);
  };

  const current = activeStep !== null ? presentationSteps[activeStep - 1] : null;

  return (
    <>
      {/* Presentation Banner Trigger / Active Bar */}
      {activeStep === null ? (
        <div className="no-print" style={{
          background: 'linear-gradient(90deg, rgba(0,240,255,0.15) 0%, rgba(59,130,246,0.15) 100%)',
          border: '1px solid rgba(0,240,255,0.35)',
          borderRadius: 12,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          boxShadow: '0 0 20px rgba(0,240,255,0.12)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles style={{ width: 18, height: 18, color: '#00F0FF' }} />
            <div>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#00F0FF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                HACKATHON JUDGE PRESENTATION MODE
              </span>
              <span style={{ fontSize: 12, color: '#CBD5E1', marginLeft: 8 }}>
                Click to launch a 60-second guided walk-through of the incident detection & rollback workflow.
              </span>
            </div>
          </div>

          <button
            onClick={handleStartDemo}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 16px',
              borderRadius: 8,
              background: '#00F0FF',
              color: '#070A0F',
              fontWeight: 800,
              fontSize: 12,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 14px rgba(0,240,255,0.4)',
              transition: 'transform 0.15s ease',
            }}
          >
            <Play style={{ width: 14, height: 14, fill: '#070A0F' }} /> START 60-SEC JUDGE DEMO
          </button>
        </div>
      ) : (
        <div style={{
          position: 'sticky',
          top: 64,
          zIndex: 9990,
          background: 'var(--bg-card)',
          border: '2px solid var(--accent-cyan)',
          borderRadius: 14,
          padding: '12px 18px',
          boxShadow: '0 8px 32px rgba(0,240,255,0.3)',
          marginBottom: 16,
        }}>
          {/* Progress Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexGrow: 1 }}>
              {presentationSteps.map((s) => (
                <div
                  key={s.step}
                  onClick={() => {
                    setActiveStep(s.step);
                    router.push(s.path);
                    if (s.step === 3 && onOpenCopilot) onOpenCopilot();
                  }}
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 4,
                    background: s.step <= (activeStep || 1) ? 'var(--accent-cyan)' : 'rgba(128,128,128,0.25)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  title={s.title}
                />
              ))}
            </div>
            <button
              onClick={handleExit}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 2 }}
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>

          {/* Active Step Details */}
          {current && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: 'rgba(0,240,255,0.15)',
                  border: '1px solid #00F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 16, color: '#00F0FF', flexShrink: 0
                }}>
                  {current.step}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-main)' }}>{current.title}</span>
                    <span style={{ fontSize: 11, color: '#00F0FF', background: 'rgba(0,240,255,0.1)', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                      {current.sub}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-slate)', marginTop: 2 }}>
                    {current.description}
                  </div>
                </div>
              </div>

              {/* Navigation controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={handlePrevStep}
                  disabled={activeStep <= 1}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4, padding: '7px 12px', borderRadius: 8,
                    background: 'var(--bg-inner)', border: '1px solid var(--border-color)', color: activeStep <= 1 ? 'var(--text-muted)' : 'var(--text-slate)',
                    fontSize: 12, fontWeight: 600, cursor: activeStep <= 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ChevronLeft style={{ width: 14, height: 14 }} /> Back
                </button>

                <button
                  onClick={handleNextStep}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8,
                    background: activeStep === 7 ? '#39FF14' : '#00F0FF', color: '#070A0F', fontSize: 12,
                    fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: '0 0 12px rgba(0,240,255,0.3)'
                  }}
                >
                  {current.actionText} <ChevronRight style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
