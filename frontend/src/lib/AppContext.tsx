'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { rollbackPLC } from '@/lib/api';

interface AppState {
  socAlertCount: number;
  hasDrift: boolean;
  isRolledBack: boolean;
  setSocAlertCount: (n: number) => void;
  setHasDrift: (v: boolean) => void;
  isDemoMode: boolean;
  setIsDemoMode: (v: boolean) => void;
  userRole: string;
  setUserRole: (r: string) => void;
  executeGlobalRollback: (plcId?: string) => Promise<void>;
}

const AppContext = createContext<AppState>({
  socAlertCount: 2,
  hasDrift: true,
  isRolledBack: false,
  setSocAlertCount: () => {},
  setHasDrift: () => {},
  isDemoMode: false,
  setIsDemoMode: () => {},
  userRole: 'judge',
  setUserRole: () => {},
  executeGlobalRollback: async () => {},
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socAlertCount, setSocAlertCount] = useState(2);
  const [hasDrift, setHasDrift] = useState(true);
  const [isRolledBack, setIsRolledBack] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [userRole, setUserRole] = useState('judge');

  const executeGlobalRollback = useCallback(async (plcId: string = 'all') => {
    try {
      await rollbackPLC(plcId);
    } catch {
      // offline fallback handled inside rollbackPLC
    }
    setHasDrift(false);
    setSocAlertCount(0);
    setIsRolledBack(true);
  }, []);

  return (
    <AppContext.Provider value={{
      socAlertCount, setSocAlertCount,
      hasDrift, setHasDrift,
      isRolledBack,
      isDemoMode, setIsDemoMode,
      userRole, setUserRole,
      executeGlobalRollback,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

