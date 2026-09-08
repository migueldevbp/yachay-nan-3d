import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@/app/routes';
import { useTranslation } from '@/i18n/useTranslation';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';
import { cx } from '@/utils/cx';

export type BrailleTab = 'explorer' | 'reference' | 'practice' | 'writing';

interface BrailleTabsProps {
  current: BrailleTab;
  onSelect?: (tab: Exclude<BrailleTab, 'writing'>) => void;
}

const ORDER: BrailleTab[] = ['explorer', 'reference', 'practice', 'writing'];

export function BrailleTabs({ current, onSelect }: BrailleTabsProps) {
  const { t } = useTranslation('braille');
  const { say } = useAccessibility();
  const navigate = useNavigate();

  const tabs: Array<{ id: BrailleTab; label: string }> = [
    { id: 'explorer', label: t('tabExplorer') },
    { id: 'reference', label: t('tabReference') },
    { id: 'practice', label: t('tabPractice') },
    { id: 'writing', label: t('tabWriting') },
  ];

  function select(next: BrailleTab) {
    const label = tabs.find((item) => item.id === next)?.label;
    if (label) {
      say(label);
    }
    if (next === 'writing') {
      navigate(ROUTE_PATHS.brailleWriting);
      return;
    }
    if (current === 'writing') {
      navigate(ROUTE_PATHS.braille);
    }
    onSelect?.(next);
  }

  return (
    <div className="braille-tabs" role="tablist" aria-label={t('title')}>
      {tabs.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          id={`braille-tab-${item.id}`}
          aria-selected={current === item.id}
          aria-controls={`braille-panel-${item.id}`}
          tabIndex={current === item.id ? 0 : -1}
          className={cx(
            'braille-tabs__tab',
            current === item.id && 'braille-tabs__tab--active',
          )}
          onClick={() => select(item.id)}
          onKeyDown={(event) => {
            const index = ORDER.indexOf(current);
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
              event.preventDefault();
              select(ORDER[(index + 1) % ORDER.length] ?? 'explorer');
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
              event.preventDefault();
              select(
                ORDER[(index - 1 + ORDER.length) % ORDER.length] ?? 'explorer',
              );
            } else if (event.key === 'Home') {
              event.preventDefault();
              select('explorer');
            } else if (event.key === 'End') {
              event.preventDefault();
              select('writing');
            }
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
