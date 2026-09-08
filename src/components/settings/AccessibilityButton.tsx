import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { AccessibilityPanel } from '@/components/settings/AccessibilityPanel';

export function AccessibilityButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Ajustes de accesibilidad
      </Button>
      <AccessibilityPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
