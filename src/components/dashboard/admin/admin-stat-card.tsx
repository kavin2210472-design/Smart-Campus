
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type AdminStatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  className?: string;
};

export default function AdminStatCard({
  title,
  value,
  description,
  icon: Icon,
  className,
}: AdminStatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={cn('text-xs', className ?? 'text-muted-foreground')}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
