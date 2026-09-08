import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { ResourceGrid } from '@/components/resource/ResourceGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { useTranslation } from '@/i18n/useTranslation';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';
import { contentEngine } from '@/modules/content';
import { cx } from '@/utils/cx';
import type { CaseForm } from '@/types/content';

type SortMode = 'pedagogical' | 'alpha';
type CaseTab = Extract<CaseForm, 'uppercase' | 'lowercase'>;

const TABS: CaseTab[] = ['uppercase', 'lowercase'];

export function AlphabetPage() {
  const { t } = useTranslation('alphabet');
  const { preferences } = useAccessibility();
  const [tab, setTab] = useState<CaseTab>('uppercase');
  const [sort, setSort] = useState<SortMode>('pedagogical');
  const [onlyPieces, setOnlyPieces] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const tabRefs = useRef<Partial<Record<CaseTab, HTMLButtonElement | null>>>(
    {},
  );

  const items = useMemo(() => {
    let list = contentEngine
      .getSequence('letter')
      .filter((item) => item.caseForm === tab);
    if (onlyPieces) {
      list = list.filter((item) => item.vision.hasPhysicalPiece);
    }
    if (sort === 'alpha') {
      return [...list].sort((a, b) =>
        a.character.localeCompare(b.character, 'es'),
      );
    }
    return list;
  }, [onlyPieces, sort, tab]);

  useEffect(() => {
    setFocusedIndex(0);
  }, [tab, sort, onlyPieces]);

  const calm = preferences.density === 'calm';

  function selectTab(next: CaseTab) {
    setTab(next);
    tabRefs.current[next]?.focus();
  }

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>) {
    const index = TABS.indexOf(tab);
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      selectTab(TABS[(index + 1) % TABS.length] ?? 'uppercase');
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      selectTab(TABS[(index - 1 + TABS.length) % TABS.length] ?? 'uppercase');
    } else if (event.key === 'Home') {
      event.preventDefault();
      selectTab('uppercase');
    } else if (event.key === 'End') {
      event.preventDefault();
      selectTab('lowercase');
    }
  }

  return (
    <>
      <Breadcrumbs />
      <PageHeader title={t('title')} lead={t('lead')} />
      <div
        className="resource-tabs"
        role="tablist"
        aria-label={t('tabsLabel')}
      >
        {TABS.map((item) => {
          const selected = tab === item;
          return (
            <button
              key={item}
              ref={(node) => {
                tabRefs.current[item] = node;
              }}
              type="button"
              role="tab"
              id={`alphabet-tab-${item}`}
              aria-selected={selected}
              aria-controls={`alphabet-panel-${item}`}
              tabIndex={selected ? 0 : -1}
              className={cx(
                'resource-tabs__tab',
                selected && 'resource-tabs__tab--active',
              )}
              onClick={() => selectTab(item)}
              onKeyDown={onTabKey}
            >
              {item === 'uppercase' ? t('tabUppercase') : t('tabLowercase')}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`alphabet-panel-${tab}`}
        aria-labelledby={`alphabet-tab-${tab}`}
        className="resource-tabs__panel"
      >
        <div className="resource-toolbar">
          <Select
            label={t('sortLabel')}
            value={sort}
            onChange={setSort}
            options={[
              { value: 'pedagogical', label: t('sortPedagogical') },
              { value: 'alpha', label: t('sortAlpha') },
            ]}
          />
          <Toggle
            label={t('filterPieces')}
            description={t('filterPiecesHelp')}
            checked={onlyPieces}
            onChange={setOnlyPieces}
          />
        </div>
        {items.length === 0 ? (
          <EmptyState>{t('emptyFilter')}</EmptyState>
        ) : (
          <ResourceGrid
            items={items}
            label={calm ? t('listLabel') : t('gridLabel')}
            calm={calm}
            focusedIndex={focusedIndex}
            onFocusChange={setFocusedIndex}
          />
        )}
      </div>
    </>
  );
}
