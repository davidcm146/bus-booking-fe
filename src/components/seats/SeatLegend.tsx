import type { VehicleType } from "@/types";

interface SeatLegendProps {
  readonly vehicleType?: VehicleType;
}

export function SeatLegend({ vehicleType = "seat" }: SeatLegendProps) {
  const isLimousine = vehicleType === "limousine";
  const isSleeper = vehicleType === "sleeper";

  const availableClass = isLimousine
    ? "border-amber-500/50 bg-amber-500/5"
    : isSleeper
    ? "border-violet-500/50 bg-violet-500/5"
    : "border-emerald-500/50 bg-emerald-500/5";

  const selectedClass = isLimousine
    ? "border-amber-600 bg-amber-600 text-white"
    : isSleeper
    ? "border-violet-600 bg-violet-600 text-white"
    : "border-emerald-600 bg-emerald-600 text-white";

  const premiumClass = isLimousine
    ? "border-amber-500 bg-amber-500/15"
    : isSleeper
    ? "border-violet-500 bg-violet-500/15"
    : "border-emerald-500 bg-emerald-500/15";

  const items = [
    { classNames: availableClass, label: "Còn trống" },
    { classNames: selectedClass, label: "Đang chọn" },
    { classNames: "border-dashed border-border-strong bg-muted/70", label: "Đã đặt" },
    { classNames: premiumClass, label: "Ghế VIP / Đầu" },
    { classNames: "border-border bg-muted/40", label: "Cửa sổ" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
          <div className={`h-3.5 w-3.5 rounded border-[1.5px] ${item.classNames}`} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
