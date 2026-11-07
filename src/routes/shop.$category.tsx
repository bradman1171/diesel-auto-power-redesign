import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ChevronRight, LayoutGrid, List, SlidersHorizontal, Truck, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BRANDS, CATEGORIES, PRODUCTS, categoryById, fitStatus, sortProducts, type SortKey } from "@/data/products";
import { ENGINES, PLATFORMS, engineById, platformById, type PlatformId } from "@/data/vehicles";
import { ProductCard } from "@/components/site/ProductCard";
import { LiveLink } from "@/components/site/ExternalLink";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useVehicle } from "@/lib/vehicle";

type Collection = "dap" | "sale" | "new";
interface ShopSearch {
  q?: string | undefined;
  platform?: PlatformId | undefined;
  engine?: string | undefined;
  collection?: Collection | undefined;
  brand?: string | undefined;
}

const PAGE = 12;
const COLLECTIONS: Record<Collection, { title: string; blurb: string; live: string }> = {
  dap: { title: "DAP Products", blurb: "Diesel Auto Power's own parts — built and sourced in-house for value without compromise.", live: "https://www.dieselautopower.com/shop-by-brand/diesel-auto-power" },
  sale: { title: "Current Sales", blurb: "Sale prices captured from the live site. Sale dates and availability change — confirm on the live store.", live: "https://www.dieselautopower.com/Current_Sales" },
  new: { title: "New Products", blurb: "Recently added Diesel Auto Power products.", live: "https://www.dieselautopower.com/New_DAP_Products" },
};

