/**
 * Design tokens and configuration constants.
 * Matches the IBM-aligned design system.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const COLORS = {
  ibmBlue: '#0F62FE',
  ibmBlueHover: '#0043CE',
  surfacePrimary: '#FFFFFF',
  surfaceSecondary: '#F4F4F4',
  border: '#E0E0E0',
  textPrimary: '#161616',
  textSecondary: '#525252',
  danger: '#DA1E28',
  dangerBg: '#FFF1F1',
  warning: '#B28600',
  warningBg: '#FFF8E1',
  success: '#24A148',
  successBg: '#DEFBE6',
} as const;

export const SCAN_STAGES = [
  { id: 'parse', label: 'Parsing manifest…', duration: 800 },
  { id: 'check', label: 'Checking packages against known vulnerabilities…', duration: 1200 },
  { id: 'graph', label: 'Building dependency impact graph…', duration: 1000 },
  { id: 'rank', label: 'Ranking replacement candidates…', duration: 800 },
  { id: 'complete', label: 'Scan complete.', duration: 500 },
] as const;

export const PIPELINE_STEPS = [
  {
    id: 'detect',
    title: 'Detect',
    description: 'Scan package manifests against CVE databases, deprecation notices, and malware registries.',
    icon: 'Search',
  },
  {
    id: 'impact',
    title: 'Impact Graph',
    description: 'Trace every import chain to map which files, services, and endpoints are affected.',
    icon: 'GitBranch',
  },
  {
    id: 'replace',
    title: 'Replacement',
    description: 'AI ranks safe alternatives by API compatibility, community health, and migration cost.',
    icon: 'ArrowLeftRight',
  },
  {
    id: 'migrate',
    title: 'Migrate',
    description: 'Auto-rewrite imports, API calls, and configuration to the chosen replacement package.',
    icon: 'Code',
  },
  {
    id: 'test',
    title: 'Test',
    description: 'Run the existing test suite against the migrated code to catch regressions.',
    icon: 'FlaskConical',
  },
  {
    id: 'verify',
    title: 'Verify',
    description: 'End-to-end verification confirms the application still works as expected.',
    icon: 'ShieldCheck',
  },
] as const;
