
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type OverviewStatCardProps = {
  title: string;
  value: number;
  total?: number;
  icon: LucideIcon;
  iconColor: string;
  description: string;
};

export default function OverviewStatCard({
  title,
  value,
  total,
  icon: Icon,
  iconColor,
  description,
}: OverviewStatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn('h-5 w-5 text-muted-foreground', iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {total !== undefined && (
            <span className="text-base font-normal text-muted-foreground">/{total}</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
