import { useTranslation } from '@/i18n/useTranslation';

interface PieceIndicatorProps {
  visible: boolean;
}

export function PieceIndicator({ visible }: PieceIndicatorProps) {
  const { t } = useTranslation('alphabet');

  if (!visible) {
    return null;
  }

  return (
    <p className="resource-piece">
      <span className="resource-piece__mark" aria-hidden="true">
        {t('pieceMark')}
      </span>
      <span>{t('hasPiece')}</span>
      <span className="resource-piece__help">{t('hasPieceHelp')}</span>
    </p>
  );
}
