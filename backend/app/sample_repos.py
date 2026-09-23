"""
Pre-seeded sample repository data.
Two repos: one npm (Node.js) and one PyPI (Python).
"""

SAMPLE_REPOS = {
    "acme-storefront": {
        "id": "acme-storefront",
        "name": "acme-commerce/storefront",
        "ecosystem": "npm",
        "description": "Next.js e-commerce storefront with Stripe integration",
        "manifest_file": "package.json",
        "dependencies": {
            "next": "14.1.0",
            "react": "18.2.0",
            "react-dom": "18.2.0",
            "typescript": "5.3.3",
            "@stripe/stripe-js": "2.4.0",
            "axios": "1.6.5",
            "zustand": "4.5.0",
            "event-stream": "3.3.6",
            "moment": "2.29.1",
            "tailwindcss": "3.4.1",
            "lucide-react": "0.312.0",
            "zod": "3.22.4",
            "sharp": "0.33.2",
            "next-auth": "4.24.5",
            "prisma": "5.8.1",
        },
        "file_imports": {
            "event-stream": [
                {"file": "src/lib/data-import.ts", "service": "Product Catalog Sync"},
                {"file": "src/api/webhooks/stripe.ts", "service": "Payment Webhooks"},
                {"file": "src/workers/inventory-stream.ts", "service": "Inventory Service"},
            ],
            "moment": [
                {"file": "src/components/OrderHistory.tsx", "service": "Customer Portal"},
                {"file": "src/lib/analytics.ts", "service": "Analytics Dashboard"},
                {"file": "src/api/reports/sales.ts", "service": "Sales Reports API"},
                {"file": "src/utils/date-helpers.ts", "service": "Shared Utilities"},
            ],
        },
    },

    "acme-pipeline": {
        "id": "acme-pipeline",
        "name": "acme-analytics/data-pipeline",
        "ecosystem": "pypi",
        "description": "FastAPI + pandas data pipeline for real-time analytics",
        "manifest_file": "requirements.txt",
        "dependencies": {
            "fastapi": "0.109.0",
            "uvicorn": "0.27.0",
            "pandas": "2.2.0",
            "numpy": "1.26.3",
            "sqlalchemy": "2.0.25",
            "pyyaml": "5.3",
            "requests": "2.6.0",
            "celery": "5.3.6",
            "redis": "5.0.1",
            "boto3": "1.34.25",
            "pydantic": "2.5.3",
            "alembic": "1.13.1",
        },
        "file_imports": {
            "pyyaml": [
                {"file": "app/config/loader.py", "service": "Configuration Service"},
                {"file": "app/pipelines/etl_config.py", "service": "ETL Pipeline"},
                {"file": "app/api/schema_validator.py", "service": "Schema Validation API"},
            ],
            "requests": [
                {"file": "app/integrations/slack_notifier.py", "service": "Notification Service"},
                {"file": "app/integrations/webhook_client.py", "service": "Webhook Dispatcher"},
                {"file": "app/pipelines/external_fetch.py", "service": "Data Ingestion Pipeline"},
                {"file": "app/health/upstream_check.py", "service": "Health Monitor"},
            ],
        },
    },
}
