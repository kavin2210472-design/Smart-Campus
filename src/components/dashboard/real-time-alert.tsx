
"use client";

import { Megaphone, X } from 'lucide-react';
import { Alert as UiAlert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { Alert } from '@/lib/types';

type RealTimeAlertProps = {
    alert: Alert;
    onDismiss: () => void;
};

export default function RealTimeAlert({ alert, onDismiss }: RealTimeAlertProps) {
    const zoneDisplay = alert.zoneName === 'all-zones' ? 'All Zones' : alert.zoneName;
    
    return (
        <UiAlert variant="destructive" className="relative mb-4">
            <Megaphone className="h-4 w-4" />
            <AlertTitle>Manual Alert Broadcast: {zoneDisplay}</AlertTitle>
            <AlertDescription>
                {alert.message}
            </AlertDescription>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={onDismiss}
            >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
            </Button>
        </UiAlert>
    );
}
