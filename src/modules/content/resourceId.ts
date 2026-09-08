import { contentEngine } from '@/modules/content/ContentEngine';
import type { EducationalResource, LanguageCode } from '@/types/content';

/**
 * Alias de IDs usados en URLs de demo / criterios.
 * No cambia el JSON: solo resuelve nombres amigables al id real.
 */
const ID_ALIASES: Record<string, string> = {
  'letter-a-uppercase': 'letter-upper-a',
};

export function resolveResourceId(id: string): string {
  return ID_ALIASES[id] ?? id;
}

export function getResourceByParam(
  id: string,
): EducationalResource | undefined {
  return contentEngine.getById(resolveResourceId(id));
}

export function resourcePath(id: string): string {
  return `/recurso/${id}`;
}

export function resourceDisplayName(
  resource: EducationalResource,
  language: LanguageCode = 'es',
): string {
  return (
    resource.i18n[language]?.name ??
    resource.i18n.es?.name ??
    resource.character
  );
}
