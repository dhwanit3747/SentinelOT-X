'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Cpu, CheckCircle2, AlertTriangle, GitCompare, Box,
  RotateCcw, Wifi, WifiOff, Shield, ShieldOff,
  ChevronDown, ChevronUp, Clock, Hash, Search,
  Filter, RefreshCw, Terminal, X, Zap, Lock
} from 'lucide-react';

const INITIAL_MACHINES = [
  {
    id: 'PLC-01',
    name: 'Chemical Reactor Mixer PLC',
    location: 'Plant Alpha — Line 2',
    model: 'Siemens S7-1500',
    protocol: 'S7comm / Profinet',
    status: 'COMPROMISED',
    online: true,
    lastChange: '14 mins ago',
    lastScan: '2 mins ago',
    issue: 'Emergency Stop switch disabled in ladder rung 0001.',
    hashMatch: false,
    approvedHash: '0x8F4A21D3',
    currentHash: '0xC3F912AB',
    firmware: 'v2.8.1 (Certified)',
    ipAddress: '192.168.1.10',
    riskScore: 94,
    changeCount: 3,
  },
  {
    id: 'PLC-03',
    name: 'Main Substation Circuit Breaker PLC',
    location: 'Substation Gamma — Grid 1',
    model: 'Schneider M580',
    protocol: 'Modbus TCP',
    status: 'COMPROMISED',
    online: true,
    lastChange: '28 mins ago',
    lastScan: '5 mins ago',
    issue: 'Breaker trip delay altered from 50ms to 5,000ms.',
    hashMatch: false,
    approvedHash: '0x4D1BC9E2',
    currentHash: '0x7A3F0011',
    firmware: 'v3.1.0 (Certified)',
    ipAddress: '192.168.1.30',
    riskScore: 87,
    changeCount: 1,
  },
  {
    id: 'PLC-02',
    name: 'Coolant Flow Controller PLC',
    location: 'Plant Alpha — Line 1',
    model: 'Allen-Bradley ControlLogix',
    protocol: 'EtherNet/IP',
    status: 'HEALTHY',
    online: true,
    lastChange: '2 days ago',
    lastScan: '1 min ago',
    issue: 'None. Operating normally.',
    hashMatch: true,
    approvedHash: '0xA12D88C7',
    currentHash: '0xA12D88C7',
    firmware: 'v4.2.3 (Certified)',
    ipAddress: '192.168.1.20',
    riskScore: 4,
    changeCount: 0,
  },
  {
    id: 'PLC-04',
    name: 'Turbine Safety Shutdown PLC',
    location: 'Powerhouse Beta',
    model: 'Siemens S7-1200',
    protocol: 'S7comm / Profinet',
    status: 'HEALTHY',
    online: true,
    lastChange: '5 days ago',
    lastScan: '3 mins ago',
    issue: 'None. Operating normally.',
    hashMatch: true,
    approvedHash: '0xF8E32B19',
    currentHash: '0xF8E32B19',
    firmware: 'v2.5.4 (Certified)',
    ipAddress: '192.168.1.40',
    riskScore: 2,
    changeCount: 0,
  },
];

type Machine = typeof INITIAL_MACHINES[0];

const C = {
  bg: '#070A0F',
  card: '#0F1623',
  inner: '#040608',
  border: '#1E293B',
  text: '#F8FAFC',
  muted: '#64748B',
  slate: '#CBD5E1',
  cyan: '#00F0FF',
  red: '#FF0055',
  green: '#39FF14',
  amber: '#FFB800',
};

function RiskBar({ score }: { score: number }) {
  const color = score > 70 ? C.red : score > 30 ? C.amber : C.green;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>RISK SCORE</span>
        <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 900, color }}>{score}/100</span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

function TerminalLog({ lines }: { lines: string[] }) {
  return (
    <div style={{
      background: C.inner, borderRadius: 8, padding: '10px 12px',
      fontFamily: 'monospace', fontSize: 10, color: C.green,
      maxHeight: 120, overflowY: 'auto', border: `1px solid ${C.border}`,
    }}>
      {lines.map((l, i) => (
        <div key={i} style={{ lineHeight: 1.7, color: l.startsWith('✓') ? C.green : l.startsWith('⚠') ? C.amber : l.startsWith('✗') ? C.red : C.slate }}>
          {l}
        </div>
      ))}
    </div>
  );
}

