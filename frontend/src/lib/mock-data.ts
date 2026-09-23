/**
 * Fallback mock data used when the backend is unreachable.
 * Mirrors the backend's sample_repos and graph_builder output
 * so the frontend can demo fully offline.
 */

import type {
  RepoInfo,
  ScanResult,
  DependencyGraph,
  ReplacementResult,
  MigrationResult,
  VerificationResult,
} from './api';

/* ── Repos ─────────────────────────────────────────────────────────────── */

export const MOCK_REPOS: RepoInfo[] = [
  {
    id: 'acme-storefront',
    name: 'acme-commerce/storefront',
    ecosystem: 'npm',
    description: 'Node.js e-commerce storefront',
    package_count: 8,
    manifest_file: 'package.json',
  },
  {
    id: 'acme-pipeline',
    name: 'acme-analytics/data-pipeline',
    ecosystem: 'pypi',
    description: 'Python analytics data pipeline',
    package_count: 7,
    manifest_file: 'requirements.txt',
  },
];

/* ── Scan Results ─────────────────────────────────────────────────────── */

export const MOCK_SCAN_RESULTS: Record<string, ScanResult> = {
  'acme-storefront': {
    repo_id: 'acme-storefront',
    total_packages: 8,
    flagged_count: 2,
    flagged_packages: [
      {
        name: 'event-stream',
        version: '3.3.6',
        is_flagged: true,
        risk_type: 'malicious',
        risk_summary:
          'Backdoor via flatmap-stream dependency targeting Bitcoin wallets (Nov 2018)',
        cve_id: null,
        cve_score: null,
      },
      {
        name: 'moment',
        version: '2.29.1',
        is_flagged: true,
        risk_type: 'deprecated',
        risk_summary:
          'Project in maintenance mode since Sept 2020. 290KB unparsed.',
        cve_id: null,
        cve_score: null,
      },
    ],
    all_packages: [
      { name: 'express', version: '4.18.2', is_flagged: false, risk_type: null, risk_summary: null, cve_id: null, cve_score: null },
      { name: 'react', version: '18.2.0', is_flagged: false, risk_type: null, risk_summary: null, cve_id: null, cve_score: null },
      { name: 'next', version: '14.0.4', is_flagged: false, risk_type: null, risk_summary: null, cve_id: null, cve_score: null },
      { name: 'axios', version: '1.6.2', is_flagged: false, risk_type: null, risk_summary: null, cve_id: null, cve_score: null },
      { name: 'lodash', version: '4.17.21', is_flagged: false, risk_type: null, risk_summary: null, cve_id: null, cve_score: null },
      { name: 'dotenv', version: '16.3.1', is_flagged: false, risk_type: null, risk_summary: null, cve_id: null, cve_score: null },
      {
        name: 'event-stream',
        version: '3.3.6',
        is_flagged: true,
        risk_type: 'malicious',
        risk_summary: 'Backdoor via flatmap-stream dependency targeting Bitcoin wallets (Nov 2018)',
        cve_id: null,
        cve_score: null,
      },
      {
        name: 'moment',
        version: '2.29.1',
        is_flagged: true,
        risk_type: 'deprecated',
        risk_summary: 'Project in maintenance mode since Sept 2020. 290KB unparsed.',
        cve_id: null,
        cve_score: null,
      },
    ],
  },
  'acme-pipeline': {
    repo_id: 'acme-pipeline',
    total_packages: 7,
    flagged_count: 2,
    flagged_packages: [
      {
        name: 'pyyaml',
        version: '5.3',
        is_flagged: true,
        risk_type: 'vulnerable',
        risk_summary:
          'Arbitrary code execution via yaml.load() without Loader',
        cve_id: 'CVE-2020-14343',
        cve_score: 9.8,
      },
      {
        name: 'requests',
        version: '2.6.0',
        is_flagged: true,
        risk_type: 'vulnerable',
        risk_summary:
          'Session data leaked on HTTP redirects from HTTPS',
        cve_id: 'CVE-2018-18074',
        cve_score: 7.5,
      },
    ],
    all_packages: [
      { name: 'flask', version: '3.0.0', is_flagged: false, risk_type: null, risk_summary: null, cve_id: null, cve_score: null },
      { name: 'pandas', version: '2.1.4', is_flagged: false, risk_type: null, risk_summary: null, cve_id: null, cve_score: null },
      { name: 'numpy', version: '1.26.2', is_flagged: false, risk_type: null, risk_summary: null, cve_id: null, cve_score: null },
      { name: 'sqlalchemy', version: '2.0.23', is_flagged: false, risk_type: null, risk_summary: null, cve_id: null, cve_score: null },
      { name: 'celery', version: '5.3.6', is_flagged: false, risk_type: null, risk_summary: null, cve_id: null, cve_score: null },
      {
        name: 'pyyaml',
        version: '5.3',
        is_flagged: true,
        risk_type: 'vulnerable',
        risk_summary: 'Arbitrary code execution via yaml.load() without Loader',
        cve_id: 'CVE-2020-14343',
        cve_score: 9.8,
      },
      {
        name: 'requests',
        version: '2.6.0',
        is_flagged: true,
        risk_type: 'vulnerable',
        risk_summary: 'Session data leaked on HTTP redirects from HTTPS',
        cve_id: 'CVE-2018-18074',
        cve_score: 7.5,
      },
    ],
  },
};

