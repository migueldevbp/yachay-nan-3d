const VISIBLE_ATTRS = [
  'aria-label',
  'aria-description',
  'title',
  'alt',
  'placeholder',
  'label',
  'legend',
  'description',
  'valueText',
] as const;

export interface HardcodedHit {
  file: string;
  excerpt: string;
}

function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

export function isAllowedLiteral(text: string): boolean {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  if (!trimmed) {
    return true;
  }

  const withoutBraille = trimmed.replace(/[\u2800-\u28FF]/g, '').trim();
  if (!withoutBraille) {
    return true;
  }

  return !/\p{L}/u.test(withoutBraille);
}

function pushHit(
  hits: HardcodedHit[],
  file: string,
  excerpt: string,
) {
  if (!isAllowedLiteral(excerpt)) {
    hits.push({ file, excerpt: excerpt.trim() });
  }
}

export function findHardcodedText(source: string, file = 'snippet.tsx'): HardcodedHit[] {
  const cleaned = stripComments(source);
  const hits: HardcodedHit[] = [];

  const tagText = /<([A-Za-z][\w.-]*)\b[^>]*>([^<>]*?)<\/\1>/g;
  let match: RegExpExecArray | null;
  while ((match = tagText.exec(cleaned)) !== null) {
    const inner = match[2] ?? '';
    if (inner.includes('{')) {
      continue;
    }
    pushHit(hits, file, inner);
  }

  const fragmentText = /<>([^<>{]+)<\/>/g;
  while ((match = fragmentText.exec(cleaned)) !== null) {
    pushHit(hits, file, match[1] ?? '');
  }

  for (const attr of VISIBLE_ATTRS) {
    const quoted = new RegExp(`\\b${attr}\\s*=\\s*['"]([^'"]+)['"]`, 'g');
    while ((match = quoted.exec(cleaned)) !== null) {
      pushHit(hits, file, match[1] ?? '');
    }
  }

  const sayLiteral = /\bsay\(\s*['"`]([^'"`]+)['"`]/g;
  while ((match = sayLiteral.exec(cleaned)) !== null) {
    pushHit(hits, file, match[1] ?? '');
  }

  const jsxStringChild = />\s*\{\s*['"`]([^'"`]+)['"`]\s*\}\s*</g;
  while ((match = jsxStringChild.exec(cleaned)) !== null) {
    pushHit(hits, file, match[1] ?? '');
  }

  return hits;
}
