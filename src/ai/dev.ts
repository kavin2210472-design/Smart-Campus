import { config } from 'dotenv';
config();

import '@/ai/flows/predict-aqi-alerts.ts';
import '@/ai/flows/suggest-corrective-actions.ts';