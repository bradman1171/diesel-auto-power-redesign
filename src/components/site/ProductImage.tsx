import { useState } from "react";
import type { Product } from "@/data/products";

/**
 * Tries DAP's live catalog photo first; falls back to a representative studio
 * image (clearly labeled) when the live image can't be loaded.
 */
export function ProductImage({ p, index = 0, className = "", eager = false, showLabel = false }: { p: Product; index?: number; className?: string; eager?: boolean; showLabel?: boolean }) {
  const live = p.liveImages[index];
  const [failed, setFailed] = useState(!live);
  return (
    <div className="relative h-full w-full">
      {failed ? (
        <img src={p.image} alt={`${p.name} (representative image)`} loading={eager ? "eager" : "lazy"} width={816} height={816} className={`h-full w-full object-cover ${className}`} />
      ) : (
        <img src={live} alt={p.name} loading={eager ? "eager" : "lazy"} referrerPolicy="no-referrer" onError={() => setFailed(true)} className={`h-full w-full bg-card object-contain ${className}`} />
      )}
      {failed && showLabel && (
        <span className="absolute bottom-2 right-2 rounded bg-ink/80 px-2 py-0.5 text-[10px] text-ink-foreground">Representative image</span>
      )}
    </div>
  );
}
