# Dependency Blackout — Implementation Plan

A production-quality, portfolio-grade web application for an IBM hackathon. AI-powered supply chain protection that detects, traces, replaces, and verifies broken/risky dependencies.

## User Review Required

> [!IMPORTANT]
> **Backend AI layer is simulated.** The replacement-candidate ranking and code migration steps use deterministic, hardcoded logic dressed up as "AI-ranked" for demo reliability. If you want to wire in a real LLM (e.g., IBM watsonx) for any of these steps, let me know before I start — I can add an adapter interface so you can swap it in later without restructuring.

> [!IMPORTANT]
> **No live external API calls.** All CVE/deprecation data is hardcoded in the backend's `known_bad_packages` registry. This guarantees the demo works offline in front of judges. If you want to add a fallback to the OSV or NVD API later, I'll structure the code so it's a one-line toggle.

## Proposed Changes

---

### Project Structure

```
Dependency Blackout/
├── frontend/                    # Next.js 14 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx       # Root layout (IBM Plex fonts, metadata)
│   │   │   ├── page.tsx         # Landing page
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx     # Dashboard (the live demo)
│   │   │   └── architecture/
│   │   │       └── page.tsx     # Architecture/roadmap page
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components (customized)
│   │   │   ├── landing/
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── ProblemSection.tsx
│   │   │   │   ├── PipelineSteps.tsx
│   │   │   │   ├── StatsBar.tsx
│   │   │   │   └── CTASection.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── RepoSelector.tsx
│   │   │   │   ├── ScanButton.tsx
│   │   │   │   ├── ScanProgress.tsx
│   │   │   │   ├── DependencyGraph.tsx   # React Flow graph
│   │   │   │   ├── PackageDetailPanel.tsx
│   │   │   │   ├── CodeDiffView.tsx
│   │   │   │   └── TestResults.tsx
│   │   │   ├── architecture/
│   │   │   │   └── PlatformDiagram.tsx
│   │   │   ├── shared/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── AnimatedCounter.tsx
│   │   │   └── graph/
│   │   │       ├── CustomNode.tsx
│   │   │       ├── CustomEdge.tsx
│   │   │       └── GraphAnimations.tsx
│   │   ├── lib/
│   │   │   ├── api.ts           # API client (fetch wrapper to FastAPI)
│   │   │   ├── mock-data.ts     # Fallback mock data (offline safety)
│   │   │   └── constants.ts     # Design tokens, config
│   │   └── hooks/
│   │       ├── useInViewCounter.ts
│   │       └── useScanPipeline.ts
│   ├── public/
│   ├── tailwind.config.ts
│   ├── components.json          # shadcn config
│   └── package.json
│
└── backend/                     # FastAPI (Python)
    ├── app/
    │   ├── main.py              # FastAPI app, CORS, routes
    │   ├── models.py            # Pydantic schemas
    │   ├── known_bad.py         # Hardcoded known-bad packages registry
    │   ├── graph_builder.py     # Builds React Flow node/edge structures
    │   ├── replacements.py      # Replacement candidate ranking logic
    │   ├── migration.py         # Before/after code diff generation
    │   └── sample_repos.py      # Pre-seeded repo data
    ├── requirements.txt
    └── README.md
```

---

### Frontend — Next.js 14

#### [NEW] `frontend/` (scaffolded via `create-next-app`)

Scaffolded with: `npx -y create-next-app@latest ./ --typescript --tailwind --app --eslint --src-dir --import-alias "@/*" --use-npm`

**Key dependencies to install after scaffolding:**
- `@xyflow/react` — React Flow (interactive dependency graph)
- `motion` — Framer Motion rebrand (animations, `whileInView`, hover states)
- `recharts` — Stats charts
- `react-diff-viewer-continued` — Syntax-highlighted side-by-side code diffs
- `lucide-react` — Icons (consistent with shadcn ecosystem)

**shadcn/ui components to add:**
- `button`, `card`, `badge`, `select`, `tabs`, `separator`, `sheet`, `dialog`
- All customized with IBM design tokens (no default shadcn theming)

---

#### [NEW] `src/app/layout.tsx` — Root Layout

- Import IBM Plex Sans (400, 500, 600, 700) and IBM Plex Mono (400, 500) from Google Fonts via `next/font/google`
- Set metadata: title "Dependency Blackout", description, OpenGraph tags
- Global navbar + footer

---

#### [NEW] `src/app/page.tsx` — Landing Page

