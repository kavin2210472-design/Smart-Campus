"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zone, ZoneStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const statusColors: Record<ZoneStatus, string> = {
  [ZoneStatus.Safe]: "bg-green-500/80 border-green-700",
  [ZoneStatus.Warning]: "bg-yellow-400/80 border-yellow-600",
  [ZoneStatus.Unsafe]: "bg-red-500/80 border-red-700",
};

export default function CampusMap({ zones, onZoneClick, isLoading }: { zones: Zone[], onZoneClick: (zone: Zone) => void, isLoading?: boolean }) {
  const renderSkeletons = () => {
    return zones.map((zone) => (
      <Skeleton
        key={zone.id}
        className="absolute rounded-md"
        style={{
          top: zone.mapPosition.top,
          left: zone.mapPosition.left,
          width: zone.mapPosition.width,
          height: zone.mapPosition.height,
        }}
      />
    ));
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Campus Heatmap</CardTitle>
        <CardDescription>Live environmental status across zones.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] md:h-[400px] relative bg-muted/50 dark:bg-muted/30 rounded-lg p-2">
          {isLoading ? renderSkeletons() : zones.map((zone) => (
            <div
              key={zone.id}
              onClick={() => onZoneClick(zone)}
              className={cn(
                "absolute rounded-md border-2 transition-all duration-500 ease-in-out cursor-pointer hover:scale-105 hover:shadow-lg transform flex items-center justify-center p-2",
                statusColors[zone.status]
              )}
              style={{
                top: zone.mapPosition.top,
                left: zone.mapPosition.left,
                width: zone.mapPosition.width,
                height: zone.mapPosition.height,
              }}
            >
              <span className="text-white font-bold text-xs md:text-sm drop-shadow-md text-center bg-black/20 rounded px-1.5 py-0.5">
                {zone.name}
              </span>
            </div>
          ))}
          <div className="absolute bottom-2 right-2 flex items-center gap-2 md:gap-4 text-xs bg-card/80 p-1.5 rounded-md">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div> Safe</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-400"></div> Warn</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Unsafe</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
