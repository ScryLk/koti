import fg from 'fast-glob';

export interface ScanSummary {
  totalFiles: number;
  byExt: Record<string, number>;
}

export async function scanProject(rootDir: string): Promise<ScanSummary> {
  const entries = await fg(['**/*.*', '!node_modules/**', '!.git/**'], {
    cwd: rootDir,
    dot: true,
    onlyFiles: true,
  });
  const byExt: Record<string, number> = {};
  for (const file of entries) {
    const ext = file.includes('.') ? file.split('.').pop() || '' : '';
    byExt[ext] = (byExt[ext] || 0) + 1;
  }
  return { totalFiles: entries.length, byExt };
}
