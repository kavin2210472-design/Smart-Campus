
'use client';

import { useState, useMemo } from 'react';
import { useCampusData } from '@/lib/hooks';
import ZoneSelection from '@/components/dashboard/zone-selection';
import CorrectiveActions from '@/components/dashboard/corrective-actions';
import TrendAnalysis from '@/components/dashboard/trend-analysis';
import { Skeleton } from '@/components/ui/skeleton';
import MetricCard from '@/components/dashboard/metric-card';
import { SensorValues } from '@/lib/types';
import {
  Wind,
  Cloud,
  Thermometer,
  Droplets,
  Ear,
  Flame,
} from 'lucide-react';
import PredictiveAlertCard from '@/components/dashboard/predictive-alert-card';
import WhoGuidelinesCard from '@/components/dashboard/who-guidelines-card';


const metricConfig: {
  [key in keyof SensorValues]: {
    name: string;
    icon: React.ElementType;
  };
} = {
  pm25: { name: 'PM2.5', icon: Wind },
  co2: { name: 'CO₂', icon: Cloud },
  voc: { name: 'VOCs', icon: Flame },
  temperature: { name: 'Temperature', icon: Thermometer },
  humidity: { name: 'Humidity', icon: Droplets },
  noise: { name: 'Noise Level', icon: Ear },
};


export default function AnalysisPage() {
  const { zones, isLoading: isCampusDataLoading } = useCampusData();
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const selectedZone = useMemo(() => {
    if (isCampusDataLoading || zones.length === 0) return null;
    const idToSelect = selectedZoneId || zones[0]?.id;
    return zones.find((z) => z.id === idToSelect) || zones[0];
  }, [zones, selectedZoneId, isCampusDataLoading]);

  if (isCampusDataLoading || !selectedZone) {
    return (
      <div className="flex flex-col gap-8">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
         <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const metricKeys = Object.keys(metricConfig) as (keyof SensorValues)[];

  return (
    <div className="flex flex-col gap-6">
      <ZoneSelection
        zones={zones}
        selectedZone={selectedZone}
        onZoneChange={setSelectedZoneId}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricKeys.map((metric) => (
          <MetricCard
            key={metric}
            metric={metric}
            name={metricConfig[metric].name}
            icon={metricConfig[metric].icon}
            data={selectedZone.currentData}
            historicalData={selectedZone.historicalData}
          />
        ))}
      </div>
        
      <WhoGuidelinesCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
            <TrendAnalysis zone={selectedZone} />
        </div>
        <div className="flex flex-col gap-6">
            <PredictiveAlertCard zone={selectedZone} />
            <CorrectiveActions zone={selectedZone} />
        </div>
      </div>
    </div>
  );
}
