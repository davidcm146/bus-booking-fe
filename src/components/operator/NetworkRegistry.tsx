import { Building2, MapPin, Route, Waypoints } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/operator/StatusBadge";
import { formatDuration } from "@/lib/format";
import type { OperatorDashboardData, ActiveStatus } from "@/types/operator";

interface NetworkRegistryProps {
  readonly data: OperatorDashboardData;
}

function availabilityTone(status: ActiveStatus): "positive" | "neutral" {
  return status === "active" ? "positive" : "neutral";
}

export function NetworkRegistry({ data }: NetworkRegistryProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card className="shadow-card">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between"><div><CardTitle className="text-lg font-extrabold">Operator profile</CardTitle><p className="mt-1 text-sm text-muted-foreground">Identity and service policy.</p></div><Building2 className="size-5 text-primary" /></div>
        </CardHeader>
        <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
          <div><p className="text-xs font-bold text-muted-foreground">NAME & CODE</p><p className="mt-1 font-extrabold">{data.profile.name}</p><p className="text-xs text-muted-foreground">{data.profile.code}</p></div>
          <div><p className="text-xs font-bold text-muted-foreground">STATUS</p><div className="mt-1"><StatusBadge label={data.profile.status} tone={availabilityTone(data.profile.status)} /></div></div>
          <div><p className="text-xs font-bold text-muted-foreground">CONTACT</p><p className="mt-1 text-sm font-semibold">{data.profile.hotline}</p><p className="text-xs text-muted-foreground">{data.profile.email}</p></div>
          <div><p className="text-xs font-bold text-muted-foreground">POLICY</p><p className="mt-1 text-sm leading-5">{data.profile.policy}</p></div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between"><div><CardTitle className="text-lg font-extrabold">Administrative areas</CardTitle><p className="mt-1 text-sm text-muted-foreground">Province, district, and ward hierarchy.</p></div><Waypoints className="size-5 text-primary" /></div>
        </CardHeader>
        <CardContent className="grid gap-3 p-5 sm:grid-cols-2">
          {data.administrativeAreas.map((area) => (
            <Card key={area.id} size="sm" className="bg-muted/45 py-3 shadow-none">
              <CardContent className="px-3"><div className="flex items-start justify-between gap-2"><div><p className="font-bold">{area.name}</p><p className="mt-1 text-xs text-muted-foreground">{area.parentName ? `Under ${area.parentName}` : "Top-level area"}</p></div><StatusBadge label={area.level} /></div><p className="mt-2 font-mono text-xs text-muted-foreground">{area.code}</p></CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-card xl:col-span-2">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between"><div><CardTitle className="text-lg font-extrabold">Routes & ordered stops</CardTitle><p className="mt-1 text-sm text-muted-foreground">Route definitions with stop sequence snapshots.</p></div><Route className="size-5 text-primary" /></div>
        </CardHeader>
        <CardContent className="grid gap-4 p-5 lg:grid-cols-2">
          {data.routes.map((route) => (
            <Card key={route.id} size="sm" className="shadow-none">
              <CardContent className="p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-extrabold">{route.name}</p><p className="mt-1 text-xs text-muted-foreground">{route.distanceKm} km · {formatDuration(route.estimatedMinutes)}</p></div><StatusBadge label={route.status} tone={availabilityTone(route.status)} /></div><div className="mt-4 space-y-3">{route.stops.map((stop) => <div key={`${route.id}-${stop.order}`} className="flex items-center gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-extrabold text-primary-dark">{stop.order}</span><div><p className="text-sm font-bold">{stop.name}</p><p className="text-xs capitalize text-muted-foreground">{stop.type}</p></div></div>)}</div></CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-card xl:col-span-2">
        <CardHeader className="border-b border-border pb-4"><div className="flex items-center justify-between"><div><CardTitle className="text-lg font-extrabold">Locations</CardTitle><p className="mt-1 text-sm text-muted-foreground">Stations, offices, rest areas, and roadside points.</p></div><MapPin className="size-5 text-primary" /></div></CardHeader>
        <CardContent className="grid gap-3 p-5 md:grid-cols-3">{data.locations.map((location) => <Card key={location.id} size="sm" className="shadow-none"><CardContent className="p-4"><div className="flex items-start justify-between gap-2"><p className="font-extrabold">{location.name}</p><StatusBadge label={location.status} tone={availabilityTone(location.status)} /></div><p className="mt-2 text-xs text-muted-foreground">{location.address}</p><p className="mt-1 text-xs text-muted-foreground">{location.areaName}</p><p className="mt-3 text-xs font-bold capitalize text-primary-dark">{location.type.replaceAll("_", " ")}</p></CardContent></Card>)}</CardContent>
      </Card>
    </div>
  );
}
