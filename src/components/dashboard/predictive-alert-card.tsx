
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAqiPrediction } from '@/app/actions';
import { AlertCircle, Clock, BarChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Zone } from '@/lib/types';
import { Badge } from '../ui/badge';

type PredictiveAlertCardProps = {
  zone: Zone;
};

type Prediction = {
  predictedAqi: number;
  alertMessage: string;
};

const getRiskLevel = (aqi: number) => {
    if (aqi > 150) return { label: 'High', className: 'bg-red-100 text-red-800' };
    if (aqi > 100) return { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' };
    if (aqi > 50) return { label: 'Low', className: 'bg-green-100 text-green-800' };
    return { label: 'Very Low', className: 'bg-blue-100 text-blue-800' };
};

export default function PredictiveAlertCard({ zone }: PredictiveAlertCardProps) {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      setIsLoading(true);
      try {
        const result = await getAqiPrediction(zone.name, zone.historicalData);
        setPrediction(result);
      } catch (error) {
        console.error('Failed to fetch AQI prediction:', error);
        setPrediction(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrediction();
  }, [zone]);

  const renderSkeleton = () => (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart className="h-5 w-5 text-primary" />
          Predictive AQI Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
         <div className="space-y-4 pt-4">
            <div className="flex flex-col gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex justify-between items-center mt-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
             <div className="flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                 <div className="flex justify-between items-center mt-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
         </div>
      </CardContent>
    </Card>
  );

  const renderPrediction = () => {
    if (!prediction || prediction.predictedAqi <= 100) {
      return (
        <div className="text-center text-sm text-muted-foreground py-8">
          <AlertCircle className="mx-auto h-8 w-8 mb-2" />
          No significant AQI increase predicted in the next 2 hours.
        </div>
      );
    }

    const risk = getRiskLevel(prediction.predictedAqi);

    return (
        <div className="space-y-4 pt-4">
            <div className="flex flex-col gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-900">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">PM2.5 Level Increase Expected</h4>
                    <div className="text-xs font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3"/>
                        Next 2 hours
                    </div>
                </div>
                <p className="text-xs">
                    {prediction.alertMessage}
                </p>
                <div className="flex justify-between items-center text-xs font-medium mt-2">
                     <p>Predicted AQI: <span className='font-bold'>{prediction.predictedAqi}</span></p>
                     <p>Risk Level: <Badge variant="outline" className={cn("text-xs", risk.className)}>{risk.label}</Badge></p>
                </div>
            </div>
             <div className="flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-900">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">CO₂ Concentration Alert</h4>
                    <div className="text-xs font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3"/>
                        Next 1 hour
                    </div>
                </div>
                <p className="text-xs">
                    Increasing occupancy detected. CO₂ levels may reach 1200 ppm during peak hours, requiring immediate ventilation.
                </p>
            </div>
        </div>
    )
  }

  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            Predictive AQI Alerts
          </div>
          <Badge variant="outline">2-hour forecast</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? renderSkeleton() : renderPrediction()}
      </CardContent>
    </Card>
  );
}
