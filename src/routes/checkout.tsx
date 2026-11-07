import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { Summary } from "@/components/site/CartSummary";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Demo Checkout | Diesel Auto Power" },
      { name: "description", content: "Demonstration checkout — no payment is collected." },
      { property: "og:title", content: "Demo Checkout | Diesel Auto Power" },
      { property: "og:description", content: "Demonstration checkout screen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { totals, clear, lines } = useCart();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
        <h1 className="mt-4 text-4xl font-extrabold uppercase">Demo complete</h1>
        <p className="mt-3 text-muted-foreground">No order was placed and nothing was sent to Diesel Auto Power. In production, this step hands off to Miva's checkout (OCST → OPAY → INVC).</p>
        <Link to="/" className="btn btn-primary mt-8">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-start gap-3 rounded-lg border-2 border-amber bg-amber/15 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <p className="text-sm"><strong>Demonstration checkout.</strong> Do not enter real personal or payment information. Fields are pre-filled with sample data and nothing is submitted.</p>
      </div>
      <h1 className="mt-6 text-4xl font-extrabold uppercase">Checkout</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={(e) => { e.preventDefault(); clear(); setDone(true); }}
          className="space-y-8 rounded-lg border border-border bg-card p-6"
        >
          <Section n={1} t="Shipping">
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="field" defaultValue="Sample Customer" aria-label="Name" readOnly />
              <input className="field" defaultValue="demo@example.com" aria-label="Email" readOnly />
              <input className="field sm:col-span-2" defaultValue="123 Example Rd" aria-label="Address" readOnly />
              <input className="field" defaultValue="Anytown" aria-label="City" readOnly />
              <input className="field" defaultValue="UT 84000" aria-label="State / ZIP" readOnly />
            </div>
          </Section>
          <Section n={2} t="Shipping method">
            <label className="flex items-center gap-3 rounded-md border border-primary p-3 text-sm"><input type="radio" checked readOnly className="accent-primary" /> Ground (rates from Miva shipping module)</label>
          </Section>
          <Section n={3} t="Payment">
            <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">Payment fields are intentionally disabled in this concept. Miva's existing payment gateway and Affirm financing would render here.</div>
          </Section>
          <button type="submit" disabled={lines.length === 0} className="btn btn-primary w-full">Complete demo order</button>
        </form>
        <Summary totals={totals} cta={false} />
      </div>
    </div>
  );
}

function Section({ n, t, children }: { n: number; t: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-3 text-xl font-bold uppercase"><span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-sm text-ink-foreground">{n}</span>{t}</h2>
      {children}
    </section>
  );
}