**Hero Section:**
- Headline: **"Your dependencies are a liability. We make them safe."**
- Subheadline: "Detect compromised packages, trace their blast radius, and auto-migrate to safe alternatives — before your users find out."
- Background: Subtle animated mini React Flow graph that loops between red (danger) → green (safe) states using motion animation. Not a full interactive graph — a decorative, simplified SVG/canvas animation
- CTA button: "Launch Demo →" (links to `/dashboard`)

**Problem Section:**
- Anchored to the real `event-stream` incident (2018): "In November 2018, a maintainer handed off the popular `event-stream` npm package to a stranger. Within weeks, 8 million downloads contained a backdoor targeting Bitcoin wallets. The community discovered it by accident. Your CI pipeline never flagged it."
- Real stats: "62% of commercial codebases contain at least one known-vulnerable dependency" (Synopsys 2023 OSSRA report)
- Clean asymmetric layout — text left, illustrative risk timeline visualization right

**Pipeline Steps Section:**
- 6 horizontal steps: Detect → Impact Graph → Replacement → Migrate → Test → Verify
- Each step animates in via `whileInView` with staggered delays
- Each step card: icon, title, one-line description, subtle connecting line between steps
- Scroll-triggered reveal, not auto-playing

**Stats Bar:**
- 3 metrics: "8.2M+ packages monitored", "< 4s average scan time", "97.3% migration success rate"
- Numbers count up via `AnimatedCounter` when scrolled into view
- Clearly labeled as simulated/benchmark data if judges ask

**CTA Section:**
- "See it in action." + "Launch Demo" button

---

#### [NEW] `src/app/dashboard/page.tsx` — Dashboard (Live Demo)

**Repo Selector:**
- Dropdown with 2 pre-seeded repos:
  - `acme-commerce/storefront` (Node.js / npm)
  - `acme-analytics/data-pipeline` (Python / PyPI)
- Styled select with repo icon, name, and ecosystem badge

**Scan Button & Progress:**
- "Scan Dependencies" button
- On click, triggers a staged loading sequence (not a single spinner):
  1. "Parsing manifest…" (0.8s)
  2. "Checking 15 packages against known vulnerabilities…" (1.2s)
  3. "Building dependency impact graph…" (1.0s)
  4. "Ranking replacement candidates…" (0.8s)
  5. "Scan complete. 2 issues found." (0.5s)
- Each stage shown as a micro-state with a progress indicator

**Dependency Graph (centerpiece):**
- Interactive React Flow graph
- Node types:
  - **Package node** (default): `#F4F4F4` bg, `#E0E0E0` border, `#0F62FE` border on hover
  - **Affected/at-risk node**: `#FFF1F1` bg, `#DA1E28` border, pulsing animation
  - **File node**: Slightly different shape (rounded rectangle)
  - **Service node**: Different shape (hexagonal or pill)
- Animated pulse propagating outward from the broken package to affected files/services
- Smooth zoom/pan, minimap in corner

**Side Panel (Package Detail):**
- Slides in when a risky node is clicked
- Shows: package name (mono font), risk type badge (Deprecated / Vulnerable / Malicious / Unavailable), CVE ID if applicable, description of the issue
- **Replacement Candidates**: Ranked list with confidence scores (e.g., `dayjs` at 94% confidence to replace `moment`), install count, last updated, license info
- "Select Replacement" button on each candidate

**Migrate & Verify Panel:**
- "Migrate & Verify" button triggers:
  1. Before/after code diff view (side-by-side, syntax highlighted via `react-diff-viewer-continued`)
  2. Test results panel: list of test names, each animating from `pending` (gray) → `running` (blue spinner) → `pass` (green checkmark) sequentially
  3. Final "Verification Complete ✓" banner

---

#### [NEW] `src/app/architecture/page.tsx` — Architecture/Roadmap

- Animated diagram (built with React Flow or custom SVG + motion) showing the platform vision:
  - **Current**: Dependency Blackout (highlighted, active)
  - **Future modules** (grayed out, labeled): Code Rescue, Architecture Autopilot, Migration OS
- Brief descriptions of each future module
- Timeline/roadmap layout

---

#### [NEW] `src/components/graph/CustomNode.tsx` — Custom React Flow Nodes

- Clean, minimal node design matching the IBM palette
- Status indicator (colored dot or border)
- Package name in IBM Plex Mono
- Risk badge for flagged packages
- Hover state: border transitions to `#0F62FE`, subtle elevation

---

#### Design System — Tailwind Config

Extend `tailwind.config.ts` with IBM design tokens:

