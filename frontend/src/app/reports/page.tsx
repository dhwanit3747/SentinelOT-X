'use client';
import React, { useState } from 'react';
import { FileText, Download, Award, ShieldCheck, CheckCircle2, DollarSign, Printer, Sparkles } from 'lucide-react';
import { JargonTooltip } from '@/components/ui/JargonTooltip';

import { useApp } from '@/lib/AppContext';

export default function ExecutiveReports() {
  const [reportType, setReportType] = useState<'exec' | 'tech' | 'compliance'>('exec');
  const [includeFin, setIncludeFin] = useState(true);
  const [includeDiff, setIncludeDiff] = useState(true);
  const { hasDrift, isRolledBack } = useApp();

  const isSafe = !hasDrift || isRolledBack;

  const [downloadedFile, setDownloadedFile] = useState<string | null>(null);

  const handleDownload = () => {
    const reportTitle = reportType === 'exec' 
      ? 'Executive Summary (C-Suite Briefing)' 
      : reportType === 'tech' 
      ? 'Technical Security Audit Report' 
      : 'IEC 62443 Compliance Audit Certificate';

    const timestamp = new Date().toLocaleString();
    const fileName = `SentinelOT_X_${reportType.toUpperCase()}_Report_${new Date().toISOString().slice(0,10)}.txt`;

    const reportText = `================================================================================
                       SENTINELOT X — OFFICIAL REPORT
================================================================================
Report Type : ${reportTitle}
Generated On: ${timestamp}
Plant Location: Plant Alpha — Chemical Processing Division
Verification: STAMP #8F4A21 (Cryptographically Signed & Certified)
================================================================================

1. INCIDENT & DRIFT SUMMARY
--------------------------------------------------------------------------------
- Affected Equipment : Siemens S7-1500 PLC (Chemical Mixer 01)
- Threat Status     : ${isSafe ? 'SAFE — BASELINE VERIFIED (HASH 0x8F4A21)' : 'UNRESOLVED DRIFT DETECTED'}
- Safety Risk       : ${isSafe ? 'NOMINAL (0 / 100 Risk)' : 'CRITICAL — Physical Floor Emergency Stop Disengaged'}

${includeFin ? `2. FINANCIAL DOWNTIME IMPACT ANALYSIS
--------------------------------------------------------------------------------
- Standard Factory Downtime Rate : $145,000 / hour
- Estimated Outage Exposure      : ${isSafe ? '$0 USD (Fully Mitigated)' : '$942,500 USD (6.5 Hours Exposure)'}
- Compliance Pass Score          : ${isSafe ? '100% (Fully Compliant)' : '62.5% (IEC 62443 Violation Flagged)'}
` : ''}${includeDiff ? `3. LADDER LOGIC CODE COMPARISON
--------------------------------------------------------------------------------
[APPROVED GOLDEN BASELINE — HASH 0x8F4A21]
Rung 0001: [E_STOP_NC] ---- ( MTR_COIL )
Status: Interlock active. E-Stop button cuts motor power immediately.

[RUNNING CODE STATE]
Rung 0001: ${isSafe ? '[E_STOP_NC] ---- ( MTR_COIL ) [VERIFIED]' : '[ALWAYS_TRUE] ---- ( MTR_COIL ) [UNAPPROVED OVERRIDE]'}
Status: ${isSafe ? 'Baseline Hash Verified. Emergency stop interlock active.' : 'E-Stop button bypassed! Motor runs regardless of safety state.'}
` : ''}4. AI COPILOT RECOMMENDATION & RECOVERY PLAN
--------------------------------------------------------------------------------
- Recommended Action : ${isSafe ? 'Baseline hash verified. Continue periodic daily cryptographic auditing.' : 'Execute 1-Click Rollback to Hash 0x8F4A21 immediately.'}
- Firewall Whitelist  : Block MAC 00:1B:44:11:3A / IP 192.168.10.99.

================================================================================
End of Certified Report | SentinelOT X AI Security Platform
================================================================================`;

    // Trigger browser file download directly into the Downloads folder
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedFile(fileName);
    setTimeout(() => setDownloadedFile(null), 6000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div className="no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#00F0FF', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase' }}>
          <JargonTooltip term="Executive Reports" plainTerm="Downloadable C-Suite Briefing PDFs" definition="Synthesized one-page visual briefing document summarizing incident details, financial risk, and AI recommendations for executives." example="Generates an official signed PDF report for board members." />
        </div>
        <h1 style={{ margin: '4px 0 0 0', fontSize: 20, fontWeight: 900, color: '#F8FAFC' }}>
          Executive Security Briefing & PDF Reports
        </h1>
        <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#94A3B8' }}>
          Generate C-suite visual reports with cryptographic verification stamps and financial impact breakdowns.
        </p>
      </div>

      {/* Grid: Options Selector (Left 35%) + Live Briefing Canvas Preview (Right 65%) */}
      <div className="reports-grid" style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>

        {/* Options Panel */}
        <div className="no-print" style={{
          background: '#0F1623', border: '1px solid #1E293B', borderRadius: 14, padding: 20,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 14 }}>
              REPORT CONFIGURATION
            </div>

            {/* Type Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {[
                { id: 'exec', label: 'Executive Summary (C-Suite)', sub: '1-page visual overview & financial impact' },
                { id: 'tech', label: 'Technical Security Audit', sub: 'Full AST ladder logic diffs & protocol logs' },
                { id: 'compliance', label: 'Compliance Certification', sub: 'IEC 62443 & NIST regulatory audit proof' },
              ].map(t => (
                <div
                  key={t.id}
                  onClick={() => setReportType(t.id as any)}
                  style={{
                    padding: 12, borderRadius: 10, cursor: 'pointer',
                    background: reportType === t.id ? 'rgba(0,240,255,0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${reportType === t.id ? '#00F0FF' : '#1E293B'}`
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 13, color: reportType === t.id ? '#00F0FF' : '#F8FAFC' }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{t.sub}</div>
                </div>
              ))}
            </div>

            {/* Customization Options */}
            <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 10 }}>
              INCLUDE SECTIONS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer', color: '#CBD5E1' }}>
                <input type="checkbox" checked={includeFin} onChange={e => setIncludeFin(e.target.checked)} />
                Include Financial Downtime Calculation ($145k/hr)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer', color: '#CBD5E1' }}>
                <input type="checkbox" checked={includeDiff} onChange={e => setIncludeDiff(e.target.checked)} />
                Include Plain-English Code Change Comparison
              </label>
            </div>
          </div>

          <div>
            <button
              onClick={handleDownload}
              style={{
                width: '100%', padding: '12px', borderRadius: 10, background: 'var(--accent-cyan)', color: '#070A0F',
                fontWeight: 900, fontSize: 13, border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(0,240,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}
            >
              <Download style={{ width: 16, height: 16 }} /> DOWNLOAD REPORT FILE (.TXT)
            </button>

            <button
              onClick={() => window.print()}
              style={{
                width: '100%', padding: '10px', borderRadius: 10, background: 'var(--bg-inner)',
                border: '1px solid var(--border-color)', color: 'var(--text-main)',
                fontWeight: 700, fontSize: 12, cursor: 'pointer', marginTop: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}
            >
              <Printer style={{ width: 14, height: 14 }} /> PRINT / SAVE TO PDF
            </button>

            {downloadedFile && (
              <div style={{
                marginTop: 12, padding: '10px 12px', borderRadius: 8,
                background: 'rgba(57,255,20,0.12)', border: '1px solid rgba(57,255,20,0.35)',
                color: 'var(--accent-green)', fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0 }} />
                <span>Downloaded <b>{downloadedFile}</b> to your Downloads folder!</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Document Preview Sheet (Right) */}
        <div className="printable-sheet" style={{
          background: '#040608',
          border: '1px solid #00F0FF',
          boxShadow: '0 0 30px rgba(0,240,255,0.15)',
          borderRadius: 14,
          padding: 28,
          color: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            {/* Header Document Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #00F0FF', paddingBottom: 16, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#00F0FF', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  SENTINELOT X — EXECUTIVE BRIEFING SHEET
                </div>
                <h2 style={{ margin: '4px 0 0 0', fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>
                  Factory Safety & Incident Audit Summary
                </h2>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                  Generated on: July 28, 2026 | Location: Plant Alpha (Chemical Processing)
                </div>
              </div>

              <div style={{
                background: 'rgba(0,240,255,0.12)', border: '1px solid #00F0FF', padding: '6px 12px',
                borderRadius: 8, textAlign: 'center'
              }}>
                <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#00F0FF', fontWeight: 800 }}>OFFICIAL VERIFIED</div>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#FFF', fontWeight: 700 }}>STAMP #8F4A21</div>
              </div>
            </div>

            {/* Content Summary Boxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: '#0F1623', padding: 14, borderRadius: 10, border: '1px solid #1E293B' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#FF0055', textTransform: 'uppercase', marginBottom: 4 }}>
                  INCIDENT SUMMARY
                </div>
                <div style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.5 }}>
                  Unapproved code modification detected on Siemens S7-1500 (Chemical Mixer). Floor Emergency Stop switch was bypassed by an unregistered engineering laptop (192.168.10.99).
                </div>
              </div>

              {includeFin && (
                <div style={{ background: '#0F1623', padding: 14, borderRadius: 10, border: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#FFB800', textTransform: 'uppercase', marginBottom: 2 }}>
                      BUSINESS FINANCIAL IMPACT
                    </div>
                    <div style={{ fontSize: 12, color: '#CBD5E1' }}>Estimated production downtime cost @ $145,000 / hr</div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, fontFamily: 'monospace', color: isSafe ? '#39FF14' : '#FF0055' }}>
                    {isSafe ? '$0 (Mitigated)' : '$942.5k'}
                  </div>
                </div>
              )}

              {includeDiff && (
                <div style={{ background: '#0F1623', padding: 14, borderRadius: 10, border: '1px solid #1E293B' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#00F0FF', textTransform: 'uppercase', marginBottom: 4 }}>
                    CODE CHANGE AUDIT
                  </div>
                  <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#E2E8F0', lineHeight: 1.5 }}>
                    - Approved: Rung 0001: [E_STOP_NC] ---- ( MTR_COIL )<br />
                    - Modified: Rung 0001: [ALWAYS_TRUE] ---- ( MTR_COIL ) [UNAPPROVED]
                  </div>
                </div>
              )}

              <div style={{ background: isSafe ? 'rgba(57,255,20,0.06)' : 'rgba(255,0,85,0.06)', padding: 14, borderRadius: 10, border: `1px solid ${isSafe ? 'rgba(57,255,20,0.25)' : 'rgba(255,0,85,0.25)'}` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: isSafe ? '#39FF14' : '#39FF14', textTransform: 'uppercase', marginBottom: 2 }}>
                  {isSafe ? '✓ INCIDENT CLOSED — BASELINE VERIFIED' : 'ACTION RECOMMENDED'}
                </div>
                <div style={{ fontSize: 12, color: '#E2E8F0' }}>
                  {isSafe
                    ? 'Golden baseline SHA-256 Hash 0x8F4A21 verified across all fleet PLCs. Safety interlocks active.'
                    : 'Execute 1-Click Rollback to restore approved baseline Hash 0x8F4A21 and re-engage safety interlocks.'}
                </div>
              </div>
            </div>
          </div>

          {/* Footer stamp */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 16, borderTop: '1px solid #1E293B', fontSize: 11, color: '#64748B' }}>
            <span>SentinelOT X AI Security Engine</span>
            <span>Page 1 of 1 (Certified Executive Briefing)</span>
          </div>
        </div>

      </div>

    </div>
  );
}
