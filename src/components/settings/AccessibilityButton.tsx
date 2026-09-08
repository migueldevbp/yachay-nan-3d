import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { AccessibilityPanel } from '@/components/settings/AccessibilityPanel';
import { useTranslation } from '@/i18n/useTranslation';

export function AccessibilityButton() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('navigation');

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {t('settings')}
      </Button>
      <AccessibilityPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
