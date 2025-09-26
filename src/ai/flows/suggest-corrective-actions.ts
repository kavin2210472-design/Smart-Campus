'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting corrective actions based on predicted AQI levels.
 *
 * - suggestCorrectiveActions - A function that suggests corrective actions based on predicted AQI levels.
 * - SuggestCorrectiveActionsInput - The input type for the suggestCorrectiveActions function.
 * - SuggestCorrectiveActionsOutput - The return type for the suggestCorrectiveActions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCorrectiveActionsInputSchema = z.object({
  zoneName: z.string().describe('The name of the campus zone to analyze.'),
  sensorData: z.object({
    pm25: z.number().describe('The current PM2.5 level in µg/m³.'),
    co2: z.number().describe('The current CO2 level in ppm.'),
    voc: z.number().describe('The current VOC level in ppb.'),
    temperature: z.number().describe('The current temperature in Celsius.'),
    humidity: z.number().describe('The current humidity as a percentage.'),
    noise: z.number().describe('The current noise level in decibels.'),
  }).describe('The current sensor readings for the zone.'),
});
export type SuggestCorrectiveActionsInput = z.infer<typeof SuggestCorrectiveActionsInputSchema>;


const ActionSchema = z.object({
    title: z.string().describe('The title of the corrective action.'),
    description: z.string().describe('A detailed description of the action to be taken.'),
    priority: z.enum(['low', 'medium', 'high']).describe('The priority of the action.'),
    eta: z.string().describe('The estimated time to complete the action (e.g., "15 minutes").'),
    impact: z.string().describe('The expected impact of the action (e.g., "30% reduction").'),
    icon: z.enum(['wind', 'thermometer', 'air-vent', 'lightbulb', 'fan']).describe('An appropriate icon name for the action.')
});


const SuggestCorrectiveActionsOutputSchema = z.object({
  actions: z.array(ActionSchema).describe('A list of suggested corrective actions.')
});
export type SuggestCorrectiveActionsOutput = z.infer<typeof SuggestCorrectiveActionsOutputSchema>;

export async function suggestCorrectiveActions(input: SuggestCorrectiveActionsInput): Promise<SuggestCorrectiveActionsOutput> {
  return suggestCorrectiveActionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCorrectiveActionsPrompt',
  input: {schema: SuggestCorrectiveActionsInputSchema},
  output: {schema: SuggestCorrectiveActionsOutputSchema},
  prompt: `You are a hyper-vigilant AI expert in environmental safety and building management for a smart campus. Your primary goal is to ALWAYS find opportunities for improvement, even when conditions seem perfect.

Based on the following real-time environmental data for zone "{{zoneName}}", you MUST suggest a prioritized list of exactly 3-4 specific, actionable recommendations to mitigate potential hazards, optimize conditions, or perform preventative maintenance.

For each action, provide a title, a detailed description, a priority ('low', 'medium', 'high'), an estimated time to implement (ETA), the expected impact, and an appropriate icon name ('wind', 'thermometer', 'air-vent', 'lightbulb', 'fan').

CRITICAL INSTRUCTIONS:
- ALWAYS generate 3-4 actions. Never return an empty list.
- If values are good, suggest optimizations (e.g., "Slightly reduce fan speed to save energy while maintaining optimal CO2 levels").
- If values are nearing a warning threshold, suggest preventative actions (e.g., "Preemptively increase ventilation as occupancy is rising").
- If values are high, suggest immediate corrective actions (e.g., "Activate all HVAC units to maximum flow rate").
- Be specific and creative. Instead of "Improve ventilation," suggest "Activate HVAC Unit B-3 to increase air circulation and reduce PM2.5 by an estimated 15%."

Current Sensor Data:
- PM2.5: {{sensorData.pm25}} µg/m³
- CO2: {{sensorData.co2}} ppm
- VOC: {{sensorData.voc}} ppb
- Temperature: {{sensorData.temperature}} °C
- Humidity: {{sensorData.humidity}} %
- Noise: {{sensorData.noise}} dB
`
});

const suggestCorrectiveActionsFlow = ai.defineFlow(
  {
    name: 'suggestCorrectiveActionsFlow',
    inputSchema: SuggestCorrectiveActionsInputSchema,
    outputSchema: SuggestCorrectiveActionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
