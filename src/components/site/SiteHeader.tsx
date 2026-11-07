import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Heart, Menu, Phone, Search, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { LiveLink } from "./ExternalLink";
import { useCart } from "@/lib/cart";
import { CATEGORIES } from "@/data/products";
import { ENGINES, PLATFORMS } from "@/data/vehicles";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

const LIVE = "https://www.dieselautopower.com";

const EXTRA_LINKS = [
  { label: "DAP Products", search: { collection: "dap" as const } },
  { label: "Sales", search: { collection: "sale" as const } },
  { label: "New", search: { collection: "new" as const } },
];

export function SiteHeader() {
  const { totals } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/shop/$category", params: { category: "all" }, search: { q: q.trim() || undefined } });
    setOpen(false);
  };
  const demoOnly = (what: string) => toast(`${what} stays on Miva`, { description: "Accounts and wishlists use the existing Miva customer system — not part of this concept." });
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-ink text-ink-foreground">
      <div className="border-b border-ink-border bg-steel text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
          <span className="truncate">
            <strong>Free standard shipping</strong> <span className="text-ink-muted">on qualifying orders $149+ · lower 48</span>
          </span>
          <span className="hidden shrink-0 items-center gap-4 text-ink-muted md:flex">
            <LiveLink href={`${LIVE}/price-match-form.html`} className="hover:text-ink-foreground">Price Match</LiveLink>
            <a href="sms:385-220-2090" className="hover:text-ink-foreground">Text 385-220-2090</a>
            <a href="tel:801-927-4600" className="font-semibold text-ink-foreground hover:underline">Call 801-927-4600</a>
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:gap-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="-ml-2 grid h-11 w-11 place-items-center rounded-md lg:hidden" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto border-ink-border bg-ink p-0 text-ink-foreground">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="border-b border-ink-border p-4"><Logo className="h-10" /></div>
            <form onSubmit={submit} className="p-4">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search part, SKU or brand" className="field" aria-label="Search" />
            </form>
            <Accordion type="single" collapsible className="px-2">
              {PLATFORMS.map((p) => (
                <AccordionItem key={p.id} value={p.id} className="border-ink-border">
                  <AccordionTrigger className="px-3 font-display text-lg font-semibold uppercase hover:no-underline">{p.name}</AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <Link to="/shop/$category" params={{ category: "all" }} search={{ platform: p.id }} onClick={close} className="block rounded px-3 py-2.5 font-semibold text-primary-soft">All {p.name} parts</Link>
                    {ENGINES.filter((e) => e.platform === p.id).map((e) => (
                      <Link key={e.id} to="/shop/$category" params={{ category: "all" }} search={{ engine: e.id }} onClick={close} className="block rounded px-3 py-2.5 text-sm text-ink-muted hover:bg-steel hover:text-ink-foreground">{e.label}</Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <nav className="px-2 pb-8">
              <p className="eyebrow px-3 pb-1 pt-5 text-primary-soft">Shop</p>
              {EXTRA_LINKS.map((l) => (
                <Link key={l.label} to="/shop/$category" params={{ category: "all" }} search={l.search} onClick={close} className="flex min-h-11 items-center rounded-md px-3 hover:bg-steel">{l.label}</Link>
              ))}
              <Link to="/brands" onClick={close} className="flex min-h-11 items-center rounded-md px-3 hover:bg-steel">Shop by Brand</Link>
              {CATEGORIES.map((c) => (
                <Link key={c.id} to="/shop/$category" params={{ category: c.id }} onClick={close} className="flex min-h-11 items-center rounded-md px-3 text-ink-muted hover:bg-steel">{c.name}</Link>
              ))}
              <p className="eyebrow px-3 pb-1 pt-5 text-primary-soft">Help</p>
              <Link to="/services" onClick={close} className="flex min-h-11 items-center rounded-md px-3 hover:bg-steel">Injector Testing &amp; Services</Link>
              <Link to="/customer-service" onClick={close} className="flex min-h-11 items-center rounded-md px-3 hover:bg-steel">Customer Service</Link>
              <Link to="/about" onClick={close} className="flex min-h-11 items-center rounded-md px-3 hover:bg-steel">About Us</Link>
              <Link to="/implementation-notes" onClick={close} className="flex min-h-11 items-center rounded-md px-3 hover:bg-steel">Miva implementation notes</Link>
              <a href="tel:801-927-4600" className="mt-3 flex min-h-11 items-center gap-2 rounded-md px-3 font-semibold"><Phone className="h-4 w-4" /> 801-927-4600</a>
            </nav>
          </SheetContent>
        </Sheet>

        <Logo className="h-11 sm:h-12" />

        <form onSubmit={submit} role="search" className="relative hidden flex-1 md:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by part name, SKU or brand — try “L5P” or “BDD-1043007”" className="field pl-10 pr-24" aria-label="Search products" />
          <button type="submit" className="btn btn-primary absolute right-1 top-1 min-h-9 px-4 text-sm">Search</button>
        </form>

        <div className="ml-auto flex items-center gap-1">
          <Link to="/customer-service" className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-steel xl:flex">
            <Phone className="h-4 w-4" /> <span className="leading-tight"><span className="block text-[11px] text-ink-muted">Talk to a specialist</span>801-927-4600</span>
          </Link>
          <button onClick={() => demoOnly("Sign in")} className="grid h-11 w-11 place-items-center rounded-md hover:bg-steel" aria-label="Account"><User className="h-5 w-5" /></button>
          <button onClick={() => demoOnly("Wishlist")} className="hidden h-11 w-11 place-items-center rounded-md hover:bg-steel sm:grid" aria-label="Wishlist"><Heart className="h-5 w-5" /></button>
          <Link to="/cart" className="relative grid h-11 w-11 place-items-center rounded-md hover:bg-steel" aria-label={`Cart, ${totals.count} items`}>
            <ShoppingCart className="h-5 w-5" />
            {totals.count > 0 && <span className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">{totals.count}</span>}
          </Link>
        </div>
      </div>

      <form onSubmit={submit} role="search" className="relative px-4 pb-3 md:hidden">
        <Search className="pointer-events-none absolute left-7 top-[1.375rem] h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search part, SKU or brand" className="field pl-10" aria-label="Search products" />
      </form>

      <nav className="relative hidden border-t border-ink-border lg:block" aria-label="Primary">
        <ul className="mx-auto flex max-w-7xl items-stretch px-2 font-display text-[15px] font-semibold uppercase tracking-wide">
          {PLATFORMS.map((p) => (
            <li key={p.id} className="group">
              <Link to="/shop/$category" params={{ category: "all" }} search={{ platform: p.id }} className="flex items-center gap-1 px-3 py-3 hover:text-primary-soft xl:px-4" aria-haspopup="true">
                {p.name} <ChevronDown className="h-3.5 w-3.5 opacity-60 transition group-hover:rotate-180" />
              </Link>
              <div className="invisible absolute inset-x-0 top-full border-t-2 border-primary bg-card text-card-foreground opacity-0 shadow-lift transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <div className="mx-auto grid max-w-7xl grid-cols-[1.3fr_1fr_0.9fr] gap-8 px-6 py-6 font-sans text-sm normal-case tracking-normal">
                  <div>
                    <p className="eyebrow mb-3">{p.make} · by generation</p>
                    <ul className="grid gap-0.5">
                      {ENGINES.filter((e) => e.platform === p.id).map((e) => (
                        <li key={e.id}><Link to="/shop/$category" params={{ category: "all" }} search={{ engine: e.id }} className="block rounded px-3 py-2 font-medium hover:bg-muted hover:text-primary">{e.label}</Link></li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="eyebrow mb-3">{p.name} categories</p>
                    <ul className="grid gap-0.5">
                      {CATEGORIES.map((c) => (
                        <li key={c.id}><Link to="/shop/$category" params={{ category: c.id }} search={{ platform: p.id }} className="block rounded px-3 py-2 hover:bg-muted hover:text-primary">{c.name}</Link></li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg bg-ink p-5 text-ink-foreground">
                    <p className="font-display text-xl font-bold uppercase">Not sure what fits?</p>
                    <p className="mt-2 text-ink-muted">DAP's diesel specialists can confirm fitment before you order.</p>
                    <a href="tel:801-927-4600" className="btn btn-primary mt-4 w-full">Call 801-927-4600</a>
                    <Link to="/shop/$category" params={{ category: "all" }} search={{ platform: p.id }} className="mt-3 block text-center font-semibold text-primary-soft hover:underline">Shop all {p.name} →</Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {EXTRA_LINKS.map((l) => (
            <li key={l.label}>
              <Link to="/shop/$category" params={{ category: "all" }} search={l.search} className="block px-3 py-3 text-ink-muted hover:text-ink-foreground xl:px-4">{l.label}</Link>
            </li>
          ))}
          <li><Link to="/brands" className="block px-3 py-3 text-ink-muted hover:text-ink-foreground xl:px-4" activeProps={{ className: "text-ink-foreground" }}>Brands</Link></li>
          <li><Link to="/services" className="block px-3 py-3 text-ink-muted hover:text-ink-foreground xl:px-4" activeProps={{ className: "text-ink-foreground" }}>Injector Testing</Link></li>
          <li className="ml-auto"><Link to="/customer-service" className="block px-3 py-3 text-ink-muted hover:text-ink-foreground" activeProps={{ className: "text-ink-foreground" }}>Customer Service</Link></li>
        </ul>
      </nav>
    </header>
  );
}
