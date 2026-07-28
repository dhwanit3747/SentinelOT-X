'use client';
import React, { useState } from 'react';
import { GitCompare, ShieldCheck, ShieldAlert, RotateCcw, AlertTriangle, CheckCircle2, ChevronRight, BookOpen, Code } from 'lucide-react';
import { JargonTooltip } from '@/components/ui/JargonTooltip';
import { useApp } from '@/lib/AppContext';

export default function LogicDiffViewer() {
  const [viewMode, setViewMode] = useState<'plain' | 'ladder'>('plain');
  const [restored, setRestored] = useState(false);
  const { setHasDrift } = useApp();

  const handleRollback = () => {
    setRestored(true);
    setHasDrift(false);
    alert('✅ ONE-CLICK ROLLBACK COMPLETED: Siemens S7-1500 restored to approved golden baseline Hash 0x8F4A21. DRIFT badge cleared.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#00F0FF', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase' }}>
            <JargonTooltip term="Diff Viewer" plainTerm="Code Security Comparison" definition="Side-by-side comparison of certified safe machine code versus modified code currently running." example="Highlights removed safety steps in red." />
          </div>
          <h1 style={{ margin: '4px 0 0 0', fontSize: 20, fontWeight: 900, color: '#F8FAFC' }}>
            What Changed in Machine Code?
          </h1>
          <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#94A3B8' }}>
            Target: Siemens S7-1500 (Chemical Reactor Mixer) — Modified by 192.168.10.99
          </p>
        </div>

        {/* Mode Switch */}
        <div style={{ display: 'flex', background: '#0F1623', border: '1px solid #1E293B', borderRadius: 10, padding: 4 }}>
          <button
            onClick={() => setViewMode('plain')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: 'none',
              background: viewMode === 'plain' ? '#00F0FF' : 'transparent', color: viewMode === 'plain' ? '#070A0F' : '#94A3B8',
              fontWeight: 800, fontSize: 12, cursor: 'pointer'
            }}
          >
            <BookOpen style={{ width: 14, height: 14 }} /> Plain English Mode
          </button>
          <button
            onClick={() => setViewMode('ladder')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: 'none',
              background: viewMode === 'ladder' ? '#00F0FF' : 'transparent', color: viewMode === 'ladder' ? '#070A0F' : '#94A3B8',
              fontWeight: 800, fontSize: 12, cursor: 'pointer'
            }}
          >
            <Code style={{ width: 14, height: 14 }} /> Technical Ladder Logic
          </button>
        </div>
      </div>

      {/* ── PLAIN ENGLISH CHANGE SUMMARY CARD ── */}
      <div style={{
        background: restored ? 'rgba(57,255,20,0.08)' : 'rgba(255,0,85,0.10)',
        border: `2px solid ${restored ? '#39FF14' : '#FF0055'}`,
        borderRadius: 14,
        padding: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: restored ? 'rgba(57,255,20,0.18)' : 'rgba(255,0,85,0.18)',
              border: `1px solid ${restored ? '#39FF14' : '#FF0055'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {restored ? <CheckCircle2 style={{ width: 24, height: 24, color: '#39FF14' }} /> : <ShieldAlert style={{ width: 24, height: 24, color: '#FF0055' }} />}
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: restored ? '#39FF14' : '#FF0055', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {restored ? 'SAFE BASELINE RESTORED' : 'UNAUTHORIZED CODE MODIFICATION DETECTED'}
              </div>
              <h2 style={{ margin: '4px 0 6px 0', fontSize: 16, fontWeight: 900, color: '#F8FAFC' }}>
                {restored ? 'Emergency Stop Safety Rules Re-engaged' : 'Safety Rule #1 (Emergency Stop Switch) Was Removed'}
              </h2>
              <p style={{ margin: 0, fontSize: 12, color: '#CBD5E1', lineHeight: 1.5, maxWidth: 680 }}>
                {restored
                  ? 'All machine control rungs match certified golden SHA-256 baseline Hash 0x8F4A21. Emergency stop interlocks active.'
                  : 'Rung 0001 (Emergency Stop Interlock) was edited to force coil DB1.X0.2 = 0. Physical emergency stop buttons on the shop floor will NO LONGER halt the motor.'}
              </p>
            </div>
          </div>

          {!restored && (
            <button
              onClick={handleRollback}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 10,
                background: '#00F0FF', color: '#070A0F', fontWeight: 900, fontSize: 13, border: 'none',
                cursor: 'pointer', boxShadow: '0 0 24px rgba(0,240,255,0.4)', whiteSpace: 'nowrap'
              }}
            >
              <RotateCcw style={{ width: 16, height: 16 }} /> RESTORE APPROVED VERSION
            </button>
          )}
        </div>
      </div>

      {/* ── SIDE-BY-SIDE CODE COMPARISON BOXES ── */}
      <div className="responsive-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Approved Version (Green) */}
        <div style={{ background: '#0F1623', border: '1px solid #39FF14', borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid #1E293B', paddingBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck style={{ width: 18, height: 18, color: '#39FF14' }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#39FF14' }}>APPROVED SAFE VERSION</span>
            </div>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#64748B' }}>Baseline: Hash 0x8F4A21</span>
          </div>

          {viewMode === 'plain' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: 'rgba(57,255,20,0.08)', padding: 12, borderRadius: 8, border: '1px solid rgba(57,255,20,0.2)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#39FF14', marginBottom: 2 }}>Rule 1: Emergency Stop Switch</div>
                <div style={{ fontSize: 12, color: '#E2E8F0' }}>ENABLED — If red stop button is pressed, immediately turn off motor power.</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 8, border: '1px solid #1E293B' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#CBD5E1', marginBottom: 2 }}>Rule 2: Motor Speed Limit</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>MAX 1,000 RPM — Automatically throttles pump if speed exceeds safe threshold.</div>
              </div>
            </div>
          ) : (
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 11, color: '#39FF14', lineHeight: 1.6, background: '#040608', padding: 12, borderRadius: 8 }}>
              {`RUNG 0001: [E_STOP_NC]----( MTR_COIL )
RUNG 0002: [SPD_SENS < 1000]--( PMP_PWR )
STATUS: BASELINE MATCH (SHA-256 VERIFIED)`}
            </pre>
          )}
        </div>

        {/* Current Modified Version (Red) */}
        <div style={{ background: '#0F1623', border: `1px solid ${restored ? '#39FF14' : '#FF0055'}`, borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid #1E293B', paddingBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldAlert style={{ width: 18, height: 18, color: restored ? '#39FF14' : '#FF0055' }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: restored ? '#39FF14' : '#FF0055' }}>
                {restored ? 'CURRENT RUNNING VERSION (RESTORED)' : 'CURRENT UNAPPROVED VERSION'}
              </span>
            </div>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#64748B' }}>Live Hash: {restored ? '0x8F4A21' : '0x99B3X2'}</span>
          </div>

          {viewMode === 'plain' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: restored ? 'rgba(57,255,20,0.08)' : 'rgba(255,0,85,0.12)', padding: 12, borderRadius: 8, border: `1px solid ${restored ? 'rgba(57,255,20,0.3)' : '#FF0055'}` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: restored ? '#39FF14' : '#FF0055', marginBottom: 2 }}>
                  Rule 1: Emergency Stop Switch
                </div>
                <div style={{ fontSize: 12, color: '#E2E8F0' }}>
                  {restored ? 'ENABLED — Emergency Stop active.' : 'DISABLED — Emergency stop button signal is IGNORED.'}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 8, border: '1px solid #1E293B' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#CBD5E1', marginBottom: 2 }}>Rule 2: Motor Speed Limit</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>MAX 1,000 RPM — Unchanged.</div>
              </div>
            </div>
          ) : (
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 11, color: restored ? '#39FF14' : '#FF0055', lineHeight: 1.6, background: '#040608', padding: 12, borderRadius: 8 }}>
              {restored ? `RUNG 0001: [E_STOP_NC]----( MTR_COIL )
RUNG 0002: [SPD_SENS < 1000]--( PMP_PWR )
STATUS: BASELINE MATCH (RESTORED)` : `RUNG 0001: [ALWAYS_TRUE]----( MTR_COIL )  <-- MODIFIED
RUNG 0002: [SPD_SENS < 1000]--( PMP_PWR )
STATUS: LOGIC DRIFT DETECTED`}
            </pre>
          )}
        </div>

      </div>

      {/* ── HAZARD EXPLANATION BOX ── */}
      <div style={{ background: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.3)', borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#FFB800', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
          <AlertTriangle style={{ width: 16, height: 16 }} /> WHY IS THIS CODE CHANGE DANGEROUS?
        </div>
        <p style={{ margin: 0, fontSize: 12, color: '#CBD5E1', lineHeight: 1.5 }}>
          By changing Rung 0001 from <code>[E_STOP_NC]</code> to <code>[ALWAYS_TRUE]</code>, an operator pressing the physical Emergency Stop button on the plant floor will send a signal that gets ignored by the computer. If a chemical pipe bursts, operators will be unable to halt the system manually.
        </p>
      </div>

    </div>
  );
}
