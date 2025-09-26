
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getCorrectiveActions } from '@/app/actions';
import { cn } from '@/lib/utils';
import type { Zone, CorrectiveAction as ActionType } from '@/lib/types';
import { Wind, Thermometer, Fan, Lightbulb, AirVent, Zap } from 'lucide-react';

const iconMap = {
    wind: Wind,
    thermometer: Thermometer,
    fan: Fan,
    lightbulb: Lightbulb,
    'air-vent': AirVent,
    default: Zap,
};

type CorrectiveActionsProps = {
  zone: Zone;
};

const priorityStyles = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function CorrectiveActions({ zone }: CorrectiveActionsProps) {
  const [actions, setActions] = useState<ActionType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActions = async () => {
      setIsLoading(true);
      const result = await getCorrectiveActions(zone.name, zone.currentData);
      setActions(result);
      setIsLoading(false);
    };

    fetchActions();
  }, [zone]);

  const renderSkeleton = () => (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <div className="flex justify-between items-center pt-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-9 w-24" />
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderActions = () => {
    if (!actions || actions.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No corrective actions suggested at this time.
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {actions.map((action, index) => {
            const Icon = iconMap[action.icon] || iconMap.default;
            return (
                <Card key={index}>
                    <CardContent className="p-4">
                         <div className="flex items-start gap-4">
                            <div className='bg-primary/10 text-primary p-2 rounded-full'>
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold">{action.title}</h3>
                                    <Badge variant="outline" className={cn('capitalize', priorityStyles[action.priority])}>
                                        {action.priority} priority
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {action.description}
                                </p>
                                <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                                    <div className='space-y-1'>
                                        <p>ETA: <span className='font-semibold text-foreground'>{action.eta}</span></p>
                                        <p>Impact: <span className='font-semibold text-foreground'>{action.impact}</span></p>
                                    </div>
                                    <Button size="sm">
                                        Execute
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )
        })}
      </div>
    );
  };

  return (
    <div>
        <h2 className="text-lg font-semibold mb-4">Suggested Actions</h2>
        {isLoading ? renderSkeleton() : renderActions()}
    </div>
  )
}
