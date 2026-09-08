import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n/useTranslation';
import type { EducationalResource } from '@/types/content';

interface ResourceNavigatorProps {
  previous?: EducationalResource;
  next?: EducationalResource;
  onPrevious: () => void;
  onNext: () => void;
}

export function ResourceNavigator({
  previous,
  next,
  onPrevious,
  onNext,
}: ResourceNavigatorProps) {
  const { t } = useTranslation('alphabet');

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA')
      ) {
        return;
      }
      if (event.key === 'ArrowLeft' && previous) {
        event.preventDefault();
        onPrevious();
      }
      if (event.key === 'ArrowRight' && next) {
        event.preventDefault();
        onNext();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, onNext, onPrevious, previous]);

  return (
    <div className="resource-navigator">
      <Button variant="secondary" onClick={onPrevious} disabled={!previous}>
        {previous
          ? t('previousNamed', { character: previous.character })
          : t('previous')}
      </Button>
      <Button variant="secondary" onClick={onNext} disabled={!next}>
        {next ? t('nextNamed', { character: next.character }) : t('next')}
      </Button>
    </div>
  );
}
