const LEGEND_ITEMS = [
  { border: "border-primary", bg: "bg-surface", label: "Available" },
  { border: "border-primary", bg: "bg-primary", label: "Selected" },
  { border: "border-dashed border-border-strong", bg: "bg-muted", label: "Occupied" },
  { border: "border-accent", bg: "bg-surface", label: "Premium" },
  { border: "border-primary", bg: "bg-primary-light", label: "Window" },
] as const;

export function SeatLegend() {
  return (
    <div className="flex flex-wrap gap-2.5 sm:gap-3.5">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
          <div className={`h-3.5 w-3.5 rounded border-[1.5px] ${item.border} ${item.bg}`} />
          {item.label}
        </div>
      ))}
    </div>
  );
}
