/**
 * API client for the Dependency Blackout FastAPI backend.
 * Falls back to mock data if the backend is unreachable.
 */

import { API_BASE_URL } from './constants';

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export interface RepoInfo {
  id: string;
  name: string;
  ecosystem: 'npm' | 'pypi' | 'maven';
  description: string;
  package_count: number;
  manifest_file: string;
}

export interface Dependency {
  name: string;
  version: string;
  is_flagged: boolean;
  risk_type: 'vulnerable' | 'deprecated' | 'malicious' | 'unavailable' | null;
  risk_summary: string | null;
  cve_id: string | null;
  cve_score: number | null;
}

export interface ScanResult {
  repo_id: string;
  total_packages: number;
  flagged_count: number;
  flagged_packages: Dependency[];
  all_packages: Dependency[];
}

export interface GraphNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  animated: boolean;
  style?: Record<string, unknown>;
  type?: string;
}

export interface DependencyGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ReplacementCandidate {
  name: string;
  version: string;
  confidence: number;
  rationale: string;
  weekly_downloads: string;
  last_updated: string;
  license: string;
  breaking_changes: boolean;
}

export interface ReplacementResult {
  original_package: string;
  original_version: string;
  risk_type: string;
  candidates: ReplacementCandidate[];
}

export interface DiffFile {
  filename: string;
  language: string;
  old_code: string;
  new_code: string;
}

export interface MigrationResult {
  original_package: string;
  replacement_package: string;
  replacement_version: string;
  files_changed: number;
  diffs: DiffFile[];
}

export interface TestCase {
  name: string;
  file: string;
  duration_ms: number;
  status: 'pass' | 'fail' | 'skip';
}

export interface VerificationResult {
  total_tests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration_ms: number;
  tests: TestCase[];
  overall_status: 'pass' | 'fail';
}

// ── API Methods ──────────────────────────────────────────────────────────

export const api = {
  getRepos: () => fetchAPI<RepoInfo[]>('/api/repos'),

  getDependencies: (repoId: string) =>
    fetchAPI<Dependency[]>(`/api/repos/${repoId}/dependencies`),

  scanRepo: (repoId: string) =>
    fetchAPI<ScanResult>(`/api/repos/${repoId}/scan`, { method: 'POST' }),

  getGraph: (repoId: string) =>
    fetchAPI<DependencyGraph>(`/api/repos/${repoId}/graph`),

  getReplacements: (ecosystem: string, packageName: string) =>
    fetchAPI<ReplacementResult>(`/api/packages/${ecosystem}/${packageName}/replacements`),

  migrate: (ecosystem: string, original: string, replacement: string) =>
    fetchAPI<MigrationResult>(
      `/api/migrate?ecosystem=${ecosystem}&original=${original}&replacement=${replacement}`,
      { method: 'POST' }
    ),

  verify: (repoId: string) =>
    fetchAPI<VerificationResult>(`/api/repos/${repoId}/verify`, { method: 'POST' }),
};
