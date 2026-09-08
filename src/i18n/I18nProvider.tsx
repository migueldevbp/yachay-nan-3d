import { createContext, useMemo, useRef, type ReactNode } from 'react';

interface I18nContextValue {
  warnedKeys: Set<string>;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const warnedKeys = useRef(new Set<string>());
  const value = useMemo(() => ({ warnedKeys: warnedKeys.current }), []);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
