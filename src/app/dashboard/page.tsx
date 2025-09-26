"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { useCampusData } from "@/lib/hooks";
import { ZoneStatus, type Zone, type Alert, type PredictedAlert, type CorrectiveAction } from "@/lib/types";
import StatsCard from "@/components/dashboard/stats-card";
import CampusMap from "@/components/dashboard/campus-map";
import AlertsPanel from "@/components/dashboard/alerts-panel";
import ZoneCard from "@/components/dashboard/zone-card";
import { AlertCircle, Bot, Shield, Siren } from "lucide-react";
import ZoneDetailSheet from '@/components/dashboard/zone-detail-sheet';
import { getAqiPrediction, getCorrectiveActions } from '../actions';
import ManualAlertDialog from '@/components/dashboard/manual-alert-dialog';

type DashboardProps = {
    addManualAlert?: (alert: Omit<Alert, 'id' | 'type'>) => void;
};

export default function Dashboard({ addManualAlert = () => {} }: DashboardProps) {
  const { zones, isLoading } = useCampusData();
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isManualAlertOpen, setManualAlertOpen] = useState(false);
  
  const [predictedAlerts, setPredictedAlerts] = useState<PredictedAlert[]>([]);
  const [isPredictionLoading, setPredictionLoading] = useState(false);

  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction | null>(null);
  const [isActionsLoading, setActionsLoading] = useState(false);

  useEffect(() => {
    if (zones.length > 0) {
      setPredictionLoading(true);
      const fetchPredictions = async () => {
        const predictions = await Promise.all(
          zones.map(zone => getAqiPrediction(zone.name, zone.historicalData))
        );
        setPredictedAlerts(predictions.filter(p => p && p.predictedAqi > 100) as PredictedAlert[]);
        setPredictionLoading(false);
      };
      fetchPredictions();
      const interval = setInterval(fetchPredictions, 30000); // Fetch predictions every 30 seconds
      return () => clearInterval(interval);
    }
  }, [zones]);
  
  const activeAlerts = useMemo<Alert[]>(() => {
    return zones
      .filter(zone => zone.status === ZoneStatus.Unsafe)
      .map(zone => ({
        id: `alert-${zone.id}`,
        zoneId: zone.id,
        zoneName: zone.name,
        message: 'Unsafe environmental levels detected',
        timestamp: new Date().toLocaleTimeString(),
        type: 'current',
      }));
  }, [zones]);
  
  const handleZoneClick = async (zone: Zone) => {
    setSelectedZone(zone);
    setSheetOpen(true);
    setCorrectiveActions(null);
    setActionsLoading(true);
    const actions = await getCorrectiveActions(zone.name, zone.currentData);
    if(actions) {
        setCorrectiveActions({ zoneName: zone.name, actions: actions.actions });
    }
    setActionsLoading(false);
  };

  const safeZones = zones.filter(z => z.status === ZoneStatus.Safe).length;
  const warningZones = zones.filter(z => z.status === ZoneStatus.Warning).length;

  return (
    <>
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
                Campus Overview
            </h1>
            <p className="text-muted-foreground">
                Real-time environmental monitoring dashboard.
            </p>
          </div>
          <Button onClick={() => setManualAlertOpen(true)} variant="destructive">
            <Siren className="mr-2 h-4 w-4" />
            Manual Alert
          </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatsCard title="Overall Status" value={activeAlerts.length > 0 ? "Alert" : "Safe"} icon={activeAlerts.length > 0 ? AlertCircle : Shield} description="Campus-wide safety assessment" isLoading={isLoading} />
        <StatsCard title="Safe Zones" value={safeZones.toString()} icon={Shield} description={`${warningZones} zones with warnings`} isLoading={isLoading}/>
        <StatsCard title="Active Alerts" value={activeAlerts.length.toString()} icon={AlertCircle} description="Immediate action may be required" isLoading={isLoading}/>
        <StatsCard title="AI Predictions" value={predictedAlerts.length.toString()} icon={Bot} description="Potential future alerts" isLoading={isLoading || isPredictionLoading} />
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {zones.map(zone => (
                    <ZoneCard key={zone.id} zone={zone} onClick={() => handleZoneClick(zone)} isLoading={isLoading} />
                ))}
            </div>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8 xl:col-span-1">
             <CampusMap zones={zones} onZoneClick={handleZoneClick} isLoading={isLoading}/>
             <AlertsPanel alerts={activeAlerts} predictedAlerts={predictedAlerts} isLoading={isLoading || isPredictionLoading} />
        </div>
      </div>
      
      <ZoneDetailSheet 
        zone={selectedZone} 
        open={isSheetOpen} 
        onOpenChange={setSheetOpen}
        correctiveActions={correctiveActions}
        isActionsLoading={isActionsLoading}
      />
      <ManualAlertDialog open={isManualAlertOpen} onOpenChange={setManualAlertOpen} onSendAlert={addManualAlert} />
    </>
  );
}
