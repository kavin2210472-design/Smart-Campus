
'use client';

import { useMemo } from 'react';
import { useCampusData } from '@/lib/hooks';
import { Zone, ZoneStatus } from '@/lib/types';
import OverviewStatCard from '@/components/dashboard/overview-stat-card';
import ActiveAlertsList from '@/components/dashboard/active-alerts-list';
import CampusMap from '@/components/dashboard/campus-map';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function OverviewPage() {
  const { zones, isLoading } = useCampusData();

  const stats = useMemo(() => {
    if (isLoading) return null;
    const totalZones = zones.length;
    const safeZones = zones.filter((z) => z.status === ZoneStatus.Safe).length;
    const warningZones = zones.filter((z) => z.status === ZoneStatus.Warning).length;
    const unsafeZones = zones.filter((z) => z.status === ZoneStatus.Unsafe).length;
    const activeAlerts = zones.filter((z) => z.status === ZoneStatus.Unsafe);

    return { totalZones, safeZones, warningZones, unsafeZones, activeAlerts };
  }, [zones, isLoading]);

  if (isLoading || !stats) {
    return (
      <div className="flex flex-col gap-4 lg:gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-[450px]" />
          </div>
          <div>
            <Skeleton className="h-[450px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewStatCard
          title="Safe Zones"
          value={stats.safeZones}
          total={stats.totalZones}
          icon={ShieldCheck}
          iconColor="text-green-500"
          description={`${((stats.safeZones / stats.totalZones) * 100).toFixed(0)}% of zones are safe`}
        />
        <OverviewStatCard
          title="Warning Zones"
          value={stats.warningZones}
          total={stats.totalZones}
          icon={ShieldAlert}
          iconColor="text-yellow-500"
          description="Conditions nearing thresholds"
        />
        <OverviewStatCard
          title="Unsafe Zones"
          value={stats.unsafeZones}
          total={stats.totalZones}
          icon={AlertTriangle}
          iconColor="text-red-500"
          description="Immediate attention required"
        />
        <OverviewStatCard
          title="Active Alerts"
          value={stats.activeAlerts.length}
          icon={AlertTriangle}
          iconColor="text-red-500"
          description="Critical environmental events"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CampusMap zones={zones} />
        </div>
        <div>
          <ActiveAlertsList alerts={stats.activeAlerts} />
        </div>
      </div>
    </>
  );
}
