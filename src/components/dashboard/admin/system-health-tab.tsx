
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, TestTube, Mail, Database } from 'lucide-react';

const HealthMetricCard = ({ icon: Icon, title, stats, statusColor = 'bg-green-500' }) => (
  <Card className="flex-1">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">{title}</h3>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {Object.entries(stats).map(([key, value]) => (
                <div key={key} className='flex justify-between'>
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-medium text-right">{value}</span>
                </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function SystemHealthTab() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>System Health Dashboard</CardTitle>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live Monitoring
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HealthMetricCard
          icon={Wifi}
          title="MQTT Connection"
          stats={{ Uptime: '99.8%', 'Last Update': '1 second ago' }}
        />
        <HealthMetricCard
          icon={TestTube}
          title="Sensor Network"
          stats={{ Connected: '48/50', 'Last Update': '10 seconds ago' }}
          statusColor='bg-yellow-500'
        />
        <HealthMetricCard
          icon={Mail}
          title="Email Service"
          stats={{ 'Sent/Failed': '1247/3', '': '' }}
        />
        <HealthMetricCard
          icon={Database}
          title="Database"
          stats={{ 'Response Time': '12ms', '': '' }}
        />
      </CardContent>
    </Card>
  );
}
