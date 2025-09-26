
'use client';

import { useState } from 'react';
import { useForm, zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCampusData, useUsers } from '@/lib/hooks';
import { useToast } from '@/hooks/use-toast';
import { sendManualAlert } from '@/app/actions';
import { Loader2, Send } from 'lucide-react';
import { Alert } from '@/lib/types';

const formSchema = z.object({
  zone: z.string().min(1, 'Please select a zone.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type ManualAlertFormProps = {
  onAlertSent: (newAlert: Alert) => void;
};

export default function ManualAlertForm({ onAlertSent }: ManualAlertFormProps) {
  const { zones, isLoading: isLoadingZones } = useCampusData();
  const { users, isLoading: isLoadingUsers } = useUsers();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zone: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const allUserEmails = users.map(u => u.email);

    try {
      const newAlert = await sendManualAlert(values.zone, values.message, allUserEmails);
      
      toast({
        title: 'Alert Sent Successfully',
        description: `The emergency alert for "${values.zone}" has been dispatched.`,
      });

      onAlertSent(newAlert);
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
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Compose Manual Alert</CardTitle>
                <CardDescription>
                Send an immediate notification to all users or a specific zone. This action will trigger a simulated email to all registered users.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="zone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Target Zone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingZones}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a campus zone or all zones" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="all-zones">All Campus Zones</SelectItem>
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
                    <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Alert Message</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="e.g., Unscheduled fire drill in progress. Please evacuate via the nearest exit."
                            className="min-h-[120px]"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting || isLoadingUsers}>
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="mr-2 h-4 w-4" />
                        )}
                        Send Emergency Alert
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
        <div className="bg-muted p-6 rounded-lg text-sm">
            <h3 className="text-lg font-semibold mb-4">Manual Alert Guidelines</h3>
            <ul className="space-y-4 text-muted-foreground">
                <li className='pl-4 border-l-2 border-primary'>
                    <strong className='block text-foreground'>Be Clear & Concise:</strong> State the emergency and the required action clearly.
                </li>
                <li className='pl-4 border-l-2 border-primary'>
                    <strong className='block text-foreground'>Specify Location:</strong> If not an all-zones alert, ensure the location is unambiguous.
                </li>
                 <li className='pl-4 border-l-2 border-primary'>
                    <strong className='block text-foreground'>Provide Instructions:</strong> Tell people what to do (e.g., evacuate, shelter in place).
                </li>
                <li className='pl-4 border-l-2 border-primary.20'>
                    <strong className='block text-foreground'>Confirmation:</strong> After sending, check the Alert History tab to confirm it was logged. This is a demo, so no real emails will be sent.
                </li>
            </ul>
        </div>
    </div>
  );
}
