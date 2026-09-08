import {
  messages,
  NAMESPACES,
  type Messages,
  type Namespace,
} from '@/i18n/config';
import type { InterpolationVars, LanguageCode } from '@/i18n/types';

export function interpolate(
  template: string,
  vars?: InterpolationVars,
): string {
  if (!vars) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (full, name: string) => {
    if (Object.prototype.hasOwnProperty.call(vars, name)) {
      return String(vars[name]);
    }
    return full;
  });
}

export function getByPath(source: unknown, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = source;

  for (const part of parts) {
    if (!current || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === 'string' ? current : undefined;
}

export function flattenMessages(
  value: unknown,
  prefix = '',
): Record<string, string> {
  if (typeof value === 'string') {
    return prefix ? { [prefix]: value } : {};
  }

  if (!value || typeof value !== 'object') {
    return {};
  }

  const out: Record<string, string> = {};
  for (const [key, nested] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    Object.assign(out, flattenMessages(nested, path));
  }
  return out;
}

export function flattenLanguageCatalog(
  catalog: Messages,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const namespace of NAMESPACES) {
    Object.assign(out, flattenMessages(catalog[namespace], namespace));
  }
  return out;
}

export function validationRatioFor(language: LanguageCode): number {
  const leaves = Object.values(flattenLanguageCatalog(messages[language]));
  if (leaves.length === 0) {
    return 0;
  }
  const filled = leaves.filter((value) => value.trim().length > 0).length;
  return Math.round((filled / leaves.length) * 100);
}

export function lookupMessage(
  language: LanguageCode,
  namespace: Namespace,
  key: string,
  vars: InterpolationVars | undefined,
  onFallback: (warning: string) => void,
): string {
  const local = getByPath(messages[language][namespace], key);
  if (local && local.trim().length > 0) {
    return interpolate(local, vars);
  }

  if (language !== 'es') {
    onFallback(
      `[i18n] Falta "${namespace}.${key}" en ${language}. Se usa castellano.`,
    );
    const fallback = getByPath(messages.es[namespace], key);
    if (fallback && fallback.trim().length > 0) {
      return interpolate(fallback, vars);
    }
  }

  return `${namespace}.${key}`;
}
