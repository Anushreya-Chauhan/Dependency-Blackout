'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GitBranch, ArrowRight, Code2, FlaskConical } from 'lucide-react';
import { type Node, type Edge } from '@xyflow/react';

import RepoSelector from '@/components/dashboard/RepoSelector';
import ScanButton from '@/components/dashboard/ScanButton';
import ScanProgress from '@/components/dashboard/ScanProgress';
import DependencyGraph from '@/components/dashboard/DependencyGraph';
import PackageDetailPanel from '@/components/dashboard/PackageDetailPanel';
import CodeDiffView from '@/components/dashboard/CodeDiffView';
import TestResults from '@/components/dashboard/TestResults';

import { api, type ScanResult, type MigrationResult, type VerificationResult } from '@/lib/api';
import { SCAN_STAGES } from '@/lib/constants';
import {
  MOCK_SCAN_RESULTS,
  MOCK_GRAPHS,
  MOCK_MIGRATIONS,
  MOCK_VERIFICATION,
  MOCK_REPOS,
} from '@/lib/mock-data';

type DashboardPhase = 'idle' | 'scanning' | 'graph' | 'migrating' | 'verifying' | 'done';

export default function DashboardPage() {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [phase, setPhase] = useState<DashboardPhase>('idle');
  const [scanStage, setScanStage] = useState(-1);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [graphNodes, setGraphNodes] = useState<Node[]>([]);
  const [graphEdges, setGraphEdges] = useState<Edge[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<Record<string, unknown> | undefined>();
  const [panelOpen, setPanelOpen] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [verifyResult, setVerifyResult] = useState<VerificationResult | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ecosystem = MOCK_REPOS.find((r) => r.id === selectedRepo)?.ecosystem || 'npm';
  const handleBackendUnavailable = useCallback(
    () => setErrorMessage('Backend unavailable. Displaying demo data.'),
    []
  );

  // ── Scan flow ──────────────────────────────────────────────────────────
  const startScan = useCallback(async () => {
    if (!selectedRepo) return;

    setPhase('scanning');
    setScanStage(0);
    setScanResult(null);
    setMigrationResult(null);
    setVerifyResult(null);
    setPanelOpen(false);
    setErrorMessage(null);

    // Run through scan stages with delays
    for (let i = 0; i < SCAN_STAGES.length; i++) {
      setScanStage(i);
      await sleep(SCAN_STAGES[i].duration);
    }

    // Fetch scan result (with mock fallback)
    let result: ScanResult;
    try {
      result = await api.scanRepo(selectedRepo);
    } catch {
      const fallback = MOCK_SCAN_RESULTS[selectedRepo] || MOCK_SCAN_RESULTS['acme-storefront'];
      if (!fallback) {
        setErrorMessage('Scan failed. Try again.');
        setPhase('idle');
        return;
      }
      setErrorMessage('Backend unavailable. Displaying demo data.');
      result = fallback;
    }
    setScanResult(result);
    setScanStage(SCAN_STAGES.length); // all done

    // Small delay then fetch graph
    await sleep(600);

    let graph;
    try {
      graph = await api.getGraph(selectedRepo);
    } catch {
      const fallback = MOCK_GRAPHS[selectedRepo] || MOCK_GRAPHS['acme-storefront'];
      if (!fallback) {
        setErrorMessage('Scan failed. Try again.');
        setPhase('idle');
        return;
      }
      setErrorMessage('Backend unavailable. Displaying demo data.');
      graph = fallback;
    }
    setGraphNodes(graph.nodes as Node[]);
    setGraphEdges(graph.edges as Edge[]);
    setPhase('graph');
  }, [selectedRepo]);

  // ── Node click handler ─────────────────────────────────────────────────
  const handleNodeClick = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      if (data.isFlagged) {
        setSelectedPackage(data.label as string);
        setSelectedNodeData(data);
        setPanelOpen(true);
      }
    },
    []
  );

  // ── Select replacement → trigger migrate ───────────────────────────────
  const handleSelectReplacement = useCallback(
    async (original: string, replacement: string) => {
      setPhase('migrating');
      setPanelOpen(false);

      // Fetch migration diff
      let result: MigrationResult;
      try {
        result = await api.migrate(ecosystem, original, replacement);
      } catch {
        const key = `${original}→${replacement}`;
        const fallback = MOCK_MIGRATIONS[key];
        if (!fallback) {
          setErrorMessage('Migration failed. Please select a different replacement and try again.');
          setPhase('graph');
          return;
        }
        setErrorMessage('Backend unavailable. Displaying demo data.');
        result = fallback;
      }
      setMigrationResult(result);
    },
    [ecosystem]
  );

  // ── Run verification ──────────────────────────────────────────────────
  const handleVerify = useCallback(async () => {
    if (!selectedRepo) return;
    setPhase('verifying');
    setVerifyLoading(true);

    await sleep(800); // simulate loading

    let result: VerificationResult;
    try {
      result = await api.verify(selectedRepo);
    } catch {
      const fallback = MOCK_VERIFICATION[selectedRepo];
      if (!fallback) {
        setErrorMessage('Verification failed. Unable to run the test suite.');
        setVerifyLoading(false);
        setPhase('migrating');
        return;
      }
      setErrorMessage('Backend unavailable. Displaying demo data.');
      result = fallback;
    }
    setVerifyResult(result);
    setVerifyLoading(false);
    setPhase('done');
  }, [selectedRepo]);

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Header */}
      <div className="border-b border-border-default bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-[22px] font-bold text-text-primary tracking-[-0.01em]">
              Dependency Scanner
            </h1>
            <p className="mt-1 text-[13px] text-text-secondary">
              Select a repository, scan its dependencies, and resolve vulnerabilities in real time.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* ── Left sidebar ──────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <RepoSelector
              selectedRepo={selectedRepo}
              onBackendUnavailable={handleBackendUnavailable}
              onSelect={(id) => {
                setSelectedRepo(id);
                setPhase('idle');
                setScanStage(-1);
                setScanResult(null);
                setMigrationResult(null);
                setVerifyResult(null);
                setPanelOpen(false);
                setErrorMessage(null);
              }}
              disabled={phase === 'scanning'}
            />

            <ScanButton
              onClick={startScan}
              disabled={!selectedRepo}
              scanning={phase === 'scanning'}
            />

            {errorMessage && (
              <div className="rounded-lg border border-danger-border bg-danger-bg px-3 py-2 text-[12px] text-danger">
                {errorMessage}
              </div>
            )}

            <ScanProgress
              currentStage={scanStage}
              flaggedCount={scanResult?.flagged_count}
            />

            {/* Scan summary */}
            <AnimatePresence>
              {scanResult && phase !== 'scanning' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl border border-border-default bg-white p-4"
                >
                  <h3 className="text-[12px] font-semibold uppercase tracking-wider text-text-tertiary mb-3">
                    Scan Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-surface-secondary p-3 text-center">
                      <div className="text-[20px] font-bold text-text-primary">
                        {scanResult.total_packages}
                      </div>
                      <div className="text-[10px] text-text-tertiary mt-0.5">
                        Total Packages
                      </div>
                    </div>
                    <div className="rounded-lg bg-danger-bg p-3 text-center">
                      <div className="text-[20px] font-bold text-danger">
                        {scanResult.flagged_count}
                      </div>
                      <div className="text-[10px] text-danger mt-0.5">
                        Issues Found
                      </div>
                    </div>
                  </div>

                  {/* Flagged list */}
                  <div className="mt-3 space-y-2">
                    {scanResult.flagged_packages.map((pkg) => (
                      <button
                        key={pkg.name}
                        onClick={() => {
                          setSelectedPackage(pkg.name);
                          setSelectedNodeData({
                            label: pkg.name,
                            nodeType: 'package',
                            isFlagged: true,
                            riskType: pkg.risk_type,
                            riskSummary: pkg.risk_summary,
                            version: pkg.version,
                            cveId: pkg.cve_id,
                            cveScore: pkg.cve_score,
                          });
                          setPanelOpen(true);
                        }}
                        className="flex items-center justify-between w-full rounded-lg border border-border-default px-3 py-2 text-left hover:border-ibm-blue transition-colors"
                      >
                        <div>
                          <p className="text-[12px] font-mono font-medium text-text-primary">
                            {pkg.name}
                          </p>
                          <p className="text-[10px] text-text-tertiary">
                            v{pkg.version}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase ${
                            pkg.risk_type === 'malicious'
                              ? 'bg-danger text-white'
                              : pkg.risk_type === 'vulnerable'
                              ? 'bg-[#FF832B] text-white'
                              : 'bg-warning text-white'
                          }`}
                        >
                          {pkg.risk_type}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Main content area ─────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-9">
            <AnimatePresence mode="wait">
              {/* Idle state */}
              {phase === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-[500px] rounded-xl border border-dashed border-border-default bg-white"
                >
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary mb-4">
                      <GitBranch className="h-6 w-6 text-text-tertiary" />
                    </div>
                    <p className="text-[15px] font-medium text-text-primary">
                      {selectedRepo
                        ? 'Ready to scan'
                        : 'Select a repository to begin'}
                    </p>
                    <p className="mt-1 text-[13px] text-text-tertiary">
                      {selectedRepo
                        ? 'Click "Scan Dependencies" to analyze the dependency graph'
                        : 'Choose from the dropdown on the left'}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Scanning state */}
              {phase === 'scanning' && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-[500px] rounded-xl border border-border-default bg-white"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-ibm-blue-10 mb-4"
                    >
                      <GitBranch className="h-7 w-7 text-ibm-blue" />
                    </motion.div>
                    <p className="text-[15px] font-medium text-text-primary">
                      Scanning dependencies…
                    </p>
                    <p className="mt-1 text-[13px] text-text-tertiary">
                      Analyzing package graph and checking for vulnerabilities
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Graph + side panel */}
              {(phase === 'graph' || phase === 'migrating' || phase === 'verifying' || phase === 'done') && (
                <motion.div
                  key="graph"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Graph container */}
                  <div className="relative h-[450px]">
                    <DependencyGraph
                      nodes={graphNodes}
                      edges={graphEdges}
                      onNodeClick={handleNodeClick}
                    />
                    <PackageDetailPanel
                      isOpen={panelOpen}
                      onClose={() => setPanelOpen(false)}
                      packageName={selectedPackage}
                      ecosystem={ecosystem}
                      nodeData={selectedNodeData}
                      onSelectReplacement={handleSelectReplacement}
                    />

                    {/* Legend overlay */}
                    <div className="absolute top-3 left-3 z-20 rounded-lg border border-border-default bg-white/90 backdrop-blur-sm px-3 py-2 shadow-sm">
                      <div className="flex items-center gap-4 text-[10px] text-text-tertiary">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-ibm-blue" /> Repo
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded border border-border-default bg-white" /> Package
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-danger animate-pulse" /> At Risk
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded bg-success-bg border border-[#0E6027]" /> File
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded bg-[#F6F2FF] border border-[#8A3FFC]" /> Service
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Migration section */}
                  {(phase === 'migrating' || phase === 'verifying' || phase === 'done') &&
                    migrationResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {/* Migration header */}
                        <div className="flex items-center justify-between rounded-xl border border-border-default bg-white px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ibm-blue-10">
                              <Code2 className="h-4.5 w-4.5 text-ibm-blue" />
                            </div>
                            <div>
                              <p className="text-[14px] font-semibold text-text-primary">
                                Migration:{' '}
                                <code className="font-mono">{migrationResult.original_package}</code>
                                {' → '}
                                <code className="font-mono text-ibm-blue">
                                  {migrationResult.replacement_package}@{migrationResult.replacement_version}
                                </code>
                              </p>
                              <p className="text-[12px] text-text-tertiary">
                                {migrationResult.files_changed} file{migrationResult.files_changed !== 1 ? 's' : ''} changed
                              </p>
                            </div>
                          </div>

                          {phase === 'migrating' && (
                            <button
                              onClick={handleVerify}
                              className="flex items-center gap-2 rounded-lg bg-ibm-blue px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-ibm-blue-hover transition-colors"
                            >
                              <FlaskConical className="h-4 w-4" />
                              Migrate & Verify
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Code diff */}
                        <CodeDiffView diffs={migrationResult.diffs} />

                        {/* Test results */}
                        {(phase === 'verifying' || phase === 'done') && (
                          <TestResults
                            results={verifyResult}
                            loading={verifyLoading}
                          />
                        )}
                      </motion.div>
                    )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
