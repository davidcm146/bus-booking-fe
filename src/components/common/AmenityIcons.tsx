import type { Amenity } from "@/types";
import { cn } from "cnfast";
import { AMENITY_CONFIG } from "@/lib/constants";

export function AmenityList({
  amenities,
  className,
  showLabels = false,
}: {
  amenities: Amenity[];
  className?: string;
  showLabels?: boolean;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {amenities.map((amenity) => {
        const config = AMENITY_CONFIG[amenity];
        const Icon = config.icon;
        return (
          <div
            key={amenity}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
            title={config.long}
          >
            <Icon className="h-3.5 w-3.5" />
            {showLabels && <span>{config.long}</span>}
          </div>
        );
      })}
    </div>
  );
}
