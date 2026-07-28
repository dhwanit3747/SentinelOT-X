'use client';
import React, { useState } from 'react';
import { HelpCircle, Info, CheckCircle2 } from 'lucide-react';

interface JargonTooltipProps {
  term: string;
  plainTerm: string;
  definition: string;
  example?: string;
  children?: React.ReactNode;
  badge?: string;
}

export const JargonTooltip: React.FC<JargonTooltipProps> = ({
  term,
  plainTerm,
  definition,
  example,
  children,
  badge
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'help' }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span style={{
        borderBottom: '1px dashed #00F0FF',
        color: '#F8FAFC',
        fontWeight: 600,
        transition: 'color 0.2s ease',
      }}>
        {children || plainTerm}
      </span>

      <HelpCircle style={{ width: 13, height: 13, color: '#00F0FF', opacity: 0.8 }} />

      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '125%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 280,
          background: '#0F1623',
          border: '1px solid #00F0FF',
          boxShadow: '0 8px 32px rgba(0, 240, 255, 0.25)',
          borderRadius: 12,
          padding: 14,
          zIndex: 9999,
          color: '#F8FAFC',
          fontSize: 12,
          lineHeight: 1.5,
          pointerEvents: 'none',
        }}>
          {/* Arrow */}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderWidth: 6,
            borderStyle: 'solid',
            borderColor: '#00F0FF transparent transparent transparent',
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#00F0FF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PLAIN ENGLISH EXPLANATION
            </span>
            {badge && (
              <span style={{ fontSize: 9, background: 'rgba(0,240,255,0.15)', color: '#00F0FF', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                {badge}
              </span>
            )}
          </div>

          <div style={{ fontWeight: 700, fontSize: 13, color: '#FFFFFF', marginBottom: 4 }}>
            {plainTerm} <span style={{ fontSize: 10, color: '#64748B', fontWeight: 400 }}>({term})</span>
          </div>

          <p style={{ margin: 0, color: '#CBD5E1', marginBottom: 8, fontSize: 11 }}>
            {definition}
          </p>

          {example && (
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '6px 8px', borderLeft: '2px solid #00F0FF' }}>
              <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Info style={{ width: 10, height: 10, color: '#00F0FF' }} /> Real-World Example:
              </div>
              <div style={{ fontSize: 11, color: '#E2E8F0', marginTop: 2 }}>
                "{example}"
              </div>
            </div>
          )}
        </div>
      )}
    </span>
  );
};
