'use client';
import React, { useState } from 'react';
import {
  Bot, Send, X, RotateCcw, Sparkles, AlertTriangle, ChevronRight,
  Award, Cpu, DollarSign, Wrench, ShieldAlert
} from 'lucide-react';
import { queryAICopilot } from '@/lib/api';
import { AICopilotResponse } from '@/types';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteRollback?: () => void;
}

const PRESETS = [
  { label: '🚨 Safety Button Hazard', text: 'Explain why disabling the Emergency Stop on Machine 1 is dangerous' },
  { label: '💰 Financial Impact', text: 'What is the financial cost of this machine parameter change?' },
  { label: '🔄 Recommended Fix', text: 'Provide 5-perspective recommendation plan to fix Chemical Reactor' },
];

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({ isOpen, onClose, onExecuteRollback }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'simple' | 'tech' | 'biz' | 'eng' | 'op'>('simple');
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'ai';
    text: string;
    simple?: string;
    technical?: string;
    business?: string;
    engineerRec?: string;
    operatorRec?: string;
    data?: AICopilotResponse;
  }>>([
    {
      role: 'ai',
      text: 'Greetings. I am SentinelOT X AI Copilot. I analyze machine changes, calculate physical safety risks, and explain issues in 5 distinct perspectives.',
      simple: 'An unauthorized device changed Machine #1 settings. The floor Emergency Stop switch was turned off, putting the chemical reactor at risk of overheating.',
      technical: 'Siemens S7-1500 PLC (192.168.10.22) DB1.X0.2 coil was forced to 0 by rogue host 192.168.10.99 via Modbus write coil FC05.',
      business: 'Financial risk: $145,000 / hr downtime. Potential regulatory fine under IEC 62443 compliance failure: $50,000.',
      engineerRec: '1. Execute 1-click baseline rollback to Hash 0x8F4A21. 2. Bind MAC address 00:1B:44:11:3A to firewall whitelist.',
      operatorRec: 'Manually inspect Chemical Reactor Tank A-102. Ensure physical relief valve is unblocked before re-engaging auto mode.',
    }
  ]);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const text = customText || query;
    if (!text.trim()) return;
    setQuery('');
    setMessages(p => [...p, { role: 'user', text }]);
    setLoading(true);

    try {
      const res = await queryAICopilot(text);
      setMessages(p => [...p, {
        role: 'ai',
        text: res.answer,
        simple: `Simple Summary: ${res.answer.substring(0, 150)}... The system detected unauthorized setting overrides on critical factory controllers.`,
        technical: `Technical Details: Affected PLC Siemens S7-1500. Attack signature MITRE ${res.mitre_tactics.join(', ')}. AST logic drift score: ${res.confidence_score}%.`,
        business: `Business Impact: Operational downtime risk estimated at $145,000/hr. Breach of IEC 62443 safety compliance standard.`,
        engineerRec: `Engineer Action: ${res.recommended_action}. Verify ladder logic baseline integrity.`,
        operatorRec: `Operator Floor Action: Conduct visual inspection of physical pressure relief valves and verify local control panel emergency switch.`,
        data: res
      }]);
    } catch {
      setMessages(p => [...p, {
        role: 'ai',
        text: 'Operating in offline XAI fallback mode.',
        simple: 'Machine settings altered without permission. Emergency safety button bypassed.',
        technical: 'Offline fallback diagnosis. Unapproved Modbus write coil operation on PLC DB1 register.',
        business: '$145k/hr estimated downtime risk.',
        engineerRec: 'Perform 1-click rollback to approved version.',
        operatorRec: 'Verify physical emergency button state on shop floor.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'flex-end' }}
    >
      <div style={{
        width: 480, maxWidth: '95vw', background: 'var(--bg-card)',
        borderLeft: '2px solid var(--accent-cyan)',
        display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'hidden',
        boxShadow: '-20px 0 60px rgba(0,240,255,0.12)',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#070A0F' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(0,240,255,0.15)', border: '1px solid #00F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot style={{ width: 18, height: 18, color: '#00F0FF' }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 6 }}>
                SENTINELOT 5-TIER AI COPILOT <Sparkles style={{ width: 14, height: 14, color: '#00F0FF' }} />
              </div>
              <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#64748B' }}>5 Perspective Technical & Plain-Language AI</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 4 }}>
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {/* Presets */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #1E293B', display: 'flex', flexWrap: 'wrap', gap: 6, background: 'rgba(7,10,15,0.5)' }}>
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => handleSend(p.text)} style={{
              fontSize: 11, fontFamily: 'monospace', padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
              background: 'rgba(0,240,255,0.08)', color: '#00F0FF', border: '1px solid rgba(0,240,255,0.28)',
              fontWeight: 600,
            }}>{p.label}</button>
          ))}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'user' ? (
                <div style={{
                  maxWidth: '85%', padding: '10px 14px', borderRadius: 12, fontSize: 12, lineHeight: 1.5,
                  background: 'rgba(0,240,255,0.18)', border: '1px solid rgba(0,240,255,0.35)', color: '#F8FAFC', fontWeight: 600
                }}>
                  {msg.text}
                </div>
              ) : (
                <div style={{
                  width: '100%', borderRadius: 14, fontSize: 12, lineHeight: 1.6,
                  background: 'rgba(15,22,35,0.95)', border: '1px solid #1E293B', color: '#F8FAFC', overflow: 'hidden'
                }}>
                  {/* Primary summary */}
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid #1E293B', background: 'rgba(0,240,255,0.04)' }}>
                    <p style={{ margin: 0, fontSize: 12, color: '#E2E8F0', fontWeight: 500 }}>{msg.text}</p>
                  </div>

                  {/* 5 Perspective Tabs */}
                  {msg.simple && (
                    <div>
                      <div style={{ display: 'flex', borderBottom: '1px solid #1E293B', background: '#070A0F', overflowX: 'auto' }}>
                        {[
                          { id: 'simple', label: 'Judge / Simple', icon: Award, color: '#00F0FF' },
                          { id: 'tech', label: 'Technical', icon: Cpu, color: '#39FF14' },
                          { id: 'biz', label: 'Business', icon: DollarSign, color: '#FF0055' },
                          { id: 'eng', label: 'Engineer Rec', icon: Wrench, color: '#FFB800' },
                          { id: 'op', label: 'Operator Action', icon: ShieldAlert, color: '#A855F7' },
                        ].map((t) => {
                          const Icon = t.icon;
                          const active = activeTab === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => setActiveTab(t.id as any)}
                              style={{
                                flex: 1,
                                padding: '8px 6px',
                                border: 'none',
                                background: active ? 'rgba(15,22,35,0.95)' : 'transparent',
                                borderBottom: active ? `2px solid ${t.color}` : '2px solid transparent',
                                color: active ? t.color : '#64748B',
                                fontSize: 10,
                                fontWeight: active ? 800 : 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 4,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <Icon style={{ width: 12, height: 12 }} /> {t.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Perspective Content */}
                      <div style={{ padding: 14 }}>
                        {activeTab === 'simple' && (
                          <div style={{ background: 'rgba(0,240,255,0.08)', borderRadius: 10, padding: 12, border: '1px solid rgba(0,240,255,0.25)' }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#00F0FF', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Award style={{ width: 14, height: 14 }} /> 30-SECOND PLAIN ENGLISH SUMMARY
                            </div>
                            <div style={{ fontSize: 12, color: '#E2E8F0', lineHeight: 1.5 }}>{msg.simple}</div>
                          </div>
                        )}

                        {activeTab === 'tech' && (
                          <div style={{ background: 'rgba(57,255,20,0.08)', borderRadius: 10, padding: 12, border: '1px solid rgba(57,255,20,0.25)' }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#39FF14', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Cpu style={{ width: 14, height: 14 }} /> INDUSTRIAL CONTROL TECHNICAL DIAGNOSIS
                            </div>
                            <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#CBD5E1', lineHeight: 1.5 }}>{msg.technical}</div>
                          </div>
                        )}

                        {activeTab === 'biz' && (
                          <div style={{ background: 'rgba(255,0,85,0.08)', borderRadius: 10, padding: 12, border: '1px solid rgba(255,0,85,0.25)' }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#FF0055', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <DollarSign style={{ width: 14, height: 14 }} /> FINANCIAL & BUSINESS RISK
                            </div>
                            <div style={{ fontSize: 12, color: '#E2E8F0', lineHeight: 1.5 }}>{msg.business}</div>
                          </div>
                        )}

                        {activeTab === 'eng' && (
                          <div style={{ background: 'rgba(255,184,0,0.08)', borderRadius: 10, padding: 12, border: '1px solid rgba(255,184,0,0.25)' }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#FFB800', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Wrench style={{ width: 14, height: 14 }} /> ENGINEER CODE FIX RECOMMENDATION
                            </div>
                            <div style={{ fontSize: 12, color: '#E2E8F0', lineHeight: 1.5 }}>{msg.engineerRec}</div>
                            {onExecuteRollback && (
                              <button
                                onClick={onExecuteRollback}
                                style={{
                                  marginTop: 10, width: '100%', padding: '8px', borderRadius: 8,
                                  background: '#FFB800', color: '#070A0F', fontWeight: 800, fontSize: 11,
                                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                                }}
                              >
                                <RotateCcw style={{ width: 14, height: 14 }} /> TRIGGER 1-CLICK ROLLBACK NOW
                              </button>
                            )}
                          </div>
                        )}

                        {activeTab === 'op' && (
                          <div style={{ background: 'rgba(168,85,247,0.08)', borderRadius: 10, padding: 12, border: '1px solid rgba(168,85,247,0.25)' }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#A855F7', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <ShieldAlert style={{ width: 14, height: 14 }} /> OPERATOR SHOP FLOOR ACTION
                            </div>
                            <div style={{ fontSize: 12, color: '#E2E8F0', lineHeight: 1.5 }}>{msg.operatorRec}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#00F0FF', fontSize: 12 }}>
              <Sparkles style={{ width: 16, height: 16 }} className="animate-spin" /> SentinelOT AI Analyzing Safety Impact...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div style={{ padding: 16, borderTop: '1px solid #1E293B', background: '#070A0F' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AI Copilot (e.g., Explain why Machine 1 is unsafe)..."
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 10, background: '#0F1623',
                border: '1px solid #1E293B', color: '#F8FAFC', fontSize: 12, outline: 'none'
              }}
            />
            <button
              onClick={() => handleSend()}
              style={{
                padding: '10px 16px', borderRadius: 10, background: '#00F0FF', color: '#070A0F',
                fontWeight: 800, fontSize: 12, border: 'none', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}
            >
              <Send style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
