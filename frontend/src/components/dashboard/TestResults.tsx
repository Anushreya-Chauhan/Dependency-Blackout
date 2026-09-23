'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  X,
  Loader2,
  SkipForward,
  FlaskConical,
  ShieldCheck,
} from 'lucide-react';
import { type TestCase, type VerificationResult } from '@/lib/api';

interface TestResultsProps {
  results: VerificationResult | null;
  loading: boolean;
}

type AnimatedTest = TestCase & {
  animState: 'pending' | 'running' | 'done';
};

export default function TestResults({ results, loading }: TestResultsProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border-default bg-white p-8">
        <div className="flex items-center justify-center gap-3 text-text-tertiary">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="h-5 w-5" />
          </motion.div>
          <span className="text-[13px]">Running test suite…</span>
        </div>
      </div>
    );
  }

  if (!results) return null;

  const testRunKey = results.tests
    .map((test) => `${test.name}:${test.status}:${test.duration_ms}`)
    .join('|');

  return <AnimatedTestRun key={testRunKey} results={results} />;
}

function AnimatedTestRun({ results }: { results: VerificationResult }) {
  const [animatedTests, setAnimatedTests] = useState<AnimatedTest[]>(() =>
    results.tests.map((test) => ({ ...test, animState: 'pending' }))
  );
  const [showBanner, setShowBanner] = useState(false);

  // Animate tests sequentially: pending → running → done.
  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let current = 0;

    const schedule = (callback: () => void, delay: number) => {
      timeouts.push(setTimeout(callback, delay));
    };

    const runNext = () => {
      if (current >= animatedTests.length) {
        schedule(() => setShowBanner(true), 400);
        return;
      }

      const testIndex = current;
      setAnimatedTests((previous) =>
        previous.map((test, index) =>
          index === testIndex ? { ...test, animState: 'running' } : test
        )
      );

      schedule(() => {
        setAnimatedTests((previous) =>
          previous.map((test, index) =>
            index === testIndex ? { ...test, animState: 'done' } : test
          )
        );
        current += 1;
        schedule(runNext, 200);
      }, 550);
    };

    schedule(runNext, 300);
    return () => timeouts.forEach(clearTimeout);
  }, [animatedTests.length]);

  return (
    <div className="space-y-4">
      {/* Test list */}
      <div className="rounded-xl border border-border-default bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-border-default bg-surface-secondary">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-text-tertiary" />
            <span className="text-[13px] font-semibold text-text-primary">
              Test Suite
            </span>
            <span className="text-[11px] text-text-tertiary">
              ({results.total_tests} tests)
            </span>
          </div>
        </div>

        <div className="divide-y divide-border-default">
          {animatedTests.map((test, i) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between px-4 py-2.5"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Status icon */}
                <div className="shrink-0">
                  {test.animState === 'done' ? (
                    test.status === 'pass' ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-success"
                      >
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </motion.div>
                    ) : test.status === 'fail' ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-danger"
                      >
                        <X className="h-3 w-3 text-white" strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-text-tertiary"
                      >
                        <SkipForward className="h-3 w-3 text-white" />
                      </motion.div>
                    )
                  ) : test.animState === 'running' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 className="h-5 w-5 text-ibm-blue" />
                    </motion.div>
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-border-default" />
                  )}
                </div>

                {/* Test info */}
                <div className="min-w-0">
                  <p
                    className={`text-[12px] font-medium truncate ${
                      test.animState === 'done'
                        ? test.status === 'pass'
                          ? 'text-text-primary'
                          : test.status === 'fail'
                          ? 'text-danger'
                          : 'text-text-tertiary'
                        : test.animState === 'running'
                        ? 'text-ibm-blue'
                        : 'text-text-tertiary'
                    }`}
                  >
                    {test.name}
                  </p>
                  <p className="text-[10px] text-text-tertiary font-mono">{test.file}</p>
                </div>
              </div>

              {/* Duration */}
              {test.animState === 'done' && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] font-mono text-text-tertiary shrink-0 ml-2"
                >
                  {test.duration_ms}ms
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Verification banner */}
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className={`rounded-xl border-2 p-5 text-center ${
            results.overall_status === 'pass'
              ? 'border-success-border bg-success-bg'
              : 'border-danger-border bg-danger-bg'
          }`}
        >
          <div className="flex items-center justify-center gap-2.5">
            {results.overall_status === 'pass' ? (
              <ShieldCheck className="h-6 w-6 text-success" />
            ) : (
              <X className="h-6 w-6 text-danger" />
            )}
            <span
              className={`text-[16px] font-bold ${
                results.overall_status === 'pass' ? 'text-success' : 'text-danger'
              }`}
            >
              {results.overall_status === 'pass'
                ? 'Verification Complete ✓'
                : 'Verification Failed'}
            </span>
          </div>
          <p className="mt-2 text-[13px] text-text-secondary">
            {results.passed} passed · {results.failed} failed · {results.skipped} skipped
            · {results.duration_ms}ms total
          </p>
        </motion.div>
      )}
    </div>
  );
}
