import { Crown, BedSingle, Armchair } from "lucide-react";
import { VEHICLE_TYPE_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { VehicleType } from "@/types";

export function VehicleTypePill({
  type,
  className,
}: {
  type: VehicleType;
  className?: string;
}) {
  const meta = VEHICLE_TYPE_META[type];
  if (!meta) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold shadow-2xs transition-colors",
        meta.badgeBg,
        meta.badgeBorder,
        meta.badgeText,
        className
      )}
    >
      {type === "limousine" ? (
        <Crown className="h-3 w-3" />
      ) : type === "sleeper" ? (
        <BedSingle className="h-3 w-3" />
      ) : (
        <Armchair className="h-3 w-3" />
      )}
      <span>{meta.labelVi}</span>
    </span>
  );
}
