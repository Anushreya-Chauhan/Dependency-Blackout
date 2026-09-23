'use client';

import { motion } from 'motion/react';
import { type DiffFile } from '@/lib/api';

interface CodeDiffViewProps {
  diffs: DiffFile[];
}

/**
 * Side-by-side code diff viewer. Uses a simplified inline diff
 * approach since react-diff-viewer-continued may not be installed.
 * Falls back gracefully to styled code blocks.
 */
export default function CodeDiffView({ diffs }: CodeDiffViewProps) {
  if (!diffs || diffs.length === 0) return null;

  return (
    <div className="space-y-4">
      {diffs.map((diff, i) => (
        <motion.div
          key={diff.filename}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          className="rounded-xl border border-border-default overflow-hidden"
        >
          {/* File header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-surface-secondary border-b border-border-default">
            <span className="text-[12px] font-mono font-medium text-text-primary">
              {diff.filename}
            </span>
            <span className="text-[10px] font-mono text-text-tertiary uppercase">
              {diff.language}
            </span>
          </div>

          {/* Side-by-side diff */}
          <div className="grid grid-cols-2 divide-x divide-border-default">
            {/* Before */}
            <div>
              <div className="px-3 py-1.5 bg-danger-bg border-b border-border-default">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-danger">
                  Before
                </span>
              </div>
              <pre className="p-4 text-[12px] font-mono leading-[1.8] text-text-primary overflow-x-auto bg-white">
                {diff.old_code.split('\n').map((line, lineIdx) => (
                  <div
                    key={lineIdx}
                    className="flex"
                  >
                    <span className="shrink-0 w-8 text-right pr-3 text-text-tertiary select-none">
                      {lineIdx + 1}
                    </span>
                    <span className={
                      !diff.new_code.split('\n').includes(line) && line.trim()
                        ? 'bg-[#FFE0E0] -mx-1 px-1 rounded'
                        : ''
                    }>
                      {line || '\u00A0'}
                    </span>
                  </div>
                ))}
              </pre>
            </div>

            {/* After */}
            <div>
              <div className="px-3 py-1.5 bg-success-bg border-b border-border-default">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-success">
                  After
                </span>
              </div>
              <pre className="p-4 text-[12px] font-mono leading-[1.8] text-text-primary overflow-x-auto bg-white">
                {diff.new_code.split('\n').map((line, lineIdx) => (
                  <div
                    key={lineIdx}
                    className="flex"
                  >
                    <span className="shrink-0 w-8 text-right pr-3 text-text-tertiary select-none">
                      {lineIdx + 1}
                    </span>
                    <span className={
                      !diff.old_code.split('\n').includes(line) && line.trim()
                        ? 'bg-[#D4EDDA] -mx-1 px-1 rounded'
                        : ''
                    }>
                      {line || '\u00A0'}
                    </span>
                  </div>
                ))}
              </pre>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
