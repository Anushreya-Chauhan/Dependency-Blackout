"""
Dependency Blackout — FastAPI Backend
Serves dependency scanning, graph building, replacement ranking,
migration diffs, and test verification endpoints.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models import (
    RepoInfo,
    Ecosystem,
    Dependency,
    ScanResult,
    DependencyGraph,
    ReplacementResult,
    MigrationResult,
    VerificationResult,
)
from app.sample_repos import SAMPLE_REPOS
from app.known_bad import check_package
from app.graph_builder import build_graph
from app.replacements import get_replacements
from app.migration import get_migration, get_test_results


app = FastAPI(
    title="Dependency Blackout API",
    description="AI-powered dependency failure protection system",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Repository endpoints ──────────────────────────────────────────────────


def resolve_repository(repo_identifier: str) -> tuple[str, dict]:
    """Resolve either a sample repository ID or its display path."""
    repo = SAMPLE_REPOS.get(repo_identifier)
    if repo:
        return repo_identifier, repo

    for repo_id, repo_data in SAMPLE_REPOS.items():
        if repo_data["name"] == repo_identifier:
            return repo_id, repo_data

    raise HTTPException(status_code=404, detail="Repository not found")


@app.get("/api/repos", response_model=list[RepoInfo])
def list_repos():
    """List all available sample repositories."""
    repos = []
    for repo_data in SAMPLE_REPOS.values():
        repos.append(RepoInfo(
            id=repo_data["id"],
            name=repo_data["name"],
            ecosystem=Ecosystem(repo_data["ecosystem"]),
            description=repo_data["description"],
            package_count=len(repo_data["dependencies"]),
            manifest_file=repo_data["manifest_file"],
        ))
    return repos


@app.get("/api/repos/{repo_id:path}/dependencies", response_model=list[Dependency])
def get_dependencies(repo_id: str):
    """Get the dependency list for a repo."""
    _, repo = resolve_repository(repo_id)

    deps = []
    for name, version in repo["dependencies"].items():
        risk = check_package(repo["ecosystem"], name, version)
        deps.append(Dependency(
            name=name,
            version=version,
            is_flagged=risk is not None,
            risk_type=risk["risk_type"] if risk else None,
            risk_summary=risk["summary"] if risk else None,
            cve_id=risk["cve_id"] if risk else None,
            cve_score=risk["cve_score"] if risk else None,
        ))
    return deps


# ── Scan endpoint ─────────────────────────────────────────────────────────


@app.post("/api/repos/{repo_id:path}/scan", response_model=ScanResult)
def scan_repo(repo_id: str):
    """Scan a repo's dependencies for known vulnerabilities."""
    canonical_repo_id, repo = resolve_repository(repo_id)

    all_deps = []
    flagged = []
    for name, version in repo["dependencies"].items():
        risk = check_package(repo["ecosystem"], name, version)
        dep = Dependency(
            name=name,
            version=version,
            is_flagged=risk is not None,
            risk_type=risk["risk_type"] if risk else None,
            risk_summary=risk["summary"] if risk else None,
            cve_id=risk["cve_id"] if risk else None,
            cve_score=risk["cve_score"] if risk else None,
        )
        all_deps.append(dep)
        if risk:
            flagged.append(dep)

    return ScanResult(
        repo_id=canonical_repo_id,
        total_packages=len(all_deps),
        flagged_count=len(flagged),
        flagged_packages=flagged,
        all_packages=all_deps,
    )


# ── Graph endpoint ────────────────────────────────────────────────────────


@app.get("/api/repos/{repo_id:path}/graph", response_model=DependencyGraph)
def get_graph(repo_id: str):
    """Get the dependency impact graph for React Flow."""
    canonical_repo_id, _ = resolve_repository(repo_id)

    graph = build_graph(canonical_repo_id)
    return DependencyGraph(
        nodes=graph["nodes"],
        edges=graph["edges"],
    )


# ── Replacement endpoint ──────────────────────────────────────────────────


@app.get("/api/packages/{ecosystem}/{package_name}/replacements", response_model=ReplacementResult)
def get_package_replacements(ecosystem: str, package_name: str):
    """Get ranked replacement candidates for a flagged package."""
    candidates = get_replacements(ecosystem, package_name)
    if not candidates:
        raise HTTPException(status_code=404, detail="No replacements found")

    # Get original version from whichever repo has it
    original_version = ""
    risk_type = None
    for repo in SAMPLE_REPOS.values():
        if repo["ecosystem"] == ecosystem and package_name in repo["dependencies"]:
            original_version = repo["dependencies"][package_name]
            risk = check_package(ecosystem, package_name, original_version)
            if risk:
                risk_type = risk["risk_type"]
            break

    return ReplacementResult(
        original_package=package_name,
        original_version=original_version,
        risk_type=risk_type,
        candidates=candidates,
    )


# ── Migration endpoint ───────────────────────────────────────────────────


@app.post("/api/migrate")
def migrate(ecosystem: str, original: str, replacement: str):
    """Generate before/after code diffs for a migration."""
    result = get_migration(ecosystem, original, replacement)
    if not result:
        raise HTTPException(status_code=404, detail="Migration not available")
    return result


# ── Verification endpoint ────────────────────────────────────────────────


@app.post("/api/repos/{repo_id:path}/verify", response_model=VerificationResult)
def verify(repo_id: str):
    """Run mock test suite and return results."""
    canonical_repo_id, _ = resolve_repository(repo_id)
    result = get_test_results(canonical_repo_id)
    if not result:
        raise HTTPException(status_code=404, detail="No test suite for this repo")
    return result


# ── Health check ──────────────────────────────────────────────────────────


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "dependency-blackout-api"}
