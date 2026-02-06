export type Severity = 'error' | 'warning' | 'info';

export interface RegexPattern {
  id: string;
  language: string; // e.g., 'java', 'typescript'
  type: 'naming-convention' | 'structural-pattern' | 'code-style';
  scope: 'class' | 'interface' | 'file' | 'method' | 'variable';
  rule: string;
  pattern: string; // regex string
  examples?: {
    valid?: string[];
    invalid?: string[];
  };
  severity: Severity;
  auto_fix?: boolean | 'suggest';
}

export interface CheckViolation {
  filePath: string;
  line?: number;
  message: string;
  patternId: string;
  severity: Severity;
  details?: Record<string, unknown>;
}

export interface CheckResult {
  passedFiles: number;
  failedFiles: number;
  violations: CheckViolation[];
  score?: number; // 0-100
}
