'use client';
import React from 'react';
import Link from 'next/link';
import { Cpu, CheckCircle2, AlertTriangle, GitCompare, Box } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

const machines = [
  {
    id: 'PLC-01',
    name: 'Chemical Reactor Mixer PLC',
    location: 'Plant Alpha — Line 2',
    model: 'Siemens S7-1500',
    initialStatus: 'COMPROMISED',
    lastChange: '14 mins ago',
    issue: 'Emergency Stop switch disabled in ladder rung 0001.',
    hashMatch: false,
  },
  {
    id: 'PLC-03',
    name: 'Main Substation Circuit Breaker PLC',
    location: 'Substation Gamma — Grid 1',
    model: 'Schneider M580',
    initialStatus: 'COMPROMISED',
    lastChange: '28 mins ago',
    issue: 'Breaker trip delay altered from 50ms to 5,000ms.',
    hashMatch: false,
  },
  {
    id: 'PLC-02',
    name: 'Coolant Flow Controller PLC',
    location: 'Plant Alpha — Line 1',
    model: 'Allen-Bradley ControlLogix',
    initialStatus: 'HEALTHY',
    lastChange: '2 days ago',
    issue: 'None. Operating normally.',
    hashMatch: true,
  },
  {
    id: 'PLC-04',
    name: 'Turbine Safety Shutdown PLC',
    location: 'Powerhouse Beta',
    model: 'Siemens S7-1200',
    initialStatus: 'HEALTHY',
    lastChange: '5 days ago',
    issue: 'None. Operating normally.',
    hashMatch: true,
  },
];

export default function EngineerFleetView() {
  const { hasDrift, isRolledBack } = useApp();
  const isSafe = !hasDrift || isRolledBack;

  const currentMachines = machines.map(m => {
    if (isSafe) {
      return {
        ...m,
        status: 'HEALTHY',
        issue: 'None. Operating normally on golden SHA-256 baseline.',
        hashMatch: true,
      };
    }
    return {
      ...m,
      status: m.initialStatus,
    };
  });

  const healthyCount = currentMachines.filter(m => m.status === 'HEALTHY').length;
  const modifiedCount = currentMachines.length - healthyCount;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#F8FAFC' }}>
            Factory Machine Control Units
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#94A3B8' }}>
            List of industrial computers (PLCs) running factory machinery. Pinned compromised units appear at the top.
          </p>
        </div>

        {/* Summary Badges */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ background: '#0F1623', border: '1px solid #1E293B', padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Cpu style={{ width: 15, height: 15, color: '#00F0FF' }} /> Total Machines: {currentMachines.length}
          </div>
          <div style={{ background: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.3)', padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#39FF14', display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 style={{ width: 15, height: 15 }} /> Healthy: {healthyCount}
          </div>
          <div style={{ background: 'rgba(255,0,85,0.1)', border: '1px solid rgba(255,0,85,0.3)', padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, color: modifiedCount > 0 ? '#FF0055' : '#39FF14', display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle style={{ width: 15, height: 15 }} /> Modified: {modifiedCount}
          </div>
        </div>
      </div>

      {/* Grid of Equipment Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {currentMachines.map((m) => {
          const isCompromised = m.status === 'COMPROMISED';

          return (
            <div
              key={m.id}
              style={{
                background: '#0F1623',
                border: `2px solid ${isCompromised ? '#FF0055' : '#1E293B'}`,
                boxShadow: isCompromised ? '0 0 20px rgba(255,0,85,0.15)' : 'none',
                borderRadius: 14,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#64748B', textTransform: 'uppercase' }}>
                      {m.id} — {m.model}
                    </span>
                    <h3 style={{ margin: '2px 0 0 0', fontSize: 15, fontWeight: 800, color: '#F8FAFC' }}>
                      {m.name}
                    </h3>
                  </div>

                  <span style={{
                    padding: '3px 8px', borderRadius: 6, fontSize: 10, fontFamily: 'monospace', fontWeight: 800,
                    background: isCompromised ? '#FF0055' : 'rgba(57,255,20,0.18)',
                    color: isCompromised ? '#000' : '#39FF14',
                    border: `1px solid ${isCompromised ? '#FF0055' : 'rgba(57,255,20,0.4)'}`
                  }}>
                    {m.status}
                  </span>
                </div>

                <div style={{ fontSize: 11, color: '#00F0FF', fontWeight: 600, marginBottom: 12 }}>
                  📍 {m.location}
                </div>

                {/* Status Box */}
                <div style={{
                  background: isCompromised ? 'rgba(255,0,85,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isCompromised ? 'rgba(255,0,85,0.3)' : '#1E293B'}`,
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 16,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: isCompromised ? '#FF0055' : '#39FF14', textTransform: 'uppercase', marginBottom: 4 }}>
                    {isCompromised ? '⚠️ UNAPPROVED CHANGE DETECTED' : '✓ SAFE BASELINE MATCH'}
                  </div>
                  <div style={{ fontSize: 12, color: '#E2E8F0', lineHeight: 1.4 }}>
                    {m.issue}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                {isCompromised ? (
                  <Link
                    href="/logic-diff"
                    style={{
                      flex: 1, padding: '9px', borderRadius: 8, background: '#FF0055', color: '#FFF',
                      fontWeight: 800, fontSize: 11, textDecoration: 'none', textAlign: 'center',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}
                  >
                    <GitCompare style={{ width: 14, height: 14 }} /> COMPARE CODE
                  </Link>
                ) : (
                  <div style={{ flex: 1, padding: '9px', borderRadius: 8, background: 'rgba(57,255,20,0.1)', color: '#39FF14', fontSize: 11, fontWeight: 700, textAlign: 'center' }}>
                    ✓ Code Verified Safe
                  </div>
                )}

                <Link
                  href="/digital-twin"
                  style={{
                    padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: '#CBD5E1',
                    border: '1px solid #1E293B', fontWeight: 700, fontSize: 11, textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: 6
                  }}
                >
                  <Box style={{ width: 14, height: 14, color: '#00F0FF' }} /> TWIN
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

