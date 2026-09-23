'use client';

import { motion } from 'motion/react';
import { AlertTriangle, Clock } from 'lucide-react';

const timeline = [
  {
    date: 'Sept 2018',
    event: 'Maintainer of event-stream hands off project to anonymous contributor',
    severity: 'warning',
  },
  {
    date: 'Oct 2018',
    event: 'Malicious flatmap-stream dependency injected — targets Bitcoin wallets',
    severity: 'danger',
  },
  {
    date: 'Nov 2018',
    event: 'Community discovers backdoor by accident after 8M+ downloads',
    severity: 'danger',
  },
  {
    date: 'Today',
    event: 'Most CI pipelines still lack proactive dependency threat detection',
    severity: 'warning',
  },
];

export default function ProblemSection() {
  return (
    <section className="relative py-24 bg-surface-secondary">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Narrative */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[12px] font-semibold uppercase tracking-widest text-danger">
                The Problem
              </span>
              <h2 className="mt-3 text-[2rem] lg:text-[2.5rem] font-bold leading-tight tracking-[-0.02em] text-text-primary">
                One compromised package.
                <br />
                <span className="text-danger">Eight million downloads.</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 space-y-4"
            >
              <p className="text-[15px] leading-relaxed text-text-secondary">
                In November 2018, a maintainer handed off the popular{' '}
                <code className="rounded bg-[#E8E8E8] px-1.5 py-0.5 font-mono text-[13px] text-text-primary">
                  event-stream
                </code>{' '}
                npm package to a stranger. Within weeks,{' '}
                <strong className="text-text-primary">
                  8 million downloads contained a backdoor
                </strong>{' '}
                targeting Bitcoin wallets.
              </p>
              <p className="text-[15px] leading-relaxed text-text-secondary">
                The community discovered it by accident. Your CI pipeline never
                flagged it. This isn&apos;t a hypothetical — it&apos;s a pattern that
                repeats across every package ecosystem.
              </p>
            </motion.div>

            {/* Stats cards */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 grid grid-cols-2 gap-3"
            >
              <div className="rounded-xl border border-danger-border bg-danger-bg p-4">
                <div className="text-[28px] font-bold text-danger">62%</div>
                <p className="mt-1 text-[12px] text-text-secondary leading-snug">
                  of commercial codebases contain at least one known-vulnerable
                  dependency
                </p>
                <p className="mt-2 text-[10px] text-text-tertiary">
                  Synopsys 2023 OSSRA Report
                </p>
              </div>
              <div className="rounded-xl border border-border-default bg-white p-4">
                <div className="text-[28px] font-bold text-text-primary">17,000+</div>
                <p className="mt-1 text-[12px] text-text-secondary leading-snug">
                  malicious packages detected on npm, PyPI, and RubyGems in 2023
                  alone
                </p>
                <p className="mt-2 text-[10px] text-text-tertiary">
                  Sonatype State of Software Supply Chain
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl border border-border-default bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-4 w-4 text-text-tertiary" />
                <span className="text-[13px] font-semibold text-text-primary">
                  event-stream incident timeline
                </span>
              </div>

              <div className="space-y-0">
                {timeline.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.12 }}
                    className="relative flex gap-4 pb-6 last:pb-0"
                  >
                    {/* Vertical line */}
                    {i < timeline.length - 1 && (
                      <div className="absolute left-[11px] top-7 bottom-0 w-px bg-border-default" />
                    )}

                    {/* Dot */}
                    <div
                      className={`relative z-10 mt-1.5 h-[22px] w-[22px] shrink-0 rounded-full border-2 flex items-center justify-center ${
                        item.severity === 'danger'
                          ? 'border-danger bg-danger-bg'
                          : 'border-warning bg-warning-bg'
                      }`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          item.severity === 'danger'
                            ? 'bg-danger'
                            : 'bg-warning'
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <div className="pt-0.5">
                      <span className="text-[11px] font-mono font-medium text-text-tertiary uppercase tracking-wider">
                        {item.date}
                      </span>
                      <p className="mt-1 text-[13px] leading-relaxed text-text-primary">
                        {item.event}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating alert */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="mt-4 rounded-xl border border-danger-border bg-danger-bg p-4"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-danger mt-0.5 shrink-0" />
                <div>
                  <p className="text-[13px] font-medium text-danger">
                    This happens more often than you think
                  </p>
                  <p className="mt-1 text-[12px] text-text-secondary leading-relaxed">
                    colors.js, faker.js, ua-parser-js, node-ipc — the list of
                    compromised packages keeps growing. Manual audits can&apos;t
                    keep up.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
