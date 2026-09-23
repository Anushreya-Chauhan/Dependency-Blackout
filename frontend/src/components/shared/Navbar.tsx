'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/architecture', label: 'Architecture' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50 border-b border-[#E0E0E0] bg-white/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F62FE] transition-colors group-hover:bg-[#0043CE]">
            <Shield className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-[15px] text-[#161616] tracking-[-0.01em]">
            Dependency Blackout
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 text-[13px] font-medium rounded-md transition-colors ${
                  isActive
                    ? 'text-[#0F62FE]'
                    : 'text-[#525252] hover:text-[#161616] hover:bg-[#F4F4F4]'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[#0F62FE] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[#0F62FE] px-4 py-2 text-[13px] font-medium text-white transition-all hover:bg-[#0043CE] active:scale-[0.97]"
        >
          Launch Demo
        </Link>
      </div>
    </motion.header>
  );
}
