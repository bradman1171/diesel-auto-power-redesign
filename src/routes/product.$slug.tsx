import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AlertTriangle, Check, ChevronRight, Info, Minus, PackageCheck, Phone, Plus, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { FREE_SHIP_THRESHOLD, categoryById, fitStatus, fitmentEngineLabels, formatPrice, productBySlug, recommendationsFor } from "@/data/products";
import { useCart, type CoreOption } from "@/lib/cart";
import { useVehicle } from "@/lib/vehicle";
import { engineById } from "@/data/vehicles";
import { ProductCard } from "@/components/site/ProductCard";
import { LiveLink } from "@/components/site/ExternalLink";
import { toast } from "sonner";

const LIVE = "https://www.dieselautopower.com";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const p = productBySlug(params.slug);
    if (!p) throw notFound();
    return { name: p.name, brand: p.brand, sku: p.sku };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} | Diesel Auto Power` },
          { name: "description", content: `${loaderData.name} (${loaderData.sku}) by ${loaderData.brand}. Fitment, details and core exchange options.` },
          { property: "og:title", content: loaderData.name },
          { property: "og:description", content: `${loaderData.brand} · SKU ${loaderData.sku} — Diesel Auto Power.` },
          { property: "og:type", content: "product" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Product unavailable" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductPage,
});

function Gallery({ slug }: { slug: string }) {
  const p = productBySlug(slug)!;
  const [ok, setOk] = useState<string[]>(p.liveImages);
  const [active, setActive] = useState(0);
  useEffect(() => { setOk(p.liveImages); setActive(0); }, [p]);
  const drop = (u: string) => setOk((list) => list.filter((x) => x !== u));
  const current = ok[active] ?? ok[0];

  if (!current) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-xl bg-ink">
        <img src={p.image} alt={`${p.name} (representative image)`} width={816} height={816} className="h-full w-full object-cover" />
        <span className="absolute bottom-3 left-3 rounded bg-ink/85 px-2 py-1 text-[11px] text-ink-foreground">Representative image — live catalog photo unavailable</span>
      </div>
    );
  }
  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-xl border border-border bg-card">
        <img src={current} alt={p.name} referrerPolicy="no-referrer" onError={() => drop(current)} className="h-full w-full object-contain" />
      </div>
      {ok.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3" role="tablist" aria-label="Product photos">
          {ok.map((g, i) => (
            <button key={g} role="tab" aria-selected={i === active} onClick={() => setActive(i)} aria-label={`Photo ${i + 1}`} className={`aspect-square overflow-hidden rounded-md border-2 bg-card ${i === active ? "border-primary" : "border-border"}`}>
              <img src={g} alt="" referrerPolicy="no-referrer" onError={() => drop(g)} loading="lazy" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductPage() {
  const { slug } = Route.useParams();
  const p = productBySlug(slug)!;
  const cat = categoryById(p.category);
  const { add, totals } = useCart();
  const { vehicle } = useVehicle();
  const [qty, setQty] = useState(1);
  const [core, setCore] = useState<CoreOption>("deposit");
  const [justAdded, setJustAdded] = useState(false);
  useEffect(() => { setQty(1); setCore("deposit"); setJustAdded(false); }, [slug]);

  const fit = fitStatus(p, vehicle?.engine, vehicle?.year);
  const related = recommendationsFor(p, 4);
  const deposit = p.core && core === "deposit" ? p.core.amount * qty : 0;
  const lineTotal = p.price * qty + deposit;
  const engines = fitmentEngineLabels(p);

  const addToCart = () => {
    add(p.slug, qty, p.core ? core : undefined);
    setJustAdded(true);
    toast.success(`Added ${qty} × to cart`, { description: p.name });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        {p.platform && <><Link to="/shop/$category" params={{ category: "all" }} search={{ platform: p.platform }} className="capitalize hover:text-foreground">{p.platform.replace("-", " ")}</Link><ChevronRight className="h-3 w-3" /></>}
        {cat && <Link to="/shop/$category" params={{ category: cat.id }} search={p.platform ? { platform: p.platform } : {}} className="hover:text-foreground">{cat.name}</Link>}
        <ChevronRight className="h-3 w-3" />
        <span className="line-clamp-1 text-foreground">{p.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <Gallery slug={p.slug} />

        <div>
          <div className="flex flex-wrap gap-2">
            {p.isDap && <span className="rounded bg-ink px-2 py-0.5 text-[11px] font-bold uppercase text-ink-foreground">DAP Product</span>}
            {p.isNew && <span className="rounded bg-primary px-2 py-0.5 text-[11px] font-bold uppercase text-primary-foreground">New</span>}
            {p.compareAt && <span className="rounded bg-sale px-2 py-0.5 text-[11px] font-bold uppercase text-primary-foreground">On sale</span>}
          </div>
          <h1 className="mt-3 text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">{p.name}</h1>
          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <div><dt className="inline text-muted-foreground">Manufacturer: </dt><dd className="inline font-semibold">{p.brand}</dd></div>
            <div><dt className="inline text-muted-foreground">SKU: </dt><dd className="inline font-mono font-semibold">{p.sku}</dd></div>
          </dl>
          <div className="mt-4 flex items-baseline gap-3">
            <p className={`font-display text-4xl font-bold ${p.compareAt ? "text-sale" : ""}`}>{formatPrice(p.price)}</p>
            {p.compareAt && <p className="text-lg text-muted-foreground line-through">{formatPrice(p.compareAt)}</p>}
          </div>
          {p.compareAt && <p className="text-xs text-muted-foreground">Sale price as listed on the live site at capture; sale dates vary.</p>}

          <div className="mt-5 rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Application (as listed by DAP)</p>
            <p className="mt-1 font-semibold">{p.fitment.label}</p>
            {engines.length > 0 && <p className="mt-1 text-sm text-muted-foreground">Catalog generations: {engines.join(" · ")}</p>}
            {vehicle && (
              <div className={`mt-3 flex items-start gap-2 rounded-md p-2.5 text-sm ${fit === "fits" ? "bg-success/10 text-success" : fit === "universal" ? "bg-muted" : "bg-sale/10 text-sale"}`}>
                {fit === "fits" ? <Check className="mt-0.5 h-4 w-4 shrink-0" /> : fit === "universal" ? <Info className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
                <span className="font-semibold">
                  {fit === "fits" && `Listed for your ${vehicle.year} ${engineById(vehicle.engine)?.short}.`}
                  {fit === "universal" && "Universal part — confirm sizing for your application."}
                  {fit === "no-match" && `Not listed for your ${vehicle.year} ${engineById(vehicle.engine)?.short}.`}
                </span>
              </div>
            )}
            <p className="mt-3 text-xs text-muted-foreground">Fitment shown is DAP's published application text. Call a specialist to confirm before ordering.</p>
          </div>

          {p.core && (
            <fieldset className="mt-5 rounded-lg border-2 border-primary/40 p-4">
              <legend className="px-2 font-display text-sm font-bold uppercase tracking-wider text-primary">This item requires a core exchange</legend>
              <div className="grid gap-2">
                {[
                  { id: "deposit" as const, t: "Add core deposit. Please ship item first.", d: `Adds a refundable ${formatPrice(p.core.amount)} core deposit per unit. Refunded after your core is received and inspected.` },
                  { id: "send-first" as const, t: "I will send core(s) in first.", d: "No deposit. Product ships once DAP receives your core(s)." },
                ].map((o) => (
                  <label key={o.id} className={`flex cursor-pointer gap-3 rounded-md border p-3 transition ${core === o.id ? "border-primary bg-primary-soft" : "border-border bg-card"}`}>
                    <input type="radio" name="core" className="mt-1 h-4 w-4 accent-primary" checked={core === o.id} onChange={() => setCore(o.id)} />
                    <span><span className="block font-semibold">{o.t}</span><span className="text-sm text-muted-foreground">{o.d}</span></span>
                  </label>
                ))}
              </div>
              <p className={`mt-3 rounded px-2 py-1.5 text-xs ${p.core.illustrative ? "bg-amber/25" : "bg-success/10"}`}>
                {p.core.illustrative ? <><strong>Illustrative deposit amount.</strong> DAP's actual core charge for this item wasn't published on the listing.</> : <><strong>Verified:</strong> {formatPrice(p.core.amount)} core charge is stated on the live listing.</>}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Core terms: return within 30 days of order for full credit (half credit after 30 days); cores must be rebuildable, drained and in original packaging. <LiveLink href={`${LIVE}/shipping-and-return-policy.html`} className="font-semibold text-primary">Core return policy</LiveLink></p>
            </fieldset>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-md border border-border bg-card">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center" aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
              <input value={qty} onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))} inputMode="numeric" className="h-12 w-12 bg-transparent text-center font-semibold" aria-label="Quantity" />
              <button onClick={() => setQty((q) => Math.min(99, q + 1))} className="grid h-12 w-12 place-items-center" aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
            </div>
            <button onClick={addToCart} className="btn btn-primary min-h-12 flex-1 text-base">Add to cart · {formatPrice(lineTotal)}</button>
          </div>
          {deposit > 0 && <p className="mt-2 text-sm text-muted-foreground">{formatPrice(p.price * qty)} item + {formatPrice(deposit)} refundable core deposit.</p>}
          {justAdded && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm" role="status">
              <span className="flex items-center gap-2 font-semibold text-success"><Check className="h-4 w-4" /> Added — cart has {totals.count} item{totals.count === 1 ? "" : "s"} ({formatPrice(totals.total)})</span>
              <Link to="/cart" className="font-semibold text-primary hover:underline">View cart →</Link>
            </div>
          )}

          <div className="mt-6 grid gap-3 rounded-lg border border-border bg-card p-4 text-sm sm:grid-cols-2">
            <div className="flex gap-2"><Truck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span><strong>Free standard shipping</strong> when qualifying items total {formatPrice(FREE_SHIP_THRESHOLD)}+. UPS/FedEx/USPS, lower 48 only; freight excluded.</span></div>
            <div className="flex gap-2"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span><strong>Talk to a specialist</strong> — <a href="tel:801-927-4600" className="font-semibold text-primary">801-927-4600</a> or text <a href="sms:385-220-2090" className="font-semibold text-primary">385-220-2090</a>.</span></div>
            <p className="text-xs text-muted-foreground sm:col-span-2">Orders after 12pm MST ship the next business day. Returns are subject to DAP's <LiveLink href={`${LIVE}/shipping-and-return-policy.html`} className="font-semibold text-primary">shipping &amp; return policy</LiveLink>.</p>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="text-2xl font-bold uppercase">Description</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{p.description}</p>
          {p.features.length > 1 && (
            <>
              <h3 className="mt-8 text-xl font-bold uppercase">Highlights</h3>
              <ul className="mt-3 space-y-2">
                {p.features.map((f) => <li key={f} className="flex gap-2"><PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{f}</li>)}
              </ul>
            </>
          )}
          <h3 className="mt-8 text-xl font-bold uppercase">Specifications</h3>
          <dl className="mt-3 divide-y divide-border overflow-hidden rounded-lg border border-border">
            {[["Manufacturer", p.brand], ["SKU", p.sku], ["Application", p.fitment.label], ["Category", cat?.name ?? ""], ["Core exchange", p.core ? "Required" : "Not required"]].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[140px_1fr] gap-4 bg-card px-4 py-3 text-sm"><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>
            ))}
          </dl>
          <h3 className="mt-8 text-xl font-bold uppercase">Reviews</h3>
          <p className="mt-2 text-sm text-muted-foreground">No reviews yet on the live listing. Reviews would continue to use Miva's review system.</p>
        </section>
        <aside className="h-fit space-y-4 rounded-lg bg-ink p-6 text-ink-foreground">
          <h2 className="text-2xl font-bold uppercase">Questions about fitment?</h2>
          <p className="text-sm text-ink-muted">DAP's team works on diesels every day. Get the right part the first time.</p>
          <a href="tel:801-927-4600" className="btn btn-primary w-full">Call 801-927-4600</a>
          <a href="sms:385-220-2090" className="btn btn-ghost-ink w-full">Text 385-220-2090</a>
          <LiveLink href={p.sourceUrl} className="border-t border-ink-border pt-4 text-sm text-primary-soft hover:underline">View this listing on dieselautopower.com</LiveLink>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold uppercase">Recommended for this truck</h2>
          <p className="mt-1 text-sm text-muted-foreground">Matched on engine generation first, then complementary categories and manufacturer.</p>
          <div className="mt-6 grid grid-cols-1 gap-4 min-[460px]:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => <ProductCard key={r.slug} p={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
