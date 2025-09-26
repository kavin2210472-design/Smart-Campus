
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { LucideIcon } from 'lucide-react';
import type { SensorValues, HistoricalDataPoint } from '@/lib/types';
import { THRESHOLDS } from '@/lib/hooks';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

type MetricCardProps = {
  metric: keyof SensorValues;
  name: string;
  icon: LucideIcon;
  data: SensorValues;
  historicalData: HistoricalDataPoint[];
};

const getStatus = (metric: keyof SensorValues, value: number) => {
  if (value > THRESHOLDS[metric].warning) return 'Warning';
  if (value > THRESHOLDS[metric].unsafe) return 'Unsafe';
  return 'Safe';
};

const getStatusColor = (status: 'Safe' | 'Warning' | 'Unsafe') => {
  if (status === 'Unsafe') return 'bg-red-500';
  if (status === 'Warning') return 'bg-yellow-500';
  return 'bg-green-500';
};

const getTrend = (
  current: number,
  historical: HistoricalDataPoint[],
  metric: keyof SensorValues
) => {
  if (historical.length < 2)
    return { diff: 0, icon: Minus, color: 'text-gray-500' };
  const previousValue = historical[historical.length - 2][metric];
  const diff = ((current - previousValue) / previousValue) * 100;

  if (Math.abs(diff) < 1) {
    return { diff: 0, icon: Minus, color: 'text-gray-500' };
  }
  if (diff > 0) {
    return { diff, icon: TrendingUp, color: 'text-red-500' };
  }
  return { diff, icon: TrendingDown, color: 'text-green-500' };
};

const getUnit = (metric: keyof SensorValues) => {
    switch (metric) {
        case 'pm25': return 'µg/m³';
        case 'co2': return 'ppm';
        case 'voc': return 'µg/m³';
        case 'temperature': return '°C';
        case 'humidity': return '%';
        case 'noise': return 'dB';
        default: return '';
    }
};


export default function MetricCard({
  metric,
  name,
  icon: Icon,
  data,
  historicalData,
}: MetricCardProps) {
  const value = data[metric];
  const status = useMemo(() => getStatus(metric, value), [metric, value]);
  const progressValue = useMemo(() => (value / (THRESHOLDS[metric].limit * 1.5)) * 100, [metric, value]);
  const trend = useMemo(() => getTrend(value, historicalData, metric), [value, historicalData, metric]);
  const lastUpdatedTimestamp = historicalData[historicalData.length - 1]?.timestamp;

  const TrendIcon = trend.icon;
  const unit = getUnit(metric);

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Icon className="h-4 w-4" />
            <span>{name}</span>
          </div>
          <Badge
            variant={status === 'Safe' ? 'secondary' : 'default'}
            className={cn({
              'bg-yellow-100 text-yellow-800 border-yellow-200': status === 'Warning',
              'bg-red-100 text-red-800 border-red-200': status === 'Unsafe',
            })}
          >
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="mb-2">
          <span className="text-3xl font-bold">{value.toFixed(name === 'Temperature' ? 1 : 0)}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          WHO Limit: {THRESHOLDS[metric].limit} {unit}
        </p>
        <Progress value={progressValue} className="h-2 mb-2" indicatorclassname={getStatusColor(status)} />
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div className={cn('flex items-center', trend.color)}>
            <TrendIcon className="h-3 w-3 mr-1" />
            <span>{trend.diff.toFixed(0)}% vs 1h ago</span>
          </div>
          {lastUpdatedTimestamp && (
            <span>{formatDistanceToNow(new Date(lastUpdatedTimestamp), { addSuffix: true })}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Add this to the progress component to use the indicatorclassname
declare module "react" {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      indicatorclassname?: string;
    }
}
