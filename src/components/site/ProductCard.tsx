import { Link } from "@tanstack/react-router";
import { Check, ShoppingCart } from "lucide-react";
import { fitStatus, formatPrice, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { useVehicle } from "@/lib/vehicle";
import { ProductImage } from "./ProductImage";
import { toast } from "sonner";

export function ProductCard({ p, view = "grid" }: { p: Product; view?: "grid" | "list" }) {
  const { add } = useCart();
  const { vehicle } = useVehicle();
  const fit = fitStatus(p, vehicle?.engine, vehicle?.year);
  const quickAdd = () => {
    add(p.slug, 1);
    toast.success("Added to cart", { description: p.name });
  };
  const list = view === "list";
  return (
    <article className={`group flex h-full overflow-hidden rounded-lg border border-border bg-card shadow-card transition hover:border-primary/40 hover:shadow-lift ${list ? "flex-row" : "flex-col"}`}>
      <Link to="/product/$slug" params={{ slug: p.slug }} className={`relative block shrink-0 overflow-hidden bg-muted ${list ? "w-32 sm:w-44" : "aspect-square"}`} tabIndex={-1} aria-hidden>
        <ProductImage p={p} className="transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {p.compareAt && <span className="rounded bg-sale px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">Sale</span>}
          {p.isNew && <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">New</span>}
          {p.isDap && <span className="rounded bg-ink px-2 py-0.5 text-[10px] font-bold uppercase text-ink-foreground">DAP</span>}
        </div>
        {p.core && <span className="absolute bottom-2 left-2 rounded bg-ink/85 px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-foreground">Core exchange</span>}
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{p.brand} · <span className="font-mono normal-case tracking-normal">{p.sku}</span></p>
        <Link to="/product/$slug" params={{ slug: p.slug }} className="line-clamp-2 min-h-[2.6em] font-display text-[17px] font-semibold leading-tight hover:text-primary">
          {p.name}
        </Link>
        <p className="line-clamp-1 text-sm text-muted-foreground">{p.fitment.label}</p>
        {fit === "fits" && <p className="flex items-center gap-1 text-xs font-semibold text-success"><Check className="h-3.5 w-3.5" /> Fits your truck</p>}
        {fit === "universal" && <p className="text-xs font-semibold text-muted-foreground">Universal part</p>}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="leading-none">
            {p.compareAt && <span className="block text-xs text-muted-foreground line-through">{formatPrice(p.compareAt)}</span>}
            <span className={`font-display text-2xl font-bold ${p.compareAt ? "text-sale" : ""}`}>{formatPrice(p.price)}</span>
          </div>
          {p.core ? (
            <Link to="/product/$slug" params={{ slug: p.slug }} className="btn btn-outline min-h-10 px-3 text-xs">Choose core</Link>
          ) : (
            <button onClick={quickAdd} className="btn btn-primary min-h-10 px-3" aria-label={`Add ${p.name} to cart`}>
              <ShoppingCart className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
