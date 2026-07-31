'use client';
import React, { useState } from 'react';
import {
  ShieldAlert, AlertTriangle, Laptop, ShieldOff, CheckCircle2, ChevronRight,
  Bot, Clock, ArrowRight, RotateCcw, Wrench, Ban
} from 'lucide-react';
import { JargonTooltip } from '@/components/ui/JargonTooltip';
import { useApp } from '@/lib/AppContext';

const alerts = [
  {
    id: 'ALT-1092',
    title: 'Emergency Stop Bypass Command Sent',
    plainTitle: 'Safety Button Disabled on Chemical Reactor',
    device: 'Siemens S7-1500 PLC (Chemical Mixer)',
    origin: 'Unrecognized Laptop (192.168.10.99)',
    time: '14 mins ago',
    severity: 'CRITICAL',
    story: 'An unregistered engineering laptop sent a command to set safety memory coil DB1.X0.2 to 0, disabling the floor Emergency Stop button.',
    threatLevel: 'Extreme Physical Hazard',
    suggestedFix: 'Execute 1-Click Rollback to approved baseline Hash 0x8F4A21.',
  },
  {
    id: 'ALT-1088',
    title: 'Unrecognized Modbus FC90 Write Operation',
    plainTitle: 'Unapproved Settings Sent to Substation Breaker',
    device: 'Schneider M580 (Power Substation)',
    origin: 'Unrecognized Laptop (192.168.10.99)',
    time: '28 mins ago',
    severity: 'HIGH',
    story: 'Industrial control protocol command forced power breaker trip delay from 50ms to 5,000ms, risking electrical fire.',
    threatLevel: 'High Electrical Danger',
    suggestedFix: 'Isolate laptop IP 192.168.10.99 at factory firewall.',
  },
];