export const Route = createFileRoute("/shop/$category")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    q: typeof s["q"] === "string" && s["q"] ? s["q"] : undefined,
    platform: PLATFORMS.some((p) => p.id === s["platform"]) ? (s["platform"] as PlatformId) : undefined,
    engine: ENGINES.some((e) => e.id === s["engine"]) ? (s["engine"] as string) : undefined,
    collection: s["collection"] === "dap" || s["collection"] === "sale" || s["collection"] === "new" ? s["collection"] : undefined,
    brand: typeof s["brand"] === "string" && s["brand"] ? s["brand"] : undefined,
  }),
  loader: ({ params }) => {
    if (params.category !== "all" && !categoryById(params.category)) throw notFound();
    return { category: params.category };
  },
  head: ({ params }) => {
    const name = categoryById(params.category)?.name ?? "Shop All Parts";
    return {
      meta: [
        { title: `${name} | Diesel Auto Power` },
        { name: "description", content: `Shop ${name.toLowerCase()} for Cummins, Duramax, Powerstroke and light-duty diesel trucks.` },
        { property: "og:title", content: `${name} | Diesel Auto Power` },
        { property: "og:description", content: `Diesel ${name.toLowerCase()} — filter by truck, brand and price.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: Shop,
});

const PRICE_BANDS = [
  { id: "u50", label: "Under $50", min: 0, max: 50 },
  { id: "50-250", label: "$50 – $250", min: 50, max: 250 },
  { id: "250-750", label: "$250 – $750", min: 250, max: 750 },
  { id: "750", label: "$750+", min: 750, max: Infinity },
];

function Shop() {
  const { category } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { vehicle, setVehicle } = useVehicle();
  const cat = categoryById(category);

  const [brands, setBrands] = useState<string[]>(search.brand ? [search.brand] : []);
  const [bands, setBands] = useState<string[]>([]);
  const [fitOnly, setFitOnly] = useState(true);
  const [coreOnly, setCoreOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [shown, setShown] = useState(PAGE);

  useEffect(() => { setBrands(search.brand ? [search.brand] : []); setShown(PAGE); }, [search.brand]);

  // A generation link (?engine=) takes priority over the saved truck.
  const engineFilter = search.engine ?? (fitOnly && !search.q ? vehicle?.engine : undefined);
  const yearFilter = search.engine ? undefined : vehicle?.year;
  const platformFilter = search.engine ? engineById(search.engine)?.platform : search.platform;

  const base = useMemo(() => {
    let list = PRODUCTS.filter((p) => category === "all" || p.category === category);
    if (search.q) {
      const s = search.q.toLowerCase();
      list = list.filter((p) => [p.name, p.sku, p.brand].some((f) => f.toLowerCase().includes(s)));
    }
    if (search.collection === "dap") list = list.filter((p) => p.isDap);
    if (search.collection === "sale") list = list.filter((p) => p.compareAt);
    if (search.collection === "new") list = list.filter((p) => p.isNew);
    if (platformFilter) list = list.filter((p) => p.platform === platformFilter || p.fitment.universal);
    if (engineFilter) list = list.filter((p) => { const f = fitStatus(p, engineFilter, yearFilter); return f === "fits" || f === "universal"; });
    return list;
  }, [category, search.q, search.collection, platformFilter, engineFilter, yearFilter]);

  const brandOptions = useMemo(() => BRANDS.filter((b) => base.some((p) => p.brand === b)), [base]);

  const results = useMemo(() => {
    let list = base;
    if (brands.length) list = list.filter((p) => brands.includes(p.brand));
    if (bands.length) list = list.filter((p) => bands.some((b) => { const r = PRICE_BANDS.find((x) => x.id === b)!; return p.price >= r.min && p.price < r.max; }));
    if (coreOnly) list = list.filter((p) => p.core);
    return sortProducts(list, sort);
  }, [base, brands, bands, coreOnly, sort]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => { set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]); setShown(PAGE); };
  const generation = engineById(search.engine);
  const platform = platformById(platformFilter);
  const coll = search.collection ? COLLECTIONS[search.collection] : undefined;
  const title = generation?.label ?? coll?.title ?? (search.q ? `Results for “${search.q}”` : search.brand ? search.brand : [platform?.name, cat?.name ?? (platform ? "Parts" : "All Parts")].filter(Boolean).join(" "));
  const blurb = coll?.blurb ?? cat?.blurb ?? (generation ? `Parts DAP lists for the ${generation.label}.` : "Every part in the demonstration catalog — real DAP listings, filterable by truck, brand and price.");
  const activeCount = brands.length + bands.length + (coreOnly ? 1 : 0);

  const setSearch = (patch: Partial<ShopSearch>) => { navigate({ search: (s) => ({ ...s, ...patch }) }); setShown(PAGE); };
  const clearAll = () => { setBrands([]); setBands([]); setCoreOnly(false); };

  const engineCounts = (id: string) => PRODUCTS.filter((p) => (category === "all" || p.category === category) && p.fitment.engines?.includes(id)).length;

  const filters = (
    <div className="space-y-7">
      <FilterGroup title="Generation">
        <select className="field" value={search.engine ?? ""} onChange={(e) => setSearch({ engine: e.target.value || undefined, platform: undefined })} aria-label="Engine generation">
          <option value="">{vehicle && fitOnly ? "Using my truck" : "All generations"}</option>
          {PLATFORMS.map((pl) => (
            <optgroup key={pl.id} label={`${pl.make} ${pl.name}`}>
              {ENGINES.filter((e) => e.platform === pl.id).map((e) => <option key={e.id} value={e.id}>{e.label} ({engineCounts(e.id)})</option>)}
            </optgroup>
          ))}
        </select>
        {vehicle && !search.engine && !search.q && (
          <label className="mt-3 flex min-h-10 cursor-pointer items-center gap-3 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-primary" checked={fitOnly} onChange={(e) => { setFitOnly(e.target.checked); setShown(PAGE); }} />
            Only parts for my truck
          </label>
        )}
      </FilterGroup>
      <FilterGroup title="Platform">
        <div className="grid gap-0.5">
          {PLATFORMS.map((p) => (
            <label key={p.id} className="flex min-h-10 cursor-pointer items-center gap-3 text-sm">
              <input type="radio" name="platform" className="h-4 w-4 accent-primary" checked={platformFilter === p.id} onChange={() => setSearch({ platform: p.id, engine: undefined })} />
              {p.make} {p.name}
            </label>
          ))}
          {(search.platform || search.engine) && <button onClick={() => setSearch({ platform: undefined, engine: undefined })} className="mt-1 text-left text-sm font-semibold text-primary">Show all platforms</button>}
        </div>
      </FilterGroup>
      <FilterGroup title="Brand">
        <div className="max-h-72 overflow-y-auto pr-1">
          {brandOptions.map((b) => (
            <label key={b} className="flex min-h-10 cursor-pointer items-center gap-3 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-primary" checked={brands.includes(b)} onChange={() => toggle(brands, setBrands, b)} />
              <span className="flex-1">{b}</span>
              <span className="text-xs text-muted-foreground">{base.filter((p) => p.brand === b).length}</span>
            </label>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Price">
        {PRICE_BANDS.map((r) => (
          <label key={r.id} className="flex min-h-10 cursor-pointer items-center gap-3 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-primary" checked={bands.includes(r.id)} onChange={() => toggle(bands, setBands, r.id)} />
            {r.label}
          </label>
        ))}
      </FilterGroup>
      <FilterGroup title="Purchase type">
        <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-primary" checked={coreOnly} onChange={(e) => setCoreOnly(e.target.checked)} />
          Core exchange items only
        </label>
      </FilterGroup>
      {activeCount > 0 && <button onClick={clearAll} className="btn btn-outline w-full">Clear filters ({activeCount})</button>}
    </div>
  );

  return (
    <div>
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:py-12">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-ink-muted">
            <Link to="/" className="hover:text-ink-foreground">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/shop/$category" params={{ category: "all" }} className="hover:text-ink-foreground">Shop</Link>
            {platform && (<><ChevronRight className="h-3 w-3" /><Link to="/shop/$category" params={{ category: "all" }} search={{ platform: platform.id }} className="hover:text-ink-foreground">{platform.name}</Link></>)}
            {cat && (<><ChevronRight className="h-3 w-3" /><span className="text-ink-foreground">{cat.name}</span></>)}
          </nav>
          <h1 className="mt-3 text-4xl font-extrabold uppercase leading-none sm:text-6xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-ink-muted">{blurb}</p>
          {(coll || generation) && <LiveLink href={(coll?.live ?? generation?.liveUrl)!} className="mt-2 text-sm text-primary-soft hover:underline">View this section on the live site</LiveLink>}
          <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1">
            <Link to="/shop/$category" params={{ category: "all" }} search={search} className="shrink-0 rounded-full border border-ink-border px-4 py-1.5 text-sm hover:border-primary-soft" activeOptions={{ includeSearch: false }} activeProps={{ className: "border-primary bg-primary text-primary-foreground" }}>All</Link>
            {CATEGORIES.map((c) => (
              <Link key={c.id} to="/shop/$category" params={{ category: c.id }} search={search} activeOptions={{ includeSearch: false }} className="shrink-0 rounded-full border border-ink-border px-4 py-1.5 text-sm hover:border-primary-soft" activeProps={{ className: "border-primary bg-primary text-primary-foreground" }}>{c.name}</Link>
            ))}
          </div>
        </div>
      </section>

      {vehicle && !search.engine && !search.q && (
        <div className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 text-sm">
            <Truck className="h-4 w-4 text-primary" />
            {fitOnly ? <span>Showing parts DAP lists for your <strong>{vehicle.year} {engineById(vehicle.engine)?.short}</strong>, plus universal parts.</span> : <span>Showing all parts — not filtered to your truck.</span>}
            <button onClick={() => setFitOnly((v) => !v)} className="font-semibold text-primary hover:underline">{fitOnly ? "Show all parts" : "Filter to my truck"}</button>
            <button onClick={() => setVehicle(null)} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /> Clear truck</button>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">{filters}</aside>
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <button className="btn btn-outline lg:hidden"><SlidersHorizontal className="h-4 w-4" /> Filters {activeCount > 0 && `(${activeCount})`}</button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto p-6">
                <SheetTitle className="mb-6 font-display text-2xl uppercase">Filters</SheetTitle>
                {filters}
                <p className="mt-6 text-center text-sm text-muted-foreground">{results.length} results</p>
              </SheetContent>
            </Sheet>
            <p className="text-sm text-muted-foreground" aria-live="polite"><strong className="text-foreground">{results.length}</strong> {results.length === 1 ? "product" : "products"}</p>
            <div className="ml-auto flex items-center gap-2">
              <label className="sr-only" htmlFor="sort">Sort products</label>
              <select id="sort" className="field w-auto" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                <option value="featured">Featured</option>
                <option value="best">Best Selling</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="newest">Newest Items</option>
              </select>
              <div className="hidden overflow-hidden rounded-md border border-border sm:flex" role="group" aria-label="View">
                <button onClick={() => setView("grid")} aria-label="Grid view" aria-pressed={view === "grid"} className={`grid h-11 w-11 place-items-center ${view === "grid" ? "bg-ink text-ink-foreground" : "bg-card"}`}><LayoutGrid className="h-4 w-4" /></button>
                <button onClick={() => setView("list")} aria-label="List view" aria-pressed={view === "list"} className={`grid h-11 w-11 place-items-center ${view === "list" ? "bg-ink text-ink-foreground" : "bg-card"}`}><List className="h-4 w-4" /></button>
              </div>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
              <h2 className="text-2xl font-bold uppercase">No matching parts in this demo</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">This prototype holds a sample of DAP's catalog. The live store carries far more — and a specialist can source parts from 600+ manufacturers.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {activeCount > 0 && <button onClick={clearAll} className="btn btn-outline">Clear filters</button>}
                <Link to="/shop/$category" params={{ category: "all" }} className="btn btn-primary">View all parts</Link>
                <a href="tel:801-927-4600" className="btn btn-outline">Call 801-927-4600</a>
              </div>
            </div>
          ) : (
            <>
              <div className={view === "grid" ? "grid grid-cols-1 gap-4 min-[460px]:grid-cols-2 xl:grid-cols-3" : "grid gap-3"}>
                {results.slice(0, shown).map((p) => <ProductCard key={p.slug} p={p} view={view} />)}
              </div>
              <div className="mt-8 flex flex-col items-center gap-3">
                <p className="text-sm text-muted-foreground">Showing {Math.min(shown, results.length)} of {results.length}</p>
                {shown < results.length && <button onClick={() => setShown((n) => n + PAGE)} className="btn btn-ink">Load more</button>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2 w-full border-b border-border pb-2 font-display text-sm font-bold uppercase tracking-wider">{title}</legend>
      {children}
    </fieldset>
  );
}
