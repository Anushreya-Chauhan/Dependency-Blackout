'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Shield, AlertTriangle, Zap } from 'lucide-react';

/* Animated background mini-graph (decorative SVG) */
function MiniGraph() {
  const nodes = [
    { x: 120, y: 80, safe: true },
    { x: 280, y: 40, safe: true },
    { x: 400, y: 100, safe: false },
    { x: 200, y: 180, safe: true },
    { x: 340, y: 200, safe: false },
    { x: 500, y: 60, safe: true },
    { x: 480, y: 190, safe: true },
    { x: 60, y: 170, safe: true },
  ];

  const edges = [
    [0, 1], [1, 2], [0, 3], [3, 4], [2, 5], [4, 6], [7, 0], [1, 5], [3, 4],
  ];

  return (
    <svg
      viewBox="0 0 560 260"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Edges */}
      {edges.map(([from, to], i) => {
        const f = nodes[from];
        const t = nodes[to];
        const isDanger = !nodes[from].safe || !nodes[to].safe;
        return (
          <motion.line
            key={`edge-${i}`}
            x1={f.x}
            y1={f.y}
            x2={t.x}
            y2={t.y}
            stroke={isDanger ? '#DA1E28' : '#E0E0E0'}
            strokeWidth={isDanger ? 2 : 1.5}
            strokeOpacity={isDanger ? 0.5 : 0.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.g key={`node-${i}`}>
          {/* Pulse ring for danger nodes */}
          {!node.safe && (
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={12}
              fill="none"
              stroke="#DA1E28"
              strokeWidth={1.5}
              initial={{ r: 8, opacity: 0.5 }}
              animate={{ r: 24, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: i * 0.3,
              }}
            />
          )}
          <motion.circle
            cx={node.x}
            cy={node.y}
            r={8}
            fill={node.safe ? '#FFFFFF' : '#FFF1F1'}
            stroke={node.safe ? '#E0E0E0' : '#DA1E28'}
            strokeWidth={2}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
          />
          <motion.circle
            cx={node.x}
            cy={node.y}
            r={3}
            fill={node.safe ? '#24A148' : '#DA1E28'}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
          />
        </motion.g>
      ))}
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-subtle opacity-60" />

      <div className="relative mx-auto max-w-[1280px] px-6 pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div className="max-w-xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-ibm-blue-10 border border-ibm-blue-light px-3.5 py-1.5 mb-6"
            >
              <Shield className="h-3.5 w-3.5 text-ibm-blue" />
              <span className="text-[12px] font-medium text-ibm-blue tracking-wide">
                IBM HACKATHON 2026
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[2.75rem] lg:text-[3.25rem] font-bold leading-[1.1] tracking-[-0.025em] text-text-primary"
            >
              Your dependencies
              <br />
              are a{' '}
              <span className="relative">
                <span className="text-danger">liability.</span>
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-danger rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  style={{ transformOrigin: 'left' }}
                />
              </span>
              <br />
              <span className="text-ibm-blue">We make them safe.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-5 text-[17px] leading-relaxed text-text-secondary max-w-lg"
            >
              Detect compromised packages, trace their blast radius, and
              auto-migrate to safe alternatives — before your users find out.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-ibm-blue px-5 py-3 text-[14px] font-semibold text-white transition-all hover:bg-ibm-blue-hover active:scale-[0.97] shadow-[0_1px_3px_rgba(15,98,254,0.3)]"
              >
                Launch Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/architecture"
                className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-surface-primary px-5 py-3 text-[14px] font-medium text-text-primary transition-all hover:bg-surface-secondary active:scale-[0.97]"
              >
                View Architecture
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-10 flex items-center gap-6 text-text-tertiary"
            >
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span className="text-[12px]">CVE Database</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                <span className="text-[12px]">Real-time Scanning</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                <span className="text-[12px]">AI-Powered Fixes</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Mini Graph */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl border border-border-default bg-white/50 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              {/* Header bar */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border-default">
                <div className="h-3 w-3 rounded-full bg-danger" />
                <div className="h-3 w-3 rounded-full bg-warning" />
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="ml-2 text-[11px] font-mono text-text-tertiary">
                  dependency-graph.viz
                </span>
              </div>
              <MiniGraph />
              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border-default">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-success" />
                  <span className="text-[11px] text-text-tertiary">Safe</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-danger animate-pulse" />
                  <span className="text-[11px] text-text-tertiary">At Risk</span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-3 -right-3 rounded-lg bg-danger-bg border border-danger-border px-3 py-2 shadow-lg"
            >
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-danger" />
                <span className="text-[11px] font-semibold text-danger">
                  2 vulnerabilities
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
