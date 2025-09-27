
// src/ai/flows/predict-aqi-alerts.ts
'use server';

/**
 * @fileOverview Predicts future Air Quality Index (AQI) levels for each zone.
 *
 * - predictAqiAlerts - Predicts future AQI levels for a given zone.
 * - PredictAqiAlertsInput - The input type for the predictAqiAlerts function.
 * - PredictAqiAlertsOutput - The return type for the predictAqiAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictAqiAlertsInputSchema = z.object({
  zoneName: z.string().describe('The name of the campus zone.'),
  historicalData: z.string().describe('Historical sensor data for the zone, including air quality, temperature, humidity and noise levels.'),
});
export type PredictAqiAlertsInput = z.infer<typeof PredictAqiAlertsInputSchema>;


const PredictedAlertSchema = z.object({
    metric: z.enum(['PM2.5', 'CO2', 'VOCs', 'Noise', 'General']),
    title: z.string().describe('A short, descriptive title for the predicted alert.'),
    description: z.string().describe('A detailed description of the prediction, including expected values and timeframes.'),
    predictedAqi: z.number().describe('The predicted AQI value associated with this specific alert.'),
    confidence: z.number().min(0).max(100).describe('The confidence level of the prediction, as a percentage (e.g., 87).'),
    riskLevel: z.enum(['Low', 'Medium', 'High']).describe('The assessed risk level of the prediction.'),
    timeframe: z.string().describe('The time window for the prediction (e.g., "Next 2 hours").')
});

const PredictAqiAlertsOutputSchema = z.object({
  alerts: z.array(PredictedAlertSchema).describe('A list of 1-2 predicted environmental alerts. Only include alerts for significant predicted events.'),
});
export type PredictAqiAlertsOutput = z.infer<typeof PredictAqiAlertsOutputSchema>;


export async function predictAqiAlerts(input: PredictAqiAlertsInput): Promise<PredictAqiAlertsOutput> {
  return predictAqiAlertsFlow(input);
}

const predictAqiAlertsPrompt = ai.definePrompt({
  name: 'predictAqiAlertsPrompt',
  input: {schema: PredictAqiAlertsInputSchema},
  output: {schema: PredictAqiAlertsOutputSchema},
  prompt: `You are an AI assistant specializing in predicting air quality and providing safety alerts for a smart campus.

  Based on the provided historical sensor data for the campus zone "{{zoneName}}", you MUST predict potential environmental events within the next 1-2 hours and generate a list of 1-2 alerts.

  CRITICAL INSTRUCTIONS:
  - You MUST ALWAYS generate between 1 and 2 alerts. Never return an empty list.
  - If no major events are predicted, you MUST generate a "Low" risk informational alert about expected stability or minor fluctuations. For example, "Conditions Expected to Remain Stable" or "Minor PM2.5 Fluctuation Possible".

  For each prediction, provide the following:
  - metric: The primary metric concerned (e.g., 'PM2.5', 'CO2', 'General'). For stable conditions, use 'General'.
  - title: A concise title for the alert.
  - description: A clear, human-readable summary of the prediction.
  - predictedAqi: An estimated AQI value. For stable conditions, this can be close to the current average.
  - confidence: Your confidence in this prediction as a percentage (e.g., 95 for 95%).
  - riskLevel: Classify the risk as 'Low', 'Medium', or 'High'. For informational alerts, use 'Low'.
  - timeframe: The time window for the prediction (e.g., "Next 2 hours").

  Historical Data for "{{zoneName}}":
  {{{historicalData}}}
  `,
});

const predictAqiAlertsFlow = ai.defineFlow(
  {
    name: 'predictAqiAlertsFlow',
    inputSchema: PredictAqiAlertsInputSchema,
    outputSchema: PredictAqiAlertsOutputSchema,
  },
  async input => {
    const {output} = await predictAqiAlertsPrompt(input);
    return output!;
  }
);
