"use server";

import { predictAqiAlerts } from "@/ai/flows/predict-aqi-alerts";
import { suggestCorrectiveActions } from "@/ai/flows/suggest-corrective-actions";
import { sendEmergencyAlert } from "@/ai/flows/send-emergency-alert";
import type { SensorValues, HistoricalDataPoint, User, Alert } from "@/lib/types";
import { useUsers } from "@/lib/hooks";

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
    console.log(`Sending alert for zone: ${zoneName}`);
    console.log(`Message: ${message}`);
    console.log(`Recipients: ${userEmails.join(', ')}`);

    try {
        const result = await sendEmergencyAlert({
            zoneName,
            customMessage: message,
            userEmails,
        });

        console.log("Alert sent successfully, confirmation: ", result.confirmationMessage);

        const newAlert: Alert = {
            id: `manual-${Date.now()}`,
            zoneId: zoneName,
            zoneName: zoneName,
            message: message,
            timestamp: new Date().toISOString(),
            type: 'manual',
        };

        return newAlert;

    } catch (error) {
        console.error("Failed to send emergency alert:", error);
        throw new Error("Failed to send alert. Please try again.");
    }
}