/* ── Graphs (React Flow nodes + edges) ────────────────────────────────── */

export const MOCK_GRAPHS: Record<string, DependencyGraph> = {
  'acme-storefront': {
    nodes: [
      { id: 'repo', type: 'custom', position: { x: 0, y: 200 }, data: { label: 'acme-storefront', nodeType: 'repo' } },
      { id: 'express', type: 'custom', position: { x: 250, y: 50 }, data: { label: 'express', nodeType: 'package', version: '4.18.2' } },
      { id: 'react', type: 'custom', position: { x: 250, y: 130 }, data: { label: 'react', nodeType: 'package', version: '18.2.0' } },
      { id: 'next', type: 'custom', position: { x: 250, y: 210 }, data: { label: 'next', nodeType: 'package', version: '14.0.4' } },
      { id: 'event-stream', type: 'custom', position: { x: 250, y: 290 }, data: { label: 'event-stream', nodeType: 'package', version: '3.3.6', isFlagged: true, riskType: 'malicious', riskSummary: 'Backdoor via flatmap-stream dependency targeting Bitcoin wallets' } },
      { id: 'moment', type: 'custom', position: { x: 250, y: 390 }, data: { label: 'moment', nodeType: 'package', version: '2.29.1', isFlagged: true, riskType: 'deprecated', riskSummary: 'Project in maintenance mode since Sept 2020. 290KB unparsed.' } },
      { id: 'axios', type: 'custom', position: { x: 250, y: 470 }, data: { label: 'axios', nodeType: 'package', version: '1.6.2' } },
      { id: 'file-server', type: 'custom', position: { x: 520, y: 50 }, data: { label: 'server.js', nodeType: 'file' } },
      { id: 'file-stream', type: 'custom', position: { x: 520, y: 290 }, data: { label: 'stream-handler.js', nodeType: 'file' } },
      { id: 'file-dates', type: 'custom', position: { x: 520, y: 390 }, data: { label: 'date-utils.js', nodeType: 'file' } },
      { id: 'file-checkout', type: 'custom', position: { x: 520, y: 170 }, data: { label: 'checkout.tsx', nodeType: 'file' } },
      { id: 'svc-api', type: 'custom', position: { x: 760, y: 120 }, data: { label: '/api/checkout', nodeType: 'service' } },
      { id: 'svc-stream', type: 'custom', position: { x: 760, y: 290 }, data: { label: '/api/events', nodeType: 'service' } },
      { id: 'svc-reports', type: 'custom', position: { x: 760, y: 390 }, data: { label: '/api/reports', nodeType: 'service' } },
    ],
    edges: [
      { id: 'e-repo-express', source: 'repo', target: 'express', animated: false },
      { id: 'e-repo-react', source: 'repo', target: 'react', animated: false },
      { id: 'e-repo-next', source: 'repo', target: 'next', animated: false },
      { id: 'e-repo-es', source: 'repo', target: 'event-stream', animated: true, style: { stroke: '#DA1E28' } },
      { id: 'e-repo-moment', source: 'repo', target: 'moment', animated: true, style: { stroke: '#DA1E28' } },
      { id: 'e-repo-axios', source: 'repo', target: 'axios', animated: false },
      { id: 'e-express-server', source: 'express', target: 'file-server', animated: false },
      { id: 'e-es-stream', source: 'event-stream', target: 'file-stream', animated: true, style: { stroke: '#DA1E28' } },
      { id: 'e-moment-dates', source: 'moment', target: 'file-dates', animated: true, style: { stroke: '#DA1E28' } },
      { id: 'e-react-checkout', source: 'react', target: 'file-checkout', animated: false },
      { id: 'e-server-api', source: 'file-server', target: 'svc-api', animated: false },
      { id: 'e-checkout-api', source: 'file-checkout', target: 'svc-api', animated: false },
      { id: 'e-stream-svc', source: 'file-stream', target: 'svc-stream', animated: true, style: { stroke: '#DA1E28' } },
      { id: 'e-dates-reports', source: 'file-dates', target: 'svc-reports', animated: true, style: { stroke: '#DA1E28' } },
    ],
  },
  'acme-pipeline': {
    nodes: [
      { id: 'repo', type: 'custom', position: { x: 0, y: 180 }, data: { label: 'acme-data-pipeline', nodeType: 'repo' } },
      { id: 'flask', type: 'custom', position: { x: 250, y: 30 }, data: { label: 'flask', nodeType: 'package', version: '3.0.0' } },
      { id: 'pandas', type: 'custom', position: { x: 250, y: 110 }, data: { label: 'pandas', nodeType: 'package', version: '2.1.4' } },
      { id: 'pyyaml', type: 'custom', position: { x: 250, y: 200 }, data: { label: 'pyyaml', nodeType: 'package', version: '5.3', isFlagged: true, riskType: 'vulnerable', riskSummary: 'Arbitrary code execution via yaml.load() without Loader', cveId: 'CVE-2020-14343', cveScore: 9.8 } },
      { id: 'requests', type: 'custom', position: { x: 250, y: 310 }, data: { label: 'requests', nodeType: 'package', version: '2.6.0', isFlagged: true, riskType: 'vulnerable', riskSummary: 'Session data leaked on HTTP redirects from HTTPS', cveId: 'CVE-2018-18074', cveScore: 7.5 } },
      { id: 'sqlalchemy', type: 'custom', position: { x: 250, y: 400 }, data: { label: 'sqlalchemy', nodeType: 'package', version: '2.0.23' } },
      { id: 'file-config', type: 'custom', position: { x: 520, y: 200 }, data: { label: 'config.py', nodeType: 'file' } },
      { id: 'file-fetcher', type: 'custom', position: { x: 520, y: 310 }, data: { label: 'data_fetcher.py', nodeType: 'file' } },
      { id: 'file-app', type: 'custom', position: { x: 520, y: 30 }, data: { label: 'app.py', nodeType: 'file' } },
      { id: 'file-models', type: 'custom', position: { x: 520, y: 400 }, data: { label: 'models.py', nodeType: 'file' } },
      { id: 'svc-ingest', type: 'custom', position: { x: 760, y: 250 }, data: { label: '/ingest', nodeType: 'service' } },
      { id: 'svc-api', type: 'custom', position: { x: 760, y: 100 }, data: { label: '/api/v1', nodeType: 'service' } },
    ],
    edges: [
      { id: 'e-repo-flask', source: 'repo', target: 'flask', animated: false },
      { id: 'e-repo-pandas', source: 'repo', target: 'pandas', animated: false },
      { id: 'e-repo-pyyaml', source: 'repo', target: 'pyyaml', animated: true, style: { stroke: '#DA1E28' } },
      { id: 'e-repo-requests', source: 'repo', target: 'requests', animated: true, style: { stroke: '#DA1E28' } },
      { id: 'e-repo-sqla', source: 'repo', target: 'sqlalchemy', animated: false },
      { id: 'e-pyyaml-config', source: 'pyyaml', target: 'file-config', animated: true, style: { stroke: '#DA1E28' } },
      { id: 'e-requests-fetcher', source: 'requests', target: 'file-fetcher', animated: true, style: { stroke: '#DA1E28' } },
      { id: 'e-flask-app', source: 'flask', target: 'file-app', animated: false },
      { id: 'e-sqla-models', source: 'sqlalchemy', target: 'file-models', animated: false },
      { id: 'e-config-ingest', source: 'file-config', target: 'svc-ingest', animated: true, style: { stroke: '#DA1E28' } },
      { id: 'e-fetcher-ingest', source: 'file-fetcher', target: 'svc-ingest', animated: true, style: { stroke: '#DA1E28' } },
      { id: 'e-app-api', source: 'file-app', target: 'svc-api', animated: false },
    ],
  },
};

