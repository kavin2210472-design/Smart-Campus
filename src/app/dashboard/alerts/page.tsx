
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

type AlertsLogPageProps = {
    manualAlerts?: Alert[];
}

export default function AlertsLogPage({ manualAlerts = [] }: AlertsLogPageProps) {
  const { zones, isLoading: isCampusDataLoading } = useCampusData();
  const [predictedAlerts, setPredictedAlerts] = useState<PredictedAlert[]>([]);

  useEffect(() => {
    if (!isCampusDataLoading && zones.length > 0) {
      const fetchPredictions = async () => {
        try {
            const predictions = await Promise.all(
              zones.map(zone => getAqiPrediction(zone.name, zone.historicalData))
            );
            const newPredictedAlerts = predictions
                .filter(p => p && p.predictedAqi > 100)
                .map(p => ({
                    ...p,
                    zoneName: p.zoneName, 
                    timestamp: new Date().toISOString(),
                    type: 'predicted'
                })) as (PredictedAlert & { zoneName: string, timestamp: string, type: 'predicted' })[];
            
            setPredictedAlerts(newPredictedAlerts);
        } catch(e) {
            console.error(e);
        }
      };
      fetchPredictions();
    }
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
        id: `predicted-${p.zoneName}-${p.predictedAqi}-${p.timestamp}-${index}`,
        zoneName: p.zoneName,
        message: p.alertMessage,
        timestamp: new Date(p.timestamp).toLocaleString(),
        type: 'predicted',
        badgeLabel: 'Predicted',
        badgeVariant: 'outline'
    }));

    const historicalAlerts: DisplayAlert[] = [];
    zones.forEach(zone => {
        zone.historicalData.forEach(dataPoint => {
            if (dataPoint.pm25 > 25) {
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
            if (dataPoint.co2 > 2000) {
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
        ...alert,
        id: alert.id,
        zoneName: alert.zoneName,
        message: alert.message,
        timestamp: alert.timestamp,
        type: 'manual',
        badgeLabel: 'Manual',
        badgeVariant: 'default'
    }));
    
    const combined = [...activeAlerts, ...futureAlerts, ...historicalAlerts, ...displayManualAlerts];

    const uniqueAlerts = Array.from(new Map(combined.map(a => [a.id, a])).values());
    
    const sortedAlerts = uniqueAlerts.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return sortedAlerts;

  }, [isCampusDataLoading, zones, predictedAlerts, manualAlerts]);


  const isLoading = isCampusDataLoading;

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
