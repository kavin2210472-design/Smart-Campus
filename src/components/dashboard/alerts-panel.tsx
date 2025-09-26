import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock } from "lucide-react";
import { Alert, PredictedAlert } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

export default function AlertsPanel({
  alerts,
  predictedAlerts,
  isLoading,
}: {
  alerts: Alert[];
  predictedAlerts: PredictedAlert[];
  isLoading?: boolean;
}) {

  const renderSkeleton = () => (
    <div className="flex items-start gap-4 p-4">
      <Skeleton className="h-6 w-6 rounded-full mt-1" />
      <div className="grid gap-1 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/4 mt-1" />
      </div>
    </div>
  );
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Active Alerts</CardTitle>
        <CardDescription>Real-time and predictive warnings.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] md:h-[400px]">
          <div className="grid gap-4">
            {isLoading && Array.from({ length: 3 }).map((_, i) => renderSkeleton())}
            {!isLoading && predictedAlerts.map((alert, index) => (
              <div key={`pred-${index}`} className="flex items-start gap-4 p-4 rounded-lg bg-accent/30 border border-accent">
                <div className="bg-accent rounded-full p-1.5 text-accent-foreground">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="grid gap-1">
                  <p className="font-semibold">{alert.zoneName}: Predictive Alert</p>
                  <p className="text-sm text-muted-foreground">{alert.alertMessage}</p>
                  <p className="text-xs text-muted-foreground">Predicted AQI: {alert.predictedAqi.toFixed(0)}</p>
                </div>
              </div>
            ))}
            {!isLoading && alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg",
                  "bg-destructive/10 border border-destructive/50"
                )}
              >
                <div className="bg-destructive rounded-full p-1.5 text-destructive-foreground">
                    <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="grid gap-1">
                  <p className="font-semibold">{alert.zoneName}: {alert.message}</p>
                  <p className="text-sm text-muted-foreground">
                    High levels detected. Immediate action may be required.
                  </p>
                  <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                </div>
              </div>
            ))}
             {!isLoading && alerts.length === 0 && predictedAlerts.length === 0 && (
                <div className="text-center text-muted-foreground py-16">
                    <p>No active alerts.</p>
                    <p className="text-xs">All zones are currently within safe limits.</p>
                </div>
             )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
