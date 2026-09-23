'use client';

import { motion } from 'motion/react';
import {
  Search,
  GitBranch,
  ArrowLeftRight,
  Code,
  FlaskConical,
  ShieldCheck,
} from 'lucide-react';
import { PIPELINE_STEPS } from '@/lib/constants';

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="h-5 w-5" />,
  GitBranch: <GitBranch className="h-5 w-5" />,
  ArrowLeftRight: <ArrowLeftRight className="h-5 w-5" />,
  Code: <Code className="h-5 w-5" />,
  FlaskConical: <FlaskConical className="h-5 w-5" />,
  ShieldCheck: <ShieldCheck className="h-5 w-5" />,
};

export default function PipelineSteps() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-[12px] font-semibold uppercase tracking-widest text-ibm-blue">
            How It Works
          </span>
          <h2 className="mt-3 text-[2rem] lg:text-[2.5rem] font-bold leading-tight tracking-[-0.02em] text-text-primary">
            Six steps to safe dependencies
          </h2>
          <p className="mt-3 text-[15px] text-text-secondary max-w-lg mx-auto">
            From detection to verification — a complete, automated pipeline that
            handles the entire remediation lifecycle.
          </p>
        </motion.div>

        {/* Pipeline grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PIPELINE_STEPS.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group relative"
            >
              <div className="relative h-full rounded-xl border border-border-default bg-white p-6 transition-all duration-300 hover:border-ibm-blue hover:shadow-[0_4px_20px_rgba(15,98,254,0.08)]">
                {/* Step number */}
                <div className="absolute top-4 right-4 text-[11px] font-mono font-medium text-text-tertiary">
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ibm-blue-10 text-ibm-blue transition-colors group-hover:bg-ibm-blue group-hover:text-white">
                  {iconMap[step.icon]}
                </div>

                {/* Content */}
                <h3 className="mt-4 text-[15px] font-semibold text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                  {step.description}
                </p>

                {/* Connecting line to next step */}
                {i < PIPELINE_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2">
                    {(i + 1) % 3 !== 0 && (
                      <div className="h-px w-4 bg-border-default" />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
