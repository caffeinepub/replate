import { Building2, Signal } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 app-header-bg border-b border-[oklch(0.26_0.055_255)] shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[oklch(0.52_0.18_255)] flex items-center justify-center shadow-sm">
              <Signal className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-base text-white tracking-tight">
                IT Lead Manager
              </span>
              <span className="text-[10px] text-[oklch(0.72_0.06_240)] font-medium hidden sm:block">
                Navi Mumbai &amp; Mumbai
              </span>
            </div>
          </div>

          <div className="flex-1" />

          {/* Right side indicators */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[oklch(0.72_0.06_240)] text-xs">
              <Building2 className="h-3.5 w-3.5" />
              <span>B2B IT Sales CRM</span>
            </div>
            <div className="h-4 w-px bg-[oklch(0.30_0.055_255)]" />
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[oklch(0.62_0.18_145)] animate-pulse" />
              <span className="text-xs text-[oklch(0.72_0.06_240)]">Live</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
