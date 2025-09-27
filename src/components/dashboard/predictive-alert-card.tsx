
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const MOCK_PREDICTIONS: Omit<PredictedAlert, 'predictedAqi' | 'confidence' | 'riskLevel'>[] = [
    { metric: 'PM2.5', title: 'PM2.5 Levels May Rise', description: 'Anticipating a slight increase in particulate matter due to morning traffic.', timeframe: 'Next 1-2 hours' },
    { metric: 'CO2', title: 'CO2 Spike Possible in Cafeteria', description: 'Increased occupancy during lunch hours may elevate CO2 levels.', timeframe: 'Next hour' },
    { metric: 'General', title: 'Conditions to Remain Stable', description: 'No significant changes in air quality are expected in the near future.', timeframe: 'Next 2 hours' },
    { metric: 'Noise', title: 'Noise Levels to Increase', description: 'Campus event scheduled, expect higher than normal noise levels.', timeframe: 'Next 3 hours' },
    { metric: 'VOCs', title: 'Potential VOC Fluctuation', description: 'Science lab experiments may cause minor, temporary spikes in VOCs.', timeframe: 'Next 2 hours' },
];

const generateRandomAlerts = (): PredictedAlert[] => {
    const alertCount = Math.random() > 0.3 ? 1 : 2; // 70% chance for 1 alert, 30% for 2
    const alerts: PredictedAlert[] = [];
    const usedIndexes = new Set();

    for (let i = 0; i < alertCount; i++) {
        let randomIndex = Math.floor(Math.random() * MOCK_PREDICTIONS.length);
        while (usedIndexes.has(randomIndex)) {
            randomIndex = Math.floor(Math.random() * MOCK_PREDICTIONS.length);
        }
        usedIndexes.add(randomIndex);

        const baseAlert = MOCK_PREDICTIONS[randomIndex];
        const isStableAlert = baseAlert.title.includes('Stable');
        
        let riskLevel: 'Low' | 'Medium' | 'High';
        if (isStableAlert) {
            riskLevel = 'Low';
        } else {
            const riskRoll = Math.random();
            riskLevel = riskRoll > 0.8 ? 'High' : (riskRoll > 0.4 ? 'Medium' : 'Low');
        }

        alerts.push({
            ...baseAlert,
            riskLevel,
            predictedAqi: 50 + Math.floor(Math.random() * 100),
            confidence: 70 + Math.floor(Math.random() * 30),
        });
    }
    return alerts;
};


export default function PredictiveAlertCard({ zone }: PredictiveAlertCardProps) {
  const [predictions, setPredictions] = useState<PredictedAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial generation
    setPredictions(generateRandomAlerts());
    setIsLoading(false);

    // Update every 5 seconds
    const intervalId = setInterval(() => {
      setPredictions(generateRandomAlerts());
    }, 5000);

    return () => clearInterval(intervalId);
  }, [zone.id]); // Rerun when zone changes

  const renderPredictions = () => {
    if (predictions.length === 0) {
        return (
            <div className="text-center text-sm text-muted-foreground py-8">
                <BrainCircuit className="mx-auto h-8 w-8 mb-2" />
                No active predictions.
            </div>
        )
    }

    return (
        <div className="space-y-4 pt-4">
            {predictions.map((p, index) => {
                const styles = riskStyles[p.riskLevel];
                const Icon = styles.icon;
                return (
                    <div key={`${zone.id}-${index}-${p.title}`} className={cn("flex flex-col gap-1 rounded-lg border p-4", styles.card)}>
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
        {isLoading ? <Skeleton className="h-24 w-full" /> : renderPredictions()}
      </CardContent>
    </Card>
  );
}
