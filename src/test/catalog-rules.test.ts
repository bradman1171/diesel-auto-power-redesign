import { describe, expect, it } from "vitest";
import { PRODUCTS, productBySlug, recommendationsFor } from "@/data/products";
import { computeTotals } from "@/lib/cart";

describe("catalog rules", () => {
  it("has no generic Sample Brand products", () => {
    expect(PRODUCTS.some((p) => /sample/i.test(p.brand))).toBe(false);
  });

  it("never recommends Cummins-specific parts on a Duramax product", () => {
    const p = productBySlug("duramax-l5p-reman-turbo-silveradosierra-25003500-2020-2023")!;
    const recs = recommendationsFor(p, 8);
    expect(recs.every((r) => r.platform === "duramax" || r.fitment.universal)).toBe(true);
  });

  it("uses the verified $250 core charge on the Diamond Advantage LML turbo", () => {
    const p = productBySlug("diamond-advantage-remanufactured-replacement-turbo")!;
    expect(p.core).toEqual({ amount: 250, illustrative: false });
    const t = computeTotals([{ key: "x", slug: p.slug, qty: 1, core: "deposit" }]);
    expect(t.coreDeposits).toBe(250);
  });
});
