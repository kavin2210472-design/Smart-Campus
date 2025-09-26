
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zone, ZoneStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type CampusMapProps = {
  zones: Zone[];
};

const statusStyles = {
  [ZoneStatus.Safe]: 'bg-green-500/20 border-green-500 text-green-700 hover:bg-green-500/40',
  [ZoneStatus.Warning]: 'bg-yellow-500/20 border-yellow-500 text-yellow-700 hover:bg-yellow-500/40 animate-pulse',
  [ZoneStatus.Unsafe]: 'bg-red-500/20 border-red-500 text-red-700 hover:bg-red-500/40 animate-pulse',
};

export default function CampusMap({ zones }: CampusMapProps) {
  const router = useRouter();

  const handleZoneClick = (zoneId: string) => {
    router.push(`/dashboard/analysis?zone=${zoneId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campus Overview Map</CardTitle>
        <CardDescription>Real-time status of all monitored zones. Click a zone for details.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] w-full rounded-lg bg-muted">
          {zones.map((zone) => (
            <button
              key={zone.id}
              className={cn(
                'absolute flex items-center justify-center rounded-md border-2 p-2 transition-all duration-300',
                statusStyles[zone.status]
              )}
              style={zone.mapPosition}
              onClick={() => handleZoneClick(zone.id)}
              title={`View details for ${zone.name}`}
            >
              <span className="font-semibold text-sm">{zone.name}</span>
            </button>
          ))}
           <div className="absolute bottom-2 right-2 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-green-500"></span>Safe</div>
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-yellow-500"></span>Warning</div>
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-red-500"></span>Unsafe</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