/* ── Replacements ──────────────────────────────────────────────────────── */

export const MOCK_REPLACEMENTS: Record<string, ReplacementResult> = {
  'event-stream': {
    original_package: 'event-stream',
    original_version: '3.3.6',
    risk_type: 'malicious',
    candidates: [
      {
        name: 'highland',
        version: '2.13.5',
        confidence: 89,
        rationale: 'Functionally equivalent stream processing library, actively maintained',
        weekly_downloads: '420K',
        last_updated: '2024-01',
        license: 'Apache-2.0',
        breaking_changes: false,
      },
      {
        name: 'scramjet',
        version: '4.36.0',
        confidence: 82,
        rationale: 'Modern stream processing with functional API, strong TypeScript support',
        weekly_downloads: '85K',
        last_updated: '2024-02',
        license: 'MIT',
        breaking_changes: true,
      },
    ],
  },
  moment: {
    original_package: 'moment',
    original_version: '2.29.1',
    risk_type: 'deprecated',
    candidates: [
      {
        name: 'dayjs',
        version: '1.11.10',
        confidence: 94,
        rationale: 'API-compatible, 2KB vs 290KB, actively maintained with plugin ecosystem',
        weekly_downloads: '15.2M',
        last_updated: '2024-03',
        license: 'MIT',
        breaking_changes: false,
      },
      {
        name: 'date-fns',
        version: '2.30.0',
        confidence: 88,
        rationale: 'Tree-shakeable, functional API, comprehensive locale support',
        weekly_downloads: '18.1M',
        last_updated: '2024-02',
        license: 'MIT',
        breaking_changes: true,
      },
    ],
  },
  pyyaml: {
    original_package: 'pyyaml',
    original_version: '5.3',
    risk_type: 'vulnerable',
    candidates: [
      {
        name: 'pyyaml',
        version: '6.0.1',
        confidence: 96,
        rationale: 'Same package, patched version — fixes CVE-2020-14343',
        weekly_downloads: '92M',
        last_updated: '2024-01',
        license: 'MIT',
        breaking_changes: false,
      },
      {
        name: 'ruamel.yaml',
        version: '0.18.5',
        confidence: 78,
        rationale: 'Drop-in with round-trip editing support, preserves comments',
        weekly_downloads: '12M',
        last_updated: '2024-03',
        license: 'MIT',
        breaking_changes: true,
      },
    ],
  },
  requests: {
    original_package: 'requests',
    original_version: '2.6.0',
    risk_type: 'vulnerable',
    candidates: [
      {
        name: 'requests',
        version: '2.31.0',
        confidence: 97,
        rationale: 'Same package, patched version — fixes CVE-2018-18074',
        weekly_downloads: '120M',
        last_updated: '2024-02',
        license: 'Apache-2.0',
        breaking_changes: false,
      },
      {
        name: 'httpx',
        version: '0.25.2',
        confidence: 74,
        rationale: 'Modern async-first HTTP client with HTTP/2 support',
        weekly_downloads: '8.5M',
        last_updated: '2024-03',
        license: 'BSD-3',
        breaking_changes: true,
      },
    ],
  },
};

