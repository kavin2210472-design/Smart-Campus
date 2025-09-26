// src/app/dashboard/alerts/page.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useCampusData } from '@/lib/hooks';
import { PredictedAlert, ZoneStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getAqiPrediction } from '@/app/actions';
import { AlertTriangle, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type DisplayAlert = {
    id: string;
    zoneName: string;
    message: string;
    timestamp: string;
    type: 'current' | 'predicted' | 'historical';
    badgeLabel: string;
    badgeVariant: 'destructive' | 'outline' | 'secondary';
};


export default function AlertsLogPage() {
  const { zones, isLoading: isCampusDataLoading } = useCampusData();
  const [predictedAlerts, setPredictedAlerts] = useState<PredictedAlert[]>([]);
  const [isPredictionLoading, setPredictionLoading] = useState(false);

  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });

  useEffect(() => {
    if (zones.length > 0) {
      setPredictionLoading(true);
      const fetchPredictions = async () => {
        const predictions = await Promise.all(
          zones.map(zone => getAqiPrediction(zone.name, zone.historicalData))
        );
        const newPredictedAlerts = predictions
            .filter(p => p && p.predictedAqi > 100)
            .map(p => ({
                ...p,
                zoneName: p.zoneName, // ensure zoneName is passed
                timestamp: new Date().toISOString(),
                type: 'predicted'
            })) as (PredictedAlert & { zoneName: string, timestamp: string, type: 'predicted' })[];
        
        setPredictedAlerts(newPredictedAlerts);
        setPredictionLoading(false);
      };
      fetchPredictions();
    }
  }, [zones]);
  
  const allAlerts = useMemo(() => {
    if (isCampusDataLoading) return [];

    // Active Alerts
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
    
    // Predicted Alerts
    const futureAlerts: DisplayAlert[] = predictedAlerts.map((p, index) => ({
        id: `predicted-${p.zoneName}-${p.predictedAqi}-${p.timestamp}-${index}`,
        zoneName: p.zoneName,
        message: p.alertMessage,
        timestamp: new Date(p.timestamp).toLocaleString(),
        type: 'predicted',
        badgeLabel: 'Predicted',
        badgeVariant: 'outline'
    }));

    // Historical Alerts
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
    
    const combined = [...activeAlerts, ...futureAlerts, ...historicalAlerts];

    const uniqueAlerts = Array.from(new Map(combined.map(a => [a.id, a])).values());
    
    const sortedAlerts = uniqueAlerts.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return sortedAlerts.filter(alert => {
        if(!date?.from) return true;
        const alertDate = new Date(alert.timestamp);
        const from = new Date(date.from);
        from.setHours(0,0,0,0);
        const to = date.to ? new Date(date.to) : new Date();
        to.setHours(23,59,59,999);
        return alertDate >= from && alertDate <= to;
    });

  }, [isCampusDataLoading, zones, predictedAlerts, date]);


  const isLoading = isCampusDataLoading || isPredictionLoading;

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

  const renderAlertRow = (alert: DisplayAlert) => (
    <TableRow key={alert.id}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
            {alert.type === 'current' ? <AlertTriangle className="h-4 w-4 text-destructive" /> : <Clock className="h-4 w-4 text-muted-foreground" /> }
            {alert.zoneName}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={alert.badgeVariant} className={cn(alert.type === 'predicted' && 'border-accent text-accent-foreground')}>
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
                      No alerts found for the selected period.
                  </TableCell>
              </TableRow>
          );
      }
      return filteredAlerts.map(renderAlertRow);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
          Alerts Log
        </h1>
        <p className="text-muted-foreground">
          A historical record of all campus environmental alerts.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle>Alert History</CardTitle>
                <CardDescription>Browse and filter through all recorded alerts.</CardDescription>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full sm:w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Alerts</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="predicted">Predicted</TabsTrigger>
              <TabsTrigger value="historical">Historical</TabsTrigger>
            </TabsList>
            <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zone</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                   <TabsContent value="all">
                      <TableBody>
                        {renderTableContent(allAlerts)}
                      </TableBody>
                   </TabsContent>
                   <TabsContent value="active">
                      <TableBody>
                        {renderTableContent(allAlerts.filter(a => a.type === 'current'))}
                      </TableBody>
                   </TabsContent>
                   <TabsContent value="predicted">
                      <TableBody>
                        {renderTableContent(allAlerts.filter(a => a.type === 'predicted'))}
                      </TableBody>
                   </TabsContent>
                   <TabsContent value="historical">
                      <TableBody>
                        {renderTableContent(allAlerts.filter(a => a.type === 'historical'))}
                      </TableBody>
                   </TabsContent>
                </Table>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
