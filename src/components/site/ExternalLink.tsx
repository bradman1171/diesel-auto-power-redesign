import { ExternalLink as Icon } from "lucide-react";
import type { ReactNode } from "react";

/** Link to the LIVE dieselautopower.com site — always opens a new tab and is marked. */
export function LiveLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1 ${className}`}>
      {children}
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
      <span className="sr-only">(opens live dieselautopower.com in a new tab)</span>
    </a>
  );
}