```typescript
colors: {
  ibm: {
    blue: '#0F62FE',
    'blue-hover': '#0043CE',
  },
  surface: {
    primary: '#FFFFFF',
    secondary: '#F4F4F4',
  },
  border: {
    DEFAULT: '#E0E0E0',
  },
  text: {
    primary: '#161616',
    secondary: '#525252',
  },
  status: {
    danger: '#DA1E28',
    'danger-bg': '#FFF1F1',
    warning: '#B28600',
    'warning-bg': '#FFF8E1',
    success: '#24A148',
    'success-bg': '#DEFBE6',
  },
},
fontFamily: {
  sans: ['IBM Plex Sans', 'sans-serif'],
  mono: ['IBM Plex Mono', 'monospace'],
},
```

---

### Backend — FastAPI

#### [NEW] `backend/app/main.py`

- FastAPI app with CORS enabled (allow frontend origin)
- Endpoints:
  - `GET /api/repos` — Returns list of available sample repos
  - `GET /api/repos/{repo_id}/dependencies` — Returns parsed dependency list
  - `POST /api/repos/{repo_id}/scan` — Triggers scan, returns flagged packages with risk data
  - `GET /api/repos/{repo_id}/graph` — Returns React Flow nodes + edges structure
  - `GET /api/packages/{package_name}/replacements` — Returns ranked replacement candidates
  - `POST /api/migrate` — Returns before/after code diff
  - `POST /api/verify` — Returns mock test results

#### [NEW] `backend/app/known_bad.py` — Known-Bad Package Registry

Hardcoded entries:

**npm ecosystem:**
| Package | Version | Risk Type | Details |
|---------|---------|-----------|---------|
| `event-stream` | `3.3.6` | Malicious | Backdoor via `flatmap-stream` dependency targeting Bitcoin wallets (Nov 2018) |
| `moment` | `2.29.1` | Deprecated | Project in maintenance mode since Sept 2020. 290KB unparsed. |

**PyPI ecosystem:**
| Package | Version | Risk Type | Details |
|---------|---------|-----------|---------|
| `pyyaml` | `5.3` | Vulnerable | CVE-2020-14343: Arbitrary code execution via `yaml.load()` without Loader |
| `requests` | `2.6.0` | Vulnerable | CVE-2018-18074: Session data leaked on HTTP redirects from HTTPS |

#### [NEW] `backend/app/replacements.py` — Replacement Candidates

Hardcoded ranked replacements:

| Broken Package | Replacement | Confidence | Rationale |
|---------------|-------------|------------|-----------|
| `event-stream` | `highland@2.13.5` | 89% | Functionally equivalent stream processing |
| `event-stream` | `scramjet@4.36.0` | 82% | Modern stream processing, active maintenance |
| `moment` | `dayjs@1.11.10` | 94% | API-compatible, 2KB vs 290KB, actively maintained |
| `moment` | `date-fns@2.30.0` | 88% | Tree-shakeable, functional API |
| `pyyaml` | `pyyaml@6.0.1` | 96% | Same package, patched version |
| `pyyaml` | `ruamel.yaml@0.18.5` | 78% | Drop-in with round-trip editing support |
| `requests` | `requests@2.31.0` | 97% | Same package, patched version |
| `requests` | `httpx@0.25.2` | 74% | Modern async-first HTTP client |

#### [NEW] `backend/app/graph_builder.py`

Generates React Flow-compatible node/edge JSON for each sample repo. Each graph includes:
- Root node (the repo)
- Package nodes (each dependency)
- File nodes (which source files import the dependency)
- Service nodes (which services/routes those files power)
- Edges with animated/highlighted state for risk propagation paths

#### [NEW] `backend/app/sample_repos.py`

Full pre-seeded data for both repos including:
- `package.json` / `requirements.txt` contents
- Mock file tree showing which files import which packages
- Mock service map

---

## Verification Plan

### Automated Tests
```bash
# Frontend
cd frontend && npm run build   # Verify no build errors
npm run lint                    # ESLint passes

# Backend
cd backend && python -m pytest  # Basic endpoint tests
```

### Manual Verification
- Launch both servers locally (`npm run dev` + `uvicorn`)
- Walk through the full user journey: landing → dashboard → select repo → scan → view graph → click risky node → select replacement → migrate → view diff → verify tests
- Confirm all animations fire correctly
- Confirm the graph renders with correct colors and pulse animations
- Confirm the scan progress sequence plays through all 5 micro-states
- Test both sample repos
- Verify the architecture page renders the platform diagram

### Recording
- Record a browser walkthrough of the complete demo flow for review
