import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#E0E0E0] bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#161616]">
              <Shield className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[13px] font-medium text-[#161616]">
              Dependency Blackout
            </span>
          </div>
          <p className="text-[12px] text-[#525252] leading-relaxed max-w-md">
            Built for the IBM Hackathon. AI-powered dependency failure protection
            for software teams who ship with confidence.
          </p>
          <p className="text-[12px] text-[#525252]">
            © {new Date().getFullYear()} Dependency Blackout
          </p>
        </div>
      </div>
    </footer>
  );
}
