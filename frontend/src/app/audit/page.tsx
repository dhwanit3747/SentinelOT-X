'use client';
import React, { useState } from 'react';
import { History, UserX, UserCheck, Clock, Laptop, AlertOctagon, ShieldAlert, Ban, CheckCircle2 } from 'lucide-react';
import { JargonTooltip } from '@/components/ui/JargonTooltip';

const timelineEvents = [
  {
    id: 'EVT-901',
    user: 'j_doe (Contract Engineer)',
    avatar: 'JD',
    role: 'External Field Technician',
    time: '14 mins ago (09:14 AM)',
    device: 'Unrecognized Laptop (192.168.10.99)',
    action: 'Disabled Emergency Stop Interlock Coil in Siemens S7-1500 PLC DB1 memory register.',
    plainAction: 'Turned off Emergency Stop switch on Chemical Reactor mixer.',
    severity: 'SUSPICIOUS',
    behaviorScore: '89% (Highly Anomalous)',
    reason: 'Login outside normal shift hours; connected directly to field network bypass firewall.',
  },
  {
    id: 'EVT-898',
    user: 'j_doe (Contract Engineer)',
    avatar: 'JD',
    role: 'External Field Technician',
    time: '28 mins ago (09:00 AM)',
    device: 'Unrecognized Laptop (192.168.10.99)',
    action: 'Sent Modbus FC90 write command to Schneider M580 breaker PLC.',
    plainAction: 'Modified Substation Breaker trip delay setting.',
    severity: 'SUSPICIOUS',
    behaviorScore: '82% (Anomalous)',
    reason: 'First time accessing Substation Gamma controller from this MAC address.',
  },
  {
    id: 'EVT-850',
    user: 'e_rostova (Principal Architect)',
    avatar: 'ER',
    role: 'Internal Staff Engineer',
    time: '3 hours ago (06:30 AM)',
    device: 'Engineering Workstation WS-01',
    action: 'Executed SHA-256 cryptographic baseline verification.',
    plainAction: 'Ran daily automated factory health check.',
    severity: 'NORMAL',
    behaviorScore: '4% (Safe)',
    reason: 'Standard scheduled morning verification.',
  },
];

export default function UserAuditTrail() {
  const [blockedUser, setBlockedUser] = useState(false);

  const handleBlockUser = () => {
    setBlockedUser(true);
    alert('ACCOUNT BLOCKED: User "j_doe" account suspended and active session revoked!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#00F0FF', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase' }}>
          <JargonTooltip term="UEBA" plainTerm="User Activity Analysis" definition="AI system monitoring employee and contractor actions to spot logins at unusual times or unauthorized code edits." example="Flags a contractor logging in at 3 AM from an unknown laptop." />
        </div>
        <h1 style={{ margin: '4px 0 0 0', fontSize: 20, fontWeight: 900, color: '#F8FAFC' }}>
          User Activity & Access History
        </h1>
        <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#94A3B8' }}>
          Chronological story of user logins, machine code edits, and suspicious contractor actions.
        </p>
      </div>

      {/* Top Suspect Card */}
      <div style={{
        background: blockedUser ? 'rgba(57,255,20,0.08)' : 'rgba(255,0,85,0.12)',
        border: `2px solid ${blockedUser ? '#39FF14' : '#FF0055'}`,
        borderRadius: 14,
        padding: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: blockedUser ? 'rgba(57,255,20,0.2)' : 'rgba(255,0,85,0.2)',
            border: `2px solid ${blockedUser ? '#39FF14' : '#FF0055'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 900, color: blockedUser ? '#39FF14' : '#FF0055'
          }}>
            JD
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#F8FAFC' }}>
                Suspect Account: Contract Engineer "j_doe"
              </h2>
              <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontFamily: 'monospace', fontWeight: 800, background: blockedUser ? '#39FF14' : '#FF0055', color: '#000' }}>
                {blockedUser ? 'ACCOUNT BLOCKED' : 'HIGH BEHAVIOR RISK (89%)'}
              </span>
            </div>

            <p style={{ margin: 0, fontSize: 12, color: '#CBD5E1', lineHeight: 1.4 }}>
              Logged in from unregistered laptop <code>192.168.10.99</code> and executed 2 unauthorized machine code edits.
            </p>
          </div>
        </div>

        {!blockedUser ? (
          <button
            onClick={handleBlockUser}
            style={{
              padding: '10px 18px', borderRadius: 10, background: '#FF0055', color: '#FFF',
              fontWeight: 800, fontSize: 12, border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(255,0,85,0.4)',
              display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            <Ban style={{ width: 15, height: 15 }} /> BLOCK USER & REVOKE SESSION
          </button>
        ) : (
          <div style={{ padding: '8px 16px', background: 'rgba(57,255,20,0.15)', border: '1px solid #39FF14', borderRadius: 8, color: '#39FF14', fontWeight: 800, fontSize: 12 }}>
            ✓ Account Suspended
          </div>
        )}
      </div>

      {/* Activity Timeline Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          CHRONOLOGICAL ACTIVITY STORYLINE
        </div>

        {timelineEvents.map((evt) => {
          const isSuspicious = evt.severity === 'SUSPICIOUS';

          return (
            <div
              key={evt.id}
              style={{
                background: '#0F1623',
                border: `1px solid ${isSuspicious ? '#FF0055' : '#1E293B'}`,
                borderRadius: 14,
                padding: 16,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: isSuspicious ? 'rgba(255,0,85,0.15)' : 'rgba(0,240,255,0.15)',
                  border: `1px solid ${isSuspicious ? '#FF0055' : '#00F0FF'}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 12, color: isSuspicious ? '#FF0055' : '#00F0FF', flexShrink: 0
                }}>
                  {evt.avatar}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: '#F8FAFC' }}>{evt.user}</span>
                    <span style={{ fontSize: 10, color: '#64748B' }}>({evt.role})</span>
                    <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock style={{ width: 11, height: 11 }} /> {evt.time}
                    </span>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 700, color: isSuspicious ? '#FF0055' : '#00F0FF', marginBottom: 4 }}>
                    Action: {evt.plainAction}
                  </div>

                  <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace', marginBottom: 6 }}>
                    Technical detail: {evt.action}
                  </div>

                  <div style={{ fontSize: 11, color: '#CBD5E1', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: 6, display: 'inline-block' }}>
                    💡 <strong>AI Behavior Analysis:</strong> {evt.reason}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  padding: '3px 8px', borderRadius: 6, fontSize: 10, fontFamily: 'monospace', fontWeight: 800,
                  background: isSuspicious ? '#FF0055' : 'rgba(57,255,20,0.18)',
                  color: isSuspicious ? '#000' : '#39FF14'
                }}>
                  {evt.behaviorScore}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
