
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getCorrectiveActions } from '@/app/actions';
import { cn } from '@/lib/utils';
import type { Zone, CorrectiveAction as ActionType } from '@/lib/types';
import { Wind, Thermometer, Fan, Lightbulb, AirVent, Zap, Clock, TrendingUp } from 'lucide-react';

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
  high: 'text-red-600',
  medium: 'text-yellow-600',
  low: 'text-blue-600',
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
  }, [zone.id, zone.name, zone.currentData]);

  const renderSkeleton = () => (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="p-4">
            <div className="flex items-start gap-4">
                <Skeleton className="h-8 w-8 rounded-lg" />
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
        </Card>
      ))}
    </div>
  );

  const renderActions = () => {
    if (!actions || actions.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Analyzing conditions...
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {actions.map((action, index) => {
            const Icon = iconMap[action.icon] || iconMap.default;
            return (
                <Card key={index} className="p-4">
                    <div className="flex items-start gap-4">
                        <Icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-base">{action.title}</h3>
                                <p className={cn('text-sm font-semibold capitalize', priorityStyles[action.priority])}>
                                    {action.priority} priority
                                </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {action.description}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground pt-4 mt-2 border-t">
                        <div className='flex gap-4'>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                <span className='font-medium text-foreground'>{action.eta}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <TrendingUp className="h-4 w-4" />
                                <span className='font-medium text-foreground'>{action.impact}</span>
                            </div>
                        </div>
                        <Button size="sm">
                            Execute
                        </Button>
                    </div>
                </Card>
            )
        })}
      </div>
    );
  };

  return (
    <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Recommended Actions
        </h2>
        {isLoading ? renderSkeleton() : renderActions()}
    </div>
  )
}
