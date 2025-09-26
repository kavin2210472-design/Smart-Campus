
"use client";

import { AlertCircle, Users, RefreshCw } from "lucide-react";
import StatsCard from "@/components/dashboard/stats-card";
import UserManagementPage from "./user-management/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AlertsLogPage from "./alerts/page";

export default function Dashboard() {
  
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <StatsCard title="Total Users" value="0" icon={Users} description="0 students, 0 staff" />
        <StatsCard title="Recent Alerts" value="0" icon={AlertCircle} description="Emergency notifications sent" />
        <StatsCard title="System Status" value="Active" icon={RefreshCw} description="All systems operational" />
      </div>
      <div className="grid gap-4 md:gap-8">
      <Tabs defaultValue="user-management">
        <TabsList>
            <TabsTrigger value="user-management">User Management</TabsTrigger>
            <TabsTrigger value="emergency-alerts">Emergency Alerts</TabsTrigger>
            <TabsTrigger value="alert-history">Alert History</TabsTrigger>
        </TabsList>
        <TabsContent value="user-management">
            <UserManagementPage />
        </TabsContent>
        <TabsContent value="emergency-alerts">
            {/* Content for Emergency Alerts will go here */}
            <div className="text-center p-8 bg-card rounded-lg">
                <p className="text-muted-foreground">Emergency alert functionality coming soon.</p>
            </div>
        </TabsContent>
        <TabsContent value="alert-history">
            <AlertsLogPage />
        </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
