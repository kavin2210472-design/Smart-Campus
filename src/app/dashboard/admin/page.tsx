
'use client';

import {
  Users,
  AlertTriangle,
  Clock,
  Database,
  Wifi,
  HelpCircle,
  Activity,
  Shield,
  Wrench,
  Bell,
  Monitor,
  Settings,
} from 'lucide-react';
import AdminStatCard from '@/components/dashboard/admin/admin-stat-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SystemHealthTab from '@/components/dashboard/admin/system-health-tab';
import UserManagementTab from '@/components/dashboard/admin/user-management-tab';
import ManualOverrideTab from '@/components/dashboard/admin/manual-override-tab';
import MaintenanceTab from '@/components/dashboard/admin/maintenance-tab';
import AlertConfigTab from '@/components/dashboard/admin/alert-config-tab';
import LiveMonitoringTab from '@/components/dashboard/admin/live-monitoring-tab';

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 text-primary p-3 rounded-lg">
            <Settings className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">System Administration</h1>
          <p className="text-muted-foreground">
            Manage monitoring infrastructure, user access, and system controls
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <AdminStatCard
          title="Sensors"
          value="47/50"
          description="94.0% Active"
          icon={HelpCircle}
        />
        <AdminStatCard
          title="Total Users"
          value="16,871"
          description="3 Admins"
          icon={Users}
        />
        <AdminStatCard
          title="Alerts Today"
          value="12"
          description="All Resolved"
          icon={AlertTriangle}
          className="text-green-600"
        />
        <AdminStatCard
          title="Uptime"
          value="99.8%"
          description="Excellent"
          icon={Clock}
          className="text-green-600"
        />
        <AdminStatCard
          title="DB Status"
          value="Online"
          description="12ms latency"
          icon={Database}
          className="text-green-600"
        />
        <AdminStatCard
          title="MQTT"
          value="Connected"
          description="156 clients"
          icon={Wifi}
          className="text-green-600"
        />
      </div>

      <Tabs defaultValue="system-health" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 h-auto">
          <TabsTrigger value="system-health" className="gap-2">
            <Activity className="h-4 w-4" />
            System Health
          </TabsTrigger>
          <TabsTrigger value="user-management" className="gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
           <TabsTrigger value="manual-override" className="gap-2">
            <Shield className="h-4 w-4" />
            Manual Override
          </TabsTrigger>
           <TabsTrigger value="maintenance" className="gap-2">
            <Wrench className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
           <TabsTrigger value="alert-config" className="gap-2">
            <Bell className="h-4 w-4" />
            Alert Config
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="gap-2">
            <Monitor className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system-health">
          <p className="text-sm text-muted-foreground mt-2 mb-4">Monitor system status and performance</p>
          <SystemHealthTab />
        </TabsContent>
        <TabsContent value="user-management">
          <p className="text-sm text-muted-foreground mt-2 mb-4">Manage users and their roles</p>
          <UserManagementTab />
        </TabsContent>
        <TabsContent value="manual-override">
          <p className="text-sm text-muted-foreground mt-2 mb-4">Directly control campus systems and trigger immediate actions.</p>
          <ManualOverrideTab />
        </TabsContent>
         <TabsContent value="maintenance">
            <p className="text-sm text-muted-foreground mt-2 mb-4">Schedule and track maintenance tasks for sensors and equipment.</p>
            <MaintenanceTab />
        </TabsContent>
         <TabsContent value="alert-config">
            <p className="text-sm text-muted-foreground mt-2 mb-4">Adjust sensitivity thresholds for environmental alerts.</p>
            <AlertConfigTab />
        </TabsContent>
        <TabsContent value="monitoring">
            <p className="text-sm text-muted-foreground mt-2 mb-4">View a live feed of all sensor data from across the campus.</p>
            <LiveMonitoringTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