/* ── Migration diffs ──────────────────────────────────────────────────── */

export const MOCK_MIGRATIONS: Record<string, MigrationResult> = {
  'moment→dayjs': {
    original_package: 'moment',
    replacement_package: 'dayjs',
    replacement_version: '1.11.10',
    files_changed: 1,
    diffs: [
      {
        filename: 'src/utils/date-utils.js',
        language: 'javascript',
        old_code: `import moment from 'moment';

export function formatDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

export function fromNow(date) {
  return moment(date).fromNow();
}

export function addDays(date, days) {
  return moment(date).add(days, 'days').toDate();
}`,
        new_code: `import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatDate(date) {
  return dayjs(date).format('YYYY-MM-DD');
}

export function fromNow(date) {
  return dayjs(date).fromNow();
}

export function addDays(date, days) {
  return dayjs(date).add(days, 'day').toDate();
}`,
      },
    ],
  },
  'event-stream→highland': {
    original_package: 'event-stream',
    replacement_package: 'highland',
    replacement_version: '2.13.5',
    files_changed: 1,
    diffs: [
      {
        filename: 'src/stream-handler.js',
        language: 'javascript',
        old_code: `const es = require('event-stream');

function processStream(input) {
  return input
    .pipe(es.split())
    .pipe(es.mapSync(line => {
      return JSON.parse(line);
    }))
    .pipe(es.stringify());
}

module.exports = { processStream };`,
        new_code: `const _ = require('highland');

function processStream(input) {
  return _(input)
    .split()
    .map(line => JSON.parse(line))
    .map(obj => JSON.stringify(obj));
}

module.exports = { processStream };`,
      },
    ],
  },
  'pyyaml→pyyaml': {
    original_package: 'pyyaml',
    replacement_package: 'pyyaml',
    replacement_version: '6.0.1',
    files_changed: 1,
    diffs: [
      {
        filename: 'config.py',
        language: 'python',
        old_code: `import yaml

def load_config(path):
    with open(path) as f:
        return yaml.load(f)

def dump_config(data, path):
    with open(path, 'w') as f:
        yaml.dump(data, f)`,
        new_code: `import yaml

def load_config(path):
    with open(path) as f:
        return yaml.safe_load(f)

def dump_config(data, path):
    with open(path, 'w') as f:
        yaml.safe_dump(data, f)`,
      },
    ],
  },
  'requests→requests': {
    original_package: 'requests',
    replacement_package: 'requests',
    replacement_version: '2.31.0',
    files_changed: 1,
    diffs: [
      {
        filename: 'data_fetcher.py',
        language: 'python',
        old_code: `import requests  # v2.6.0

def fetch_data(url, api_key):
    session = requests.Session()
    session.headers.update({'Authorization': f'Bearer {api_key}'})
    response = session.get(url)
    return response.json()`,
        new_code: `import requests  # v2.31.0 — fixes CVE-2018-18074

def fetch_data(url, api_key):
    session = requests.Session()
    session.headers.update({'Authorization': f'Bearer {api_key}'})
    response = session.get(url)
    response.raise_for_status()
    return response.json()`,
      },
    ],
  },
};

