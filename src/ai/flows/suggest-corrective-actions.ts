// src/ai/flows/suggest-corrective-actions.ts
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
  zone: z.string().describe('The campus zone to analyze.'),
  predictedPm25: z.number().describe('The predicted PM2.5 level in μg/m³.'),
  predictedCo2: z.number().describe('The predicted CO2 level in ppm.'),
  predictedVoc: z.number().describe('The predicted VOC level in ppb.'),
  predictedTemperature: z.number().describe('The predicted temperature in Celsius.'),
  predictedHumidity: z.number().describe('The predicted humidity as a percentage.'),
  predictedNoiseLevel: z.number().describe('The predicted noise level in decibels.'),
});
export type SuggestCorrectiveActionsInput = z.infer<typeof SuggestCorrectiveActionsInputSchema>;

const SuggestCorrectiveActionsOutputSchema = z.object({
  actions: z.array(
    z.string().describe('A suggested corrective action to mitigate environmental hazards.')
  ).describe('A list of suggested corrective actions.')
});
export type SuggestCorrectiveActionsOutput = z.infer<typeof SuggestCorrectiveActionsOutputSchema>;

export async function suggestCorrectiveActions(input: SuggestCorrectiveActionsInput): Promise<SuggestCorrectiveActionsOutput> {
  return suggestCorrectiveActionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCorrectiveActionsPrompt',
  input: {schema: SuggestCorrectiveActionsInputSchema},
  output: {schema: SuggestCorrectiveActionsOutputSchema},
  prompt: `You are an expert in environmental safety and provide corrective actions to maintain a healthy campus environment.

  Based on the following predicted environmental conditions for zone {{{zone}}}, suggest corrective actions to mitigate potential hazards. Focus on actions related to air quality (PM2.5, CO2, VOCs), temperature, humidity and noise levels. The suggested actions should maintain the safety of students and faculty.

  Predicted PM2.5 Level: {{{predictedPm25}}} μg/m³
  Predicted CO2 Level: {{{predictedCo2}}} ppm
  Predicted VOC Level: {{{predictedVoc}}} ppb
  Predicted Temperature: {{{predictedTemperature}}} °C
  Predicted Humidity: {{{predictedHumidity}}} %
  Predicted Noise Level: {{{predictedNoiseLevel}}} dB

  Provide a numbered list of corrective actions, be direct and concise.
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
