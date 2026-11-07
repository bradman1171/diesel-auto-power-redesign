/**
 * Centralized demonstration catalog.
 *
 * `catalog.json` holds products sampled from dieselautopower.com (Nov 2026):
 * names, SKUs, brands, prices (incl. sale prices), application text, core
 * requirements, descriptions and live image URLs. Fitment generation ids are
 * mapped from DAP's own application text. Replace this module with a Miva feed.
 */
import turbo from "@/assets/p-turbo.jpg";
import injector from "@/assets/p-injector.jpg";
import studs from "@/assets/p-studs.jpg";
import pump from "@/assets/p-pump.jpg";
import exhaust from "@/assets/p-exhaust.jpg";
import engine from "@/assets/p-engine.jpg";
import tuner from "@/assets/p-tuner.jpg";
import trans from "@/assets/p-trans.jpg";
import catalog from "./catalog.json";
import { engineById, type PlatformId } from "./vehicles";

export type CategoryId =
  | "engine-parts"
  | "turbochargers"
  | "fuel-injectors"
  | "fuel-systems"
  | "exhaust"
  | "performance"
  | "transmission";

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
  image: string;
}

export const CATEGORIES: Category[] = [
  { id: "engine-parts", name: "Engine Parts", blurb: "Head studs, cams, valve springs, rocker arms, gaskets and bearings.", image: engine },
  { id: "turbochargers", name: "Turbochargers", blurb: "Reman stock replacements, DAP builds, billet wheels and covers.", image: turbo },
  { id: "fuel-injectors", name: "Fuel Injectors", blurb: "New Bosch and OEM, DAP performance injectors and seal kits.", image: injector },
  { id: "fuel-systems", name: "Fuel Systems", blurb: "Injection pumps, lift pumps, injection lines and P-pump parts.", image: pump },
  { id: "exhaust", name: "Exhaust", blurb: "Manifolds, up-pipes and EGT fittings.", image: exhaust },
  { id: "performance", name: "Performance & Intake", blurb: "Tuner bundles, cold air intakes and intercooler piping.", image: tuner },
  { id: "transmission", name: "Drivetrain & Cooling", blurb: "Transmission coolers, cooler lines, intercoolers and coolant parts.", image: trans },
];

const REP: Record<string, string> = { turbo, injector, studs, pump, exhaust, engine, tuner, trans };

export interface Fitment {
  /** Exact application text as shown on the live DAP listing. */
  label: string;
  universal?: boolean;
  engines?: string[];
  yearFrom?: number;
  yearTo?: number;
}

export interface CoreCharge {
  amount: number;
  /** true when the amount is a placeholder, not a charge published by DAP */
  illustrative: boolean;
}

export interface Product {
  slug: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  compareAt?: number;
  category: CategoryId;
  platform?: PlatformId;
  fitment: Fitment;
  /** Representative studio image used when live photos can't load */
  image: string;
  liveImages: string[];
  features: string[];
  description: string;
  core?: CoreCharge;
  sourceUrl: string;
  isDap: boolean;
  isNew: boolean;
  featured: boolean;
  popularity: number;
  addedOrder: number;
}

interface RawProduct extends Omit<Product, "image" | "category" | "platform"> {
  imageKey: string;
  category: string;
  platform?: string;
}

export const PRODUCTS: Product[] = (catalog as unknown as RawProduct[]).map(({ imageKey, ...p }) => ({
  ...p,
  category: p.category as CategoryId,
  platform: p.platform as PlatformId | undefined,
  image: REP[imageKey] ?? engine,
}) as Product);

export const BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))].sort();

export const categoryById = (id?: string) => CATEGORIES.find((c) => c.id === id);
export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const FREE_SHIP_THRESHOLD = 149;

export type FitStatus = "fits" | "universal" | "no-match" | "none";

export function fitStatus(p: Product, engineId?: string, year?: number): FitStatus {
  if (!engineId) return "none";
  if (p.fitment.universal) return "universal";
  if (!p.fitment.engines?.includes(engineId)) return "no-match";
  if (year && p.fitment.yearFrom && p.fitment.yearTo && (year < p.fitment.yearFrom || year > p.fitment.yearTo)) return "no-match";
  return "fits";
}

export function fitsEngine(p: Product, engineId?: string, year?: number) {
  const s = fitStatus(p, engineId, year);
  return s === "fits" || s === "universal" || s === "none";
}

export function searchProducts(q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return PRODUCTS.filter((p) => [p.name, p.sku, p.brand].some((f) => f.toLowerCase().includes(s)));
}

/**
 * Recommendations, in priority order:
 * 1. same vehicle (shared engine generation), 2. same/complementary category,
 * 3. upgrade/replacement in same category & platform, 4. same manufacturer.
 * Never recommends a different-platform, vehicle-specific part.
 */
const COMPLEMENTS: Record<CategoryId, CategoryId[]> = {
  turbochargers: ["exhaust", "performance", "engine-parts"],
  "fuel-injectors": ["fuel-systems", "performance"],
  "fuel-systems": ["fuel-injectors", "performance"],
  "engine-parts": ["engine-parts", "turbochargers"],
  exhaust: ["turbochargers", "performance"],
  performance: ["fuel-injectors", "turbochargers", "exhaust"],
  transmission: ["performance", "engine-parts"],
};

export function recommendationsFor(p: Product, limit = 4): Product[] {
  const engines = new Set(p.fitment.engines ?? []);
  const scored = PRODUCTS.filter((x) => x.slug !== p.slug)
    .filter((x) => x.fitment.universal || !p.platform || x.platform === p.platform)
    .map((x) => {
      let s = 0;
      const shared = (x.fitment.engines ?? []).some((e) => engines.has(e));
      if (shared) s += 100;
      if (x.category === p.category) s += 30;
      else if (COMPLEMENTS[p.category].includes(x.category)) s += 20;
      if (x.brand === p.brand) s += 10;
      if (x.fitment.universal) s += 2;
      return { x, s };
    })
    .filter(({ s }) => s >= 20)
    .sort((a, b) => b.s - a.s || b.x.popularity - a.x.popularity);
  return scored.slice(0, limit).map(({ x }) => x);
}

export function fitmentEngineLabels(p: Product) {
  return (p.fitment.engines ?? []).map((id) => engineById(id)?.label).filter(Boolean) as string[];
}

export type SortKey = "featured" | "best" | "price-asc" | "price-desc" | "newest";

export function sortProducts(list: Product[], sort: SortKey) {
  const a = [...list];
  switch (sort) {
    case "price-asc": return a.sort((x, y) => x.price - y.price);
    case "price-desc": return a.sort((x, y) => y.price - x.price);
    case "newest": return a.sort((x, y) => Number(y.isNew) - Number(x.isNew) || y.addedOrder - x.addedOrder);
    case "best": return a.sort((x, y) => y.popularity - x.popularity);
    default: return a.sort((x, y) => Number(y.featured) - Number(x.featured) || y.popularity - x.popularity);
  }
}

export const formatPrice = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
