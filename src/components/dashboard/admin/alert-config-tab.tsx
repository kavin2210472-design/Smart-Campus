
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useThresholds } from '@/lib/hooks';
import { SensorValues } from '@/lib/types';
import { Save } from 'lucide-react';

type MetricKey = keyof SensorValues;

const metricDetails: Record<MetricKey, { name: string; unit: string; min: number; max: number; step: number; }> = {
  pm25: { name: 'PM2.5', unit: 'µg/m³', min: 0, max: 100, step: 1 },
  co2: { name: 'CO₂', unit: 'ppm', min: 400, max: 5000, step: 50 },
  voc: { name: 'VOCs', unit: 'ppb', min: 0, max: 2000, step: 25 },
  temperature: { name: 'Temperature', unit: '°C', min: 10, max: 40, step: 0.5 },
  humidity: { name: 'Humidity', unit: '%', min: 0, max: 100, step: 1 },
  noise: { name: 'Noise', unit: 'dB', min: 30, max: 120, step: 1 },
};


export default function AlertConfigTab() {
  const { thresholds, setThresholds, resetThresholds, isLoading } = useThresholds();
  const [localThresholds, setLocalThresholds] = useState(thresholds);
  const { toast } = useToast();

  useState(() => {
    if (thresholds) {
      setLocalThresholds(thresholds);
    }
  });
  
  if (isLoading || !localThresholds) {
      return <Card><CardContent><p className="py-8 text-center">Loading configurations...</p></CardContent></Card>
  }

  const handleSliderChange = (metric: MetricKey, level: 'warning' | 'unsafe', value: number) => {
    setLocalThresholds(prev => ({
      ...prev,
      [metric]: { ...prev[metric], [level]: value },
    }));
  };

  const handleSave = () => {
    setThresholds(localThresholds);
    toast({
      title: 'Configuration Saved',
      description: 'Alert thresholds have been updated successfully.',
    });
  };
  
  const handleReset = () => {
    const defaultThresholds = resetThresholds();
    setLocalThresholds(defaultThresholds);
     toast({
      title: 'Configuration Reset',
      description: 'Alert thresholds have been reset to their default values.',
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Alert Threshold Configuration</CardTitle>
                <CardDescription>Fine-tune the sensitivity for triggering environmental alerts.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={handleReset}>Reset to Defaults</Button>
                <Button onClick={handleSave} className="gap-2"><Save className="h-4 w-4" /> Save Changes</Button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 pt-4">
        {Object.keys(metricDetails).map(key => {
          const metric = key as MetricKey;
          const details = metricDetails[metric];
          const values = localThresholds[metric];

          return (
            <div key={metric} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-1">
                <h3 className="font-semibold text-lg">{details.name}</h3>
                <p className="text-sm text-muted-foreground">{`Unit: ${details.unit}`}</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor={`${metric}-warning`} className="text-yellow-600 font-medium">Warning Level</Label>
                    <span className="text-sm font-bold text-yellow-600">{values.warning.toFixed(details.step < 1 ? 1 : 0)} {details.unit}</span>
                  </div>
                  <Slider
                    id={`${metric}-warning`}
                    min={details.min}
                    max={details.max}
                    step={details.step}
                    value={[values.warning]}
                    onValueChange={([val]) => handleSliderChange(metric, 'warning', val)}
                  />
                </div>
                 <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor={`${metric}-unsafe`} className="text-red-600 font-medium">Unsafe Level</Label>
                     <span className="text-sm font-bold text-red-600">{values.unsafe.toFixed(details.step < 1 ? 1 : 0)} {details.unit}</span>
                  </div>
                  <Slider
                    id={`${metric}-unsafe`}
                    min={details.min}
                    max={details.max}
                    step={details.step}
                    value={[values.unsafe]}
                    onValueChange={([val]) => handleSliderChange(metric, 'unsafe', val)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
