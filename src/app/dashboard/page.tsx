
"use client";

import { useState, useMemo } from 'react';
import { useCampusData } from '@/lib/hooks';
import ZoneSelection from '@/components/dashboard/zone-selection';
import MetricCard from '@/components/dashboard/metric-card';
import PredictiveAlertCard from '@/components/dashboard/predictive-alert-card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Wind,
  Cloud,
  Flame,
  Thermometer,
  Droplets,
  Ear,
  BrainCircuit,
} from 'lucide-react';

export default function ZoneAnalysisPage() {
  const { zones, isLoading: isCampusDataLoading } = useCampusData();
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const selectedZone = useMemo(() => {
    if (isCampusDataLoading || zones.length === 0) return null;
    const idToSelect = selectedZoneId || zones[0]?.id;
    return zones.find(z => z.id === idToSelect) || zones[0];
  }, [zones, selectedZoneId, isCampusDataLoading]);


  const metrics = [
    { key: 'pm25', name: 'PM2.5', icon: Wind },
    { key: 'co2', name: 'CO₂', icon: Cloud },
    { key: 'voc', name: 'VOCs', icon: Flame },
    { key: 'temperature', name: 'Temperature', icon: Thermometer },
    { key: 'humidity', name: 'Humidity', icon: Droplets },
    { key: 'noise', name: 'Noise Level', icon: Ear },
  ];
  
  const renderSkeletons = () => (
    <>
       <div className="mb-8">
          <Skeleton className="h-10 w-full" />
       </div>
       <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-4 rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-2 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="md:col-span-4">
          <div className="flex flex-col gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4 rounded-lg border bg-card p-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  if (isCampusDataLoading || !selectedZone) {
    return renderSkeletons();
  }

  return (
    <>
      <ZoneSelection
        zones={zones}
        selectedZone={selectedZone}
        onZoneChange={setSelectedZoneId}
      />
      
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8">
            <div className="mb-4 flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Environmental Metrics</h2>
                <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live Data
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {metrics.map(metric => (
                <MetricCard 
                  key={metric.key}
                  metric={metric.key as keyof import('@/lib/types').SensorValues}
                  name={metric.name}
                  icon={metric.icon}
                  data={selectedZone.currentData}
                  historicalData={selectedZone.historicalData}
                />
              ))}
            </div>
        </div>
        <div className="md:col-span-4">
            <PredictiveAlertCard zone={selectedZone} />
        </div>
      </div>
    </>
  );
}
