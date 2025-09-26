// src/app/dashboard/alerts/page.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useCampusData } from '@/lib/hooks';
import { Alert, PredictedAlert, ZoneStatus } from '@/lib/types';
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


export default function AlertsLogPage() {
  const { zones, isLoading: isCampusDataLoading } = useCampusData();
  const [predictedAlerts, setPredictedAlerts] = useState<PredictedAlert[]>([]);
  const [isPredictionLoading, setPredictionLoading] = useState(false);

  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });

  // Mock historical alerts data
  const mockHistoricalAlerts: (Alert | PredictedAlert)[] = useMemo(() => {
    if (isCampusDataLoading) return [];
    const alerts: (Alert | PredictedAlert)[] = [];
    zones.forEach(zone => {
        zone.historicalData.forEach(dataPoint => {
            if (dataPoint.pm25 > 25) {
                alerts.push({
                    id: `hist-alert-${zone.id}-${dataPoint.timestamp}`,
                    zoneId: zone.id,
                    zoneName: zone.name,
                    message: 'Unsafe PM2.5 levels detected',
                    timestamp: new Date(dataPoint.timestamp).toLocaleString(),
                    type: 'current',
                });
            }
            if (dataPoint.co2 > 2000) {
                alerts.push({
                    id: `hist-alert-${zone.id}-${dataPoint.timestamp}`,
                    zoneId: zone.id,
                    zoneName: zone.name,
                    message: 'Unsafe CO2 levels detected',
                    timestamp: new Date(dataPoint.timestamp).toLocaleString(),
                    type: 'current',
                });
            }
        });
    });
    // Add some mock predicted alerts
    for (let i = 0; i < 5; i++) {
        const randomZone = zones[Math.floor(Math.random() * zones.length)];
        if(randomZone) {
            alerts.push({
                zoneName: randomZone.name,
                predictedAqi: 100 + Math.random() * 50,
                alertMessage: "High AQI predicted due to simulated weather patterns.",
                timestamp: addDays(new Date(), -Math.floor(Math.random() * 7)).toLocaleString(),
                type: 'predicted'
            } as PredictedAlert & { timestamp: string, type: 'predicted' });
        }
    }
    return alerts.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [isCampusDataLoading, zones]);

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
                timestamp: new Date().toLocaleString(),
                type: 'predicted'
            })) as (PredictedAlert & { timestamp: string, type: 'predicted' })[];
        
        setPredictedAlerts(newPredictedAlerts);
        setPredictionLoading(false);
      };
      fetchPredictions();
    }
  }, [zones]);

  const activeAlerts = useMemo<Alert[]>(() => {
    return zones
      .filter(zone => zone.status === ZoneStatus.Unsafe)
      .map(zone => ({
        id: `alert-${zone.id}`,
        zoneId: zone.id,
        zoneName: zone.name,
        message: 'Unsafe environmental levels detected',
        timestamp: new Date().toLocaleString(),
        type: 'current',
      }));
  }, [zones]);
  
  const allAlerts = useMemo(() => {
    const combined = [...activeAlerts, ...predictedAlerts, ...mockHistoricalAlerts];
    const uniqueAlerts = Array.from(new Map(combined.map(a => [('id' in a ? a.id : a.timestamp + a.zoneName), a])).values());
    
    return uniqueAlerts.filter(alert => {
        if(!date?.from) return true;
        const alertDate = new Date(alert.timestamp);
        const from = new Date(date.from);
        from.setHours(0,0,0,0);
        const to = date.to ? new Date(date.to) : new Date();
        to.setHours(23,59,59,999);
        return alertDate >= from && alertDate <= to;
    });

  }, [activeAlerts, predictedAlerts, mockHistoricalAlerts, date]);


  const isLoading = isCampusDataLoading || isPredictionLoading;

  const renderSkeleton = () => (
    Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-10" /></TableCell>
        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      </TableRow>
    ))
  );

  const renderAlertRow = (alert: any) => (
    <TableRow key={alert.id || alert.timestamp + alert.zoneName}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
            {alert.type === 'current' ? 
                <AlertTriangle className="h-4 w-4 text-destructive" /> : 
                <Clock className="h-4 w-4 text-accent" />
            }
            {alert.zoneName}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={alert.type === 'current' ? 'destructive' : 'outline'} className={cn(alert.type === 'predicted' && 'border-accent text-accent-foreground')}>
          {alert.type === 'current' ? 'Active' : 'Predicted'}
        </Badge>
      </TableCell>
      <TableCell>{alert.message || alert.alertMessage}</TableCell>
      <TableCell>{alert.timestamp}</TableCell>
    </TableRow>
  );

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
                  <TableBody>
                    {isLoading && renderSkeleton()}
                    {!isLoading && (
                        <>
                           <TabsContent value="all">
                                {allAlerts.map(renderAlertRow)}
                           </TabsContent>
                           <TabsContent value="active">
                                {allAlerts.filter(a => a.type === 'current').map(renderAlertRow)}
                           </TabsContent>
                           <TabsContent value="predicted">
                                {allAlerts.filter(a => a.type === 'predicted').map(renderAlertRow)}
                           </TabsContent>
                        </>
                    )}
                    {!isLoading && allAlerts.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No alerts found for the selected period.
                            </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
