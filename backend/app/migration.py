"""
Migration logic — generates before/after code diffs and mock test results.
"""

from app.models import DiffFile, MigrationResult, TestCase, VerificationResult


# ── Code diff templates ────────────────────────────────────────────────────

MIGRATION_DIFFS = {
    ("npm", "event-stream", "highland"): MigrationResult(
        original_package="event-stream",
        replacement_package="highland",
        replacement_version="2.13.5",
        files_changed=3,
        diffs=[
            DiffFile(
                filename="src/lib/data-import.ts",
                language="typescript",
                old_code='''import es from 'event-stream';
import { createReadStream } from 'fs';

export async function importProducts(filePath: string) {
  return new Promise((resolve, reject) => {
    const products: Product[] = [];
    createReadStream(filePath)
      .pipe(es.split())
      .pipe(es.mapSync((line: string) => {
        if (line) {
          products.push(JSON.parse(line));
        }
      }))
      .on('end', () => resolve(products))
      .on('error', reject);
  });
}''',
                new_code='''import highland from 'highland';
import { createReadStream } from 'fs';

export async function importProducts(filePath: string) {
  return new Promise((resolve, reject) => {
    const products: Product[] = [];
    highland(createReadStream(filePath))
      .split()
      .each((line: string) => {
        if (line) {
          products.push(JSON.parse(line));
        }
      })
      .done(() => resolve(products));
  });
}''',
            ),
            DiffFile(
                filename="src/api/webhooks/stripe.ts",
                language="typescript",
                old_code='''import es from 'event-stream';

export function processWebhookStream(stream: NodeJS.ReadableStream) {
  return stream
    .pipe(es.split('\\n'))
    .pipe(es.parse())
    .pipe(es.mapSync((event: StripeEvent) => {
      return handleStripeEvent(event);
    }));
}''',
                new_code='''import highland from 'highland';

export function processWebhookStream(stream: NodeJS.ReadableStream) {
  return highland(stream)
    .split()
    .map((chunk: string) => JSON.parse(chunk))
    .map((event: StripeEvent) => {
      return handleStripeEvent(event);
    });
}''',
            ),
        ],
    ),

    ("npm", "moment", "dayjs"): MigrationResult(
        original_package="moment",
        replacement_package="dayjs",
        replacement_version="1.11.10",
        files_changed=4,
        diffs=[
            DiffFile(
                filename="src/components/OrderHistory.tsx",
                language="tsx",
                old_code='''import moment from 'moment';

export function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <div className="order-list">
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <span className="order-date">
            {moment(order.createdAt).format('MMM D, YYYY')}
          </span>
          <span className="relative-time">
            {moment(order.createdAt).fromNow()}
          </span>
        </div>
      ))}
    </div>
  );
}''',
                new_code='''import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <div className="order-list">
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <span className="order-date">
            {dayjs(order.createdAt).format('MMM D, YYYY')}
          </span>
          <span className="relative-time">
            {dayjs(order.createdAt).fromNow()}
          </span>
        </div>
      ))}
    </div>
  );
}''',
            ),
            DiffFile(
                filename="src/lib/analytics.ts",
                language="typescript",
                old_code='''import moment from 'moment';

export function getDateRange(period: string) {
  const end = moment();
  const start = moment().subtract(1, period as moment.unitOfTime.DurationConstructor);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
    label: `${start.format('MMM D')} — ${end.format('MMM D, YYYY')}`,
  };
}''',
                new_code='''import dayjs from 'dayjs';

export function getDateRange(period: string) {
  const end = dayjs();
  const start = dayjs().subtract(1, period as dayjs.ManipulateType);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
    label: `${start.format('MMM D')} — ${end.format('MMM D, YYYY')}`,
  };
}''',
            ),
        ],
    ),

    ("pypi", "pyyaml", "pyyaml"): MigrationResult(
        original_package="pyyaml",
        replacement_package="pyyaml",
        replacement_version="6.0.1",
        files_changed=3,
        diffs=[
            DiffFile(
                filename="app/config/loader.py",
                language="python",
                old_code='''import yaml

def load_config(path: str) -> dict:
    """Load application configuration from YAML file."""
    with open(path, 'r') as f:
        config = yaml.load(f)  # Unsafe: no Loader specified
    return config

def load_all_configs(path: str) -> list[dict]:
    with open(path, 'r') as f:
        return list(yaml.load_all(f))  # Also unsafe''',
                new_code='''import yaml

def load_config(path: str) -> dict:
    """Load application configuration from YAML file."""
    with open(path, 'r') as f:
        config = yaml.load(f, Loader=yaml.SafeLoader)
    return config

def load_all_configs(path: str) -> list[dict]:
    with open(path, 'r') as f:
        return list(yaml.load_all(f, Loader=yaml.SafeLoader))''',
            ),
            DiffFile(
                filename="app/pipelines/etl_config.py",
                language="python",
                old_code='''import yaml

class ETLConfig:
    def __init__(self, config_str: str):
        self.config = yaml.load(config_str)
        self.steps = self.config.get('pipeline_steps', [])''',
                new_code='''import yaml

class ETLConfig:
    def __init__(self, config_str: str):
        self.config = yaml.safe_load(config_str)
        self.steps = self.config.get('pipeline_steps', [])''',
            ),
        ],
    ),

    ("pypi", "requests", "requests"): MigrationResult(
        original_package="requests",
        replacement_package="requests",
        replacement_version="2.31.0",
        files_changed=1,
        diffs=[
            DiffFile(
                filename="requirements.txt",
                language="text",
                old_code="requests==2.6.0",
                new_code="requests==2.31.0",
            ),
        ],
    ),
}


