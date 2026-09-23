"""
Pydantic models for the Dependency Blackout API.
"""

from __future__ import annotations
from pydantic import BaseModel
from enum import Enum
from typing import Optional


class Ecosystem(str, Enum):
    NPM = "npm"
    PYPI = "pypi"
    MAVEN = "maven"


class RiskType(str, Enum):
    VULNERABLE = "vulnerable"
    DEPRECATED = "deprecated"
    MALICIOUS = "malicious"
    UNAVAILABLE = "unavailable"


class RepoInfo(BaseModel):
    id: str
    name: str
    ecosystem: Ecosystem
    description: str
    package_count: int
    manifest_file: str


class Dependency(BaseModel):
    name: str
    version: str
    is_flagged: bool = False
    risk_type: Optional[RiskType] = None
    risk_summary: Optional[str] = None
    cve_id: Optional[str] = None
    cve_score: Optional[float] = None


class ScanResult(BaseModel):
    repo_id: str
    total_packages: int
    flagged_count: int
    flagged_packages: list[Dependency]
    all_packages: list[Dependency]


class GraphNode(BaseModel):
    id: str
    type: str  # "package" | "file" | "service" | "root"
    data: dict
    position: dict


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    animated: bool = False
    style: Optional[dict] = None
    type: Optional[str] = None


class DependencyGraph(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]


class ReplacementCandidate(BaseModel):
    name: str
    version: str
    confidence: float
    rationale: str
    weekly_downloads: str
    last_updated: str
    license: str
    breaking_changes: bool


class ReplacementResult(BaseModel):
    original_package: str
    original_version: str
    risk_type: RiskType
    candidates: list[ReplacementCandidate]


class DiffFile(BaseModel):
    filename: str
    language: str
    old_code: str
    new_code: str


class MigrationResult(BaseModel):
    original_package: str
    replacement_package: str
    replacement_version: str
    files_changed: int
    diffs: list[DiffFile]


class TestCase(BaseModel):
    name: str
    file: str
    duration_ms: int
    status: str  # "pass" | "fail" | "skip"


class VerificationResult(BaseModel):
    total_tests: int
    passed: int
    failed: int
    skipped: int
    duration_ms: int
    tests: list[TestCase]
    overall_status: str  # "pass" | "fail"
