/** "My Garage" selected vehicle, persisted locally. Miva equivalent: a YMM module session value. */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { PlatformId } from "@/data/vehicles";

export interface Vehicle {
  platform: PlatformId;
  year: number;
  engine: string;
}

const Ctx = createContext<{ vehicle: Vehicle | null; setVehicle: (v: Vehicle | null) => void } | null>(null);
const KEY = "dap-demo-vehicle";

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicle, setV] = useState<Vehicle | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setV(JSON.parse(raw));
    } catch {}
  }, []);
  const setVehicle = (v: Vehicle | null) => {
    setV(v);
    if (v) localStorage.setItem(KEY, JSON.stringify(v));
    else localStorage.removeItem(KEY);
  };
  return <Ctx.Provider value={{ vehicle, setVehicle }}>{children}</Ctx.Provider>;
}

export function useVehicle() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useVehicle outside provider");
  return c;
}
