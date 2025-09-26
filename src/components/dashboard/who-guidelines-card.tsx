
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function WhoGuidelinesCard() {
    const guidelines = {
        'PM2.5': '15 µg/m³ (24h avg)',
        'CO₂': '1000 ppm (indoor)',
        'VOCs': '300 µg/m³ (TVOC)',
        'Temperature': '18-24°C',
        'Humidity': '40-60%',
        'Noise': '55 dB (day)',
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Info className="h-5 w-5 text-primary" />
                    WHO Air Quality Guidelines
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                    {Object.entries(guidelines).map(([metric, value]) => (
                        <div key={metric}>
                            <p className="text-muted-foreground">{metric}</p>
                            <p className="font-medium">{value}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
