'use client';

import { motion } from 'motion/react';
import {
  Shield,
  Code2,
  Building2,
  Repeat,
  ArrowRight,
  CheckCircle,
  Circle,
  Zap,
  GitBranch,
  Boxes,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

const modules = [
  {
    id: 'dep-blackout',
    title: 'Dependency Blackout',
    description:
      'Real-time dependency vulnerability detection, impact analysis, and automated remediation.',
    icon: <Shield className="h-6 w-6" />,
    status: 'active' as const,
    features: [
      'CVE & malware detection',
      'Dependency impact graph',
      'AI-ranked replacements',
      'Automated code migration',
      'Verification test suite',
    ],
  },
  {
    id: 'code-rescue',
    title: 'Code Rescue',
    description:
      'Detects and auto-fixes deprecated API usage, anti-patterns, and dead code across your codebase.',
    icon: <Code2 className="h-6 w-6" />,
    status: 'planned' as const,
    features: [
      'Deprecated API detection',
      'Auto-refactoring suggestions',
      'Dead code elimination',
      'Pattern migration',
    ],
  },
  {
    id: 'arch-autopilot',
    title: 'Architecture Autopilot',
    description:
      'Continuously monitors architectural drift, circular dependencies, and module boundary violations.',
    icon: <Building2 className="h-6 w-6" />,
    status: 'planned' as const,
    features: [
      'Architectural rule enforcement',
      'Circular dependency detection',
      'Module boundary analysis',
      'Technical debt scoring',
    ],
  },
  {
    id: 'migration-os',
    title: 'Migration OS',
    description:
      'Full-stack framework and language migration engine — React to Next.js, REST to GraphQL, and more.',
    icon: <Repeat className="h-6 w-6" />,
    status: 'future' as const,
    features: [
      'Framework migrations',
      'API protocol upgrades',
      'Language transpilation',
      'Incremental rollout support',
    ],
  },
];

const statusConfig = {
  active: {
    label: 'Active',
    bg: 'bg-success-bg',
    border: 'border-success-border',
    text: 'text-success',
    dot: 'bg-success',
  },
  planned: {
    label: 'Planned',
    bg: 'bg-ibm-blue-10',
    border: 'border-ibm-blue-light',
    text: 'text-ibm-blue',
    dot: 'bg-ibm-blue',
  },
  future: {
    label: 'Future',
    bg: 'bg-surface-secondary',
    border: 'border-border-default',
    text: 'text-text-tertiary',
    dot: 'bg-text-tertiary',
  },
};

const timelineItems = [
  { quarter: 'Q3 2026', title: 'Dependency Blackout v1.0', status: 'done' as const },
  { quarter: 'Q4 2026', title: 'Code Rescue Beta', status: 'current' as const },
  { quarter: 'Q1 2027', title: 'Architecture Autopilot Alpha', status: 'upcoming' as const },
  { quarter: 'Q2 2027', title: 'Migration OS Preview', status: 'upcoming' as const },
  { quarter: 'Q3 2027', title: 'Unified Platform GA', status: 'upcoming' as const },
];

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative border-b border-border-default bg-surface-secondary">
        <div className="absolute inset-0 bg-grid-subtle opacity-40" />
        <div className="relative mx-auto max-w-[1280px] px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="text-[12px] font-semibold uppercase tracking-widest text-ibm-blue">
              Platform Architecture
            </span>
            <h1 className="mt-3 text-[2.5rem] lg:text-[3rem] font-bold leading-tight tracking-[-0.025em] text-text-primary">
              A complete platform for
              <br />
              <span className="text-ibm-blue">code supply chain safety</span>
            </h1>
            <p className="mt-4 text-[16px] text-text-secondary leading-relaxed">
              Dependency Blackout is the first module in a comprehensive platform
              that protects every layer of your software supply chain.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Platform diagram */}
      <section className="py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          {/* Central diagram */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="relative rounded-2xl border border-border-default bg-surface-secondary p-8 lg:p-12">
              {/* Platform label */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-white border border-border-default px-4 py-2 shadow-sm">
                  <Boxes className="h-4 w-4 text-ibm-blue" />
                  <span className="text-[13px] font-semibold text-text-primary">
                    Supply Chain Protection Platform
                  </span>
                </div>
              </div>

              {/* Module grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {modules.map((mod, i) => {
                  const status = statusConfig[mod.status];
                  const isActive = mod.status === 'active';

                  return (
                    <motion.div
                      key={mod.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className={`
                        relative rounded-xl border-2 bg-white p-5 transition-all
                        ${
                          isActive
                            ? 'border-ibm-blue shadow-[0_4px_20px_rgba(15,98,254,0.12)]'
                            : 'border-border-default opacity-70'
                        }
                      `}
                    >
                      {/* Status badge */}
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.bg} ${status.text} border ${status.border}`}
                      >
                        <div className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </div>

                      {/* Icon */}
                      <div
                        className={`mt-4 flex h-11 w-11 items-center justify-center rounded-xl ${
                          isActive
                            ? 'bg-ibm-blue text-white'
                            : 'bg-surface-secondary text-text-tertiary'
                        }`}
                      >
                        {mod.icon}
                      </div>

                      {/* Content */}
                      <h3
                        className={`mt-4 text-[15px] font-bold ${
                          isActive ? 'text-text-primary' : 'text-text-secondary'
                        }`}
                      >
                        {mod.title}
                      </h3>
                      <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">
                        {mod.description}
                      </p>

                      {/* Features */}
                      <ul className="mt-4 space-y-1.5">
                        {mod.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-2 text-[11px] text-text-secondary"
                          >
                            {isActive ? (
                              <CheckCircle className="h-3 w-3 text-success shrink-0" />
                            ) : (
                              <Circle className="h-3 w-3 text-text-tertiary shrink-0" />
                            )}
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Active glow effect */}
                      {isActive && (
                        <div className="absolute -inset-px rounded-xl bg-ibm-blue/5 pointer-events-none" />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Connection lines (decorative) */}
              <div className="hidden lg:flex items-center justify-center mt-8 gap-3">
                <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Unified security model</span>
                </div>
                <div className="h-4 w-px bg-border-default" />
                <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Shared AI engine</span>
                </div>
                <div className="h-4 w-px bg-border-default" />
                <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
                  <GitBranch className="h-3.5 w-3.5" />
                  <span>Common graph infrastructure</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Roadmap timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <span className="text-[12px] font-semibold uppercase tracking-widest text-ibm-blue">
                Roadmap
              </span>
              <h2 className="mt-2 text-[2rem] font-bold text-text-primary tracking-[-0.02em]">
                Where we&apos;re headed
              </h2>
            </div>

            <div className="relative max-w-2xl mx-auto">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border-default" />

              <div className="space-y-6">
                {timelineItems.map((item, i) => (
                  <motion.div
                    key={item.quarter}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-5"
                  >
                    {/* Dot */}
                    <div className="relative z-10">
                      {item.status === 'done' ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                      ) : item.status === 'current' ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ibm-blue animate-pulse">
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border-default bg-white">
                          <Circle className="h-4 w-4 text-text-tertiary" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div
                      className={`flex-1 rounded-xl border px-5 py-3.5 ${
                        item.status === 'done'
                          ? 'border-success-border bg-success-bg'
                          : item.status === 'current'
                          ? 'border-ibm-blue bg-ibm-blue-10'
                          : 'border-border-default bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[14px] font-semibold text-text-primary">
                            {item.title}
                          </p>
                          <p className="text-[12px] text-text-tertiary font-mono mt-0.5">
                            {item.quarter}
                          </p>
                        </div>
                        {item.status === 'done' && (
                          <span className="text-[10px] font-semibold text-success uppercase tracking-wider">
                            Shipped
                          </span>
                        )}
                        {item.status === 'current' && (
                          <span className="text-[10px] font-semibold text-ibm-blue uppercase tracking-wider">
                            In Progress
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mt-20"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-ibm-blue px-6 py-3.5 text-[14px] font-semibold text-white hover:bg-ibm-blue-hover transition-all active:scale-[0.97] shadow-[0_2px_8px_rgba(15,98,254,0.3)]"
            >
              Try the Live Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
