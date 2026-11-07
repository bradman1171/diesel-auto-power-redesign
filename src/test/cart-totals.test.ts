import { describe, expect, it } from "vitest";
import { computeTotals } from "@/lib/cart";

describe("core exchange totals", () => {
  it("adds the core deposit per unit when 'add core deposit' is chosen", () => {
    const t = computeTotals([{ key: "a", slug: "duramax-l5p-reman-turbo-silveradosierra-25003500-2020-2023", qty: 2, core: "deposit" }]);
    expect(t.merchandise).toBeCloseTo(5003.9);
    expect(t.coreDeposits).toBe(500);
    expect(t.total).toBeCloseTo(5503.9);
  });

  it("charges no deposit when the customer sends the core first", () => {
    const t = computeTotals([{ key: "b", slug: "duramax-l5p-reman-turbo-silveradosierra-25003500-2020-2023", qty: 1, core: "send-first" }]);
    expect(t.coreDeposits).toBe(0);
    expect(t.total).toBeCloseTo(2501.95);
  });
});
