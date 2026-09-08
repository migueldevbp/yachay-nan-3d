import { AccessibilityProvider } from '@/modules/accessibility/AccessibilityProvider';
import { I18nProvider } from '@/i18n/I18nProvider';
import { AppLayout } from '@/app/AppLayout';

export function App() {
  return (
    <AccessibilityProvider>
      <I18nProvider>
        <AppLayout />
      </I18nProvider>
    </AccessibilityProvider>
  );
}
