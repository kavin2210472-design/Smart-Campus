
'use client';

import { CheckCircle, MapPin, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { Zone } from '@/lib/types';
import { ZoneStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type ZoneSelectionProps = {
  zones: Zone[];
  selectedZone: Zone;
  onZoneChange: (zoneId: string) => void;
};

export default function ZoneSelection({
  zones,
  selectedZone,
  onZoneChange,
}: ZoneSelectionProps) {
  const statusConfig = {
    [ZoneStatus.Safe]: {
      label: 'Safe',
      className: 'bg-green-100 text-green-800 border-green-200',
      icon: <CheckCircle className="h-4 w-4" />,
    },
    [ZoneStatus.Warning]: {
      label: 'Warning',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: <CheckCircle className="h-4 w-4" />,
    },
    [ZoneStatus.Unsafe]: {
      label: 'Unsafe',
      className: 'bg-red-100 text-red-800 border-red-200',
      icon: <CheckCircle className="h-4 w-4" />,
    },
  };

  const currentStatus = statusConfig[selectedZone.status];

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-bold">Zone Analysis</h1>
        <div className="flex items-center gap-4">
          <Select value={selectedZone.id} onValueChange={onZoneChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select a zone" />
            </SelectTrigger>
            <SelectContent>
              {zones.map((zone) => (
                <SelectItem key={zone.id} value={zone.id}>
                  {zone.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge className={cn('gap-2', currentStatus.className)}>
            {currentStatus.icon}
            {currentStatus.label}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{selectedZone.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>
            Last updated: {format(new Date(selectedZone.lastUpdated), 'p')}
          </span>
        </div>
      </div>
    </div>
  );
}
