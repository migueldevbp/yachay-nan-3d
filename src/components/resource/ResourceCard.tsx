import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { PieceIndicator } from '@/components/resource/PieceIndicator';
import { ResourceChannels } from '@/components/resource/ResourceChannels';
import { buildResourceAnnouncement } from '@/components/resource/announce';
import { resolveChannelFlags } from '@/components/resource/channels';
import type { ResourceCardProps } from '@/components/resource/types';
import { useTranslation } from '@/i18n/useTranslation';
import { resourceDisplayName } from '@/modules/content/resourceId';
import { useAccessibility } from '@/modules/accessibility/useAccessibility';
import { cx } from '@/utils/cx';

export function ResourceCard({
  resource,
  variant,
  channels,
  onAction,
  autoAnnounce = false,
  confidence,
  source,
}: ResourceCardProps) {
  const { t, language } = useTranslation('alphabet');
  const { preferences, say } = useAccessibility();
  const flags = resolveChannelFlags(resource, preferences, channels);
  const announced = useRef<string | null>(null);
  const cardRef = useRef<HTMLElement>(null);
  const name = resourceDisplayName(resource, language);

  const announcement = buildResourceAnnouncement(
    resource,
    flags,
    (key, vars) => t(key as 'announceBraille', vars),
  );

  function listen() {
    say(announcement);
    onAction?.({ type: 'listen' });
  }

  useEffect(() => {
    if (!autoAnnounce) {
      return;
    }
    const key = resource.id;
    if (announced.current === key) {
      return;
    }
    announced.current = key;
    say(announcement);
  }, [announcement, autoAnnounce, resource.id, say]);

  useEffect(() => {
    if (variant === 'recognition') {
      cardRef.current?.focus();
    }
  }, [resource.id, variant]);

  const sourceKey =
    source === 'model'
      ? 'source_model'
      : source === 'fiducial'
        ? 'source_fiducial'
        : source === 'manual'
          ? 'source_manual'
          : null;

  return (
    <Card
      ref={cardRef}
      tabIndex={variant === 'recognition' ? -1 : undefined}
      className={cx('resource-card', `resource-card--${variant}`)}
    >
      <p
        className={cx(
          'resource-card__title',
          variant === 'compact' && 'ui-visually-hidden',
        )}
      >
        {name}
      </p>
      <ResourceChannels
        resource={resource}
        variant={variant}
        flags={flags}
        onListen={listen}
      />
      <PieceIndicator visible={resource.vision.hasPhysicalPiece} />
      {variant === 'recognition' ? (
        <div className="resource-card__recognition">
          {confidence == null ? null : (
            <p>
              {t('confidenceValue', { value: Math.round(confidence * 100) })}
            </p>
          )}
          {sourceKey ? <p>{t(sourceKey)}</p> : null}
        </div>
      ) : null}
    </Card>
  );
}
