
'use client';

import { useMemo } from 'react';
import { useCampusData } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ZoneStatus } from '@/lib/types';
import { CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

const statusConfig = {
    [ZoneStatus.Safe]: {
      label: 'Safe',
      className: 'bg-green-100 text-green-800',
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    },
    [ZoneStatus.Warning]: {
      label: 'Warning',
      className: 'bg-yellow-100 text-yellow-800',
      icon: <ShieldAlert className="h-4 w-4 text-yellow-600" />,
    },
    [ZoneStatus.Unsafe]: {
      label: 'Unsafe',
      className: 'bg-red-100 text-red-800',
      icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
    },
  };

export default function LiveMonitoringTab() {
  const { zones, isLoading } = useCampusData();

  const sortedZones = useMemo(() => {
    return [...zones].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  }, [zones]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Live Sensor Data Feed</CardTitle>
                <CardDescription>A real-time stream of the latest sensor readings from all campus zones.</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live Feed
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg max-h-[600px] overflow-y-auto">
            <Table>
                <TableHeader className="sticky top-0 bg-muted">
                    <TableRow>
                    <TableHead>Zone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>PM2.5</TableHead>
                    <TableHead>CO₂</TableHead>
                    <TableHead>VOCs</TableHead>
                    <TableHead>Temp.</TableHead>
                    <TableHead>Humidity</TableHead>
                    <TableHead>Noise</TableHead>
                    <TableHead className="text-right">Last Update</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedZones.map((zone) => (
                    <TableRow key={zone.id}>
                        <TableCell className="font-medium">{zone.name}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className={statusConfig[zone.status].className}>
                                {statusConfig[zone.status].icon}
                                <span className="ml-1">{statusConfig[zone.status].label}</span>
                            </Badge>
                        </TableCell>
                        <TableCell>{zone.currentData.pm25.toFixed(1)}</TableCell>
                        <TableCell>{zone.currentData.co2.toFixed(0)}</TableCell>
                        <TableCell>{zone.currentData.voc.toFixed(0)}</TableCell>
                        <TableCell>{zone.currentData.temperature.toFixed(1)}°C</TableCell>
                        <TableCell>{zone.currentData.humidity.toFixed(0)}%</TableCell>
                        <TableCell>{zone.currentData.noise.toFixed(0)}dB</TableCell>
                        <TableCell className="text-right text-muted-foreground text-xs">
                            {formatDistanceToNow(new Date(zone.lastUpdated), { addSuffix: true })}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
