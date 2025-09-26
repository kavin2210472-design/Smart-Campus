
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCampusData } from '@/lib/hooks';
import { Flame, AirVent, Siren, Power } from 'lucide-react';

export default function ManualOverrideTab() {
  const { zones, isLoading } = useCampusData();
  const [selectedZone, setSelectedZone] = useState('zone-library');
  const [hvacState, setHvacState] = useState(false);
  const [alarmState, setAlarmState] = useState(false);
  const [customCommand, setCustomCommand] = useState('');
  const { toast } = useToast();

  const handleExecute = (action: string) => {
    toast({
      title: 'Action Executed',
      description: `${action} command sent to ${zones.find(z => z.id === selectedZone)?.name}.`,
    });
    // In a real app, this would trigger a server action
    console.log(`Executing: ${action} for zone: ${selectedZone}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Flame className="h-5 w-5 text-primary"/> HVAC Control</CardTitle>
          <CardDescription>Manually control ventilation systems in a specific zone.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Target Zone</Label>
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {zones.map(zone => (
                  <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label htmlFor="hvac-switch" className="font-medium">Emergency Ventilation</Label>
            <Switch id="hvac-switch" checked={hvacState} onCheckedChange={setHvacState} />
          </div>
          <Button className="w-full gap-2" onClick={() => handleExecute('HVAC Override')} disabled={isLoading}>
            <AirVent className="h-4 w-4" /> Execute HVAC Command
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Siren className="h-5 w-5 text-primary"/> Campus Alarms</CardTitle>
          <CardDescription>Activate or deactivate campus-wide alarm systems.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label htmlFor="alarm-switch" className="font-medium text-red-600">Activate All Alarms</Label>
            <Switch id="alarm-switch" checked={alarmState} onCheckedChange={setAlarmState} />
          </div>
           <p className="text-xs text-muted-foreground text-center">
            Warning: This will activate audible and visual alarms across the entire campus. Use with extreme caution.
          </p>
          <Button variant="destructive" className="w-full gap-2" onClick={() => handleExecute('Alarm System Override')}>
            <Siren className="h-4 w-4" /> Trigger Alarms
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Power className="h-5 w-5 text-primary"/> Custom Command</CardTitle>
          <CardDescription>Send a raw command to a system for advanced control.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="e.g., SET-TEMP zone-cafeteria 21.5" 
            value={customCommand}
            onChange={(e) => setCustomCommand(e.target.value)}
            className="font-mono text-xs"
          />
          <Button variant="secondary" className="w-full" onClick={() => handleExecute(`Custom Command: ${customCommand}`)}>
            Send Command
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
