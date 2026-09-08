import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { findHardcodedText } from './hardcodedText';

const here = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(here, '../../src');

function walkTsx(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkTsx(full));
    } else if (entry.name.endsWith('.tsx')) {
      files.push(full);
    }
  }
  return files;
}

describe('sin texto hardcodeado en JSX', () => {
  it('detecta un literal si se introduce a propósito', () => {
    const hits = findHardcodedText('<p>Hola mundo</p>', 'probe.tsx');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]?.excerpt).toContain('Hola');
  });

  it('acepta texto que viene de t() y símbolos de la lista blanca', () => {
    const sample = `
      <h1>{t('title')}</h1>
      <IconButton aria-label={t('close')}>×</IconButton>
      <span>{'2'}</span>
      <span>⠿</span>
    `;
    expect(findHardcodedText(sample, 'ok.tsx')).toEqual([]);
  });

  it('no encuentra literales visibles en pages, components ni app', () => {
    const roots = ['pages', 'components', 'app'].map((folder) =>
      join(srcRoot, folder),
    );
    const files = roots.flatMap((root) => walkTsx(root));
    const hits = files.flatMap((file) =>
      findHardcodedText(readFileSync(file, 'utf8'), relative(srcRoot, file)),
    );

    expect(hits).toEqual([]);
  });
});
