import { cn } from "cnfast";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  readonly label: string;
  readonly tone?: "neutral" | "positive" | "warning" | "critical";
}

const TONE_STYLES: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  neutral: "bg-muted text-muted-foreground ring-border",
  positive: "bg-primary-light text-primary-dark ring-primary/20",
  warning: "bg-warning/12 text-amber-800 dark:text-amber-300 ring-warning/25",
  critical: "bg-destructive/10 text-destructive ring-destructive/15",
};

export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  return (
    <Badge variant="secondary" className={cn("h-6 px-2.5 font-bold capitalize ring-1", TONE_STYLES[tone])}>
      {label.replaceAll("_", " ")}
    </Badge>
  );
}
