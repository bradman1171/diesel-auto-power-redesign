import { createFileRoute } from "@tanstack/react-router";
import { Gauge, Phone } from "lucide-react";
import { SERVICES } from "@/data/services";
import { formatPrice } from "@/data/products";
import { LiveLink } from "@/components/site/ExternalLink";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Injector Testing & Turbo Services | Diesel Auto Power" },
      { name: "description", content: "DAP common rail, HEUI and mechanical injector testing plus S300/S400 turbo rebuild and balance services." },
      { property: "og:title", content: "Injector Testing & Services | Diesel Auto Power" },
      { property: "og:description", content: "Injector testing and turbo rebuild services from Diesel Auto Power." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <p className="eyebrow text-primary-soft">DAP Services</p>
          <h1 className="mt-2 max-w-3xl text-5xl font-extrabold uppercase leading-none sm:text-6xl">Injector testing &amp; turbo rebuilds</h1>
          <p className="mt-4 max-w-2xl text-ink-muted">Know exactly what your injectors are doing before you spend money on new ones. Services and prices as listed on the live DAP store.</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <article key={s.name} className="flex flex-col rounded-lg border border-border bg-card p-5 shadow-card">
              <Gauge className="h-6 w-6 text-primary" />
              <h2 className="mt-3 font-display text-xl font-bold leading-tight">{s.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{s.application}</p>
              <div className="mt-auto flex items-center justify-between pt-5">
                <span className="font-display text-2xl font-bold">{formatPrice(s.price)}</span>
                <LiveLink href={s.url} className="text-sm font-semibold text-primary hover:underline">Book on live site</LiveLink>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start gap-4 rounded-xl bg-primary-soft p-6 sm:flex-row sm:items-center">
          <Phone className="h-8 w-8 text-primary" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold uppercase">Not sure which test you need?</h2>
            <p className="text-sm text-muted-foreground">Call before you ship injectors so we can recommend the right service.</p>
          </div>
          <a href="tel:801-927-4600" className="btn btn-primary">Call 801-927-4600</a>
        </div>
      </div>
    </>
  );
}
