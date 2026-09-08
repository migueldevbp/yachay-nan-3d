import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';

interface ConfirmNavigationValue {
  setActivityInProgress: (value: boolean) => void;
  confirmLeave: () => boolean;
  guardClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}

const ConfirmNavigationContext = createContext<ConfirmNavigationValue | null>(
  null,
);

export function useConfirmNavigation(): ConfirmNavigationValue {
  const value = useContext(ConfirmNavigationContext);
  if (!value) {
    return {
      setActivityInProgress: () => {},
      confirmLeave: () => true,
      guardClick: () => {},
    };
  }
  return value;
}

interface ConfirmNavigationProviderProps {
  children: ReactNode;
}

export function ConfirmNavigationProvider({
  children,
}: ConfirmNavigationProviderProps) {
  const { preferences } = useAccessibility();
  const { t } = useTranslation('common');
  const inProgress = useRef(false);

  const setActivityInProgress = useCallback((value: boolean) => {
    inProgress.current = value;
  }, []);

  const confirmLeave = useCallback(() => {
    if (!preferences.confirmNavigation || !inProgress.current) {
      return true;
    }
    return window.confirm(
      `${t('confirmLeaveTitle')}\n${t('confirmLeaveBody')}`,
    );
  }, [preferences.confirmNavigation, t]);

  const guardClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (!confirmLeave()) {
        event.preventDefault();
      }
    },
    [confirmLeave],
  );

  const value = useMemo(
    () => ({ setActivityInProgress, confirmLeave, guardClick }),
    [setActivityInProgress, confirmLeave, guardClick],
  );

  return (
    <ConfirmNavigationContext.Provider value={value}>
      {children}
    </ConfirmNavigationContext.Provider>
  );
}