export default function SOCAlertTriage() {
  const [selectedAlert, setSelectedAlert] = useState(alerts[0]);
  const [resolved, setResolved] = useState<string[]>([]);
  const { setSocAlertCount, executeGlobalRollback, isRolledBack, hasDrift } = useApp();

  const isAllResolved = isRolledBack || !hasDrift;
  const currentResolved = isAllResolved ? alerts.map(a => a.id) : resolved;

  const handleResolve = async (id: string) => {
    const next = resolved.includes(id) ? resolved : [...resolved, id];
    const remaining = alerts.length - next.length;
    setResolved(next);
    setSocAlertCount(remaining);
    if (remaining === 0) {
      await executeGlobalRollback('all');
    }
    alert(`✅ Alert ${id} resolved. Baseline restored & threat neutralised.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Top AI Investigator Summary */}
      <div style={{
        background: 'rgba(0,240,255,0.08)',
        border: '1px solid rgba(0,240,255,0.3)',
        borderRadius: 14,
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, background: 'rgba(0,240,255,0.15)',
          border: '1px solid #00F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Bot style={{ width: 22, height: 22, color: '#00F0FF' }} />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#00F0FF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            AI ALERT INVESTIGATOR SYNTHESIS
          </div>
          <p style={{ margin: '2px 0 0 0', fontSize: 13, color: '#F8FAFC', lineHeight: 1.5 }}>
            SentinelOT AI linked 2 active security events to <strong>1 rogue laptop (192.168.10.99)</strong>. The intruder disabled the Chemical Reactor Emergency Stop and modified Substation trip limits.
          </p>
        </div>
      </div>

      {/* Main Split Screen */}
      <div className="responsive-grid-2col" style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 20 }}>

        {/* Alert List Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Threat Events ({Math.max(0, alerts.length - currentResolved.length)})
          </div>

          {alerts.map((alt) => {
            const isSelected = selectedAlert.id === alt.id;
            const isResolved = currentResolved.includes(alt.id);

            return (
              <div
                key={alt.id}
                onClick={() => setSelectedAlert(alt)}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: isSelected ? '#0F1623' : 'rgba(15,22,35,0.5)',
                  border: `2px solid ${isSelected ? (alt.severity === 'CRITICAL' ? '#FF0055' : '#FFB800') : '#1E293B'}`,
                  cursor: 'pointer',
                  opacity: isResolved ? 0.5 : 1,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 800, background: alt.severity === 'CRITICAL' ? '#FF0055' : '#FFB800', color: '#000', padding: '2px 6px', borderRadius: 4 }}>
                    {isResolved ? 'RESOLVED' : alt.severity}
                  </span>
                  <span style={{ fontSize: 10, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock style={{ width: 11, height: 11 }} /> {alt.time}
                  </span>
                </div>

                <div style={{ fontWeight: 800, fontSize: 13, color: '#F8FAFC', marginBottom: 4 }}>
                  {alt.plainTitle}
                </div>

                <div style={{ fontSize: 11, color: '#00F0FF', fontWeight: 600 }}>
                  {alt.device}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Incident Canvas */}
        <div style={{
          background: '#0F1623',
          border: '1px solid #1E293B',
          borderRadius: 14,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: '#00F0FF', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase' }}>
                  INCIDENT INVESTIGATION CANVAS — {selectedAlert.id}
                </div>
                <h2 style={{ margin: '4px 0 0 0', fontSize: 18, fontWeight: 900, color: '#F8FAFC' }}>
                  {selectedAlert.plainTitle}
                </h2>
              </div>

              <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontFamily: 'monospace', fontWeight: 800, background: 'rgba(255,0,85,0.18)', color: '#FF0055', border: '1px solid #FF0055' }}>
                {selectedAlert.threatLevel}
              </span>
            </div>

            {/* Story Timeline */}
            <div style={{ background: '#040608', borderRadius: 12, padding: 16, border: '1px solid #1E293B', marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 10 }}>
                INCIDENT SEQUENCE OF EVENTS
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#CBD5E1' }}>
                  <Laptop style={{ width: 16, height: 16, color: '#FF0055' }} />
                  <strong>Origin:</strong> {selectedAlert.origin}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#CBD5E1' }}>
                  <ShieldOff style={{ width: 16, height: 16, color: '#FFB800' }} />
                  <strong>Target Machine:</strong> {selectedAlert.device}
                </div>
                <div style={{ fontSize: 12, color: '#94A3B8', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginTop: 4 }}>
                  "{selectedAlert.story}"
                </div>
              </div>
            </div>

            {/* AI Recommendation */}
            <div style={{ background: 'rgba(57,255,20,0.06)', borderRadius: 10, padding: 14, border: '1px solid rgba(57,255,20,0.25)', marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#39FF14', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 style={{ width: 14, height: 14 }} /> RECOMMENDED REMEDIATION
              </div>
              <div style={{ fontSize: 12, color: '#E2E8F0', fontWeight: 600 }}>
                {selectedAlert.suggestedFix}
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div style={{ display: 'flex', gap: 12, borderTop: '1px solid #1E293B', paddingTop: 16 }}>
            <button
              onClick={() => handleResolve(selectedAlert.id)}
              style={{
                flex: 1, padding: '12px', borderRadius: 10, background: '#00F0FF', color: '#070A0F',
                fontWeight: 900, fontSize: 13, border: 'none', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 0 18px rgba(0,240,255,0.3)'
              }}
            >
              <RotateCcw style={{ width: 16, height: 16 }} /> REVERT MACHINE CHANGES
            </button>

            <button
              onClick={() => alert(`IP ${selectedAlert.origin} blocked at firewall.`)}
              style={{
                padding: '12px 18px', borderRadius: 10, background: 'rgba(255,0,85,0.15)', color: '#FF0055',
                border: '1px solid #FF0055', fontWeight: 800, fontSize: 12, cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: 6
              }}
            >
              <Ban style={{ width: 15, height: 15 }} /> BLOCK LAPTOP IP
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
