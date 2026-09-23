'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Shield } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 gradient-hero opacity-50" />

      <div className="relative mx-auto max-w-[1280px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-ibm-blue mb-6">
            <Shield className="h-7 w-7 text-white" />
          </div>

          <h2 className="text-[2rem] lg:text-[2.75rem] font-bold leading-tight tracking-[-0.02em] text-text-primary">
            See it in action.
          </h2>
          <p className="mt-3 text-[16px] text-text-secondary max-w-md mx-auto">
            Walk through a live scan of a real-world dependency graph. Watch
            vulnerabilities get detected, traced, and fixed — in seconds.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2.5 rounded-xl bg-ibm-blue px-7 py-4 text-[15px] font-semibold text-white transition-all hover:bg-ibm-blue-hover active:scale-[0.97] shadow-[0_2px_8px_rgba(15,98,254,0.3)]"
            >
              Launch Demo
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
