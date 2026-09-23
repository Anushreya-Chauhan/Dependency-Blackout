'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  AlertTriangle,
  Shield,
  Download,
  Calendar,
  Scale,
  ArrowRight,
  Star,
} from 'lucide-react';
import { api, type ReplacementCandidate, type ReplacementResult } from '@/lib/api';

interface NodeData {
  label?: string;
  nodeType?: string;
  isFlagged?: boolean;
  riskType?: string;
  riskSummary?: string;
  version?: string;
  cveId?: string;
  cveScore?: number;
  ecosystem?: string;
  [key: string]: unknown;
}

interface PackageDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string | null;
  ecosystem: string;
  nodeData?: NodeData;
  onSelectReplacement: (original: string, replacement: string) => void;
}

const riskTypeConfig: Record<string, { label: string; color: string; bg: string }> = {
  malicious: { label: 'Malicious', color: 'text-white', bg: 'bg-danger' },
  vulnerable: { label: 'Vulnerable', color: 'text-white', bg: 'bg-[#FF832B]' },
  deprecated: { label: 'Deprecated', color: 'text-white', bg: 'bg-warning' },
  unavailable: { label: 'Unavailable', color: 'text-white', bg: 'bg-text-tertiary' },
};

export default function PackageDetailPanel({
  isOpen,
  onClose,
  packageName,
  ecosystem,
  nodeData,
  onSelectReplacement,
}: PackageDetailPanelProps) {
  const riskType = nodeData?.riskType;
  const riskConfig = riskType ? riskTypeConfig[riskType] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="absolute right-0 top-0 bottom-0 w-[380px] max-w-full border-l border-border-default bg-white z-30 overflow-y-auto shadow-[-4px_0_24px_rgba(0,0,0,0.06)]"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-border-default bg-white px-5 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-text-primary">
                Package Details
              </h3>
              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-surface-secondary transition-colors"
              >
                <X className="h-4 w-4 text-text-tertiary" />
              </button>
            </div>
          </div>

          <div className="p-5 space-y-6">
            {/* Package info */}
            <div>
              <div className="flex items-center gap-2">
                <code className="text-[16px] font-mono font-semibold text-text-primary">
                  {packageName}
                </code>
              </div>
              {nodeData?.version && (
                <p className="mt-1 text-[12px] font-mono text-text-tertiary">
                  v{String(nodeData.version)}
                </p>
              )}

              {/* Risk badge */}
              {riskConfig && (
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${riskConfig.bg} ${riskConfig.color}`}
                  >
                    <AlertTriangle className="h-3 w-3" />
                    {riskConfig.label}
                  </span>
                </div>
              )}

              {/* Risk description */}
              {nodeData?.riskSummary && (
                <p className="mt-3 text-[13px] leading-relaxed text-text-secondary">
                  {String(nodeData.riskSummary)}
                </p>
              )}

              {/* CVE info */}
              {nodeData?.cveId && (
                <div className="mt-3 rounded-lg border border-danger-border bg-danger-bg p-3">
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-danger" />
                    <span className="text-[12px] font-mono font-semibold text-danger">
                      {String(nodeData.cveId)}
                    </span>
                  </div>
                  {nodeData?.cveScore && (
                    <p className="mt-1 text-[11px] text-text-secondary">
                      CVSS Score: {Number(nodeData.cveScore)}/10
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Replacement candidates */}
            {nodeData?.isFlagged && (
              <div>
                <h4 className="text-[12px] font-semibold uppercase tracking-wider text-text-tertiary mb-3">
                  Replacement Candidates
                </h4>

                {packageName && (
                  <ReplacementCandidates
                    key={`${ecosystem}:${packageName}`}
                    ecosystem={ecosystem}
                    packageName={packageName}
                    onSelectReplacement={onSelectReplacement}
                  />
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ReplacementCandidates({
  ecosystem,
  packageName,
  onSelectReplacement,
}: {
  ecosystem: string;
  packageName: string;
  onSelectReplacement: (original: string, replacement: string) => void;
}) {
  const [replacements, setReplacements] = useState<ReplacementResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .getReplacements(ecosystem, packageName)
      .then((result) => {
        if (!cancelled) setReplacements(result);
      })
      .catch(() => {
        if (!cancelled) setReplacements(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ecosystem, packageName]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-28 rounded-lg border border-border-default animate-shimmer" />
        ))}
      </div>
    );
  }

  if (!replacements?.candidates) {
    return <p className="text-[13px] text-text-tertiary">No replacements available.</p>;
  }

  return (
    <div className="space-y-3">
      {replacements.candidates.map((candidate, i) => (
        <CandidateCard
          key={candidate.name}
          candidate={candidate}
          rank={i + 1}
          onSelect={() => onSelectReplacement(packageName, candidate.name)}
        />
      ))}
    </div>
  );
}

function CandidateCard({
  candidate,
  rank,
  onSelect,
}: {
  candidate: ReplacementCandidate;
  rank: number;
  onSelect: () => void;
}) {
  const confidenceColor =
    candidate.confidence >= 90
      ? 'text-success'
      : candidate.confidence >= 80
      ? 'text-ibm-blue'
      : 'text-warning';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className="rounded-xl border border-border-default p-4 hover:border-ibm-blue hover:shadow-[0_2px_12px_rgba(15,98,254,0.08)] transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            {rank === 1 && <Star className="h-3.5 w-3.5 text-warning fill-warning" />}
            <code className="text-[13px] font-mono font-semibold text-text-primary">
              {candidate.name}
            </code>
          </div>
          <p className="mt-0.5 text-[11px] font-mono text-text-tertiary">
            v{candidate.version}
          </p>
        </div>
        <div className={`text-[18px] font-bold ${confidenceColor}`}>
          {candidate.confidence}%
        </div>
      </div>

      <p className="mt-2 text-[12px] text-text-secondary leading-relaxed">
        {candidate.rationale}
      </p>

      {/* Meta */}
      <div className="mt-3 flex items-center gap-3 text-[10px] text-text-tertiary">
        <span className="flex items-center gap-1">
          <Download className="h-3 w-3" />
          {candidate.weekly_downloads}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {candidate.last_updated}
        </span>
        <span className="flex items-center gap-1">
          <Scale className="h-3 w-3" />
          {candidate.license}
        </span>
      </div>

      {/* Select button */}
      <button
        onClick={onSelect}
        className="mt-3 flex items-center justify-center gap-1.5 w-full rounded-lg bg-ibm-blue-10 px-3 py-2 text-[12px] font-semibold text-ibm-blue transition-all hover:bg-ibm-blue hover:text-white"
      >
        Select Replacement
        <ArrowRight className="h-3 w-3" />
      </button>
    </motion.div>
  );
}
