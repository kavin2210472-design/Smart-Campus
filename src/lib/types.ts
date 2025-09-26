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
};

export type Alert = {
  id: string;
  zoneId: string;
  zoneName: string;
  message: string;
  timestamp: string;
  type: 'current' | 'predicted';
};

export type PredictedAlert = {
  zoneName: string;
  predictedAqi: number;
  alertMessage: string;
};

export type CorrectiveAction = {
  zoneName: string;
  actions: string[];
};
