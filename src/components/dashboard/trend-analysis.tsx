
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingUp,
  Download,
  Wind,
  Cloud,
  Thermometer,
  Droplets,
  Ear,
  Flame,
} from 'lucide-react';
import ZoneChart from '@/components/dashboard/zone-chart';
import type { Zone, SensorValues } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';


type TrendAnalysisProps = {
  zone: Zone;
};

type MetricKey = keyof SensorValues;

const metricConfig: {
  [key in MetricKey]: {
    name: string;
    icon: React.ElementType;
    color: string;
  };
} = {
  pm25: { name: 'PM2.5', icon: Wind, color: '#ef4444' },
  co2: { name: 'CO₂', icon: Cloud, color: '#8b5cf6' },
  temperature: { name: 'Temperature', icon: Thermometer, color: '#f97316' },
  humidity: { name: 'Humidity', icon: Droplets, color: '#3b82f6' },
  noise: { name: 'Noise Level', icon: Ear, color: '#14b8a6' },
  voc: { name: 'VOCs', icon: Flame, color: '#eab308' },
};

const getUnit = (metric: MetricKey) => {
    switch (metric) {
        case 'pm25': return 'µg/m³';
        case 'co2': return 'ppm';
        case 'voc': return 'ppb';
        case 'temperature': return '°C';
        case 'humidity': return '%';
        case 'noise': return 'dB';
        default: return '';
    }
};

const StatCard = ({ label, value, unit }: {label: string, value: number, unit: string}) => (
    <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">
            {value.toFixed(label === 'Temperature' ? 1 : 0)}
            <span className="text-base font-normal text-muted-foreground ml-1">{unit}</span>
        </p>
    </div>
);


export default function TrendAnalysis({ zone }: TrendAnalysisProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('pm25');
  const { historicalData, currentData } = zone;

  const stats = {
    current: currentData[activeMetric],
    average: historicalData.reduce((acc, d) => acc + d[activeMetric], 0) / historicalData.length,
    peak: Math.max(...historicalData.map((d) => d[activeMetric])),
    minimum: Math.min(...historicalData.map((d) => d[activeMetric])),
  };

  const handleExport = () => {
    const headers = ['timestamp', 'pm25', 'co2', 'voc', 'temperature', 'humidity', 'noise'];
    const csvRows = [
      headers.join(','),
      ...historicalData.map(row => {
        const formattedTimestamp = format(new Date(row.timestamp), 'yyyy-MM-dd HH:mm:ss');
        const values = headers.map(header => {
            if (header === 'timestamp') return `"${formattedTimestamp}"`;
            return row[header as MetricKey].toFixed(2);
        });
        return values.join(',');
      })
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${zone.name}_data_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trend Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select defaultValue="24">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last Hour</SelectItem>
                <SelectItem value="6">Last 6 Hours</SelectItem>
                <SelectItem value="24">Last 24 Hours</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-1 rounded-lg bg-muted p-1">
          {Object.keys(metricConfig).map((key) => {
            const metric = metricConfig[key as MetricKey];
            const Icon = metric.icon;
            return (
              <Button
                key={key}
                variant={activeMetric === key ? 'secondary' : 'ghost'}
                size="sm"
                className={cn(
                    'flex-1 gap-2', 
                    activeMetric === key && 'bg-white shadow-sm hover:bg-white text-primary'
                )}
                onClick={() => setActiveMetric(key as MetricKey)}
              >
                <Icon className="h-4 w-4" />
                {metric.name}
              </Button>
            );
          })}
        </div>

        <div className="h-80 w-full">
            <ZoneChart 
                data={historicalData}
                dataKey={activeMetric}
                name={metricConfig[activeMetric].name}
                color={metricConfig[activeMetric].color}
            />
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t pt-6">
            <StatCard label="Current" value={stats.current} unit={getUnit(activeMetric)} />
            <StatCard label="Average" value={stats.average} unit={getUnit(activeMetric)} />
            <StatCard label="Peak" value={stats.peak} unit={getUnit(activeMetric)} />
            <StatCard label="Minimum" value={stats.minimum} unit={getUnit(activeMetric)} />
        </div>
      </CardContent>
    </Card>
  );
}
