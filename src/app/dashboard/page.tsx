
"use client";

import { AlertCircle, Users, RefreshCw } from "lucide-react";
import StatsCard from "@/components/dashboard/stats-card";
import UserManagementPage from "./user-management/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AlertsLogPage from "./alerts/page";
import { useUsers, addUser, updateUser, deleteUser } from "@/lib/hooks";
import { useCampusData } from "@/lib/hooks";
import { ZoneStatus, Alert as ManualAlert, User } from "@/lib/types";
import EmergencyAlertForm from "@/components/dashboard/emergency-alert-form";
import { useState } from "react";

export default function Dashboard() {
  const { users } = useUsers();
  const { zones } = useCampusData();
  const [manualAlerts, setManualAlerts] = useState<ManualAlert[]>([]);

  const activeAlertsCount = zones.filter(zone => zone.status === ZoneStatus.Unsafe).length;
  
  const handleAlertSent = (alert: ManualAlert) => {
    setManualAlerts(prev => [...prev, alert]);
  };

  const totalUsers = users.length;
  const studentCount = users.filter(u => u.role.toLowerCase() === 'student').length;
  const staffCount = users.filter(u => u.role.toLowerCase() === 'staff').length;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <StatsCard 
          title="Total Users" 
          value={totalUsers.toString()} 
          icon={Users} 
          description={`${studentCount} students, ${staffCount} staff`} 
        />
        <StatsCard 
          title="Active Alerts" 
          value={activeAlertsCount.toString()} 
          icon={AlertCircle} 
          description="Emergency notifications active" 
        />
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
            <UserManagementPage 
                users={users} 
                addUser={addUser} 
                updateUser={updateUser} 
                deleteUser={deleteUser} 
            />
        </TabsContent>
        <TabsContent value="emergency-alerts">
            <EmergencyAlertForm onAlertSent={handleAlertSent} zones={zones} />
        </TabsContent>
        <TabsContent value="alert-history">
            <AlertsLogPage manualAlerts={manualAlerts} />
        </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
