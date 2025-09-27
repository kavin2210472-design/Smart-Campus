
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { LucideIcon } from 'lucide-react';
import type { SensorValues, HistoricalDataPoint } from '@/lib/types';
import { THRESHOLDS } from '@/lib/hooks';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { cn } from '@/lib/utils';

type MetricCardProps = {
  metric: keyof SensorValues;
  name: string;
  icon: LucideIcon;
  data: SensorValues;
  historicalData: HistoricalDataPoint[];
};

const getStatus = (metric: keyof SensorValues, value: number) => {
  if (value > THRESHOLDS[metric].unsafe) return 'Unsafe';
  if (value > THRESHOLDS[metric].warning) return 'Warning';
  return 'Safe';
};

const getStatusStyles = (status: 'Safe' | 'Warning' | 'Unsafe') => {
  if (status === 'Unsafe') return {
    progress: 'bg-red-500',
    badge: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
    value: 'text-red-600',
  };
  if (status === 'Warning') return {
    progress: 'bg-yellow-500',
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
    value: 'text-yellow-600',
  };
  return {
    progress: 'bg-green-500',
    badge: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
    value: 'text-green-600',
  };
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

  // For temp, humidity, noise, higher can be bad
  const isBadTrend = ['pm25', 'co2', 'voc', 'temperature', 'humidity', 'noise'].includes(metric);

  if (Math.abs(diff) < 0.1) {
    return { diff: 0, icon: Minus, color: 'text-muted-foreground' };
  }
  if (diff > 0) {
    return { diff, icon: TrendingUp, color: isBadTrend ? 'text-red-500' : 'text-green-500' };
  }
  return { diff, icon: TrendingDown, color: isBadTrend ? 'text-green-500' : 'text-red-500' };
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
  const styles = useMemo(() => getStatusStyles(status), [status]);
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
            <Icon className="h-5 w-5 text-primary" />
            <span>{name}</span>
          </div>
          <Badge
            variant={'outline'}
            className={cn('font-semibold', styles.badge)}
          >
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="mb-2">
          <span className={cn('text-3xl font-bold', status !== 'Safe' ? styles.value : 'text-foreground')}>
            {value.toFixed(metric === 'temperature' ? 1 : 0)}
          </span>
          <span className="text-sm text-muted-foreground ml-1">{unit}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          WHO Limit: {THRESHOLDS[metric].limit} {unit}
        </p>
        <Progress value={progressValue} className="h-2 mb-2" indicatorClassName={styles.progress} />
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div className={cn('flex items-center', trend.color)}>
            <TrendIcon className="h-3 w-3 mr-1" />
            <span>{trend.diff.toFixed(0)}% vs 1h ago</span>
          </div>
          {lastUpdatedTimestamp && (
            <span>{formatDistanceToNowStrict(new Date(lastUpdatedTimestamp))} ago</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Add this to the progress component to use the indicatorClassName
declare module "react" {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      indicatorClassName?: string;
    }
}
