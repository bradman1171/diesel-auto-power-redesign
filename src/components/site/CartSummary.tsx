import { Link } from "@tanstack/react-router";
import { FREE_SHIP_THRESHOLD, formatPrice } from "@/data/products";
import type { CartTotals } from "@/lib/cart";

export function Summary({ totals, cta = true }: { totals: CartTotals; cta?: boolean }) {
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - totals.merchandise);
  const pct = Math.min(100, (totals.merchandise / FREE_SHIP_THRESHOLD) * 100);
  return (
    <aside className="h-fit space-y-3 rounded-lg border border-border bg-card p-6 lg:sticky lg:top-44">
      <h2 className="text-2xl font-bold uppercase">Summary</h2>
      <Row k={`Merchandise (${totals.count})`} v={formatPrice(totals.merchandise)} />
      {totals.coreDeposits > 0 && <Row k="Refundable core deposits" v={formatPrice(totals.coreDeposits)} />}
      <Row k="Shipping" v="Calculated at checkout" />
      <div className="border-t border-border pt-3"><Row k="Total" v={formatPrice(totals.total)} strong /></div>
      <div className="rounded-md bg-muted p-3 text-xs">
        <div className="h-1.5 overflow-hidden rounded-full bg-border"><div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div>
        <p className="mt-2">
          {remaining > 0 ? <>Add <strong>{formatPrice(remaining)}</strong> in qualifying items for free standard shipping.</> : <><strong>Your qualifying items may ship free.</strong></>}
        </p>
        <p className="mt-1 text-muted-foreground">Qualifying items $149+, UPS/FedEx/USPS, lower 48 only; freight excluded. Final eligibility set at checkout.</p>
      </div>
      {cta && <Link to="/checkout" className="btn btn-primary w-full">Checkout (demo)</Link>}
      <Link to="/shop/$category" params={{ category: "all" }} className="block text-center text-sm text-muted-foreground hover:text-foreground">Continue shopping</Link>
    </aside>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "font-display text-2xl font-bold" : "text-sm"}`}>
      <span className={strong ? "" : "text-muted-foreground"}>{k}</span><span>{v}</span>
    </div>
  );
}
