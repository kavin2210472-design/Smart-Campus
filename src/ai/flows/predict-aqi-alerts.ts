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

const PredictAqiAlertsOutputSchema = z.object({
  predictedAqi: z.number().describe('The predicted AQI level for the zone in 2 hours.'),
  alertMessage: z.string().describe('A message indicating if the predicted AQI level is unsafe and suggesting corrective actions.'),
});
export type PredictAqiAlertsOutput = z.infer<typeof PredictAqiAlertsOutputSchema>;

export async function predictAqiAlerts(input: PredictAqiAlertsInput): Promise<PredictAqiAlertsOutput> {
  return predictAqiAlertsFlow(input);
}

const predictAqiAlertsPrompt = ai.definePrompt({
  name: 'predictAqiAlertsPrompt',
  input: {schema: PredictAqiAlertsInputSchema},
  output: {schema: PredictAqiAlertsOutputSchema},
  prompt: `You are an AI assistant specializing in predicting air quality and providing safety alerts.

  Based on the provided historical sensor data for the campus zone "{{zoneName}}", predict the Air Quality Index (AQI) level in 2 hours.
  Consider air quality (PM2.5, CO2, VOCs), temperature, humidity, and noise levels when making your prediction.

  Historical Data: {{{historicalData}}}

  If the predicted AQI level exceeds WHO guidelines, generate an alert message suggesting corrective actions, such as increasing ventilation or limiting access to the zone.
  Otherwise, indicate that the zone is likely to remain safe.
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
