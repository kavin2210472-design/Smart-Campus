
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { sendManualAlert } from '@/app/actions';
import { useUsers } from '@/lib/hooks';
import type { Zone, Alert } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';
import { Alert as UiAlert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const alertFormSchema = z.object({
  zoneName: z.string().min(1, 'Please select a zone.'),
  message: z.string().min(10, 'Message must be at least 10 characters long.'),
});

type AlertFormValues = z.infer<typeof alertFormSchema>;

type EmergencyAlertFormProps = {
    onAlertSent: (alert: Alert) => void;
    zones: Zone[];
}

export default function EmergencyAlertForm({ onAlertSent, zones }: EmergencyAlertFormProps) {
  const { toast } = useToast();
  const { users } = useUsers();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      zoneName: 'all-zones',
      message: '',
    },
  });

  const onSubmit = async (values: AlertFormValues) => {
    setIsSubmitting(true);
    
    const userEmails = users.map(u => u.email);

    try {
      const newAlert = await sendManualAlert(values.zoneName, values.message, userEmails);
      
      onAlertSent(newAlert);

      toast({
        title: 'Emergency Alert Sent',
        description: `An alert has been broadcasted for ${values.zoneName === 'all-zones' ? 'all zones' : values.zoneName}.`,
      });

      form.reset();

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to Send Alert',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Emergency Alert</CardTitle>
        <CardDescription>
          Broadcast a manual emergency alert to all registered users. This will send an email notification.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
            <UiAlert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>High Priority Action</AlertTitle>
                <AlertDescription>
                    Use this form only in case of a genuine emergency. All users will be notified immediately.
                </AlertDescription>
            </UiAlert>

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                    control={form.control}
                    name="zoneName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Campus Zone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a zone" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="all-zones">All Zones</SelectItem>
                            {zones.map(zone => (
                                <SelectItem key={zone.id} value={zone.name}>
                                    {zone.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>

                <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Alert Message</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="e.g., Evacuate the Science Lab immediately due to a chemical spill."
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Broadcast Alert'}
                </Button>
                </div>
            </form>
            </Form>
        </div>
      </CardContent>
    </Card>
  );
}
