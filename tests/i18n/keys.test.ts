import { describe, expect, it } from 'vitest';
import { messages, NAMESPACES } from '@/i18n/config';
import { flattenLanguageCatalog, flattenMessages } from '@/i18n/catalog';

describe('claves de i18n', () => {
  it('es y qu tienen exactamente el mismo conjunto de claves', () => {
    const esKeys = Object.keys(flattenLanguageCatalog(messages.es)).sort();
    const quKeys = Object.keys(flattenLanguageCatalog(messages.qu)).sort();
    expect(quKeys).toEqual(esKeys);
  });

  it('ninguna clave de castellano está vacía', () => {
    const empty = Object.entries(flattenLanguageCatalog(messages.es))
      .filter(([, value]) => value.trim().length === 0)
      .map(([key]) => key);
    expect(empty).toEqual([]);
  });

  it('las claves de quechua están vacías a propósito', () => {
    const filled = Object.entries(flattenLanguageCatalog(messages.qu))
      .filter(([, value]) => value.trim().length > 0)
      .map(([key]) => key);
    expect(filled).toEqual([]);
  });

  it('cada namespace existe en ambos idiomas sin claves huérfanas', () => {
    for (const namespace of NAMESPACES) {
      const es = Object.keys(flattenMessages(messages.es[namespace])).sort();
      const qu = Object.keys(flattenMessages(messages.qu[namespace])).sort();
      expect(qu, namespace).toEqual(es);
    }
  });
});
