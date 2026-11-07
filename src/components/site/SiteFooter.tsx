import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { LiveLink } from "./ExternalLink";
import { CATEGORIES } from "@/data/products";

const LIVE = "https://www.dieselautopower.com";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <Logo className="h-14" />
          <p className="max-w-sm text-sm text-ink-muted">The best parts, at the best value, with the best service. Cummins specialists with a full range for Duramax, Powerstroke and light-duty diesels.</p>
          <div className="space-y-1 text-sm">
            <p>Call: <a className="font-semibold hover:text-primary-soft" href="tel:801-927-4600">801-927-4600</a></p>
            <p>Text: <a className="font-semibold hover:text-primary-soft" href="sms:385-220-2090">385-220-2090</a></p>
            <p className="text-ink-muted">Layton, Utah</p>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-bold uppercase">Shop</h3>
          <ul className="space-y-2 text-sm text-ink-muted">
            {CATEGORIES.map((c) => (
              <li key={c.id}><Link to="/shop/$category" params={{ category: c.id }} className="hover:text-ink-foreground">{c.name}</Link></li>
            ))}
            <li><Link to="/brands" className="hover:text-ink-foreground">Shop by Brand</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-bold uppercase">Help</h3>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><Link to="/customer-service" className="hover:text-ink-foreground">Customer Service</Link></li>
            <li><Link to="/services" className="hover:text-ink-foreground">Injector Testing &amp; Services</Link></li>
            <li><Link to="/about" className="hover:text-ink-foreground">About Us</Link></li>
          </ul>
          <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-wider text-ink-muted">On the live site</h3>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><LiveLink href={`${LIVE}/contact-us.html`} className="hover:text-ink-foreground">Contact Us</LiveLink></li>
            <li><LiveLink href={`${LIVE}/shipping-and-return-policy.html`} className="hover:text-ink-foreground">Shipping &amp; Returns</LiveLink></li>
            <li><LiveLink href={`${LIVE}/price-match-form.html`} className="hover:text-ink-foreground">Price Match</LiveLink></li>
            <li><LiveLink href={`${LIVE}/faqs.html`} className="hover:text-ink-foreground">FAQs</LiveLink></li>
            <li><LiveLink href={`${LIVE}/privacy-policy.html`} className="hover:text-ink-foreground">Privacy Policy</LiveLink></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-bold uppercase">This concept</h3>
          <p className="text-sm text-ink-muted">A redesign proposal using a sample of real DAP catalog data. No orders, accounts or payments are processed. Links marked with an arrow open the live store.</p>
          <Link to="/implementation-notes" className="mt-4 inline-block text-sm font-semibold text-primary-soft hover:underline">Miva implementation notes →</Link>
        </div>
      </div>
      <div className="border-t border-ink-border">
        <p className="mx-auto max-w-7xl px-4 py-5 pl-56 text-xs text-ink-muted max-sm:pl-4 max-sm:pb-16">© 2026 Diesel Auto Power, LLC. All Rights Reserved. All Prices in USD. · Website Redesign Concept</p>
      </div>
    </footer>
  );
}
