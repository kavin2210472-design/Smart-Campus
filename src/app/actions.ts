
"use server";

import { predictAqiAlerts } from "@/ai/flows/predict-aqi-alerts";
import { suggestCorrectiveActions } from "@/ai/flows/suggest-corrective-actions";
import { sendEmergencyAlert } from "@/ai/flows/send-emergency-alert";
import type { SensorValues, HistoricalDataPoint, User, Alert } from "@/lib/types";

export async function getAqiPrediction(zoneName: string, historicalData: HistoricalDataPoint[]) {
  try {
    if (!historicalData || historicalData.length === 0) {
      // Return a default or empty value if there's no data to process
      return { predictedAqi: 0, alertMessage: "Not enough data for prediction." };
    }

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

export async function sendManualAlert(zoneName: string, message: string, userEmails: string[]): Promise<Alert> {
    try {
        const result = await sendEmergencyAlert({
            zoneName,
            customMessage: message,
            userEmails,
        });

        if (!result) {
            throw new Error("AI flow did not return a result.");
        }

        console.log("Alert simulation successful, confirmation: ", result.confirmationMessage);

        const newAlert: Alert = {
            id: `manual-${Date.now()}`,
            zoneId: zoneName,
            zoneName: zoneName,
            message: message, // Use the original message for the UI alert
            timestamp: new Date().toISOString(),
            type: 'manual',
        };

        return newAlert;

    } catch (error) {
        console.error("Failed to process the emergency alert simulation:", error);
        throw new Error("Failed to generate alert content. Please try again.");
    }
}
