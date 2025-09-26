
'use client';

import { useState, useMemo } from 'react';
import { useCampusData } from '@/lib/hooks';
import ZoneSelection from '@/components/dashboard/zone-selection';
import CorrectiveActions from '@/components/dashboard/corrective-actions';
import TrendAnalysis from '@/components/dashboard/trend-analysis';
import { Skeleton } from '@/components/ui/skeleton';

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
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8">
            <Skeleton className="h-[500px] w-full" />
          </div>
          <div className="col-span-4 flex flex-col gap-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ZoneSelection
        zones={zones}
        selectedZone={selectedZone}
        onZoneChange={setSelectedZoneId}
      />

      <div className="grid grid-cols-12 items-start gap-8">
        <div className="col-span-12 lg:col-span-8">
          <TrendAnalysis zone={selectedZone} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <CorrectiveActions zone={selectedZone} />
        </div>
      </div>
    </>
  );
}
