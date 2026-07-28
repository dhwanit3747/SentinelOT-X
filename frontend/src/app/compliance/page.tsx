'use client';
import React, { useState } from 'react';
import { CheckCircle2, XCircle, ShieldCheck, DollarSign, RotateCcw, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import { JargonTooltip } from '@/components/ui/JargonTooltip';

const rules = [
  {
    id: 'RULE-01',
    code: 'IEC 62443-3-3 SR 3.1',
    plainTitle: 'Rule #1: Machine Code Modification Safeguard',
    standard: 'IEC 62443 Industrial Cybersecurity',
    status: 'FAILED',
    penalty: '$50,000 Regulatory Audit Fine',
    issue: 'Siemens S7-1500 running unapproved ladder logic modification without 2-factor approval.',
    fix: 'Revert Siemens S7-1500 to certified golden baseline Hash 0x8F4A21.',
  },
  {
    id: 'RULE-02',
    code: 'NIST SP 800-82 Rev 2',
    plainTitle: 'Rule #2: Emergency Stop Safety Interlock Protection',
    standard: 'NIST Industrial Control Systems',
    status: 'FAILED',
    penalty: '$75,000 Safety Compliance Penalty',
    issue: 'Rung 0001 Emergency Stop coil forced off, violating mandatory hardware safety interlock regulations.',
    fix: 'Re-engage physical Emergency Stop logic interlock in PLC memory register.',
  },
  {
    id: 'RULE-03',
    code: 'IEC 62443-3-3 SR 1.1',
    plainTitle: 'Rule #3: Human User Identification & Authentication',
    standard: 'IEC 62443 Industrial Cybersecurity',
    status: 'PASSED',
    penalty: '$0 (Compliant)',
    issue: 'All engineer workstation logins verified with multi-factor authentication.',
    fix: 'Already compliant.',
  },
  {
    id: 'RULE-04',
    code: 'ISO 27001 A.12.1.2',
    plainTitle: 'Rule #4: Change Management Approval Audit Trail',
    standard: 'ISO 27001 Information Security',
    status: 'PASSED',
    penalty: '$0 (Compliant)',
    issue: 'All configuration modifications cryptographically signed and logged to immutable audit ledger.',
    fix: 'Already compliant.',
  },
];

export default function ComplianceFramework() {
  const [ruleList, setRuleList] = useState(rules);
  const [allFixed, setAllFixed] = useState(false);

  const handleFixRule = (id: string) => {
    setRuleList(p => p.map(r => r.id === id ? { ...r, status: 'PASSED', penalty: '$0 (Compliant)', issue: 'Violation remediated. Baseline verified.' } : r));
    alert(`Rule ${id} violation fixed! Compliance restored.`);
  };

  const handleFixAll = () => {
    setAllFixed(true);
    setRuleList(p => p.map(r => ({ ...r, status: 'PASSED', penalty: '$0 (Compliant)', issue: 'Violation remediated. Baseline verified.' })));
    alert('ALL SAFETY VIOLATIONS REMEDIATED: Compliance score restored to 100%!');
  };

  const failedCount = ruleList.filter(r => r.status === 'FAILED').length;
  const passRate = (((ruleList.length - failedCount) / ruleList.length) * 100).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header & Score Gauge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#00F0FF', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase' }}>
            <JargonTooltip term="Compliance Framework" plainTerm="Safety Standards & Regulation Audit" definition="Automated compliance verification against international factory safety standards (IEC 62443, NIST SP 800-82)." example="Identifies broken safety rules that carry regulatory fines." />
          </div>
          <h1 style={{ margin: '4px 0 0 0', fontSize: 20, fontWeight: 900, color: '#F8FAFC' }}>
            Factory Safety & Regulatory Standards Check
          </h1>
          <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#94A3B8' }}>
            Verification of international industrial safety rules. Pinned violations carry audit penalties.
          </p>
        </div>

        {/* Top Overall Score Banner */}
        <div style={{
          background: '#0F1623', border: `2px solid ${failedCount > 0 ? '#FFB800' : '#39FF14'}`,
          borderRadius: 14, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16
        }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
              OVERALL COMPLIANCE PASS SCORE
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, fontFamily: 'monospace', color: failedCount > 0 ? '#FFB800' : '#39FF14' }}>
              {passRate}%
            </div>
          </div>

          {failedCount > 0 && (
            <button
              onClick={handleFixAll}
              style={{
                padding: '10px 16px', borderRadius: 10, background: '#00F0FF', color: '#070A0F',
                fontWeight: 900, fontSize: 12, border: 'none', cursor: 'pointer', boxShadow: '0 0 16px rgba(0,240,255,0.3)',
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <RotateCcw style={{ width: 14, height: 14 }} /> AUTO-FIX ALL VIOLATIONS
            </button>
          )}
        </div>
      </div>

      {/* Rule Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {ruleList.map((r) => {
          const isFailed = r.status === 'FAILED';

          return (
            <div
              key={r.id}
              style={{
                background: '#0F1623',
                border: `2px solid ${isFailed ? '#FF0055' : '#1E293B'}`,
                borderRadius: 14,
                padding: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1, minWidth: 300 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: isFailed ? 'rgba(255,0,85,0.18)' : 'rgba(57,255,20,0.18)',
                  border: `1px solid ${isFailed ? '#FF0055' : '#39FF14'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {isFailed ? <XCircle style={{ width: 22, height: 22, color: '#FF0055' }} /> : <CheckCircle2 style={{ width: 22, height: 22, color: '#39FF14' }} />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 800, background: 'rgba(0,240,255,0.15)', color: '#00F0FF', padding: '2px 6px', borderRadius: 4 }}>
                      {r.code}
                    </span>
                    <span style={{ fontSize: 10, color: '#64748B' }}>
                      {r.standard}
                    </span>
                  </div>

                  <h3 style={{ margin: '2px 0 6px 0', fontSize: 15, fontWeight: 800, color: '#F8FAFC' }}>
                    {r.plainTitle}
                  </h3>

                  <p style={{ margin: 0, fontSize: 12, color: '#CBD5E1', lineHeight: 1.4 }}>
                    {r.issue}
                  </p>
                </div>
              </div>

              {/* Penalty badge & fix button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#64748B', fontWeight: 700 }}>FINANCIAL RISK</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: isFailed ? '#FF0055' : '#39FF14', fontFamily: 'monospace' }}>
                    {r.penalty}
                  </div>
                </div>

                {isFailed ? (
                  <button
                    onClick={() => handleFixRule(r.id)}
                    style={{
                      padding: '9px 16px', borderRadius: 8, background: '#FF0055', color: '#FFF',
                      fontWeight: 800, fontSize: 11, border: 'none', cursor: 'pointer', boxShadow: '0 0 14px rgba(255,0,85,0.3)',
                      display: 'flex', alignItems: 'center', gap: 6
                    }}
                  >
                    <RotateCcw style={{ width: 14, height: 14 }} /> FIX VIOLATION
                  </button>
                ) : (
                  <div style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(57,255,20,0.1)', color: '#39FF14', fontSize: 11, fontWeight: 800 }}>
                    ✓ RULE PASSED
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
