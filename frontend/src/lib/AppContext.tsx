'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppState {
  socAlertCount: number;
  hasDrift: boolean;
  setSocAlertCount: (n: number) => void;
  setHasDrift: (v: boolean) => void;
  isDemoMode: boolean;
  setIsDemoMode: (v: boolean) => void;
  userRole: string;
  setUserRole: (r: string) => void;
}

const AppContext = createContext<AppState>({
  socAlertCount: 2,
  hasDrift: true,
  setSocAlertCount: () => {},
  setHasDrift: () => {},
  isDemoMode: false,
  setIsDemoMode: () => {},
  userRole: 'judge',
  setUserRole: () => {},
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socAlertCount, setSocAlertCount] = useState(2);
  const [hasDrift, setHasDrift] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [userRole, setUserRole] = useState('judge');

  return (
    <AppContext.Provider value={{
      socAlertCount, setSocAlertCount,
      hasDrift, setHasDrift,
      isDemoMode, setIsDemoMode,
      userRole, setUserRole,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
