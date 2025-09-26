"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Zone, CorrectiveAction, SensorValues } from "@/lib/types"
import ZoneChart from "./zone-charts"
import { AlertCircle, Thermometer, Wind, Waves, Co2, Volume2, Factory, Bot } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { Badge } from "../ui/badge"
import { Skeleton } from "../ui/skeleton"

const sensorConfig = {
  pm25: { name: "PM2.5", icon: Wind, color: "hsl(var(--chart-1))" },
  co2: { name: "CO₂", icon: Factory, color: "hsl(var(--chart-2))" },
  voc: { name: "VOC", icon: Co2, color: "hsl(var(--chart-3))" },
  temperature: { name: "Temperature", icon: Thermometer, color: "hsl(var(--chart-4))" },
  humidity: { name: "Humidity", icon: Waves, color: "hsl(var(--chart-5))" },
  noise: { name: "Noise", icon: Volume2, color: "hsl(var(--primary))" },
};

export default function ZoneDetailSheet({
  zone,
  open,
  onOpenChange,
  correctiveActions,
  isActionsLoading,
}: {
  zone: Zone | null
  open: boolean
  onOpenChange: (open: boolean) => void
  correctiveActions: CorrectiveAction | null
  isActionsLoading: boolean
}) {
  if (!zone) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0">
        <ScrollArea className="h-full">
            <div className="p-6">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-headline">{zone.name} Details</SheetTitle>
                    <SheetDescription>
                    Historical trends and AI-powered recommendations for this zone.
                    </SheetDescription>
                </SheetHeader>

                {(correctiveActions || isActionsLoading) && (
                  <div className="mt-6 p-4 rounded-lg bg-accent/20 border border-accent/80">
                      <h3 className="font-semibold text-accent-foreground flex items-center gap-2 mb-2"><Bot className="h-5 w-5"/> AI Recommendations</h3>
                      {isActionsLoading ? (
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-5/6" />
                           <Skeleton className="h-4 w-3/4" />
                        </div>
                      ): (
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {correctiveActions?.actions.map((action, i) => <li key={i}>{action}</li>)}
                        </ul>
                      )}
                  </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-6">
                {Object.entries(sensorConfig).map(([key, config]) => (
                <div key={key} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                        <config.icon className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">{config.name}</h4>
                        <Badge variant="outline" className="ml-auto">{zone.currentData[key as keyof SensorValues].toFixed(1)}</Badge>
                    </div>
                    <ZoneChart
                    data={zone.historicalData}
                    dataKey={key as keyof SensorValues}
                    name={config.name}
                    color={config.color}
                    />
                </div>
                ))}
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
