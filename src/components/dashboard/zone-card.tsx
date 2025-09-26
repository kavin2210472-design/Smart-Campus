import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zone, ZoneStatus } from "@/lib/types";
import { Thermometer, Wind, Waves, Co2, Volume2, Factory } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

const statusStyles: Record<ZoneStatus, { badge: string; text: string }> = {
  [ZoneStatus.Safe]: { badge: 'bg-green-500/20 text-green-700 border-green-500/30', text: 'text-green-600' },
  [ZoneStatus.Warning]: { badge: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30', text: 'text-yellow-600' },
  [ZoneStatus.Unsafe]: { badge: 'bg-red-500/20 text-red-700 border-red-500/30', text: 'text-red-600' },
};

export default function ZoneCard({ zone, onClick, isLoading }: { zone: Zone; onClick: () => void; isLoading?: boolean }) {

  if (isLoading) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <Skeleton className="h-6 w-3/4 mb-1" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const sensorReadings = [
    { icon: Wind, value: `${zone.currentData.pm25.toFixed(1)} µg/m³`, label: 'PM2.5' },
    { icon: Factory, value: `${zone.currentData.co2.toFixed(0)} ppm`, label: 'CO₂' },
    { icon: Co2, value: `${zone.currentData.voc.toFixed(0)} ppb`, label: 'VOC' },
    { icon: Thermometer, value: `${zone.currentData.temperature.toFixed(1)}°C`, label: 'Temp' },
    { icon: Waves, value: `${zone.currentData.humidity.toFixed(1)}%`, label: 'Humidity' },
    { icon: Volume2, value: `${zone.currentData.noise.toFixed(0)} dB`, label: 'Noise' },
  ];

  const style = statusStyles[zone.status];

  return (
    <Card onClick={onClick} className="cursor-pointer hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{zone.name}</CardTitle>
          <Badge variant="outline" className={cn("text-xs", style.badge)}>{zone.status}</Badge>
        </div>
        <CardDescription className={cn("font-semibold", style.text)}>
          Environmental status is {zone.status}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 text-sm">
        {sensorReadings.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-2" title={label}>
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium whitespace-nowrap">{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
