'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Package } from 'lucide-react';
import { api, type RepoInfo } from '@/lib/api';

interface RepoSelectorProps {
  selectedRepo: string | null;
  onSelect: (repoId: string) => void;
  onBackendUnavailable?: () => void;
  disabled?: boolean;
}

const ecosystemBadgeColors: Record<string, string> = {
  npm: 'bg-[#FFF0F0] text-[#CB3837] border-[#FFD4D4]',
  pypi: 'bg-[#EDF4FF] text-[#3776AB] border-[#C5DAFF]',
};

export default function RepoSelector({
  selectedRepo,
  onSelect,
  onBackendUnavailable,
  disabled = false,
}: RepoSelectorProps) {
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getRepos()
      .then(setRepos)
      .catch(() => {
        onBackendUnavailable?.();
        // Fallback mock data if backend unavailable
        setRepos([
          {
            id: 'acme-storefront',
            name: 'acme-commerce/storefront',
            ecosystem: 'npm',
            description: 'Node.js e-commerce storefront',
            package_count: 8,
            manifest_file: 'package.json',
          },
          {
            id: 'acme-data-pipeline',
            name: 'acme-analytics/data-pipeline',
            ecosystem: 'pypi',
            description: 'Python analytics data pipeline',
            package_count: 7,
            manifest_file: 'requirements.txt',
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, [onBackendUnavailable]);

  const selected = repos.find((r) => r.id === selectedRepo);

  return (
    <div className="relative">
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
        Repository
      </label>

      <button
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`
          flex items-center justify-between w-full rounded-lg border px-3.5 py-2.5
          text-left transition-all
          ${
            disabled
              ? 'border-border-default bg-surface-secondary cursor-not-allowed opacity-60'
              : open
              ? 'border-ibm-blue bg-white shadow-[0_0_0_2px_rgba(15,98,254,0.12)]'
              : 'border-border-default bg-white hover:border-ibm-blue'
          }
        `}
      >
        {selected ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-secondary">
              <Package className="h-3.5 w-3.5 text-text-secondary" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-text-primary truncate">
                {selected.name}
              </p>
              <p className="text-[11px] text-text-tertiary">{selected.description}</p>
            </div>
          </div>
        ) : (
          <span className="text-[13px] text-text-tertiary">
            {loading ? 'Loading repositories…' : 'Select a repository'}
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 text-text-tertiary shrink-0 ml-2 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full rounded-lg border border-border-default bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden"
          >
            {repos.map((repo) => (
              <button
                key={repo.id}
                onClick={() => {
                  onSelect(repo.id);
                  setOpen(false);
                }}
                className={`
                  flex items-center gap-3 w-full px-3.5 py-3 text-left transition-colors
                  ${
                    repo.id === selectedRepo
                      ? 'bg-ibm-blue-10'
                      : 'hover:bg-surface-secondary'
                  }
                `}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-secondary">
                  <Package className="h-4 w-4 text-text-secondary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-text-primary">
                    {repo.name}
                  </p>
                  <p className="text-[11px] text-text-tertiary mt-0.5">
                    {repo.description} · {repo.package_count} packages
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    ecosystemBadgeColors[repo.ecosystem] || ''
                  }`}
                >
                  {repo.ecosystem}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
