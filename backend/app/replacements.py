"""
Replacement candidate ranking logic.
Deterministic/hardcoded for demo reliability.
Structured so a real LLM call can be swapped in via the rank_replacements() interface.
"""

from app.models import ReplacementCandidate


REPLACEMENT_REGISTRY = {
    # ── npm replacements ───────────────────────────────────────────────
    ("npm", "event-stream"): [
        ReplacementCandidate(
            name="highland",
            version="2.13.5",
            confidence=0.89,
            rationale="Functionally equivalent stream utility library. Active maintenance, well-tested, no known vulnerabilities. Drop-in replacement for most event-stream use cases including .pipe(), .map(), and .filter() patterns.",
            weekly_downloads="142K",
            last_updated="2024-01-15",
            license="Apache-2.0",
            breaking_changes=False,
        ),
        ReplacementCandidate(
            name="scramjet",
            version="4.36.9",
            confidence=0.82,
            rationale="Modern stream processing framework with async/await support. Higher performance than event-stream for large datasets. Requires minor API changes for .through() calls.",
            weekly_downloads="38K",
            last_updated="2024-02-08",
            license="MIT",
            breaking_changes=True,
        ),
        ReplacementCandidate(
            name="readable-stream",
            version="4.5.2",
            confidence=0.71,
            rationale="Node.js core streams polyfill. Lower-level than event-stream but covers all primitive stream operations. May require more refactoring for convenience methods.",
            weekly_downloads="48M",
            last_updated="2024-01-20",
            license="MIT",
            breaking_changes=True,
        ),
    ],

    ("npm", "moment"): [
        ReplacementCandidate(
            name="dayjs",
            version="1.11.10",
            confidence=0.94,
            rationale="API-compatible with Moment.js. 2KB vs 290KB — 99% smaller. Supports the same .format(), .add(), .subtract() methods. Plugin system for advanced features. Actively maintained.",
            weekly_downloads="18.2M",
            last_updated="2024-01-28",
            license="MIT",
            breaking_changes=False,
        ),
        ReplacementCandidate(
            name="date-fns",
            version="3.3.1",
            confidence=0.88,
            rationale="Functional, tree-shakeable date library. Import only the functions you need. Different API paradigm (function-based vs method-chaining) but comprehensive formatting and manipulation support.",
            weekly_downloads="22.5M",
            last_updated="2024-02-01",
            license="MIT",
            breaking_changes=True,
        ),
        ReplacementCandidate(
            name="luxon",
            version="3.4.4",
            confidence=0.79,
            rationale="Built by a Moment.js maintainer as its spiritual successor. Uses Intl API for i18n. Immutable by default. Different API from Moment but well-documented migration path.",
            weekly_downloads="7.8M",
            last_updated="2024-01-10",
            license="MIT",
            breaking_changes=True,
        ),
    ],

    # ── PyPI replacements ──────────────────────────────────────────────
    ("pypi", "pyyaml"): [
        ReplacementCandidate(
            name="pyyaml",
            version="6.0.1",
            confidence=0.96,
            rationale="Same package, patched version. CVE-2020-14343 is fixed. Safe Loader is now the default. Minimal migration: add Loader=SafeLoader argument to yaml.load() calls or upgrade to 6.0+ where it's enforced.",
            weekly_downloads="85M",
            last_updated="2023-07-18",
            license="MIT",
            breaking_changes=False,
        ),
        ReplacementCandidate(
            name="ruamel.yaml",
            version="0.18.5",
            confidence=0.78,
            rationale="Drop-in replacement with round-trip editing support. Preserves comments and formatting when reading/writing YAML. Safe by default. Slightly different API for advanced usage.",
            weekly_downloads="12M",
            last_updated="2024-01-22",
            license="MIT",
            breaking_changes=True,
        ),
        ReplacementCandidate(
            name="strictyaml",
            version="1.7.3",
            confidence=0.62,
            rationale="Security-first YAML parser. Rejects all potentially dangerous YAML constructs by design. More restrictive but guarantees safety. Different API — requires schema definition.",
            weekly_downloads="520K",
            last_updated="2023-11-05",
            license="MIT",
            breaking_changes=True,
        ),
    ],

    ("pypi", "requests"): [
        ReplacementCandidate(
            name="requests",
            version="2.31.0",
            confidence=0.97,
            rationale="Same package, patched version. CVE-2018-18074 and subsequent vulnerabilities are fixed. No code changes required — just update the version pin in requirements.txt.",
            weekly_downloads="130M",
            last_updated="2023-05-22",
            license="Apache-2.0",
            breaking_changes=False,
        ),
        ReplacementCandidate(
            name="httpx",
            version="0.27.0",
            confidence=0.74,
            rationale="Modern async-first HTTP client with sync fallback. Supports HTTP/2 out of the box. API is similar to requests but not identical — requires import changes and minor refactoring for session handling.",
            weekly_downloads="14M",
            last_updated="2024-02-10",
            license="BSD-3-Clause",
            breaking_changes=True,
        ),
        ReplacementCandidate(
            name="urllib3",
            version="2.2.0",
            confidence=0.58,
            rationale="Lower-level HTTP library (requests is built on it). Full control over connection pooling and retry logic. Requires significant API changes — no high-level convenience methods like requests.get().",
            weekly_downloads="180M",
            last_updated="2024-01-30",
            license="MIT",
            breaking_changes=True,
        ),
    ],
}


def get_replacements(ecosystem: str, package_name: str) -> list[ReplacementCandidate]:
    """
    Get ranked replacement candidates for a flagged package.
    Returns an empty list if no replacements are known.
    """
    key = (ecosystem, package_name)
    return REPLACEMENT_REGISTRY.get(key, [])
