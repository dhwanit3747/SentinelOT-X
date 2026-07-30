'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert, DollarSign, AlertTriangle,
  Bot, Activity, Cpu, CheckCircle2, ChevronRight, Network, HelpCircle, BookOpen, RotateCcw, AlertOctagon, Flame
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine
} from 'recharts';
import { JargonTooltip } from '@/components/ui/JargonTooltip';

const C = {
  bg: '#070A0F', card: '#0F1623', border: '#1E293B',
  cyan: '#00F0FF', red: '#FF0055', green: '#39FF14',
  amber: '#FFB800', text: '#F8FAFC', muted: '#64748B', slate: '#CBD5E1'
};

const riskData = [
  { time: '00:00', risk: 18, note: 'Normal Ops' },
  { time: '03:00', risk: 22, note: 'Normal Ops' },
  { time: '06:00', risk: 45, note: 'Shift Handover' },
  { time: '09:00', risk: 94.5, note: 'CRITICAL: E-Stop Disabled' },
  { time: '12:00', risk: 82, note: 'Risk Mitigated' },
  { time: '15:00', risk: 30, note: 'Normalizing' },
];

const cardStyle = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  background: 'rgba(15,22,35,0.92)',
  backdropFilter: 'blur(16px)',
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  padding: 20,
  ...extra,
});

