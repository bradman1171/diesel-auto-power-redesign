import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/implementation-notes")({
  head: () => ({
    meta: [
      { title: "Miva Implementation Notes | DAP Redesign Concept" },
      { name: "description", content: "How this Diesel Auto Power redesign concept maps onto Miva Merchant templates." },
      { property: "og:title", content: "Miva Implementation Notes" },
      { property: "og:description", content: "Mapping the DAP redesign concept to Miva Merchant." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Notes,
});

type Effort = "Visual / template adaptation" | "Miva configuration" | "Custom integration" | "Validate in existing Miva";
const ROWS: [string, string, Effort][] = [
  ["Header, mega-menu, footer", "Global header/footer templates; menu built from the existing category tree (generation categories already exist)", "Visual / template adaptation"],
  ["Homepage sections", "Storefront page + content sections; product lists from existing featured/new/sale categories", "Visual / template adaptation"],
  ["Category page: sort, grid/list, load more", "Category product list template; Load More may need a small JS + AJAX template", "Validate in existing Miva"],
  ["Brand & price filters", "Miva facets on manufacturer / price fields", "Miva configuration"],
  ["Year / Make / Engine selector", "Needs structured engine-generation fitment per product and a YMM module or custom field + facet strategy", "Custom integration"],
  ["Sitewide 'My truck' memory", "Basket/customer custom field or session cookie read by templates", "Custom integration"],
  ["Engine-generation navigation", "Links to existing generation categories (e.g. 2001-2004 LB7 Duramax)", "Visual / template adaptation"],
  ["Product page layout, gallery, specs", "Product page template, existing image types, custom fields for specs", "Visual / template adaptation"],
  ["Core deposit / send-core-first", "Existing product attribute with price modifier; restyle and confirm attribute codes per product", "Validate in existing Miva"],
  ["Smart recommendations", "Related products are manual today; generation-based scoring needs fitment data or a recommendation add-on", "Custom integration"],
  ["Free-shipping progress bar", "Reads basket subtotal of qualifying items; threshold must match shipping module rules", "Validate in existing Miva"],
  ["Cart & checkout", "Existing basket, checkout, payment gateways, Affirm and order processing stay as-is; restyle only", "Visual / template adaptation"],
  ["Search", "Existing Miva search; predictive suggestions need a search add-on", "Miva configuration"],
];

function Notes() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="eyebrow">For stakeholders &amp; developers</p>
      <h1 className="mt-2 text-4xl font-extrabold uppercase sm:text-5xl">Miva implementation notes</h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">
        This is a <strong className="text-foreground">Website Redesign Concept</strong>. It runs on a small demonstration dataset sampled from dieselautopower.com. Catalog, inventory, customer accounts, pricing, checkout and order management all remain in Miva; this plan restyles and extends them.
      </p>

      <div className="mt-10 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-ink text-ink-foreground">
            <tr><th className="p-3">Concept feature</th><th className="p-3">Miva Merchant equivalent</th><th className="p-3">Effort</th></tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {ROWS.map(([a, b, c]) => (
              <tr key={a}><td className="p-3 font-semibold">{a}</td><td className="p-3 text-muted-foreground">{b}</td><td className="p-3"><span className={`rounded px-2 py-0.5 text-xs font-bold uppercase ${c === "Custom integration" ? "bg-amber text-ink" : c === "Validate in existing Miva" ? "bg-primary-soft" : "bg-muted"}`}>{c}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-bold uppercase">What's real</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>68 products: names, SKUs, manufacturers, prices (incl. captured sale prices), application text and descriptions</li><li>Engine generations from the live mega-menu</li><li>$149 free-shipping terms, core return terms, verified $250 turbo core charges</li>
            <li>Core-exchange choices (from the L5P reman turbo listing)</li>
            <li>Company story, phone and text numbers, customer-service links</li>
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-bold uppercase">What's illustrative</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Product photos: live catalog photos are attempted; representative studio images show when they can't load</li>
            <li>Core deposit amounts</li>
            <li>Generation mapping derived from DAP application text (confirm with a specialist)</li>
            <li>Core amounts marked “illustrative”, popularity ranking, and the checkout screen</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
