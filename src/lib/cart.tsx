/**
 * Demonstration cart (browser-only, localStorage). In production this is Miva's
 * BASK (basket) — add-to-cart posts to Miva's ADPR action with attribute codes.
 */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "@/data/products";

export type CoreOption = "deposit" | "send-first";

export interface CartLine {
  key: string;
  slug: string;
  qty: number;
  core?: CoreOption | undefined;
}

export interface CartTotals {
  merchandise: number;
  coreDeposits: number;
  shipping: number;
  total: number;
  count: number;
}

export function lineKey(slug: string, core?: CoreOption) {
  return core ? `${slug}::${core}` : slug;
}

export function lineCoreDeposit(p: Product, line: CartLine) {
  return p.core && line.core === "deposit" ? p.core.amount * line.qty : 0;
}

export function computeTotals(lines: CartLine[], products: Product[] = PRODUCTS): CartTotals {
  let merchandise = 0;
  let coreDeposits = 0;
  let count = 0;
  for (const l of lines) {
    const p = products.find((x) => x.slug === l.slug);
    if (!p) continue;
    merchandise += p.price * l.qty;
    coreDeposits += lineCoreDeposit(p, l);
    count += l.qty;
  }
  // Illustrative only — real shipping comes from Miva's shipping modules.
  const shipping = 0;
  return { merchandise, coreDeposits, shipping, total: merchandise + coreDeposits + shipping, count };
}

interface CartCtx {
  lines: CartLine[];
  totals: CartTotals;
  add: (slug: string, qty: number, core?: CoreOption) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const STORAGE = "dap-demo-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE, JSON.stringify(lines));
  }, [lines, ready]);

  const value = useMemo<CartCtx>(
    () => ({
      lines,
      totals: computeTotals(lines),
      add: (slug, qty, core) =>
        setLines((prev) => {
          const key = lineKey(slug, core);
          const ex = prev.find((l) => l.key === key);
          if (ex) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
          return [...prev, { key, slug, qty, core }];
        }),
      setQty: (key, qty) =>
        setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty: Math.max(1, Math.min(99, qty)) } : l))),
      remove: (key) => setLines((prev) => prev.filter((l) => l.key !== key)),
      clear: () => setLines([]),
    }),
    [lines],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
