# Dependency Blackout — Build Tasks

## Phase 1: Scaffolding
- [x] Scaffold Next.js 14 frontend
- [x] Install frontend dependencies (motion, @xyflow/react, recharts, lucide-react)
- [ ] Install react-diff-viewer-continued (npm not in PATH — skipped, using inline diff)
- [x] Scaffold FastAPI backend
- [x] Install backend dependencies

## Phase 2: Design System
- [x] Configure Tailwind with IBM design tokens (globals.css)
- [x] Set up IBM Plex fonts in root layout (via Google Fonts CDN)
- [x] Create global CSS styles (animations, glass effects, grid patterns)

## Phase 3: Backend
- [x] Create known-bad packages registry
- [x] Create sample repos data
- [x] Create graph builder
- [x] Create replacement candidates logic
- [x] Create migration/diff logic
- [x] Create Pydantic models
- [x] Create FastAPI routes
- [ ] Verify backend runs (Python/pip not tested in this env)

## Phase 4: Frontend — Shared Components
- [x] Navbar
- [x] Footer
- [x] AnimatedCounter

## Phase 5: Frontend — Landing Page
- [x] Hero section with animated mini-graph
- [x] Problem section (event-stream narrative)
- [x] Pipeline steps (scroll-triggered)
- [x] Stats bar
- [x] CTA section

## Phase 6: Frontend — Dashboard
- [x] Repo selector
- [x] Scan button + staged progress
- [x] Custom React Flow nodes/edges
- [x] Dependency graph (interactive)
- [x] Package detail side panel
- [x] Code diff view
- [x] Test results panel
- [x] Dashboard page (orchestrator)
- [x] Mock data fallback

## Phase 7: Frontend — Architecture Page
- [x] Platform vision diagram
- [x] Future modules layout
- [x] Roadmap timeline

## Phase 8: Verification
- [ ] Frontend builds without errors
- [ ] Backend runs and serves endpoints
- [ ] Full user journey walkthrough
- [ ] Record browser demo
