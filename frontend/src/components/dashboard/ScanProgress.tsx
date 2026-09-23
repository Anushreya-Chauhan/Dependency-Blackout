'use client';

import { motion } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';
import { SCAN_STAGES } from '@/lib/constants';

interface ScanProgressProps {
  currentStage: number; // -1 = not started, 0-4 = stage index, 5 = done
  flaggedCount?: number;
}

export default function ScanProgress({
  currentStage,
  flaggedCount = 0,
}: ScanProgressProps) {
  if (currentStage < 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="rounded-lg border border-border-default bg-white overflow-hidden"
    >
      <div className="p-4">
        <div className="space-y-2.5">
          {SCAN_STAGES.map((stage, i) => {
            const isActive = i === currentStage;
            const isDone = i < currentStage;
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="flex items-center gap-3"
              >
                {/* Status icon */}
                <div className="shrink-0">
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-success"
                    >
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="flex h-5 w-5 items-center justify-center"
                    >
                      <Loader2 className="h-5 w-5 text-ibm-blue" />
                    </motion.div>
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-border-default" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[13px] transition-colors ${
                    isDone
                      ? 'text-text-tertiary line-through'
                      : isActive
                      ? 'text-text-primary font-medium'
                      : 'text-text-tertiary'
                  }`}
                >
                  {stage.label}
                  {i === SCAN_STAGES.length - 1 &&
                    (isDone || isActive) &&
                    flaggedCount > 0 &&
                    ` ${flaggedCount} issues found.`}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 rounded-full bg-surface-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-ibm-blue"
            initial={{ width: '0%' }}
            animate={{
              width: `${Math.min(((currentStage + 1) / SCAN_STAGES.length) * 100, 100)}%`,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
