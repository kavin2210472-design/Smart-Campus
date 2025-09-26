
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

type AlertStatCardProps = {
  title: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down';
  icon: LucideIcon;
  iconColor?: string;
};

export default function AlertStatCard({
  title,
  value,
  trend,
  trendDirection,
  icon: Icon,
  iconColor,
}: AlertStatCardProps) {
  const TrendIcon = trendDirection === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trendDirection === 'up' ? 'text-red-500' : 'text-green-500';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={cn('h-5 w-5 text-muted-foreground', iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className={cn('text-xs flex items-center gap-1', trendColor)}>
          <TrendIcon className="h-4 w-4" />
          {trend}
        </p>
      </CardContent>
    </Card>
  );
}
