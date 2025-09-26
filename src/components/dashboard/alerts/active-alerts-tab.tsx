
'use client';

import { useState, useMemo } from 'react';
import { useCampusData } from '@/lib/hooks';
import { Alert, ZoneStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ShieldCheck, AlertTriangle, MessageSquareWarning } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const getSeverity = (metric: keyof typeof THRESHOLDS, value: number): 'Critical' | 'High' | 'Medium' | 'Low' => {
    if (value > THRESHOLDS[metric].unsafe * 1.2) return 'Critical';
    if (value > THRESHOLDS[metric].unsafe) return 'High';
    if (value > THRESHOLDS[metric].warning) return 'Medium';
    return 'Low';
};

const getUnsafeMetric = (zone: any) => {
    for (const key of Object.keys(THRESHOLDS)) {
        const metric = key as keyof typeof THRESHOLDS;
        if (zone.currentData[metric] > THRESHOLDS[metric].warning) {
            return {
                metric,
                value: zone.currentData[metric],
                alertType: METRIC_NAMES[metric],
                severity: getSeverity(metric, zone.currentData[metric]),
            };
        }
    }
    return null;
};

export default function ActiveAlertsTab() {
  const { zones, isLoading } = useCampusData();
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  const activeAlerts = useMemo(() => {
    if (isLoading) return [];
    return zones
      .filter((zone) => zone.status !== ZoneStatus.Safe)
      .map((zone) => {
        const unsafeInfo = getUnsafeMetric(zone);
        return {
          id: zone.id,
          zoneName: zone.name,
          alertType: unsafeInfo?.alertType || 'Multiple',
          severity: unsafeInfo?.severity || 'Medium',
          currentValue: unsafeInfo ? `${unsafeInfo.value.toFixed(1)} ${UNITS[unsafeInfo.metric]}` : 'N/A',
          time: zone.lastUpdated,
          status: 'Active',
        };
      });
  }, [zones, isLoading]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAlerts(activeAlerts.map((a) => a.id));
    } else {
      setSelectedAlerts([]);
    }
  };

  const handleSelect = (alertId: string, checked: boolean) => {
    if (checked) {
      setSelectedAlerts((prev) => [...prev, alertId]);
    } else {
      setSelectedAlerts((prev) => prev.filter((id) => id !== alertId));
    }
  };
  
  if (isLoading) {
      return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
                <CardTitle>Active Alerts</CardTitle>
                <CardDescription>Real-time monitoring alerts across campus zones</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live Updates
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between py-2 text-sm text-muted-foreground">
            <p>{selectedAlerts.length} of {activeAlerts.length} alerts selected</p>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-2 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                    Acknowledge All
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    Escalate All
                </Button>
            </div>
        </div>
        <div className="border rounded-lg">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[50px]">
                    <Checkbox
                        onCheckedChange={handleSelectAll}
                        checked={selectedAlerts.length === activeAlerts.length && activeAlerts.length > 0}
                    />
                </TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Alert Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {activeAlerts.map((alert) => (
                <TableRow key={alert.id}>
                    <TableCell>
                    <Checkbox
                        onCheckedChange={(checked) => handleSelect(alert.id, !!checked)}
                        checked={selectedAlerts.includes(alert.id)}
                    />
                    </TableCell>
                    <TableCell className="font-medium">{alert.zoneName}</TableCell>
                    <TableCell>{alert.alertType}</TableCell>
                    <TableCell>
                    <Badge variant={alert.severity === 'Critical' || alert.severity === 'High' ? 'destructive' : 'secondary'}>
                        {alert.severity}
                    </Badge>
                    </TableCell>
                    <TableCell>{alert.currentValue}</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(alert.time), { addSuffix: true })}</TableCell>
                    <TableCell>
                    <Badge variant="outline" className="text-red-500 border-red-500">
                        {alert.status}
                    </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ShieldCheck className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <AlertTriangle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MessageSquareWarning className="h-4 w-4" />
                        </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>

        {activeAlerts.length === 0 && (
             <div className="text-center py-16 text-muted-foreground">
                No active alerts at this time. All systems are normal.
            </div>
        )}
      </CardContent>
    </Card>
  );
}


// Duplicating these from other files to avoid complex imports in this new component
const THRESHOLDS = {
  pm25: { good: 12, warning: 35, unsafe: 55, limit: 35 },
  co2: { good: 800, warning: 1500, unsafe: 2500, limit: 1500 },
  voc: { good: 250, warning: 500, unsafe: 1000, limit: 500 },
  temperature: { good: 25, warning: 28, unsafe: 32, limit: 28 },
  humidity: { good: 50, warning: 70, unsafe: 80, limit: 80 },
  noise: { good: 60, warning: 70, unsafe: 85, limit: 70 },
};

const METRIC_NAMES = {
  pm25: 'Air Quality (PM2.5)',
  co2: 'Air Quality (CO2)',
  voc: 'Air Quality (VOC)',
  temperature: 'Temperature',
  humidity: 'Humidity',
  noise: 'Noise Level',
};

const UNITS = {
    pm25: 'µg/m³',
    co2: 'ppm',
    voc: 'µg/m³',
    temperature: '°C',
    humidity: '%',
    noise: 'dB',
};
