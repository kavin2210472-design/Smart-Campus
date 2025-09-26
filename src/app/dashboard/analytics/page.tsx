// src/app/dashboard/analytics/page.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useCampusData } from '@/lib/hooks';
import { Zone, SensorValues } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

const sensorConfig: { key: keyof SensorValues; name: string; unit: string; }[] = [
  { key: 'pm25', name: 'PM2.5', unit: 'µg/m³' },
  { key: 'co2', name: 'CO₂', unit: 'ppm' },
  { key: 'voc', name: 'VOC', unit: 'ppb' },
  { key: 'temperature', name: 'Temperature', unit: '°C' },
  { key: 'humidity', name: 'Humidity', unit: '%' },
  { key: 'noise', name: 'Noise', unit: 'dB' },
];

const zoneColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--primary))',
];

export default function AnalyticsPage() {
  const { zones, isLoading } = useCampusData();
  const [selectedMetric, setSelectedMetric] = useState<keyof SensorValues>('pm25');
  const [selectedZoneIds, setSelectedZoneIds] = useState<string[]>([]);

  // Default to selecting the first 3 zones if available
  useEffect(() => {
    if (zones.length > 0 && selectedZoneIds.length === 0) {
      setSelectedZoneIds(zones.slice(0, 3).map(z => z.id));
    }
  }, [zones, selectedZoneIds.length]);


  const handleZoneSelection = (zoneId: string, checked: boolean | 'indeterminate') => {
    setSelectedZoneIds(prev =>
      checked ? [...prev, zoneId] : prev.filter(id => id !== zoneId)
    );
  };

  const chartData = useMemo(() => {
    if (!zones.length || !selectedMetric) return [];

    const selectedZones = zones.filter(z => selectedZoneIds.includes(z.id));
    if (!selectedZones.length) return [];
    
    // Assuming all zones have the same historical data timestamps for simplicity
    const timestamps = selectedZones.length > 0 ? selectedZones[0].historicalData.map(d => d.timestamp) : [];

    return timestamps.map(ts => {
      const dataPoint: { timestamp: number; [key: string]: number } = { timestamp: ts };
      selectedZones.forEach(zone => {
        const historyPoint = zone.historicalData.find(d => d.timestamp === ts);
        if(historyPoint) {
            dataPoint[zone.name] = historyPoint[selectedMetric];
        }
      });
      return dataPoint;
    });

  }, [zones, selectedMetric, selectedZoneIds]);
  
  const zoneColorMap = useMemo(() => {
    const map = new Map<string, string>();
    zones.forEach((zone, index) => {
        map.set(zone.id, zoneColors[index % zoneColors.length]);
    });
    return map;
  }, [zones]);


  const metricConfig = sensorConfig.find(m => m.key === selectedMetric);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
          Environmental Analytics
        </h1>
        <p className="text-muted-foreground">
          Compare historical data trends across different campus zones.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Comparison</CardTitle>
          <CardDescription>Select a metric and up to 5 zones to compare their historical data.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="metric-select">Select Metric</Label>
              <Select value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as keyof SensorValues)}>
                <SelectTrigger id="metric-select">
                  <SelectValue placeholder="Select a metric" />
                </SelectTrigger>
                <SelectContent>
                  {sensorConfig.map(metric => (
                    <SelectItem key={metric.key} value={metric.key}>
                      {metric.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Select Zones (up to 5)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)
                ) : (
                  zones.map(zone => (
                    <div key={zone.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`zone-${zone.id}`}
                        checked={selectedZoneIds.includes(zone.id)}
                        onCheckedChange={(checked) => handleZoneSelection(zone.id, checked)}
                        disabled={!selectedZoneIds.includes(zone.id) && selectedZoneIds.length >= 5}
                      />
                      <Label htmlFor={`zone-${zone.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {zone.name}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="h-96 w-full mt-4">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        yAxisId="left"
                        orientation="left"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        unit={metricConfig?.unit}
                        label={{ value: metricConfig?.name, angle: -90, position: 'insideLeft', offset: 10, style: { textAnchor: 'middle' } }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                        }}
                        labelFormatter={(label) => new Date(label).toLocaleString()}
                        formatter={(value: number, name: string) => [`${value.toFixed(2)} ${metricConfig?.unit}`, name]}
                    />
                    <Legend />
                    {zones.filter(z => selectedZoneIds.includes(z.id)).map((zone) => (
                        <Line
                        key={zone.id}
                        yAxisId="left"
                        type="monotone"
                        dataKey={zone.name}
                        stroke={zoneColorMap.get(zone.id)}
                        strokeWidth={2}
                        dot={false}
                        />
                    ))}
                    </LineChart>
                </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
