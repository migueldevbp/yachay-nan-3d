import { useTranslation } from '@/i18n/useTranslation';
import type { ResourceAssociation } from '@/types/content';

interface AssociationDisplayProps {
  association?: ResourceAssociation;
  showImage: boolean;
}

export function AssociationDisplay({
  association,
  showImage,
}: AssociationDisplayProps) {
  const { t } = useTranslation('alphabet');

  if (!association?.word) {
    return null;
  }

  return (
    <div className="resource-association">
      <p className="resource-association__word">
        {t('associatedWord', { word: association.word })}
      </p>
      {showImage && association.imageUrl ? (
        <img
          src={association.imageUrl}
          alt={association.imageAlt}
          className="resource-association__image"
        />
      ) : null}
    </div>
  );
}
