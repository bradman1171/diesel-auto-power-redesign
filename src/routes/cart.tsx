import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { PRODUCTS, formatPrice } from "@/data/products";
import { lineCoreDeposit, useCart } from "@/lib/cart";
import { Summary } from "@/components/site/CartSummary";
import { ProductImage } from "@/components/site/ProductImage";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | Diesel Auto Power" },
      { name: "description", content: "Review the parts in your demonstration cart." },
      { property: "og:title", content: "Cart | Diesel Auto Power" },
      { property: "og:description", content: "Demonstration shopping cart." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, totals, setQty, remove } = useCart();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-extrabold uppercase sm:text-5xl">Your cart</h1>
      {lines.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Link to="/shop/$category" params={{ category: "engine-parts" }} className="btn btn-primary mt-6">Shop engine parts</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {lines.map((l) => {
              const p = PRODUCTS.find((x) => x.slug === l.slug);
              if (!p) return null;
              const dep = lineCoreDeposit(p, l);
              return (
                <li key={l.key} className="flex gap-4 p-4">
                  <Link to="/product/$slug" params={{ slug: p.slug }} className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                    <ProductImage p={p} />
                  </Link>
                  <div className="flex flex-1 flex-col gap-1">
                    <Link to="/product/$slug" params={{ slug: p.slug }} className="font-display text-lg font-semibold leading-tight hover:text-primary">{p.name}</Link>
                    <p className="text-xs text-muted-foreground">SKU {p.sku} · {formatPrice(p.price)} each</p>
                    {l.core && (
                      <p className="text-xs font-semibold text-primary">
                        {l.core === "deposit" ? `Refundable core deposit: ${formatPrice(dep)}${p.core?.illustrative ? " (illustrative amount)" : ""}` : "Sending core first — ships when DAP receives your core"}
                      </p>
                    )}
                    {l.core && (
                      <p className="text-xs text-muted-foreground">Return core within 30 days of order for full credit.</p>
                    )}
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center rounded-md border border-border">
                        <button onClick={() => setQty(l.key, l.qty - 1)} className="grid h-10 w-10 place-items-center" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
                        <span className="w-8 text-center font-semibold" aria-live="polite">{l.qty}</span>
                        <button onClick={() => setQty(l.key, l.qty + 1)} className="grid h-10 w-10 place-items-center" aria-label="Increase"><Plus className="h-4 w-4" /></button>
                      </div>
                      <span className="font-display text-xl font-bold">{formatPrice(p.price * l.qty + dep)}</span>
                      <button onClick={() => remove(l.key)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /> Remove</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <Summary totals={totals} />
        </div>
      )}
    </div>
  );
}

