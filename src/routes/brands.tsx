import { createFileRoute, Link } from "@tanstack/react-router";
import { BRANDS, PRODUCTS } from "@/data/products";
import { LiveLink } from "@/components/site/ExternalLink";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: [
      { title: "Shop by Brand | Diesel Auto Power" },
      { name: "description", content: "Bosch, BD Diesel, ARP, Fleece, FASS, S&B, Mishimoto, Diamond Advantage and more at Diesel Auto Power." },
      { property: "og:title", content: "Shop by Brand | Diesel Auto Power" },
      { property: "og:description", content: "Diesel brands carried by Diesel Auto Power." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Brands,
});

function Brands() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <p className="eyebrow">600+ manufacturer partnerships</p>
      <h1 className="mt-2 text-5xl font-extrabold uppercase">Shop by brand</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Brands below appear in this demo's sample of the live DAP catalog. The full list is on the live store.</p>
      <LiveLink href="https://www.dieselautopower.com/shop-by-brand" className="mt-2 text-sm font-semibold text-primary">All brands on dieselautopower.com</LiveLink>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {BRANDS.map((b) => {
          const n = PRODUCTS.filter((p) => p.brand === b).length;
          return (
            <li key={b}>
              <Link to="/shop/$category" params={{ category: "all" }} search={{ brand: b }} className={`flex min-h-24 flex-col justify-center rounded-lg border p-4 transition hover:border-primary hover:shadow-card ${b === "Diesel Auto Power" ? "border-primary bg-primary-soft" : "border-border bg-card"}`}>
                <span className="font-display text-xl font-bold uppercase leading-tight">{b}</span>
                <span className="text-xs text-muted-foreground">{n} product{n === 1 ? "" : "s"} in demo</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
