import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-truck.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Diesel Auto Power | Don't Pay to Play" },
      { name: "description", content: "Established in 2008, Diesel Auto Power delivers the best diesel parts at the best value with the best service." },
      { property: "og:title", content: "About Diesel Auto Power" },
      { property: "og:description", content: "The best parts, at the best value, with the best service." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <img src={hero} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 -z-10 bg-hero-fade" />
        <div className="mx-auto max-w-7xl px-4 py-24">
          <p className="eyebrow">About us</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-extrabold uppercase sm:text-7xl">You shouldn't have to pay to play.</h1>
        </div>
      </section>
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-lg leading-relaxed">
        <p>Our story began in 2007 when our founder, Jacob, found himself stranded hundreds of miles from home after a breakdown. Faced with steep repair costs, he realized there had to be a better way to get quality diesel parts without paying a premium. That idea became Diesel Auto Power, established in 2008.</p>
        <p>Today, we specialize in Dodge Cummins performance parts and OEM replacements, while also offering a full range of performance products for Chevy, Ford, and other diesel and gasoline vehicles. With partnerships across more than 600 companies, we're committed to being your one-stop source for diesel parts.</p>
        <p className="border-l-4 border-primary pl-5 font-display text-2xl font-bold uppercase">Our mission is simple: to deliver the best parts, at the best value, with the best service.</p>
        <div className="flex flex-wrap gap-3 pt-4">
          <Link to="/shop/$category" params={{ category: "all" }} search={{ platform: "cummins" }} className="btn btn-primary">Shop Cummins</Link>
          <a href="tel:801-927-4600" className="btn btn-outline">Call 801-927-4600</a>
        </div>
      </section>
    </>
  );
}
