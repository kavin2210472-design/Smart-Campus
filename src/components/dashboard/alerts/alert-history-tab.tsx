
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useCampusData } from '@/lib/hooks';
import { PredictedAlert, ZoneStatus, Alert } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getAqiPrediction } from '@/app/actions';
import { AlertTriangle, Clock, Megaphone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type DisplayAlert = {
    id: string;
    zoneName: string;
    message: string;
    timestamp: string;
    type: 'current' | 'predicted' | 'historical' | 'manual';
    badgeLabel: string;
    badgeVariant: 'destructive' | 'outline' | 'secondary' | 'default';
};

type AlertHistoryTabProps = {
    manualAlerts?: Alert[];
}

export default function AlertHistoryTab({ manualAlerts = [] }: AlertHistoryTabProps) {
  const { zones, isLoading: isCampusDataLoading } = useCampusData();
  const [predictedAlerts, setPredictedAlerts] = useState<(PredictedAlert & { zoneName: string })[]>([]);
  const [loadingPredictions, setLoadingPredictions] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!isCampusDataLoading && zones.length > 0) {
      const fetchPredictions = async () => {
        setLoadingPredictions(true);
        try {
            const predictions = await Promise.all(
              zones.map(zone => getAqiPrediction(zone.name, zone.historicalData))
            );
            if (isMounted) {
                const newPredictedAlerts = predictions
                    .flatMap((p, index) => p.alerts.map(alert => ({...alert, zoneName: zones[index].name})))
                    .filter(p => p && p.predictedAqi > 100);

                setPredictedAlerts(newPredictedAlerts);
            }
        } catch(e) {
            console.error("Failed to fetch predictions:", e);
        } finally {
            if (isMounted) {
                setLoadingPredictions(false);
            }
        }
      };
      fetchPredictions();
    } else if (!isCampusDataLoading) {
        setLoadingPredictions(false);
    }
    
    return () => { isMounted = false };

  }, [isCampusDataLoading, zones]);
  
  const allAlerts = useMemo(() => {
    if (isCampusDataLoading) return [];

    const activeAlerts: DisplayAlert[] = zones
      .filter(zone => zone.status === ZoneStatus.Unsafe)
      .map(zone => ({
        id: `active-${zone.id}-${new Date().getTime()}`,
        zoneName: zone.name,
        message: 'Unsafe environmental levels detected',
        timestamp: new Date().toLocaleString(),
        type: 'current',
        badgeLabel: 'Active',
        badgeVariant: 'destructive'
      }));
    
    const futureAlerts: DisplayAlert[] = predictedAlerts.map((p, index) => ({
        id: `predicted-${p.zoneName}-${p.predictedAqi}-${index}`,
        zoneName: p.zoneName,
        message: p.description,
        timestamp: new Date().toLocaleString(),
        type: 'predicted',
        badgeLabel: 'Predicted',
        badgeVariant: 'outline'
    }));

    const historicalAlerts: DisplayAlert[] = [];
    zones.forEach(zone => {
        zone.historicalData.forEach(dataPoint => {
            if (dataPoint.pm25 > THRESHOLDS.pm25.unsafe) {
                historicalAlerts.push({
                    id: `hist-pm25-${zone.id}-${dataPoint.timestamp}`,
                    zoneName: zone.name,
                    message: `High PM2.5 level: ${dataPoint.pm25.toFixed(1)} µg/m³`,
                    timestamp: new Date(dataPoint.timestamp).toLocaleString(),
                    type: 'historical',
                    badgeLabel: 'Historical',
                    badgeVariant: 'secondary'
                });
            }
            if (dataPoint.co2 > THRESHOLDS.co2.unsafe) {
                historicalAlerts.push({
                    id: `hist-co2-${zone.id}-${dataPoint.timestamp}`,
                    zoneName: zone.name,
                    message: `High CO2 level: ${dataPoint.co2.toFixed(0)} ppm`,
                    timestamp: new Date(dataPoint.timestamp).toLocaleString(),
                    type: 'historical',
                    badgeLabel: 'Historical',
                    badgeVariant: 'secondary'
                });
            }
        });
    });

    const displayManualAlerts: DisplayAlert[] = manualAlerts.map(alert => ({
        id: alert.id,
        zoneName: alert.zoneName === 'all-zones' ? 'All Zones' : alert.zoneName,
        message: alert.message,
        timestamp: new Date(alert.timestamp).toLocaleString(),
        type: 'manual',
        badgeLabel: 'Manual',
        badgeVariant: 'default'
    }));
    
    const combined = [...displayManualAlerts, ...activeAlerts, ...futureAlerts, ...historicalAlerts];


    const uniqueAlerts = Array.from(new Map(combined.map(a => [a.id, a])).values());
    
    const sortedAlerts = uniqueAlerts.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return sortedAlerts.slice(0, 50); // Limit to 50 for performance

  }, [isCampusDataLoading, zones, predictedAlerts, manualAlerts]);


  const isLoading = isCampusDataLoading || loadingPredictions;

  const renderSkeleton = () => (
    Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      </TableRow>
    ))
  );

  const getIconForType = (type: DisplayAlert['type']) => {
      switch(type) {
          case 'current': return <AlertTriangle className="h-4 w-4 text-destructive" />;
          case 'predicted': return <Clock className="h-4 w-4 text-muted-foreground" />;
          case 'manual': return <Megaphone className="h-4 w-4 text-primary" />;
          default: return <Clock className="h-4 w-4 text-muted-foreground" />;
      }
  }

  const renderAlertRow = (alert: DisplayAlert) => (
    <TableRow key={alert.id}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
            {getIconForType(alert.type)}
            {alert.zoneName}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={alert.badgeVariant}>
          {alert.badgeLabel}
        </Badge>
      </TableCell>
      <TableCell>{alert.message}</TableCell>
      <TableCell>{alert.timestamp}</TableCell>
    </TableRow>
  );
  
  const renderTableContent = (filteredAlerts: DisplayAlert[]) => {
      if (isLoading) return renderSkeleton();
      if (filteredAlerts.length === 0) {
          return (
              <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                      No alerts found.
                  </TableCell>
              </TableRow>
          );
      }
      return filteredAlerts.map(renderAlertRow);
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Alert History</CardTitle>
            <CardDescription>A historical record of all campus environmental alerts.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Zone</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Timestamp</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {renderTableContent(allAlerts)}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}

// Add a dummy THRESHOLDS object to satisfy the dependency
const THRESHOLDS = {
  pm25: { good: 12, warning: 35, unsafe: 55, limit: 35 },
  co2: { good: 800, warning: 1500, unsafe: 2500, limit: 1500 },
};
