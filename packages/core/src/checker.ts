import path from 'path';
import type { RegexPattern, CheckResult, CheckViolation } from '@kodi/shared';
import fg from 'fast-glob';

const languageExts: Record<string, string[]> = {
  java: ['.java'],
  typescript: ['.ts', '.tsx'],
  javascript: ['.js'],
  python: ['.py'],
};

function applyNamingPattern(files: string[], patterns: RegexPattern[]): CheckViolation[] {
  const violations: CheckViolation[] = [];
  const namingPatterns = patterns.filter(p => p.type === 'naming-convention' && !!p.pattern);
  for (const file of files) {
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    for (const pat of namingPatterns) {
      const exts = languageExts[pat.language] || [];
      if (exts.length && !exts.includes(ext)) continue; // only apply to matching language files
      const re = new RegExp(pat.pattern);
      if (!re.test(base)) {
        violations.push({
          filePath: file,
          message: `Naming violation: ${pat.rule}. Found: ${base}`,
          patternId: pat.id,
          severity: pat.severity,
        });
      }
    }
  }
  return violations;
}

export async function checkProject(rootDir: string, patterns: RegexPattern[]): Promise<CheckResult> {
  const files = await fg(['**/*.{java,ts,tsx,js,py}', '!node_modules/**', '!.git/**'], {
    cwd: rootDir,
    dot: true,
    onlyFiles: true,
  });
  const violations = applyNamingPattern(files, patterns);
  const failedFiles = new Set(violations.map(v => v.filePath)).size;
  const passedFiles = Math.max(files.length - failedFiles, 0);
  const score = files.length === 0 ? 100 : Math.round((passedFiles / files.length) * 100);
  return { passedFiles, failedFiles, violations, score };
}
