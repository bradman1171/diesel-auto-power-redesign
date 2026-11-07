import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeDollarSign, Gauge, Handshake, Phone, Truck, Wrench } from "lucide-react";
import { useState } from "react";
import hero from "@/assets/hero-truck.jpg";
import { BRANDS, CATEGORIES, PRODUCTS } from "@/data/products";
import { ENGINES, PLATFORMS, type PlatformId } from "@/data/vehicles";
import { ProductCard } from "@/components/site/ProductCard";
import { VehicleSelector } from "@/components/site/VehicleSelector";
import { LiveLink } from "@/components/site/ExternalLink";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diesel Auto Power — Cummins, Duramax & Powerstroke Parts" },
      { name: "description", content: "Redesign concept: shop diesel turbos, injectors, fuel systems and engine parts by truck and generation." },
      { property: "og:title", content: "Diesel Auto Power — Redesign Concept" },
      { property: "og:description", content: "Shop diesel performance and OEM replacement parts by truck — Cummins, Duramax, Powerstroke and light duty." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 8);
  const dap = PRODUCTS.filter((p) => p.isDap && !p.featured).sort((a, b) => Number(b.isNew) - Number(a.isNew)).slice(0, 4);
  const sale = PRODUCTS.filter((p) => p.compareAt).slice(0, 4);
  const [gen, setGen] = useState<PlatformId>("cummins");

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <img src={hero} alt="" width={1920} height={1088} className="absolute inset-0 -z-10 h-full w-full object-cover object-[72%_center]" />
        <div className="absolute inset-0 -z-10 bg-hero-fade" />
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:pb-28 sm:pt-24 lg:pb-36 lg:pt-32">
          <p className="eyebrow animate-rise text-primary-soft">Diesel performance & OEM replacement</p>
          <h1 className="mt-4 max-w-3xl animate-rise text-5xl font-extrabold uppercase leading-[0.92] sm:text-7xl lg:text-[5.5rem] [animation-delay:60ms]">
            Don't pay<br />to play.
          </h1>
          <p className="mt-6 max-w-xl animate-rise text-lg text-ink-muted [animation-delay:120ms]">
            Quality diesel parts at the best value — turbos, injectors, fuel systems and engine parts from 600+ manufacturers, backed by people who know diesels.
          </p>
          <div className="mt-8 flex animate-rise flex-wrap gap-3 [animation-delay:180ms]">
            {PLATFORMS.slice(0, 3).map((p, i) => (
              <Link key={p.id} to="/shop/$category" params={{ category: "all" }} search={{ platform: p.id }} className={`btn ${i === 0 ? "btn-primary" : "btn-ghost-ink"}`}>
                Shop {p.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-14 max-w-7xl px-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-lift sm:p-7">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="eyebrow flex items-center gap-2"><Truck className="h-4 w-4" /> Shop by vehicle</p>
              <h2 className="text-2xl font-bold uppercase sm:text-3xl">Find parts for your truck</h2>
            </div>
            <p className="text-xs text-muted-foreground">Generations match DAP's catalog. Your truck stays selected while you shop.</p>
          </div>
          <VehicleSelector />
        </div>
      </section>

      {/* Generation navigation */}
      <section className="mx-auto max-w-7xl px-4 pt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Shop by generation</p>
            <h2 className="text-4xl font-bold uppercase">Pick your platform</h2>
          </div>
          <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1" role="tablist" aria-label="Platform">
            {PLATFORMS.map((p) => (
              <button key={p.id} role="tab" aria-selected={gen === p.id} onClick={() => setGen(p.id)} className={`rounded-md px-4 py-2 font-display text-sm font-semibold uppercase transition ${gen === p.id ? "bg-ink text-ink-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="tabpanel">
          {ENGINES.filter((e) => e.platform === gen).map((e) => {
            const n = PRODUCTS.filter((p) => p.fitment.engines?.includes(e.id)).length;
            return (
              <Link key={e.id} to="/shop/$category" params={{ category: "all" }} search={{ engine: e.id }} className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-5 py-4 transition hover:border-primary hover:shadow-card">
                <span>
                  <span className="block font-display text-lg font-bold uppercase leading-tight">{e.short}</span>
                  <span className="text-sm text-muted-foreground">{e.label}</span>
                </span>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">{n > 0 && `${n} parts`}<ArrowRight className="h-4 w-4 text-primary transition group-hover:translate-x-1" /></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Categories</p>
            <h2 className="text-4xl font-bold uppercase">Shop by system</h2>
          </div>
          <Link to="/shop/$category" params={{ category: "all" }} className="hidden items-center gap-1 font-display font-semibold uppercase hover:text-primary sm:flex">All parts <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {CATEGORIES.slice(0, 6).map((c) => (
            <Link key={c.id} to="/shop/$category" params={{ category: c.id }} className="group relative isolate block aspect-[4/3] overflow-hidden rounded-lg bg-ink text-ink-foreground lg:aspect-[16/10]">
              <img src={c.image} alt="" loading="lazy" width={816} height={816} className="absolute inset-0 -z-10 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100" />
              <div className="absolute inset-0 -z-10 bg-fade-up" />
              <div className="flex h-full flex-col justify-end p-4 sm:p-6">
                <h3 className="text-xl font-bold uppercase sm:text-3xl">{c.name}</h3>
                <p className="mt-1 hidden max-w-sm text-sm text-ink-muted sm:block">{c.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-soft">Shop now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="eyebrow">From the DAP catalog</p>
          <h2 className="text-4xl font-bold uppercase">Featured products</h2>
          <p className="mt-2 text-sm text-muted-foreground">Real DAP listings across Cummins, Duramax and Powerstroke.</p>
          <div className="mt-8 grid grid-cols-1 gap-4 min-[460px]:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.slug} p={p} />)}
          </div>
        </div>
      </section>

      {/* DAP products */}
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-[0.8fr_2fr]">
          <div>
            <p className="eyebrow text-primary-soft">Built by DAP</p>
            <h2 className="mt-2 text-4xl font-bold uppercase sm:text-5xl">Diesel Auto Power products</h2>
            <p className="mt-4 text-ink-muted">Head studs, turbos, injectors, valve springs and fixes for common failures — DAP's own parts, priced so you don't pay to play.</p>
            <Link to="/shop/$category" params={{ category: "all" }} search={{ collection: "dap" }} className="btn btn-primary mt-8">Shop DAP products</Link>
          </div>
          <div className="grid grid-cols-1 gap-4 text-foreground min-[460px]:grid-cols-2">
            {dap.map((p) => <ProductCard key={p.slug} p={p} />)}
          </div>
        </div>
      </section>

      {sale.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-sale">Current sales</p>
              <h2 className="text-4xl font-bold uppercase">On sale now</h2>
              <p className="mt-1 text-sm text-muted-foreground">Sale prices captured from the live site; sale dates vary.</p>
            </div>
            <div className="flex gap-4 text-sm font-semibold">
              <Link to="/shop/$category" params={{ category: "all" }} search={{ collection: "sale" }} className="text-primary hover:underline">All sale items →</Link>
              <LiveLink href="https://www.dieselautopower.com/Clerance-List" className="text-muted-foreground hover:text-foreground">Clearance list</LiveLink>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 min-[460px]:grid-cols-2 lg:grid-cols-4">
            {sale.map((p) => <ProductCard key={p.slug} p={p} />)}
          </div>
        </section>
      )}

      <section className="border-y border-border bg-card py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Manufacturers</p>
              <h2 className="text-3xl font-bold uppercase">Brands we carry</h2>
            </div>
            <Link to="/brands" className="text-sm font-semibold text-primary hover:underline">Shop by brand →</Link>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4 lg:grid-cols-6">
            {BRANDS.slice(0, 18).map((b) => (
              <li key={b}>
                <Link to="/shop/$category" params={{ category: "all" }} search={{ brand: b }} className="grid h-full min-h-20 place-items-center bg-card px-3 text-center font-display text-base font-bold uppercase tracking-wide text-muted-foreground transition hover:bg-muted hover:text-foreground">
                  {b}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-20 lg:grid-cols-2">
        <div className="flex flex-col justify-between rounded-xl bg-primary p-8 text-primary-foreground">
          <div>
            <Phone className="h-8 w-8" />
            <h2 className="mt-4 text-4xl font-bold uppercase">Talk to a diesel specialist</h2>
            <p className="mt-3 max-w-md opacity-90">Not sure which injector, turbo or pump your truck needs? Call or text before you order and get it right the first time.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="tel:801-927-4600" className="btn btn-ink">Call 801-927-4600</a>
            <a href="sms:385-220-2090" className="btn btn-ghost-ink">Text 385-220-2090</a>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-8">
          <div>
            <Gauge className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-4xl font-bold uppercase">Injector testing</h2>
            <p className="mt-3 max-w-md text-muted-foreground">Common rail testing from $45, HEUI testing for 7.3L & 6.0L, mechanical testing for 12V/24V, plus S300/S400 turbo rebuilds.</p>
          </div>
          <Link to="/services" className="btn btn-outline mt-8 self-start">See services</Link>
        </div>
      </section>

      <section className="bg-ink bg-grid-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-primary-soft">Our story</p>
            <h2 className="mt-2 text-4xl font-bold uppercase sm:text-5xl">Born from a breakdown.</h2>
            <p className="mt-6 text-ink-muted">In 2007 our founder Jacob was stranded hundreds of miles from home after a breakdown. Facing steep repair costs, he knew there had to be a better way to get quality diesel parts — and Diesel Auto Power was established in 2008.</p>
            <Link to="/about" className="btn btn-ghost-ink mt-8">Read our story</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Wrench, t: "Cummins specialists", d: "Dodge Cummins performance parts and OEM replacements are our core." },
              { icon: Handshake, t: "600+ partners", d: "A one-stop source for Cummins, Duramax, Powerstroke and more." },
              { icon: BadgeDollarSign, t: "Price match", d: "Found it cheaper? Submit a price match request." },
              { icon: Truck, t: "Free shipping $149+", d: "On qualifying items, lower 48. Freight excluded." },
            ].map(({ icon: I, t, d }) => (
              <div key={t} className="rounded-lg border border-ink-border bg-steel/60 p-6">
                <I className="h-7 w-7 text-primary-soft" />
                <h3 className="mt-4 text-xl font-bold uppercase">{t}</h3>
                <p className="mt-1 text-sm text-ink-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
