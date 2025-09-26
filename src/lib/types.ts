
export type SensorValues = {
  pm25: number;
  co2: number;
  voc: number;
  temperature: number;
  humidity: number;
  noise: number;
};

export type HistoricalDataPoint = SensorValues & {
  timestamp: number;
};

export enum ZoneStatus {
  Safe = 'Safe',
  Warning = 'Warning',
  Unsafe = 'Unsafe',
}

export type Zone = {
  id: string;
  name: string;
  status: ZoneStatus;
  currentData: SensorValues;
  historicalData: HistoricalDataPoint[];
  mapPosition: { top: string; left: string; width: string; height: string };
  location: string;
  lastUpdated: string;
};

export type Alert = {
  id: string;
  zoneId: string;
  zoneName: string;
  message: string;
  timestamp: string;
  type: 'current' | 'predicted' | 'manual' | 'historical';
  alertType?: string;
  severity?: 'Critical' | 'High' | 'Medium' | 'Low';
  currentValue?: string;
  status?: 'Active' | 'Acknowledged' | 'Resolved';
};

export type PredictedAlert = {
    metric: 'PM2.5' | 'CO2' | 'VOCs' | 'Noise' | 'General';
    title: string;
    description: string;
    predictedAqi: number;
    confidence: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    timeframe: string;
};


export type CorrectiveAction = {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  eta: string;
  impact: string;
  icon: 'wind' | 'thermometer' | 'air-vent' | 'lightbulb' | 'fan';
};

export type User = {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Manager' | 'Operator' | 'Student' | 'Staff';
    avatarUrl?: string;
};
