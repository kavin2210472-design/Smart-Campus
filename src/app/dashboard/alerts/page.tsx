
'use client';

import { useState } from 'react';
import {
  LayoutGrid,
  MapPin,
  Settings,
  Mail,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Send,
  History,
  Activity,
} from 'lucide-react';
import AlertStatCard from '@/components/dashboard/alerts/alert-stat-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActiveAlertsTab from '@/components/dashboard/alerts/active-alerts-tab';
import AlertHistoryTab from '@/components/dashboard/alerts/alert-history-tab';
import { Button } from '@/components/ui/button';
import ManualAlertForm from '@/components/dashboard/alerts/manual-alert-form';
import { Alert } from '@/lib/types';
import SystemHealthTab from '@/components/dashboard/admin/system-health-tab';


export default function AlertManagementPage() {
  const [manualAlerts, setManualAlerts] = useState<Alert[]>([]);

  const handleNewManualAlert = (newAlert: Alert) => {
    setManualAlerts(prev => [newAlert, ...prev]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Alert Management</h1>
          <p className="text-muted-foreground">
            Comprehensive control over automated and manual emergency notifications for campus safety
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            Dashboard
          </Button>
           <Button variant="outline" size="sm" className="gap-2">
            <MapPin className="h-4 w-4" />
            Zone Details
          </Button>
           <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            System Admin
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AlertStatCard
          title="Active Alerts"
          value="5"
          trend="+2 from yesterday"
          trendDirection="up"
          icon={AlertTriangle}
          iconColor="text-red-500"
        />
        <AlertStatCard
          title="Emails Sent Today"
          value="24"
          trend="-15% from yesterday"
          trendDirection="down"
          icon={Mail}
        />
        <AlertStatCard
          title="Response Time"
          value="2.3s"
          trend="-0.5s improvement"
          trendDirection="down"
          icon={Clock}
        />
        <AlertStatCard
          title="System Health"
          value="98.5%"
          trend="All systems operational"
          trendDirection="up"
          icon={ShieldCheck}
          iconColor="text-green-500"
        />
      </div>

      <Tabs defaultValue="active-alerts">
        <TabsList>
          <TabsTrigger value="active-alerts" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Active Alerts
          </TabsTrigger>
          <TabsTrigger value="manual-alerts" className="gap-2">
            <Send className="h-4 w-4" />
            Manual Alerts
          </TabsTrigger>
          <TabsTrigger value="alert-history" className="gap-2">
            <History className="h-4 w-4" />
            Alert History
          </TabsTrigger>
           <TabsTrigger value="system-health" className="gap-2">
            <Activity className="h-4 w-4" />
            System Health
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active-alerts">
          <ActiveAlertsTab />
        </TabsContent>
        <TabsContent value="manual-alerts">
            <ManualAlertForm onAlertSent={handleNewManualAlert} />
        </TabsContent>
        <TabsContent value="alert-history">
          <AlertHistoryTab manualAlerts={manualAlerts} />
        </TabsContent>
        <TabsContent value="system-health">
            <p className="text-sm text-muted-foreground mt-2 mb-4">Monitor system status and performance</p>
            <SystemHealthTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