/* ── Verification ─────────────────────────────────────────────────────── */

export const MOCK_VERIFICATION: Record<string, VerificationResult> = {
  'acme-storefront': {
    total_tests: 6,
    passed: 6,
    failed: 0,
    skipped: 0,
    duration_ms: 1243,
    overall_status: 'pass',
    tests: [
      { name: 'formatDate returns ISO string', file: 'date-utils.test.js', duration_ms: 12, status: 'pass' },
      { name: 'fromNow returns relative time', file: 'date-utils.test.js', duration_ms: 8, status: 'pass' },
      { name: 'addDays adds correct days', file: 'date-utils.test.js', duration_ms: 5, status: 'pass' },
      { name: 'processStream parses JSON lines', file: 'stream-handler.test.js', duration_ms: 45, status: 'pass' },
      { name: 'processStream handles empty input', file: 'stream-handler.test.js', duration_ms: 18, status: 'pass' },
      { name: 'checkout flow integration', file: 'checkout.test.js', duration_ms: 1155, status: 'pass' },
    ],
  },
  'acme-pipeline': {
    total_tests: 5,
    passed: 5,
    failed: 0,
    skipped: 0,
    duration_ms: 892,
    overall_status: 'pass',
    tests: [
      { name: 'load_config reads YAML safely', file: 'test_config.py', duration_ms: 23, status: 'pass' },
      { name: 'dump_config writes YAML safely', file: 'test_config.py', duration_ms: 15, status: 'pass' },
      { name: 'fetch_data returns JSON', file: 'test_fetcher.py', duration_ms: 340, status: 'pass' },
      { name: 'fetch_data raises on error', file: 'test_fetcher.py', duration_ms: 210, status: 'pass' },
      { name: 'pipeline integration test', file: 'test_pipeline.py', duration_ms: 304, status: 'pass' },
    ],
  },
};