# ── Mock test results ──────────────────────────────────────────────────────

TEST_SUITES = {
    "acme-storefront": VerificationResult(
        total_tests=12,
        passed=12,
        failed=0,
        skipped=0,
        duration_ms=3420,
        overall_status="pass",
        tests=[
            TestCase(name="data-import: should parse CSV product stream", file="src/lib/data-import.test.ts", duration_ms=245, status="pass"),
            TestCase(name="data-import: should handle empty lines", file="src/lib/data-import.test.ts", duration_ms=89, status="pass"),
            TestCase(name="data-import: should reject malformed JSON", file="src/lib/data-import.test.ts", duration_ms=112, status="pass"),
            TestCase(name="webhooks: should process Stripe payment_intent.succeeded", file="src/api/webhooks/stripe.test.ts", duration_ms=334, status="pass"),
            TestCase(name="webhooks: should handle webhook signature verification", file="src/api/webhooks/stripe.test.ts", duration_ms=201, status="pass"),
            TestCase(name="OrderHistory: should render formatted dates", file="src/components/OrderHistory.test.tsx", duration_ms=156, status="pass"),
            TestCase(name="OrderHistory: should show relative timestamps", file="src/components/OrderHistory.test.tsx", duration_ms=134, status="pass"),
            TestCase(name="analytics: should compute correct date ranges", file="src/lib/analytics.test.ts", duration_ms=98, status="pass"),
            TestCase(name="analytics: should handle month boundaries", file="src/lib/analytics.test.ts", duration_ms=87, status="pass"),
            TestCase(name="reports: should aggregate daily sales", file="src/api/reports/sales.test.ts", duration_ms=445, status="pass"),
            TestCase(name="date-helpers: should format ISO dates", file="src/utils/date-helpers.test.ts", duration_ms=67, status="pass"),
            TestCase(name="inventory-stream: should process batch updates", file="src/workers/inventory-stream.test.ts", duration_ms=452, status="pass"),
        ],
    ),
    "acme-pipeline": VerificationResult(
        total_tests=10,
        passed=10,
        failed=0,
        skipped=0,
        duration_ms=2810,
        overall_status="pass",
        tests=[
            TestCase(name="config: should load YAML config safely", file="app/config/test_loader.py", duration_ms=123, status="pass"),
            TestCase(name="config: should reject unsafe YAML constructs", file="app/config/test_loader.py", duration_ms=89, status="pass"),
            TestCase(name="config: should handle missing keys gracefully", file="app/config/test_loader.py", duration_ms=45, status="pass"),
            TestCase(name="etl: should parse pipeline step definitions", file="app/pipelines/test_etl_config.py", duration_ms=156, status="pass"),
            TestCase(name="etl: should validate step ordering", file="app/pipelines/test_etl_config.py", duration_ms=201, status="pass"),
            TestCase(name="schema: should validate input schema", file="app/api/test_schema_validator.py", duration_ms=334, status="pass"),
            TestCase(name="slack: should send notification on pipeline failure", file="app/integrations/test_slack_notifier.py", duration_ms=445, status="pass"),
            TestCase(name="webhook: should dispatch events to registered endpoints", file="app/integrations/test_webhook_client.py", duration_ms=389, status="pass"),
            TestCase(name="fetch: should retry failed external requests", file="app/pipelines/test_external_fetch.py", duration_ms=567, status="pass"),
            TestCase(name="health: should report upstream service status", file="app/health/test_upstream_check.py", duration_ms=461, status="pass"),
        ],
    ),
}


def get_migration(ecosystem: str, original: str, replacement: str) -> MigrationResult | None:
    key = (ecosystem, original, replacement)
    return MIGRATION_DIFFS.get(key)


def get_test_results(repo_id: str) -> VerificationResult | None:
    return TEST_SUITES.get(repo_id)
