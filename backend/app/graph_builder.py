"""
Builds React Flow-compatible graph structures for dependency visualization.
"""

from app.sample_repos import SAMPLE_REPOS
from app.known_bad import check_package


def build_graph(repo_id: str) -> dict:
    """Build a React Flow graph for the given repo."""
    repo = SAMPLE_REPOS.get(repo_id)
    if not repo:
        return {"nodes": [], "edges": []}

    nodes = []
    edges = []
    ecosystem = repo["ecosystem"]
    file_imports = repo.get("file_imports", {})

    # ── Root node (the repo) ───────────────────────────────────────────
    nodes.append({
        "id": "root",
        "type": "root",
        "position": {"x": 500, "y": 0},
        "data": {
            "label": repo["name"],
            "ecosystem": ecosystem,
            "description": repo["description"],
        },
    })

    # ── Package nodes ──────────────────────────────────────────────────
    deps = repo["dependencies"]
    total = len(deps)
    pkg_x_start = 0
    pkg_spacing = 180
    pkg_y = 160

    flagged_packages = set()

    for i, (name, version) in enumerate(deps.items()):
        risk = check_package(ecosystem, name, version)
        is_flagged = risk is not None
        if is_flagged:
            flagged_packages.add(name)

        node_id = f"pkg-{name}"
        x = pkg_x_start + (i % 8) * pkg_spacing
        y = pkg_y + (i // 8) * 120

        nodes.append({
            "id": node_id,
            "type": "package",
            "position": {"x": x, "y": y},
            "data": {
                "label": name,
                "version": version,
                "ecosystem": ecosystem,
                "isFlagged": is_flagged,
                "riskType": risk["risk_type"].value if risk else None,
                "riskSummary": risk["summary"] if risk else None,
                "cveId": risk["cve_id"] if risk else None,
                "cveScore": risk["cve_score"] if risk else None,
            },
        })

        edges.append({
            "id": f"root-to-{node_id}",
            "source": "root",
            "target": node_id,
            "type": "smoothstep",
            "animated": is_flagged,
            "style": {
                "stroke": "#DA1E28" if is_flagged else "#E0E0E0",
                "strokeWidth": 2 if is_flagged else 1,
            },
        })

    # ── File and Service nodes for flagged packages ────────────────────
    file_y = pkg_y + 280
    service_y = file_y + 160

    file_counter = 0
    service_set = {}

    for pkg_name in flagged_packages:
        imports = file_imports.get(pkg_name, [])
        for imp in imports:
            file_id = f"file-{file_counter}"
            file_counter += 1

            x = 60 + file_counter * 200

            nodes.append({
                "id": file_id,
                "type": "file",
                "position": {"x": x, "y": file_y},
                "data": {
                    "label": imp["file"],
                    "service": imp["service"],
                    "affectedBy": pkg_name,
                },
            })

            edges.append({
                "id": f"pkg-{pkg_name}-to-{file_id}",
                "source": f"pkg-{pkg_name}",
                "target": file_id,
                "type": "smoothstep",
                "animated": True,
                "style": {"stroke": "#DA1E28", "strokeWidth": 2},
            })

            # Service node (deduplicated)
            svc_name = imp["service"]
            if svc_name not in service_set:
                svc_id = f"svc-{len(service_set)}"
                service_set[svc_name] = svc_id
                nodes.append({
                    "id": svc_id,
                    "type": "service",
                    "position": {"x": x, "y": service_y},
                    "data": {
                        "label": svc_name,
                        "status": "at-risk",
                    },
                })

            edges.append({
                "id": f"{file_id}-to-{service_set[svc_name]}",
                "source": file_id,
                "target": service_set[svc_name],
                "type": "smoothstep",
                "animated": True,
                "style": {"stroke": "#B28600", "strokeWidth": 1.5},
            })

    return {"nodes": nodes, "edges": edges}
