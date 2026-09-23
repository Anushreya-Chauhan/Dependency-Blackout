'use client';

import { motion } from 'motion/react';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import { Package, Clock, CheckCircle } from 'lucide-react';

const stats = [
  {
    value: 8200000,
    suffix: 'M+',
    label: 'packages monitored',
    icon: <Package className="h-4 w-4" />,
  },
  {
    value: 4,
    prefix: '< ',
    suffix: 's',
    label: 'average scan time',
    icon: <Clock className="h-4 w-4" />,
  },
  {
    value: 97.3,
    suffix: '%',
    label: 'migration success rate',
    icon: <CheckCircle className="h-4 w-4" />,
  },
];

export default function StatsBar() {
  return (
    <section className="relative py-16 bg-[#161616]">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-white/10 text-ibm-blue mb-3">
                {stat.icon}
              </div>
              <div className="text-[2.5rem] font-bold text-white">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <p className="mt-1 text-[13px] text-white/60">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
