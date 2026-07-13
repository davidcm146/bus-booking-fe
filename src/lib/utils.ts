import { cn as cnFast } from "cnfast";

export function cn(...inputs: Parameters<typeof cnFast>) {
  return cnFast(...inputs);
}
