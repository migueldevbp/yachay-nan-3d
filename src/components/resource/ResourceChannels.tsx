import { BrailleString } from '@/components/braille/BrailleString';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { AssociationDisplay } from '@/components/resource/AssociationDisplay';
import { CharacterDisplay } from '@/components/resource/CharacterDisplay';
import { PhonemeDisplay } from '@/components/resource/PhonemeDisplay';
import { describeDots, expandSpec } from '@/modules/braille';
import { useTranslation } from '@/i18n/useTranslation';
import type { EducationalResource } from '@/types/content';
import type {
  ChannelFlags,
  ResourceCardVariant,
} from '@/components/resource/types';

interface ResourceChannelsProps {
  resource: EducationalResource;
  variant: ResourceCardVariant;
  flags: ChannelFlags;
  onListen?: () => void;
}

export function ResourceChannels({
  resource,
  variant,
  flags,
  onListen,
}: ResourceChannelsProps) {
  const { t } = useTranslation('alphabet');
  const association = resource.associations[0];
  const brailleCells = expandSpec(resource.braille).map((cell) => cell.dots);
  const brailleText = brailleCells
    .map((dots) => describeDots(dots, 'es'))
    .join('; ');

  return (
    <div className="resource-channels">
      {flags.character ? (
        <CharacterDisplay character={resource.character} variant={variant} />
      ) : null}

      {flags.word || flags.image ? (
        <AssociationDisplay
          association={association}
          showImage={flags.image}
        />
      ) : null}

      {flags.braille ? (
        <div className="resource-braille">
          <p className="resource-braille__text">
            {t('brailleLabel', { dots: brailleText })}
          </p>
          <BrailleString
            spec={resource.braille}
            size={variant === 'compact' ? 'sm' : 'lg'}
          />
        </div>
      ) : null}

      {flags.sign ? (
        <div className="resource-sign">
          {resource.media.sign ? (
            <p>{resource.media.sign.description}</p>
          ) : (
            <p>
              <StatusBadge status="pending" /> {t('signPending')}
            </p>
          )}
        </div>
      ) : null}

      {flags.phoneme && resource.phoneme ? (
        <PhonemeDisplay phoneme={resource.phoneme} />
      ) : null}

      {flags.speech && variant !== 'compact' ? (
        <Button variant="secondary" onClick={onListen}>
          {t('listen')}
        </Button>
      ) : null}
    </div>
  );
}
