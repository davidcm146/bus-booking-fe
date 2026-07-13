"use client";

import { Activity, KeyRound, Map } from "lucide-react";
import { AccessRegistry } from "@/components/operator/AccessRegistry";
import { ActivityRegistry } from "@/components/operator/ActivityRegistry";
import { NetworkRegistry } from "@/components/operator/NetworkRegistry";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { OperatorDashboardData } from "@/types/operator";

interface DataRegistryProps {
  readonly data: OperatorDashboardData;
}

export function DataRegistry({ data }: DataRegistryProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold tracking-[-0.03em]">Data registry</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Every remaining schema entity is represented here and ready to swap from fixture records to API responses.</p>
      </div>
      <Tabs defaultValue="network">
        <TabsList className="no-scrollbar h-10 max-w-full justify-start overflow-x-auto p-1" aria-label="Schema registry sections">
          <TabsTrigger value="network" className="shrink-0 gap-1.5"><Map className="size-4" /> Network</TabsTrigger>
          <TabsTrigger value="access" className="shrink-0 gap-1.5"><KeyRound className="size-4" /> Access</TabsTrigger>
          <TabsTrigger value="activity" className="shrink-0 gap-1.5"><Activity className="size-4" /> Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="network" className="mt-5"><NetworkRegistry data={data} /></TabsContent>
        <TabsContent value="access" className="mt-5"><AccessRegistry data={data} /></TabsContent>
        <TabsContent value="activity" className="mt-5"><ActivityRegistry data={data} /></TabsContent>
      </Tabs>
    </div>
  );
}
