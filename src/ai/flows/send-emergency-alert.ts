// src/ai/flows/send-emergency-alert.ts
'use server';

/**
 * @fileOverview Defines a Genkit flow for sending emergency alert emails.
 *
 * - sendEmergencyAlert - A function that crafts and "sends" an emergency alert email.
 * - SendEmergencyAlertInput - The input type for the sendEmergencyAlert function.
 * - SendEmergencyAlertOutput - The return type for the sendEmergencyAlert function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SendEmergencyAlertInputSchema = z.object({
  zoneName: z.string().describe('The campus zone the alert is for. Can be "all-zones".'),
  customMessage: z.string().describe('The core message of the emergency alert.'),
  userEmails: z.array(z.string().email()).describe('A list of user email addresses to send the alert to.'),
});
export type SendEmergencyAlertInput = z.infer<typeof SendEmergencyAlertInputSchema>;

const SendEmergencyAlertOutputSchema = z.object({
  confirmationMessage: z.string().describe('A confirmation that the alert was processed successfully.'),
  emailSubject: z.string().describe('The subject line of the email.'),
  emailBody: z.string().describe('The body content of the email.'),
});
export type SendEmergencyAlertOutput = z.infer<typeof SendEmergencyAlertOutputSchema>;

export async function sendEmergencyAlert(input: SendEmergencyAlertInput): Promise<SendEmergencyAlertOutput> {
  return sendEmergencyAlertFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sendEmergencyAlertPrompt',
  input: { schema: SendEmergencyAlertInputSchema },
  output: { schema: SendEmergencyAlertOutputSchema },
  prompt: `
    You are the CampusGuard emergency alert system. Your task is to generate a professional and clear emergency alert email and a confirmation message based on the provided information.

    The alert is for: {{{zoneName}}}
    The core message is: {{{customMessage}}}

    1.  **Create a confirmation message.** It should state that the alert for the specified zone has been successfully processed and is being dispatched.
    2.  **Create a clear and concise email subject line.** Start it with "EMERGENCY ALERT:".
    3.  **Write a formal email body.**
        - Start with a direct and urgent opening.
        - Clearly state the core message.
        - If the zone is not 'all-zones', specify the affected area.
        - Include a call to action (e.g., "Please evacuate immediately," "Stay clear of the area," "Follow instructions from emergency personnel").
        - Conclude with a professional closing from "CampusGuard Security".
  `,
});

const sendEmergencyAlertFlow = ai.defineFlow(
  {
    name: 'sendEmergencyAlertFlow',
    inputSchema: SendEmergencyAlertInputSchema,
    outputSchema: SendEmergencyAlertOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);

    if (!output) {
      throw new Error('AI failed to generate an alert.');
    }

    // In a real application, this is where you would integrate with an email service (e.g., SendGrid, Mailgun)
    // to send the generated email to the list of `input.userEmails`.
    // For this simulation, we will just log the action and the generated content.
    console.log('--- SIMULATING EMAIL DISPATCH ---');
    console.log(`Subject: ${output.emailSubject}`);
    console.log('Recipients:', input.userEmails.join(', '));
    console.log('--- End of Simulation ---');
    
    return output;
  }
);
