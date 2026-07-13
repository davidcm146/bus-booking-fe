import type { Metadata } from "next";
import { OperatorWorkspace } from "@/components/operator/OperatorWorkspace";
import { getOperatorDashboard } from "@/lib/services/operatorService";

export const metadata: Metadata = {
  title: "Operator workspace",
  description: "Manage trips, bookings, passenger check-in, vehicles, and promotions.",
};

export default function OperatorPage() {
  return <OperatorWorkspace data={getOperatorDashboard()} />;
}
