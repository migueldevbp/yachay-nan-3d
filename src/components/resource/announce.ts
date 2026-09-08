import { describeDots, expandSpec } from '@/modules/braille';
import type { EducationalResource } from '@/types/content';
import type { ChannelFlags } from '@/components/resource/types';

type TFn = (key: string, vars?: Record<string, string | number>) => string;

export function buildResourceAnnouncement(
  resource: EducationalResource,
  flags: ChannelFlags,
  t: TFn,
): string {
  const parts: string[] = [];
  const name =
    resource.i18n.es?.name ??
    (resource.type === 'number'
      ? t('announceNumberName', { character: resource.character })
      : t('announceLetterName', { character: resource.character }));
  parts.push(name);

  const word = resource.associations[0]?.word;
  if (flags.word && word && resource.type !== 'number') {
    parts.push(t('announceWord', { character: resource.character, word }));
  }

  if (flags.braille) {
    const cells =
      resource.type === 'number'
        ? expandSpec(resource.braille)
        : [{ dots: resource.braille.dots }];
    const dots = cells
      .map((cell) => describeDots(cell.dots, 'es'))
      .join(', ');
    parts.push(t('announceBraille', { dots }));
  }

  return parts.join('. ');
}