export default function EngineerFleetView() {
  const [machines, setMachines] = useState(INITIAL_MACHINES);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [scanning, setScanning] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'COMPROMISED' | 'HEALTHY'>('ALL');
  const [search, setSearch] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<Record<string, string[]>>({});
  const [isolatedIds, setIsolatedIds] = useState<string[]>([]);
  const [scanAllRunning, setScanAllRunning] = useState(false);
  const [globalRestoreDone, setGlobalRestoreDone] = useState(false);

  const addLog = (id: string, lines: string[]) => {
    setTerminalLogs(prev => ({ ...prev, [id]: [...(prev[id] || []), ...lines] }));
  };

  // ── Per-machine restore to approved baseline
  const handleRestore = (id: string) => {
    setRestoring(id);
    addLog(id, [
      `[${new Date().toLocaleTimeString()}] Initiating rollback for ${id}...`,
      '⚠ Suspending active PLC scan cycle...',
      '⚠ Downloading approved golden baseline...',
    ]);
    setTimeout(() => {
      addLog(id, [
        '✓ Baseline hash verified: approved checksum matches.',
        '✓ Writing certified firmware block to PLC memory...',
        '✓ Emergency Stop interlock re-engaged.',
        '✓ Baseline restored. Machine back to SAFE state.',
      ]);
      setMachines(prev => prev.map(m =>
        m.id === id
          ? { ...m, status: 'HEALTHY', hashMatch: true, currentHash: m.approvedHash, riskScore: 3, issue: 'Baseline restored. Operating normally.', lastChange: 'Just now' }
          : m
      ));
      setRestoring(null);
    }, 2800);
  };

  // ── Per-machine network isolation toggle
  const handleIsolate = (id: string) => {
    const isIsolated = isolatedIds.includes(id);
    if (isIsolated) {
      setIsolatedIds(prev => prev.filter(i => i !== id));
      addLog(id, [`[${new Date().toLocaleTimeString()}] ✓ Network access restored for ${id}.`]);
    } else {
      setIsolatedIds(prev => [...prev, id]);
      addLog(id, [
        `[${new Date().toLocaleTimeString()}] ⚠ ISOLATING ${id} from plant network...`,
        '⚠ Dropping all active Modbus / S7comm sessions.',
        '✓ Network isolation applied. Machine is offline from OT network.',
      ]);
      setMachines(prev => prev.map(m => m.id === id ? { ...m, online: false } : m));
    }
  };

  // ── Per-machine integrity scan
  const handleScan = (id: string) => {
    setScanning(id);
    addLog(id, [
      `[${new Date().toLocaleTimeString()}] Starting integrity scan on ${id}...`,
      '⚠ Fetching live PLC memory dump...',
      '⚠ Comparing against approved SHA-256 baseline...',
    ]);
    setTimeout(() => {
      const m = machines.find(x => x.id === id);
      if (m) {
        if (m.hashMatch) {
          addLog(id, [
            `✓ Hash match: ${m.approvedHash} = ${m.currentHash}`,
            '✓ No drift detected. Machine is SAFE.',
            `✓ Scan complete. Last scan: ${new Date().toLocaleTimeString()}`,
          ]);
        } else {
          addLog(id, [
            `✗ Hash MISMATCH: approved ${m.approvedHash} ≠ current ${m.currentHash}`,
            '⚠ Unapproved modification confirmed.',
            `✓ Scan complete at ${new Date().toLocaleTimeString()}. ACTION REQUIRED.`,
          ]);
        }
      }
      setMachines(prev => prev.map(x => x.id === id ? { ...x, lastScan: 'Just now' } : x));
      setScanning(null);
    }, 2000);
  };

  // ── Scan all machines at once
  const handleScanAll = () => {
    setScanAllRunning(true);
    machines.forEach(m => handleScan(m.id));
    setTimeout(() => setScanAllRunning(false), 2500);
  };

  // ── Restore ALL compromised machines
  const handleRestoreAll = () => {
    setGlobalRestoreDone(true);
    machines.filter(m => m.status === 'COMPROMISED').forEach(m => handleRestore(m.id));
  };

  const filtered = machines
    .filter(m => filter === 'ALL' || m.status === filter)
    .filter(m =>
      search === '' ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.model.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.riskScore - a.riskScore);

  const compromisedCount = machines.filter(m => m.status === 'COMPROMISED').length;
  const healthyCount = machines.filter(m => m.status === 'HEALTHY').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, color: C.text }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: 'monospace', color: C.cyan, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            FACTORY MACHINE LIST
          </div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: C.text }}>
            OT Controller Fleet Management
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: 12, color: C.muted }}>
            Live status of all industrial PLCs. Scan, isolate, compare code and restore compromised machines.
          </p>
        </div>

        {/* Summary Badges */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Cpu style={{ width: 15, height: 15, color: C.cyan }} /> {machines.length} Total
          </div>
          <div style={{ background: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.3)', padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, color: C.green, display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 style={{ width: 15, height: 15 }} /> {healthyCount} Healthy
          </div>
          <div style={{ background: 'rgba(255,0,85,0.1)', border: '1px solid rgba(255,0,85,0.3)', padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, color: C.red, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle style={{ width: 15, height: 15 }} /> {compromisedCount} Compromised
          </div>
        </div>
      </div>

      {/* ── Global Actions Bar ── */}
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.inner, border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 12px', flex: 1, minWidth: 180 }}>
          <Search style={{ width: 14, height: 14, color: C.muted, flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search machine name, ID, model…"
            style={{ background: 'transparent', border: 'none', outline: 'none', color: C.text, fontSize: 12, width: '100%' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 0 }}>
              <X style={{ width: 12, height: 12 }} />
            </button>
          )}
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 6 }}>
          {(['ALL', 'COMPROMISED', 'HEALTHY'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none',
                background: filter === f ? (f === 'COMPROMISED' ? C.red : f === 'HEALTHY' ? 'rgba(57,255,20,0.2)' : 'rgba(0,240,255,0.15)') : 'rgba(255,255,255,0.05)',
                color: filter === f ? (f === 'COMPROMISED' ? '#fff' : f === 'HEALTHY' ? C.green : C.cyan) : C.muted,
                transition: 'all 0.15s ease',
              }}
            >
              <Filter style={{ width: 11, height: 11, display: 'inline', marginRight: 4 }} />
              {f}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', flexWrap: 'wrap' }}>
          {/* Scan All */}
          <button
            onClick={handleScanAll}
            disabled={scanAllRunning}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8,
              background: 'rgba(0,240,255,0.1)', border: `1px solid rgba(0,240,255,0.3)`, color: C.cyan,
              fontSize: 11, fontWeight: 700, cursor: scanAllRunning ? 'not-allowed' : 'pointer', opacity: scanAllRunning ? 0.6 : 1,
            }}
          >
            <RefreshCw style={{ width: 13, height: 13, animation: scanAllRunning ? 'spin 1s linear infinite' : 'none' }} />
            {scanAllRunning ? 'Scanning…' : 'Scan All'}
          </button>

          {/* Restore All Compromised */}
          {compromisedCount > 0 && (
            <button
              onClick={handleRestoreAll}
              disabled={!!restoring}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8,
                background: C.red, border: 'none', color: '#fff',
                fontSize: 11, fontWeight: 800, cursor: restoring ? 'not-allowed' : 'pointer', opacity: restoring ? 0.6 : 1,
              }}
            >
              <RotateCcw style={{ width: 13, height: 13 }} />
              Restore All ({compromisedCount})
            </button>
          )}
        </div>
      </div>

      {/* ── Machine Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: C.muted, fontSize: 13 }}>
            No machines match your search or filter.
          </div>
        )}

        {filtered.map((m) => {
          const isCompromised = m.status === 'COMPROMISED';
          const isExpanded = expanded === m.id;
          const isRestoring = restoring === m.id;
          const isScanning = scanning === m.id;
          const isIsolated = isolatedIds.includes(m.id);

          return (
            <div
              key={m.id}
              style={{
                background: C.card,
                border: `2px solid ${isCompromised ? C.red : C.border}`,
                boxShadow: isCompromised ? '0 0 24px rgba(255,0,85,0.12)' : 'none',
                borderRadius: 14,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                transition: 'all 0.2s ease',
              }}
            >
              {/* ── Card Header ── */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: C.muted, textTransform: 'uppercase' }}>
                    {m.id} — {m.model}
                  </span>
                  <h3 style={{ margin: '2px 0 0 0', fontSize: 14, fontWeight: 800, color: C.text, lineHeight: 1.3 }}>
                    {m.name}
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: 6, fontSize: 10, fontFamily: 'monospace', fontWeight: 800,
                    background: isCompromised ? C.red : 'rgba(57,255,20,0.18)',
                    color: isCompromised ? '#000' : C.green,
                    border: `1px solid ${isCompromised ? C.red : 'rgba(57,255,20,0.4)'}`,
                  }}>
                    {isRestoring ? 'RESTORING…' : m.status}
                  </span>
                  {isIsolated && (
                    <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 9, fontFamily: 'monospace', fontWeight: 800, background: 'rgba(255,184,0,0.15)', color: C.amber, border: `1px solid rgba(255,184,0,0.3)` }}>
                      ISOLATED
                    </span>
                  )}
                </div>
              </div>

              {/* Location + IP */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 4 }}>
                <div style={{ fontSize: 11, color: C.cyan, fontWeight: 600 }}>📍 {m.location}</div>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: C.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {m.online && !isIsolated ? <Wifi style={{ width: 11, height: 11, color: C.green }} /> : <WifiOff style={{ width: 11, height: 11, color: C.amber }} />}
                  {m.ipAddress}
                </div>
              </div>

              {/* Issue box */}
              <div style={{
                background: isCompromised ? 'rgba(255,0,85,0.07)' : 'rgba(57,255,20,0.05)',
                border: `1px solid ${isCompromised ? 'rgba(255,0,85,0.25)' : 'rgba(57,255,20,0.18)'}`,
                borderRadius: 8, padding: '10px 12px', marginBottom: 12,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: isCompromised ? C.red : C.green, marginBottom: 3, textTransform: 'uppercase' }}>
                  {isCompromised ? '⚠ Unapproved Change Detected' : '✓ Safe Baseline Match'}
                </div>
                <div style={{ fontSize: 11, color: '#E2E8F0', lineHeight: 1.5 }}>{m.issue}</div>
              </div>

              {/* Risk bar */}
              <RiskBar score={m.riskScore} />

              {/* Last scan + protocol */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, marginBottom: 12, fontSize: 10, color: C.muted }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock style={{ width: 10, height: 10 }} /> Last scan: {m.lastScan}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Terminal style={{ width: 10, height: 10 }} /> {m.protocol}
                </span>
              </div>

              {/* ── Action Buttons ── */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>

                {/* Scan */}
                <button
                  onClick={() => handleScan(m.id)}
                  disabled={isScanning}
                  style={{
                    flex: 1, minWidth: 70, padding: '8px 6px', borderRadius: 8, border: `1px solid ${C.border}`,
                    background: 'rgba(0,240,255,0.06)', color: C.cyan, fontSize: 10, fontWeight: 700,
                    cursor: isScanning ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, opacity: isScanning ? 0.6 : 1,
                  }}
                >
                  <RefreshCw style={{ width: 11, height: 11, animation: isScanning ? 'spin 1s linear infinite' : 'none' }} />
                  {isScanning ? 'Scanning…' : 'Scan'}
                </button>

                {/* Isolate / Un-isolate */}
                <button
                  onClick={() => handleIsolate(m.id)}
                  style={{
                    flex: 1, minWidth: 70, padding: '8px 6px', borderRadius: 8, border: `1px solid ${isIsolated ? 'rgba(255,184,0,0.4)' : C.border}`,
                    background: isIsolated ? 'rgba(255,184,0,0.12)' : 'rgba(255,255,255,0.04)', color: isIsolated ? C.amber : C.muted,
                    fontSize: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  }}
                >
                  {isIsolated ? <Wifi style={{ width: 11, height: 11 }} /> : <WifiOff style={{ width: 11, height: 11 }} />}
                  {isIsolated ? 'Connect' : 'Isolate'}
                </button>

                {/* View Code Diff or Verified */}
                {isCompromised ? (
                  <Link
                    href="/logic-diff"
                    style={{
                      flex: 1, minWidth: 70, padding: '8px 6px', borderRadius: 8, background: 'rgba(255,0,85,0.12)',
                      border: `1px solid rgba(255,0,85,0.35)`, color: C.red, fontSize: 10, fontWeight: 700,
                      textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    }}
                  >
                    <GitCompare style={{ width: 11, height: 11 }} /> Diff
                  </Link>
                ) : (
                  <div style={{
                    flex: 1, minWidth: 70, padding: '8px 6px', borderRadius: 8, background: 'rgba(57,255,20,0.07)',
                    border: `1px solid rgba(57,255,20,0.2)`, color: C.green, fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  }}>
                    <Shield style={{ width: 11, height: 11 }} /> Verified
                  </div>
                )}

                {/* Digital Twin */}
                <Link
                  href="/digital-twin"
                  style={{
                    padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${C.border}`, color: C.slate, fontSize: 10, fontWeight: 700,
                    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  <Box style={{ width: 11, height: 11, color: C.cyan }} /> Twin
                </Link>
              </div>

              {/* Restore Baseline — only on compromised */}
              {isCompromised && (
                <button
                  onClick={() => handleRestore(m.id)}
                  disabled={isRestoring}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 8, background: isRestoring ? 'rgba(0,240,255,0.08)' : C.cyan,
                    border: 'none', color: isRestoring ? C.cyan : '#070A0F',
                    fontSize: 12, fontWeight: 900, cursor: isRestoring ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    boxShadow: isRestoring ? 'none' : '0 0 16px rgba(0,240,255,0.3)',
                    transition: 'all 0.2s ease',
                    marginBottom: 8,
                  }}
                >
                  <RotateCcw style={{ width: 14, height: 14 }} />
                  {isRestoring ? 'Restoring Baseline…' : 'Restore Approved Baseline'}
                </button>
              )}

              {/* Expand / Collapse Details */}
              <button
                onClick={() => setExpanded(isExpanded ? null : m.id)}
                style={{
                  width: '100%', padding: '7px', borderRadius: 8, background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${C.border}`, color: C.muted, fontSize: 10, fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  transition: 'all 0.15s ease',
                }}
              >
                {isExpanded ? <ChevronUp style={{ width: 12, height: 12 }} /> : <ChevronDown style={{ width: 12, height: 12 }} />}
                {isExpanded ? 'Hide Details' : 'Show Details & Logs'}
              </button>

              {/* ── Expanded Details Panel ── */}
              {isExpanded && (
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {/* Hash Comparison */}
                  <div style={{ background: C.inner, borderRadius: 8, padding: '10px 12px', border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: 8 }}>
                      <Hash style={{ width: 10, height: 10, display: 'inline', marginRight: 4 }} />
                      SHA-256 Hash Comparison
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'monospace', fontSize: 11 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                        <span style={{ color: C.muted }}>Approved:</span>
                        <span style={{ color: C.green }}>{m.approvedHash}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                        <span style={{ color: C.muted }}>Current:</span>
                        <span style={{ color: m.hashMatch ? C.green : C.red }}>{m.currentHash}</span>
                      </div>
                      <div style={{ padding: '4px 8px', borderRadius: 6, textAlign: 'center', fontWeight: 800, fontSize: 10,
                        background: m.hashMatch ? 'rgba(57,255,20,0.1)' : 'rgba(255,0,85,0.12)',
                        color: m.hashMatch ? C.green : C.red,
                        border: `1px solid ${m.hashMatch ? 'rgba(57,255,20,0.3)' : 'rgba(255,0,85,0.3)'}`,
                      }}>
                        {m.hashMatch ? '✓ HASH MATCH — SAFE' : '✗ HASH MISMATCH — TAMPERED'}
                      </div>
                    </div>
                  </div>

                  {/* Extra info */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { label: 'Firmware', value: m.firmware },
                      { label: 'Protocol', value: m.protocol },
                      { label: 'Last Change', value: m.lastChange },
                      { label: 'Change Count', value: `${m.changeCount} modification${m.changeCount !== 1 ? 's' : ''}` },
                    ].map(row => (
                      <div key={row.label} style={{ background: C.inner, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px' }}>
                        <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{row.label}</div>
                        <div style={{ fontSize: 11, color: C.slate, fontWeight: 600 }}>{row.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Terminal log */}
                  {terminalLogs[m.id] && terminalLogs[m.id].length > 0 && (
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Terminal style={{ width: 10, height: 10 }} /> Activity Log
                      </div>
                      <TerminalLog lines={terminalLogs[m.id]} />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Spin keyframe style */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
