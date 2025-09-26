
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

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6">
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

      <Tabs defaultValue="system-health">
        <TabsList>
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
            <div className="text-center py-16 text-muted-foreground">
                Manual override configuration coming soon.
            </div>
        </TabsContent>
         <TabsContent value="maintenance">
            <div className="text-center py-16 text-muted-foreground">
                Maintenance scheduling coming soon.
            </div>
        </TabsContent>
         <TabsContent value="alert-config">
            <div className="text-center py-16 text-muted-foreground">
                Alert configuration settings coming soon.
            </div>
        </TabsContent>
        <TabsContent value="monitoring">
            <div className="text-center py-16 text-muted-foreground">
                Live monitoring dashboard coming soon.
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
