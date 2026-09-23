"""
Known-bad packages registry.
Hardcoded for demo reliability — no external API calls during judging.
Based on real CVEs and incidents.
"""

from app.models import RiskType

KNOWN_BAD_PACKAGES = {
    # ── npm ecosystem ──────────────────────────────────────────────────
    "npm": {
        "event-stream": {
            "bad_versions": ["3.3.6"],
            "risk_type": RiskType.MALICIOUS,
            "cve_id": None,
            "cve_score": None,
            "summary": "Backdoor injected via flatmap-stream dependency. Targeted Copay Bitcoin wallet users to steal private keys. Discovered November 2018 after the original maintainer transferred ownership to an unknown actor.",
            "detail": "The malicious payload in flatmap-stream@0.1.1 was designed to detect the Copay build environment and inject code to harvest wallet credentials for accounts with >100 BTC. Over 8 million downloads were affected before discovery.",
            "affected_since": "2018-09-16",
            "discovered": "2018-11-20",
        },
        "moment": {
            "bad_versions": ["2.29.1", "2.29.0", "2.28.0", "2.27.0"],
            "risk_type": RiskType.DEPRECATED,
            "cve_id": None,
            "cve_score": None,
            "summary": "Project in maintenance mode since September 2020. The Moment.js team recommends migrating to modern alternatives. The full library is 290KB unparsed, with no tree-shaking support.",
            "detail": "Moment.js is considered a legacy project. While it will receive critical security patches, no new features will be added. The team specifically recommends dayjs, date-fns, or Luxon as replacements.",
            "affected_since": "2020-09-15",
            "discovered": "2020-09-15",
        },
    },

    # ── PyPI ecosystem ─────────────────────────────────────────────────
    "pypi": {
        "pyyaml": {
            "bad_versions": ["5.3", "5.3.1", "5.2", "5.1"],
            "risk_type": RiskType.VULNERABLE,
            "cve_id": "CVE-2020-14343",
            "cve_score": 9.8,
            "summary": "Arbitrary code execution via yaml.load() without a safe Loader argument. CVSS 9.8 — Critical severity.",
            "detail": "Calling yaml.load(input) without specifying Loader=SafeLoader allows deserialization of arbitrary Python objects, enabling remote code execution. This affects all versions prior to 6.0 when using the default Loader.",
            "affected_since": "2016-01-01",
            "discovered": "2020-07-21",
        },
        "requests": {
            "bad_versions": ["2.6.0", "2.5.0", "2.5.1", "2.5.3"],
            "risk_type": RiskType.VULNERABLE,
            "cve_id": "CVE-2018-18074",
            "cve_score": 7.5,
            "summary": "HTTP session credentials leaked on cross-origin redirects. CVSS 7.5 — High severity.",
            "detail": "When a requests Session follows a redirect from an HTTPS URL to an HTTP URL, the Authorization header is not stripped. This leaks credentials in plaintext. Fixed in requests>=2.20.0.",
            "affected_since": "2014-01-01",
            "discovered": "2018-10-09",
        },
    },
}


def check_package(ecosystem: str, name: str, version: str) -> dict | None:
    """
    Check a package against the known-bad registry.
    Returns risk info dict if flagged, None if clean.
    """
    eco_registry = KNOWN_BAD_PACKAGES.get(ecosystem, {})
    entry = eco_registry.get(name)
    if entry is None:
        return None
    if version in entry["bad_versions"]:
        return {
            "risk_type": entry["risk_type"],
            "cve_id": entry.get("cve_id"),
            "cve_score": entry.get("cve_score"),
            "summary": entry["summary"],
            "detail": entry["detail"],
        }
    return None
