
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
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ZoneAnalysisPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/analysis');
  }, [router]);

  return (
     <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Redirecting to analysis page...</p>
     </div>
  );
}

