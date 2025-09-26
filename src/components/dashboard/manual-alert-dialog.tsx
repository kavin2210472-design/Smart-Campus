"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function ManualAlertDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const { toast } = useToast();

    const handleSendAlert = () => {
        toast({
            title: "Manual Alert Sent",
            description: "Your emergency alert has been broadcasted to all registered users.",
        });
        onOpenChange(false);
    }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Manual Alert</DialogTitle>
          <DialogDescription>
            Broadcast an emergency alert to all registered students and teachers. Use with caution.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="alert-level">Alert Level</Label>
            <Select defaultValue="high">
                <SelectTrigger id="alert-level">
                    <SelectValue placeholder="Select alert level" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="low">Low (Informational)</SelectItem>
                    <SelectItem value="medium">Medium (Warning)</SelectItem>
                    <SelectItem value="high">High (Emergency)</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Type your alert message here." rows={4}/>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" variant="destructive" onClick={handleSendAlert}>Send Alert</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
