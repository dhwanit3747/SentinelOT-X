'use client';
import React, { useState } from 'react';
import { Box, Play, Pause, RotateCcw, AlertTriangle, Flame, ShieldAlert, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { JargonTooltip } from '@/components/ui/JargonTooltip';

const equipmentNodes = [
  {
    id: 'tank-101',
    name: 'Chemical Reactor Tank A',
    type: 'Reactor Vessel',
    status: 'DANGEROUS',
    pressure: '8.4 Bar',
    maxPressure: '5.0 Bar',
    temp: '142°C',
    whatChanged: 'Cooling pump speed override was forced down to 10%. Emergency stop bypassed.',
    whyDangerous: 'Internal fluid temperature is rapidly boiling. Pressure exceeds safe vessel limits by +68%.',
    whatWillHappen: 'In 4 minutes, secondary pipe seal #3 will rupture, releasing thermal acid spray.',
    howToFix: 'Click 1-Click Rollback to restore cooling pump auto-control.',
  },
  {
    id: 'pump-02',
    name: 'Primary Coolant Pump B-12',
    type: 'Hydraulic Pump',
    status: 'OVERLOADED',
    pressure: '4.1 Bar',
    maxPressure: '3.5 Bar',
    temp: '98°C',
    whatChanged: 'Motor speed limit setting was changed from 1,000 RPM to 3,500 RPM.',
    whyDangerous: 'Motor windings are overheating due to continuous max voltage.',
    whatWillHappen: 'Motor failure will lock the cooling loop entirely within 8 minutes.',
    howToFix: 'Revert motor speed limit back to approved baseline (1,000 RPM).',
  },
  {
    id: 'valve-01',
    name: 'Emergency Relief Valve V-01',
    type: 'Solenoid Valve',
    status: 'NORMAL',
    pressure: '2.0 Bar',
    maxPressure: '10.0 Bar',
    temp: '45°C',
    whatChanged: 'No changes. Operating on local hydraulic pressure.',
    whyDangerous: 'Currently normal, but manual bypass switch is armed.',
    whatWillHappen: 'Will trip open automatically if tank pressure hits 9.0 Bar.',
    howToFix: 'No action required.',
  },
];

export default function DigitalTwinReplay() {
  const [selectedNode, setSelectedNode] = useState(equipmentNodes[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [timeStep, setTimeStep] = useState(14);
  const [overrideFixed, setOverrideFixed] = useState(false);

  const handleFix = () => {
    setOverrideFixed(true);
    alert('SAFE OVERRIDE TRIGGERED: Digital Twin state reset to safe baseline!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#00F0FF', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase' }}>
            <JargonTooltip term="Digital Twin" plainTerm="Interactive Factory Equipment Simulation" definition="A virtual digital twin simulating physical consequences (pressure, heat, fluid flow) of code modifications." example="Shows what happens to the physical tank when safety controls are turned off." />
          </div>
          <h1 style={{ margin: '4px 0 0 0', fontSize: 20, fontWeight: 900, color: '#F8FAFC' }}>
            Educational Equipment Impact Simulator
          </h1>
          <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#94A3B8' }}>
            Click any factory machine to see <strong>What Changed</strong>, <strong>Why it is Dangerous</strong>, and <strong>What Will Happen</strong>.
          </p>
        </div>

        {/* Replay Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#0F1623', border: '1px solid #1E293B', padding: '6px 14px', borderRadius: 12 }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
              background: isPlaying ? '#FFB800' : '#00F0FF', color: '#070A0F', fontWeight: 900, fontSize: 12, border: 'none', cursor: 'pointer'
            }}
          >
            {isPlaying ? <Pause style={{ width: 14, height: 14 }} /> : <Play style={{ width: 14, height: 14, fill: '#070A0F' }} />}
            {isPlaying ? 'PAUSE REPLAY' : 'PLAY ATTACK SIMULATION'}
          </button>

          <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#94A3B8' }}>
            Time: +{timeStep}m
          </div>

          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 5].map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                style={{
                  fontSize: 10, fontFamily: 'monospace', padding: '3px 8px', borderRadius: 6,
                  background: speed === s ? 'rgba(0,240,255,0.2)' : 'transparent',
                  color: speed === s ? '#00F0FF' : '#64748B', border: `1px solid ${speed === s ? '#00F0FF' : '#1E293B'}`,
                  cursor: 'pointer'
                }}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Schematic (Left 60%) + Educational Inspector (Right 40%) */}
      <div className="responsive-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 20 }}>

        {/* Interactive Schematic Diagram */}
        <div style={{
          background: '#040608',
          border: '1px solid #1E293B',
          borderRadius: 14,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 460,
          position: 'relative',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
              CLICK ANY COMPONENT TO INSPECT PHYSICAL RISK
            </span>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: overrideFixed ? '#39FF14' : '#FF0055', fontWeight: 800 }}>
              {overrideFixed ? '✓ SIMULATION SAFE' : '⚠️ THERMAL RUNAWAY IN PROGRESS'}
            </span>
          </div>

          {/* SVG Factory Equipment Graphic */}
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 500 300" style={{ width: '100%', height: '100%' }}>
              {/* Animated liquid pipe flow */}
              <path d="M 120 150 L 250 150 L 250 220 L 380 220" stroke={overrideFixed ? '#00F0FF' : '#FF0055'} strokeWidth="8" fill="none" opacity="0.7" strokeDasharray="12 6" />

              {/* Tank Node */}
              <g onClick={() => setSelectedNode(equipmentNodes[0])} style={{ cursor: 'pointer' }}>
                <rect x="50" y="80" width="140" height="140" rx="16" fill="#0F1623" stroke={selectedNode.id === 'tank-101' ? '#00F0FF' : (overrideFixed ? '#39FF14' : '#FF0055')} strokeWidth={selectedNode.id === 'tank-101' ? '3' : '2'} />
                <text x="120" y="120" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">CHEMICAL TANK A</text>
                <text x="120" y="140" textAnchor="middle" fill={overrideFixed ? '#39FF14' : '#FF0055'} fontSize="13" fontFamily="monospace" fontWeight="bold">
                  {overrideFixed ? '4.1 Bar (Safe)' : '8.4 Bar (CRITICAL)'}
                </text>
                <text x="120" y="160" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="monospace">CLICK TO INSPECT</text>
              </g>

              {/* Pump Node */}
              <g onClick={() => setSelectedNode(equipmentNodes[1])} style={{ cursor: 'pointer' }}>
                <circle cx="250" cy="150" r="40" fill="#0F1623" stroke={selectedNode.id === 'pump-02' ? '#00F0FF' : '#FFB800'} strokeWidth={selectedNode.id === 'pump-02' ? '3' : '2'} />
                <text x="250" y="146" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">PUMP B-12</text>
                <text x="250" y="162" textAnchor="middle" fill="#FFB800" fontSize="9" fontFamily="monospace" fontWeight="bold">OVERLOAD</text>
              </g>

              {/* Valve Node */}
              <g onClick={() => setSelectedNode(equipmentNodes[2])} style={{ cursor: 'pointer' }}>
                <rect x="340" y="190" width="110" height="60" rx="10" fill="#0F1623" stroke={selectedNode.id === 'valve-01' ? '#00F0FF' : '#39FF14'} strokeWidth={selectedNode.id === 'valve-01' ? '3' : '2'} />
                <text x="395" y="218" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">VALVE V-01</text>
                <text x="395" y="234" textAnchor="middle" fill="#39FF14" fontSize="9" fontFamily="monospace">NORMAL</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Educational 4-Question Inspector (Right) */}
        <div style={{
          background: '#0F1623',
          border: '2px solid #00F0FF',
          borderRadius: 14,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            {/* Header */}
            <div style={{ borderBottom: '1px solid #1E293B', paddingBottom: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: '#00F0FF', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase' }}>
                EDUCATIONAL EQUIPMENT INSPECTOR
              </div>
              <h2 style={{ margin: '4px 0 0 0', fontSize: 17, fontWeight: 900, color: '#F8FAFC' }}>
                {selectedNode.name}
              </h2>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                Type: {selectedNode.type} | Telemetry: <strong style={{ color: overrideFixed ? '#39FF14' : '#FF0055' }}>{overrideFixed ? 'Normal' : selectedNode.pressure}</strong>
              </div>
            </div>

            {/* 4 Mandatory Educational Answers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* 1. What Changed? */}
              <div style={{ background: 'rgba(0,240,255,0.06)', borderRadius: 10, padding: 12, border: '1px solid rgba(0,240,255,0.25)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#00F0FF', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Info style={{ width: 14, height: 14 }} /> 1. WHAT CHANGED?
                </div>
                <div style={{ fontSize: 12, color: '#E2E8F0', lineHeight: 1.4 }}>
                  {overrideFixed ? 'Restored to safe auto-control baseline.' : selectedNode.whatChanged}
                </div>
              </div>

              {/* 2. Why is this dangerous? */}
              <div style={{ background: 'rgba(255,0,85,0.06)', borderRadius: 10, padding: 12, border: '1px solid rgba(255,0,85,0.25)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#FF0055', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle style={{ width: 14, height: 14 }} /> 2. WHY IS THIS DANGEROUS?
                </div>
                <div style={{ fontSize: 12, color: '#E2E8F0', lineHeight: 1.4 }}>
                  {overrideFixed ? 'Risk eliminated. Operating parameters normal.' : selectedNode.whyDangerous}
                </div>
              </div>

              {/* 3. What will happen? */}
              <div style={{ background: 'rgba(255,184,0,0.06)', borderRadius: 10, padding: 12, border: '1px solid rgba(255,184,0,0.25)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#FFB800', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Flame style={{ width: 14, height: 14 }} /> 3. WHAT WILL HAPPEN IF UNFIXED?
                </div>
                <div style={{ fontSize: 12, color: '#E2E8F0', lineHeight: 1.4 }}>
                  {overrideFixed ? 'No equipment failure predicted.' : selectedNode.whatWillHappen}
                </div>
              </div>

              {/* 4. How to fix it? */}
              <div style={{ background: 'rgba(57,255,20,0.06)', borderRadius: 10, padding: 12, border: '1px solid rgba(57,255,20,0.25)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#39FF14', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 style={{ width: 14, height: 14 }} /> 4. HOW TO FIX IT?
                </div>
                <div style={{ fontSize: 12, color: '#E2E8F0', lineHeight: 1.4 }}>
                  {selectedNode.howToFix}
                </div>
              </div>

            </div>
          </div>

          {/* Action button */}
          {!overrideFixed && (
            <button
              onClick={handleFix}
              style={{
                marginTop: 16, width: '100%', padding: '12px', borderRadius: 10, background: '#00F0FF',
                color: '#070A0F', fontWeight: 900, fontSize: 13, border: 'none', cursor: 'pointer',
                boxShadow: '0 0 20px rgba(0,240,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}
            >
              <RotateCcw style={{ width: 16, height: 16 }} /> TRIGGER SAFE OVERRIDE
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
