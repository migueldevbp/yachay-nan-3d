import type { AccessibilityPreferences } from '@/modules/accessibility/types';
import type { EducationalResource } from '@/types/content';
import type { ChannelFlags, ChannelId } from '@/components/resource/types';

export function resolveChannelFlags(
  resource: EducationalResource,
  preferences: AccessibilityPreferences,
  override?: Partial<Record<ChannelId, boolean>>,
): ChannelFlags {
  const association = resource.associations[0];
  const hasBraille =
    resource.braille.dots.length > 0 ||
    (resource.braille.prefixes?.length ?? 0) > 0 ||
    (resource.braille.extraCells?.length ?? 0) > 0;

  const flags: ChannelFlags = {
    character: true,
    braille: hasBraille && preferences.braille,
    word: Boolean(association?.word),
    image: Boolean(association?.imageUrl),
    sign: preferences.signLanguage,
    phoneme:
      Boolean(resource.phoneme) && preferences.instructionLength === 'full',
    speech: preferences.speech,
  };

  if (!override) {
    return flags;
  }

  for (const key of Object.keys(override) as ChannelId[]) {
    const value = override[key];
    if (value === false) {
      flags[key] = false;
    }
  }

  return flags;
}
