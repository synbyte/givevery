'use client';
import { createContext, useContext, ReactNode } from 'react';

// Define the shape of your context data
interface NonprofitContextType {
  nonprofitId: string | undefined;
  connectedAccountId: string | undefined;
}

// Create context with the new type
export const NonprofitContext = createContext<NonprofitContextType | undefined>(undefined);

// Update provider props to include both values
interface NonprofitProviderProps {
  children: ReactNode;
  nonprofitId: string | undefined;
  connectedAccountId: string | undefined;
}

export function NonprofitProvider({ children, nonprofitId, connectedAccountId }: NonprofitProviderProps) {
  return (
    <NonprofitContext.Provider value={{ nonprofitId, connectedAccountId }}>
      {children}
    </NonprofitContext.Provider>
  );
}

export function useNonprofit() {
  const context = useContext(NonprofitContext);
  if (context === undefined) {
    throw new Error('useNonprofit must be used within a NonprofitProvider');
  }
  return context; // Now returns { nonprofitId, connectedAccountId }
}