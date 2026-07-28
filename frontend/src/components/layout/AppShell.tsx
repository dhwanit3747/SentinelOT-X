'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { AICopilotDrawer } from '@/components/layout/AICopilotDrawer';
import { PresentationModeBar } from '@/components/layout/PresentationModeBar';
import { WelcomeWizardModal } from '@/components/layout/WelcomeWizardModal';
import { AppProvider } from '@/lib/AppContext';
import { BookOpen, X } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [userRole, setUserRole] = useState('Judge Mode');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const seen = localStorage.getItem('sentinel_wizard_seen');
      if (!seen) setShowWizard(true);
    } catch {}
  }, []);

  // Apply light/dark mode
  useEffect(() => {
    if (!mounted) return;
    if (isLightMode) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [isLightMode, mounted]);

  const handleWizardClose = useCallback((role: string) => {
    setShowWizard(false);
    try { localStorage.setItem('sentinel_wizard_seen', 'true'); } catch {}
    if (role === 'judge') setUserRole('Judge Mode');
    else if (role === 'engineer') setUserRole('Engineer Mode');
    else if (role === 'security') setUserRole('Security Mode');
  }, []);

  const glossaryTerms = [
    { tech: 'Logic Drift', plain: 'Unauthorized PLC Change', desc: 'Someone altered the computer program running plant equipment without approval.', ex: 'A hacker changed the cooling pump control program.' },
    { tech: 'Integrity Baseline', plain: 'Approved PLC Version', desc: 'The certified safe software version saved by senior engineers.', ex: 'The factory backup saved yesterday at 9:00 AM.' },
    { tech: 'Hash Comparison', plain: 'Security Verification', desc: 'A digital fingerprint check ensuring code was not tampered with.', ex: 'Comparing digital fingerprints to spot hidden changes.' },
    { tech: 'Diff Viewer', plain: 'What Changed?', desc: 'Side-by-side comparison of safe code vs modified code.', ex: 'Line 12: Emergency stop switch turned OFF.' },
    { tech: 'Risk Engine', plain: 'Threat Assessment', desc: 'Automated safety system calculating physical damage potential.', ex: 'Score 94.5/100 = Critical physical danger!' },
    { tech: 'UEBA', plain: 'User Activity Analysis', desc: 'AI monitoring suspicious employee or contractor behavior.', ex: 'User logged in at 3 AM from an unknown laptop.' },
    { tech: 'Configuration Drift', plain: 'Settings Changed', desc: 'Machine operational parameters changed outside approved limits.', ex: 'Pressure threshold raised from 50 to 120 PSI.' },
    { tech: 'Audit Trail', plain: 'Activity History', desc: 'Full log of who did what and when inside the system.', ex: 'Engineer plugged in a USB at 09:14 AM.' },
  ];

  return (
    <AppProvider>
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-main)',
        color: 'var(--text-main)',
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        transition: 'background-color 0.25s ease, color 0.25s ease',
      }}>
        <Header
          onToggleCopilot={() => setIsCopilotOpen(v => !v)}
          isCopilotOpen={isCopilotOpen}
          onToggleLightMode={() => setIsLightMode(v => !v)}
          isLightMode={isLightMode}
          onOpenGlossary={() => setShowGlossary(true)}
          onOpenWizard={() => setShowWizard(true)}
          userRole={userRole}
          onToggleSidebar={() => setIsMobileSidebarOpen(v => !v)}
          isSidebarOpen={isMobileSidebarOpen}
        />

        <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', position: 'relative' }}>
          {/* Mobile Sidebar Overlay Backdrop */}
          {isMobileSidebarOpen && (
            <div
              onClick={() => setIsMobileSidebarOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 90,
                background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
              }}
            />
          )}

          <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

          <main className="main-content" style={{ flex: 1, padding: 24, overflowY: 'auto', minWidth: 0, maxWidth: 1280, margin: '0 auto', width: '100%' }}>
            <PresentationModeBar onOpenCopilot={() => setIsCopilotOpen(true)} />
            {children}
          </main>
        </div>

        {mounted && (
          <>
            {/* AI Copilot Drawer */}
            <AICopilotDrawer
              isOpen={isCopilotOpen}
              onClose={() => setIsCopilotOpen(false)}
              onExecuteRollback={() => {
                alert('ONE-CLICK ROLLBACK EXECUTED: Siemens S7-1500 approved baseline restored. Emergency Stop interlocks re-engaged!');
              }}
            />

            {/* Welcome Wizard */}
            <WelcomeWizardModal isOpen={showWizard} onClose={handleWizardClose} />

            {/* Plain English Dictionary */}
            {showGlossary && (
              <div style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
              }}>
                <div style={{
                  width: '100%', maxWidth: 640,
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                  borderRadius: 16, padding: 20,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                  color: 'var(--text-main)', maxHeight: '85vh', overflowY: 'auto',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <BookOpen style={{ width: 20, height: 20, color: 'var(--accent-amber)' }} />
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>
                        Plain English Cybersecurity Dictionary
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowGlossary(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, lineHeight: 1 }}
                    >
                      <X style={{ width: 22, height: 22 }} />
                    </button>
                  </div>

                  <p style={{ fontSize: 13, color: 'var(--text-slate)', marginBottom: 16, lineHeight: 1.5 }}>
                    This platform monitors industrial factory control computers (PLCs). Here is what every technical term means in plain language:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {glossaryTerms.map(g => (
                      <div key={g.tech} style={{
                        background: 'var(--bg-inner)', border: '1px solid var(--border-color)',
                        borderRadius: 10, padding: 12,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-cyan)' }}>{g.plain}</span>
                          <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-muted)', marginLeft: 8 }}>({g.tech})</span>
                        </div>
                        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-slate)', lineHeight: 1.4 }}>{g.desc}</p>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>
                          Example: "{g.ex}"
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowGlossary(false)}
                    style={{
                      width: '100%', marginTop: 20, padding: '11px 0', borderRadius: 10,
                      border: 'none', background: 'var(--accent-cyan)', color: '#000',
                      fontWeight: 800, fontSize: 13, cursor: 'pointer',
                    }}
                  >
                    GOT IT — CLOSE DICTIONARY
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppProvider>
  );
}
