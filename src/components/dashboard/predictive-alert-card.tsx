
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAqiPrediction } from '@/app/actions';
import { AlertCircle, AlertTriangle, BrainCircuit, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Zone, PredictedAlert } from '@/lib/types';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

type PredictiveAlertCardProps = {
  zone: Zone;
};

const riskStyles = {
    High: {
        card: 'border-red-200 bg-red-50 text-red-900',
        icon: AlertTriangle,
        iconColor: 'text-red-500',
    },
    Medium: {
        card: 'border-yellow-200 bg-yellow-50 text-yellow-900',
        icon: AlertTriangle,
        iconColor: 'text-yellow-500',
    },
    Low: {
        card: 'border-blue-200 bg-blue-50 text-blue-900',
        icon: AlertCircle,
        iconColor: 'text-blue-500',
    },
};

export default function PredictiveAlertCard({ zone }: PredictiveAlertCardProps) {
  const [predictions, setPredictions] = useState<PredictedAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      setIsLoading(true);
      try {
        const result = await getAqiPrediction(zone.name, zone.historicalData);
        setPredictions(result?.alerts ?? []);
      } catch (error) {
        console.error('Failed to fetch AQI prediction:', error);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrediction(); // Fetch immediately on zone change

    const intervalId = setInterval(fetchPrediction, 30000); // And then every 30 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount or zone change
  }, [zone.id, zone.name, zone.historicalData]);

  const renderSkeleton = () => (
    <div className="space-y-4 pt-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-lg border bg-muted p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex justify-between items-center mt-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderPredictions = () => {
    if (predictions.length === 0) {
      return (
        <div className="text-center text-sm text-muted-foreground py-8">
          <BrainCircuit className="mx-auto h-8 w-8 mb-2" />
          Generating predictions...
        </div>
      );
    }

    return (
        <div className="space-y-4 pt-4">
            {predictions.map((p, index) => {
                const styles = riskStyles[p.riskLevel];
                const Icon = styles.icon;
                return (
                    <div key={index} className={cn("flex flex-col gap-1 rounded-lg border p-4", styles.card)}>
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                                <Icon className={cn("h-5 w-5", styles.iconColor)} />
                                {p.title}
                            </h4>
                            <div className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="h-3 w-3"/>
                                {p.timeframe}
                            </div>
                        </div>
                        <p className="text-xs pl-7 text-muted-foreground">
                            {p.description}
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-xs font-medium mt-3 pl-7">
                            <p>Predicted AQI: <span className='font-bold text-foreground'>{p.predictedAqi}</span></p>
                            <p>Confidence: <span className='font-bold text-foreground'>{p.confidence}%</span></p>
                            <p>Risk Level: <span className='font-bold text-foreground'>{p.riskLevel}</span></p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
  }

  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            Predictive AQI Alerts
          </div>
          <Badge variant="outline">2-hour forecast</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? renderSkeleton() : renderPredictions()}
      </CardContent>
    </Card>
  );
}
