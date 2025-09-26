"use server";

import { predictAqiAlerts } from "@/ai/flows/predict-aqi-alerts";
import { suggestCorrectiveActions } from "@/ai/flows/suggest-corrective-actions";
import type { SensorValues, HistoricalDataPoint } from "@/lib/types";

export async function getAqiPrediction(zoneName: string, historicalData: HistoricalDataPoint[]) {
  try {
    const historicalDataString = historicalData
      .slice(-5) // Use last 5 data points
      .map(d => `Timestamp: ${new Date(d.timestamp).toISOString()}, PM2.5: ${d.pm25.toFixed(1)}, CO2: ${d.co2.toFixed(0)}, VOC: ${d.voc.toFixed(0)}`)
      .join('\n');

    const prediction = await predictAqiAlerts({
      zoneName,
      historicalData: historicalDataString,
    });
    return prediction;
  } catch (error) {
    console.error(`Error getting AQI prediction for ${zoneName}:`, error);
    return null;
  }
}

export async function getCorrectiveActions(zoneName: string, predictedData: SensorValues) {
  try {
    const actions = await suggestCorrectiveActions({
      zone: zoneName,
      predictedPm25: predictedData.pm25,
      predictedCo2: predictedData.co2,
      predictedVoc: predictedData.voc,
      predictedTemperature: predictedData.temperature,
      predictedHumidity: predictedData.humidity,
      predictedNoiseLevel: predictedData.noise,
    });
    return actions;
  } catch (error) {
    console.error(`Error getting corrective actions for ${zoneName}:`, error);
    return null;
  }
}
