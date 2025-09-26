
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import type { Zone } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

type ActiveAlertsListProps = {
  alerts: Zone[];
};

export default function ActiveAlertsList({ alerts }: ActiveAlertsListProps) {
  const router = useRouter();

  const handleNavigate = (zoneId: string) => {
    router.push(`/dashboard/analysis?zone=${zoneId}`);
  };
    
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Active Alerts
        </CardTitle>
        <CardDescription>Zones requiring immediate attention.</CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center text-center">
            <p className="text-lg font-medium">All Clear</p>
            <p className="text-sm text-muted-foreground">No active alerts at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alertZone) => (
              <div
                key={alertZone.id}
                className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3"
              >
                <div>
                  <h4 className="font-semibold">{alertZone.name}</h4>
                  <p className="text-sm text-red-700">Unsafe conditions detected</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(alertZone.lastUpdated), { addSuffix: true })}
                  </p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => handleNavigate(alertZone.id)}>
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
