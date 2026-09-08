import { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { ResourceGrid } from '@/components/resource/ResourceGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { useTranslation } from '@/i18n/useTranslation';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';
import { contentEngine } from '@/modules/content';

type SortMode = 'pedagogical' | 'alpha';

export function NumbersPage() {
  const { t } = useTranslation('numbers');
  const { t: tAlphabet } = useTranslation('alphabet');
  const { preferences } = useAccessibility();
  const [sort, setSort] = useState<SortMode>('pedagogical');
  const [onlyPieces, setOnlyPieces] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const items = useMemo(() => {
    let list = contentEngine.getSequence('number');
    if (onlyPieces) {
      list = list.filter((item) => item.vision.hasPhysicalPiece);
    }
    if (sort === 'alpha') {
      return [...list].sort((a, b) =>
        a.character.localeCompare(b.character, 'es'),
      );
    }
    return list;
  }, [onlyPieces, sort]);

  useEffect(() => {
    setFocusedIndex(0);
  }, [sort, onlyPieces]);

  const calm = preferences.density === 'calm';

  return (
    <>
      <Breadcrumbs />
      <PageHeader title={t('title')} lead={t('lead')} />
      <div className="resource-toolbar">
        <Select
          label={tAlphabet('sortLabel')}
          value={sort}
          onChange={setSort}
          options={[
            { value: 'pedagogical', label: tAlphabet('sortPedagogical') },
            { value: 'alpha', label: tAlphabet('sortAlpha') },
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
    </>
  );
}
