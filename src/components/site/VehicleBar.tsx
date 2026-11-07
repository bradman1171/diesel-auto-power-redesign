import { Link } from "@tanstack/react-router";
import { Truck, X } from "lucide-react";
import { useState } from "react";
import { useVehicle } from "@/lib/vehicle";
import { engineById, platformById } from "@/data/vehicles";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { VehicleSelector } from "./VehicleSelector";

/** Sitewide "My Truck" indicator with change / clear controls. */
export function VehicleBar() {
  const { vehicle, setVehicle } = useVehicle();
  const [open, setOpen] = useState(false);
  const engine = engineById(vehicle?.engine);
  return (
    <div className="border-b border-border bg-primary-soft">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 text-sm">
        <Truck className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        {vehicle && engine ? (
          <>
            <span className="min-w-0">
              <span className="text-muted-foreground">My truck: </span>
              <Link to="/shop/$category" params={{ category: "all" }} className="font-semibold hover:text-primary">
                {vehicle.year} {platformById(vehicle.platform)?.make} · {engine.short}
              </Link>
            </span>
            <button onClick={() => setOpen(true)} className="font-semibold text-primary hover:underline">Change</button>
            <button onClick={() => setVehicle(null)} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground" aria-label="Clear selected vehicle">
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          </>
        ) : (
          <>
            <span className="text-muted-foreground">Select your truck to see parts that fit.</span>
            <button onClick={() => setOpen(true)} className="font-semibold text-primary hover:underline">Select vehicle</button>
          </>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogTitle className="font-display text-2xl uppercase">Select your truck</DialogTitle>
          <DialogDescription>Generations match DAP's catalog. Your truck stays selected as you browse.</DialogDescription>
          <VehicleSelector onDone={() => setOpen(false)} navigateOnSubmit={false} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
