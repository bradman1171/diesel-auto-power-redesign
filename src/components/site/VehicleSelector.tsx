import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PLATFORMS, enginesFor, yearsFor, type PlatformId } from "@/data/vehicles";
import { useVehicle } from "@/lib/vehicle";

/** Make → Year → Engine selector. Generations mirror DAP's live catalog categories. */
export function VehicleSelector({ onDone, navigateOnSubmit = true }: { onDone?: () => void; navigateOnSubmit?: boolean }) {
  const { vehicle, setVehicle } = useVehicle();
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<PlatformId | "">("");
  const [year, setYear] = useState<number | "">("");
  const [engine, setEngine] = useState("");

  useEffect(() => {
    if (vehicle) {
      setPlatform(vehicle.platform);
      setYear(vehicle.year);
      setEngine(vehicle.engine);
    }
  }, [vehicle]);

  const years = platform ? yearsFor(platform) : [];
  const engines = platform && year ? enginesFor(platform, year) : [];

  useEffect(() => {
    if (engines.length === 1 && engine !== engines[0]!.id) setEngine(engines[0]!.id);
  }, [engines, engine]);

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform || !year || !engine) return;
    setVehicle({ platform, year, engine });
    onDone?.();
    if (navigateOnSubmit) navigate({ to: "/shop/$category", params: { category: "all" } });
  };

  return (
    <form onSubmit={go} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.8fr_1.4fr_auto]">
      <label className="grid gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">1 · Make</span>
        <select className="field" value={platform} onChange={(e) => { setPlatform(e.target.value as PlatformId); setYear(""); setEngine(""); }}>
          <option value="">Select make</option>
          {PLATFORMS.map((p) => <option key={p.id} value={p.id}>{p.make} {p.name}</option>)}
        </select>
      </label>
      <label className="grid gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">2 · Year</span>
        <select className="field" value={year} disabled={!platform} onChange={(e) => { setYear(Number(e.target.value) || ""); setEngine(""); }}>
          <option value="">Select year</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </label>
      <label className="grid gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">3 · Engine</span>
        <select className="field" value={engine} disabled={!year} onChange={(e) => setEngine(e.target.value)}>
          <option value="">Select engine</option>
          {engines.map((en) => <option key={en.id} value={en.id}>{en.label}</option>)}
        </select>
      </label>
      <button type="submit" disabled={!engine} className="btn btn-primary self-end sm:col-span-2 lg:col-span-1">Shop parts</button>
    </form>
  );
}
