import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Phone, RotateCcw, Scale, Truck } from "lucide-react";
import { LiveLink } from "@/components/site/ExternalLink";

const LIVE = "https://www.dieselautopower.com";

export const Route = createFileRoute("/customer-service")({
  head: () => ({
    meta: [
      { title: "Customer Service | Diesel Auto Power" },
      { name: "description", content: "Contact Diesel Auto Power, free shipping terms, core returns and price match." },
      { property: "og:title", content: "Customer Service | Diesel Auto Power" },
      { property: "og:description", content: "Shipping, core returns, price match and contact details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CS,
});

function CS() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="eyebrow">We're here to help</p>
      <h1 className="mt-2 text-5xl font-extrabold uppercase">Customer service</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Summaries below are taken from DAP's live policies. The live policy pages are the authoritative source.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a href="tel:801-927-4600" className="flex items-center gap-4 rounded-lg bg-ink p-6 text-ink-foreground transition hover:bg-steel">
          <Phone className="h-8 w-8 text-primary-soft" />
          <span><span className="block text-sm text-ink-muted">Call a parts specialist</span><span className="font-display text-3xl font-bold">801-927-4600</span></span>
        </a>
        <a href="sms:385-220-2090" className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 transition hover:border-primary">
          <MessageSquare className="h-8 w-8 text-primary" />
          <span><span className="block text-sm text-muted-foreground">Text us</span><span className="font-display text-3xl font-bold">385-220-2090</span></span>
        </a>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <Policy icon={Truck} title="Free shipping" link={`${LIVE}/shipping-and-return-policy.html`}>
          <li>Ships free when qualifying "Free Shipping" items total <strong>$149 or more</strong>.</li>
          <li>Applies to UPS, FedEx or USPS shipments. Freight shipments do not apply.</li>
          <li>USA lower 48 states only.</li>
          <li>Orders placed after 12pm MST ship the next business day.</li>
        </Policy>
        <Policy icon={RotateCcw} title="Core returns" link={`${LIVE}/shipping-and-return-policy.html`}>
          <li>Return cores within <strong>30 days</strong> of the order date for full credit; after 30 days, half credit.</li>
          <li>Ship in the same box with the core return form and invoice copy, insured with tracking.</li>
          <li>Cores must be rebuildable, drained, clean and bagged. Injector cores must have Bosch bodies and original packaging.</li>
          <li>Questions: Cores@DieselAutoPower.com</li>
        </Policy>
        <Policy icon={Scale} title="Price match" link={`${LIVE}/price-match-form.html`}>
          <li>"We strive to bring you the best pricing. Found it cheaper? Let us beat it!"</li>
          <li>Submit the price match form with the part number and where you found it.</li>
          <li>Matches are reviewed by DAP — terms on the live form apply.</li>
        </Policy>
      </div>
    </div>
  );
}

function Policy({ icon: I, title, link, children }: { icon: typeof Truck; title: string; link: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col rounded-lg border border-border bg-card p-6">
      <I className="h-7 w-7 text-primary" />
      <h2 className="mt-3 text-2xl font-bold uppercase">{title}</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">{children}</ul>
      <LiveLink href={link} className="mt-auto pt-5 text-sm font-semibold text-primary">Read the full policy</LiveLink>
    </section>
  );
}