export default function ExecutiveDashboard() {
  const [mounted, setMounted] = useState(false);
  const [hrs, setHrs] = useState(6.5);
  const rate = 145_000;
  const loss = hrs * rate;
  const [rolledBack, setRolledBack] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleRollback = () => {
    setRolledBack(true);
    alert('SUCCESS: Approved PLC baseline restored! Emergency Stop re-engaged.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, color: C.text }}>

      {/* ── 10-SECOND HERO STORY CARD (ANSWERING ALL 5 QUESTIONS IN 10 SECONDS) ── */}
      <div style={{
        ...cardStyle({
          background: rolledBack ? 'rgba(57,255,20,0.08)' : 'rgba(255,0,85,0.12)',
          border: `2px solid ${rolledBack ? C.green : C.red}`,
          boxShadow: `0 0 32px ${rolledBack ? 'rgba(57,255,20,0.2)' : 'rgba(255,0,85,0.25)'}`,
        }),
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flex: 1, minWidth: 300 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: rolledBack ? 'rgba(57,255,20,0.18)' : 'rgba(255,0,85,0.20)',
              border: `1px solid ${rolledBack ? C.green : C.red}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {rolledBack ? (
                <CheckCircle2 style={{ width: 28, height: 28, color: C.green }} />
              ) : (
                <ShieldAlert style={{ width: 28, height: 28, color: C.red }} />
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 800, background: rolledBack ? C.green : C.red, color: '#000', padding: '3px 8px', borderRadius: 6 }}>
                  {rolledBack ? 'SAFE STATE RESTORED' : 'CRITICAL INCIDENT IN PROGRESS'}
                </span>
                <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
                  Target: <strong>Plant Alpha — Line 2 (Chemical Mixer)</strong>
                </span>
              </div>

              <h1 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 900, color: C.text, lineHeight: 1.3 }}>
                {rolledBack
                  ? 'All Factory Controllers Restored to Approved Safe Version'
                  : 'CRITICAL ALERT: Factory Safety Disabled on Chemical Reactor PLC'}
              </h1>

              {/* 5-Question Story Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginTop: 12 }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>1. WHAT HAPPENED?</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: rolledBack ? C.green : C.red, marginTop: 2 }}>
                    {rolledBack ? 'Emergency Stop Switch Re-engaged' : 'Emergency Stop Disabled in Code'}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>2. WHERE?</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginTop: 2 }}>
                    Siemens S7-1500 (Chemical Reactor)
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>3. HOW SERIOUS?</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: rolledBack ? C.green : C.red, marginTop: 2 }}>
                    {rolledBack ? '0 / 100 Risk (Safe)' : '94.5 / 100 Physical Danger'}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>4. WHY?</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.amber, marginTop: 2 }}>
                    Unregistered Laptop (192.168.10.99)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Callout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 220 }}>
            {!rolledBack ? (
              <button
                onClick={handleRollback}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', borderRadius: 10,
                  background: C.cyan, color: '#070A0F', fontFamily: 'sans-serif', fontWeight: 900, fontSize: 13,
                  border: 'none', cursor: 'pointer', boxShadow: '0 0 24px rgba(0,240,255,0.4)', transition: 'transform 0.15s ease'
                }}
              >
                <RotateCcw style={{ width: 16, height: 16 }} /> RESTORE APPROVED VERSION
              </button>
            ) : (
              <div style={{ textAlign: 'center', padding: '10px 16px', background: 'rgba(57,255,20,0.15)', borderRadius: 10, border: `1px solid ${C.green}`, color: C.green, fontWeight: 800, fontSize: 12 }}>
                ✓ Baseline Hash Verified
              </div>
            )}

            <Link href="/logic-diff" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 16px', borderRadius: 10,
              background: 'rgba(255,255,255,0.06)', color: C.text, border: `1px solid ${C.border}`, fontWeight: 700, fontSize: 12, textDecoration: 'none'
            }}>
              SEE WHAT CHANGED IN CODE <ChevronRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI METRICS ROW (WITH PLAIN ENGLISH DICTIONARY TOOLTIPS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div style={cardStyle()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>
              <JargonTooltip term="OT Integrity Posture" plainTerm="Overall Plant Health" definition="Overall safety rating of factory control computers based on code integrity." example="100% means all machine code is safe and certified." />
            </span>
            <ShieldAlert style={{ width: 16, height: 16, color: rolledBack ? C.green : C.amber }} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, fontFamily: 'monospace', color: rolledBack ? C.green : C.amber }}>
            {rolledBack ? '100.0%' : '68.4%'}
          </div>
          <div style={{ fontSize: 11, color: C.slate, marginTop: 4 }}>
            {rolledBack ? '✓ All machines verified safe' : '▼ -14.2% from approved baseline'}
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>
              <JargonTooltip term="Financial Downtime Risk" plainTerm="Business Money at Risk" definition="Estimated financial loss if the factory is forced to shut down due to unapproved code modifications." example="$145,000 lost per hour of stopped production." />
            </span>
            <DollarSign style={{ width: 16, height: 16, color: C.red }} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, fontFamily: 'monospace', color: C.red }}>
            ${(loss / 1000).toFixed(1)}k
          </div>
          <div style={{ fontSize: 11, color: C.slate, marginTop: 4 }}>
            Based on ${rate.toLocaleString()} / hr downtime
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>
              <JargonTooltip term="Logic Drift" plainTerm="Modified Machines" definition="Factory PLCs whose control programs were changed without authorization." example="Siemens S7-1500 had its emergency stop bit set to 0." />
            </span>
            <Cpu style={{ width: 16, height: 16, color: C.cyan }} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, fontFamily: 'monospace', color: C.cyan }}>
            {rolledBack ? '0' : '2'}
          </div>
          <div style={{ fontSize: 11, color: C.slate, marginTop: 4 }}>
            {rolledBack ? '✓ All 4 PLCs running golden code' : 'Siemens S7 & Schneider M580'}
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>
              <JargonTooltip term="IEC 62443 Compliance" plainTerm="Safety Standards Pass Rate" definition="Percentage of mandatory industrial safety rules satisfied by the current plant state." example="62.5% pass rate means 2 mandatory safety rules are broken." />
            </span>
            <CheckCircle2 style={{ width: 16, height: 16, color: C.amber }} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, fontFamily: 'monospace', color: C.amber }}>
            {rolledBack ? '100%' : '62.5%'}
          </div>
          <div style={{ fontSize: 11, color: C.slate, marginTop: 4 }}>
            {rolledBack ? '✓ 8 of 8 rules passed' : '2 Safety Rules Broken'}
          </div>
        </div>
      </div>

      {/* ── MIDDLE ROW: VISUAL ATTACK PATH & ANNOTATED RISK GRAPH ── */}
      {/* ── ATTACK PATH & RISK TREND GRID ── */}
      <div className="responsive-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Visual Attack Surface Diagram */}
        <div style={cardStyle()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.text, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Network style={{ width: 16, height: 16, color: C.cyan }} /> ATTACK PATH STORYBOARD
              </h3>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>How an unauthorized laptop connected to factory equipment</div>
            </div>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: C.red, fontWeight: 800, background: 'rgba(255,0,85,0.15)', padding: '2px 8px', borderRadius: 4 }}>
              UNAUTHORIZED LINK
            </span>
          </div>

          <div style={{ background: '#040608', borderRadius: 10, border: `1px solid ${C.border}`, padding: 16 }}>
            <svg viewBox="0 0 500 160" style={{ width: '100%', height: 160 }}>
              <line x1="100" y1="80" x2="230" y2="80" stroke="#FF0055" strokeWidth="2.5" strokeDasharray="6 3" />
              <line x1="230" y1="80" x2="360" y2="38" stroke="#FF0055" strokeWidth="2" />
              <line x1="230" y1="80" x2="360" y2="122" stroke="#FF0055" strokeWidth="2" />

              {/* Rogue Laptop */}
              <rect x="15" y="50" width="90" height="60" rx="8" fill="#0F1623" stroke="#FF0055" strokeWidth="2" />
              <text x="60" y="72" textAnchor="middle" fill="#FF0055" fontSize="10" fontFamily="monospace" fontWeight="bold">UNRECOGNIZED</text>
              <text x="60" y="86" textAnchor="middle" fill="#FF0055" fontSize="10" fontFamily="monospace" fontWeight="bold">LAPTOP</text>
              <text x="60" y="100" textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="monospace">192.168.10.99</text>

              {/* Gateway */}
              <rect x="185" y="55" width="90" height="50" rx="8" fill="#0F1623" stroke="#FFB800" strokeWidth="1.5" />
              <text x="230" y="78" textAnchor="middle" fill="#FFB800" fontSize="9" fontFamily="monospace" fontWeight="bold">FACTORY FIREWALL</text>
              <text x="230" y="92" textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="monospace">BYPASSED</text>

              {/* Chemical Reactor PLC */}
              <rect x="340" y="14" width="140" height="50" rx="8" fill="#0F1623" stroke={rolledBack ? C.green : C.red} strokeWidth="2" />
              <text x="410" y="34" textAnchor="middle" fill={rolledBack ? C.green : C.red} fontSize="9" fontFamily="monospace" fontWeight="bold">CHEMICAL REACTOR PLC</text>
              <text x="410" y="48" textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="monospace">Siemens S7-1500</text>

              {/* Substation PLC */}
              <rect x="340" y="98" width="140" height="50" rx="8" fill="#0F1623" stroke={rolledBack ? C.green : C.red} strokeWidth="2" />
              <text x="410" y="118" textAnchor="middle" fill={rolledBack ? C.green : C.red} fontSize="9" fontFamily="monospace" fontWeight="bold">SUBSTATION BREAKER</text>
              <text x="410" y="132" textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="monospace">Schneider M580</text>
            </svg>
          </div>
        </div>

        {/* Risk Trend Chart with Safe/Danger Thresholds */}
        <div style={cardStyle()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.text, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity style={{ width: 16, height: 16, color: C.cyan }} /> 24-HOUR FACTORY RISK TIMELINE
              </h3>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Threat level spiking during unauthorized code modification</div>
            </div>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: C.amber, fontWeight: 800 }}>PEAK 94.5 DANGER</span>
          </div>

          <div style={{ height: 160 }}>
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.red} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={C.red} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={10} />
                  <YAxis stroke="#64748B" fontSize={10} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: '#0F1623', borderColor: C.border, borderRadius: 8, fontSize: 11 }} />
                  <ReferenceLine y={30} stroke={C.green} strokeDasharray="3 3" label={{ value: 'SAFE THRESHOLD (<30)', fill: C.green, fontSize: 9 }} />
                  <ReferenceLine y={70} stroke={C.red} strokeDasharray="3 3" label={{ value: 'DANGER THRESHOLD (>70)', fill: C.red, fontSize: 9 }} />
                  <Area type="monotone" dataKey="risk" stroke={C.red} strokeWidth={2.5} fillOpacity={1} fill="url(#riskGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 160, background: 'rgba(15,22,35,0.5)', borderRadius: 8 }} />
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
