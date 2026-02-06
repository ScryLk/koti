import { promises as fs } from 'fs';
import type { Dirent } from 'fs';
import path from 'path';
import { parse } from 'yaml';
import type { RegexPattern } from '@kodi/shared';

export async function loadPatterns(patternsDir: string): Promise<RegexPattern[]> {
  const entries: Dirent[] = await fs.readdir(patternsDir, { withFileTypes: true }) as unknown as Dirent[];
  const files = entries.filter((e: Dirent) => e.isFile() && e.name.endsWith('.yaml'));
  const patterns: RegexPattern[] = [];
  for (const f of files) {
    const full = path.join(patternsDir, f.name);
    const content = await fs.readFile(full, 'utf8');
    const parsed = parse(content);
    if (parsed && parsed.id && parsed.pattern) {
      patterns.push(parsed as RegexPattern);
    }
  }
  return patterns;
}
