'use client';

import { motion } from 'motion/react';
import { Radar } from 'lucide-react';

interface ScanButtonProps {
  onClick: () => void;
  disabled: boolean;
  scanning: boolean;
}

export default function ScanButton({
  onClick,
  disabled,
  scanning,
}: ScanButtonProps) {
  return (
    <motion.button
      whileHover={!disabled && !scanning ? { scale: 1.01 } : {}}
      whileTap={!disabled && !scanning ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || scanning}
      className={`
        flex items-center justify-center gap-2.5 w-full rounded-lg px-5 py-3
        text-[14px] font-semibold transition-all
        ${
          disabled
            ? 'bg-surface-secondary text-text-tertiary cursor-not-allowed'
            : scanning
            ? 'bg-ibm-blue text-white cursor-wait'
            : 'bg-ibm-blue text-white hover:bg-ibm-blue-hover shadow-[0_1px_4px_rgba(15,98,254,0.3)]'
        }
      `}
    >
      {scanning ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          >
            <Radar className="h-4.5 w-4.5" />
          </motion.div>
          Scanning…
        </>
      ) : (
        <>
          <Radar className="h-4.5 w-4.5" />
          Scan Dependencies
        </>
      )}
    </motion.button>
  );
}
