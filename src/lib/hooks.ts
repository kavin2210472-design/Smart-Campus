
"use client";

import { useState, useEffect } from 'react';
import { ZoneStatus } from './types';
import type { Zone, SensorValues, HistoricalDataPoint, User } from './types';

// --- Configuration ---
const ZONES_CONFIG: Omit<Zone, 'status' | 'currentData' | 'historicalData'>[] = [
  { id: 'zone-library', name: 'Library', mapPosition: { top: '10%', left: '10%', width: '30%', height: '30%' } },
  { id: 'zone-cafeteria', name: 'Cafeteria', mapPosition: { top: '10%', left: '50%', width: '40%', height: '20%' } },
  { id: 'zone-sciencelab', name: 'Science Lab', mapPosition: { top: '45%', left: '10%', width: '30%', height: '45%' } },
  { id: 'zone-dorm-a', name: 'Dormitory A', mapPosition: { top: '35%', left: '50%', width: '20%', height: '55%' } },
  { id: 'zone-gym', name: 'Gymnasium', mapPosition: { top: '70%', left: '75%', width: '15%', height: '20%' } },
];

const UPDATE_INTERVAL = 5000; // 5 seconds

// --- Sensor Thresholds (simplified from WHO guidelines) ---
const THRESHOLDS = {
  pm25: { warning: 15, unsafe: 25 },
  co2: { warning: 1000, unsafe: 2000 },
  voc: { warning: 300, unsafe: 500 },
  temperature: { warning: 26, unsafe: 30 },
  humidity: { warning: 60, unsafe: 70 },
  noise: { warning: 70, unsafe: 85 },
};

// --- Helper Functions ---
const generateInitialSensorData = (): SensorValues => ({
  pm25: 5 + Math.random() * 10,
  co2: 400 + Math.random() * 200,
  voc: 50 + Math.random() * 100,
  temperature: 20 + Math.random() * 4,
  humidity: 40 + Math.random() * 15,
  noise: 30 + Math.random() * 20,
});

const simulateDataChange = (value: number, fluctuation: number, spikeChance: number = 0.05): number => {
  let newValue = value + (Math.random() - 0.5) * fluctuation;
  if (Math.random() < spikeChance) {
    newValue *= (1.5 + Math.random()); // Occasional spike
  }
  return Math.max(0, newValue);
};

const getZoneStatus = (data: SensorValues): ZoneStatus => {
  let unsafeCount = 0;
  let warningCount = 0;

  for (const key of Object.keys(THRESHOLDS)) {
    const metric = key as keyof SensorValues;
    if (data[metric] > THRESHOLDS[metric].unsafe) {
      unsafeCount++;
    } else if (data[metric] > THRESHOLDS[metric].warning) {
      warningCount++;
    }
  }

  if (unsafeCount > 0) return ZoneStatus.Unsafe;
  if (warningCount > 1) return ZoneStatus.Unsafe;
  if (warningCount > 0) return ZoneStatus.Warning;
  return ZoneStatus.Safe;
};

// --- Main Hook ---
export function useCampusData() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial data generation
    const now = Date.now();
    const initialZones = ZONES_CONFIG.map(config => {
      const historicalData: HistoricalDataPoint[] = Array.from({ length: 20 }).map((_, i) => {
        return {
          ...generateInitialSensorData(),
          timestamp: now - (20 - i) * UPDATE_INTERVAL,
        };
      });
      const currentData = historicalData[historicalData.length - 1];
      return {
        ...config,
        currentData,
        historicalData,
        status: getZoneStatus(currentData),
      };
    });
    setZones(initialZones);
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    if (isLoading) return;

    const intervalId = setInterval(() => {
      setZones(prevZones => {
        const now = Date.now();
        return prevZones.map(zone => {
          const newValues: SensorValues = {
            pm25: simulateDataChange(zone.currentData.pm25, 2, zone.name === 'Science Lab' ? 0.2 : 0.05),
            co2: simulateDataChange(zone.currentData.co2, 50, zone.name === 'Cafeteria' ? 0.2 : 0.02),
            voc: simulateDataChange(zone.currentData.voc, 20, zone.name === 'Science Lab' ? 0.3 : 0.05),
            temperature: simulateDataChange(zone.currentData.temperature, 0.5),
            humidity: simulateDataChange(zone.currentData.humidity, 2),
            noise: simulateDataChange(zone.currentData.noise, 5, zone.name === 'Gymnasium' ? 0.25 : 0.1),
          };

          const newHistoricalData = [...zone.historicalData, { ...newValues, timestamp: now }].slice(-100); // Keep last 100 points

          return {
            ...zone,
            currentData: newValues,
            historicalData: newHistoricalData,
            status: getZoneStatus(newValues),
          };
        });
      });
    }, UPDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isLoading]);

  return { zones, isLoading };
}


// --- User Data Hook ---
const MOCK_USERS: User[] = [];

let userCounter = MOCK_USERS.length + 1;

// The state needs to be managed outside the hook to be shared across components.
let inMemoryUsers: User[] = [...MOCK_USERS];
const listeners: Set<(users: User[]) => void> = new Set();

const broadcastUsers = () => {
    listeners.forEach(listener => listener(inMemoryUsers));
};

export const addUser = (user: Omit<User, 'id' | 'avatarUrl'>) => {
    const seed = user.name.split(' ').join('-') || `user-${Date.now()}`;
    const id = `user-${Date.now()}-${userCounter++}-${Math.random()}`;
    const newUser: User = { 
        ...user, 
        id,
        avatarUrl: `https://picsum.photos/seed/${seed}/40/40`,
    };
    inMemoryUsers = [newUser, ...inMemoryUsers];
    broadcastUsers();
};

export const addUsers = (users: Omit<User, 'id' | 'avatarUrl'>[]) => {
    const existingEmails = new Set(inMemoryUsers.map(u => u.email));
    const newUsers = users
        .filter(user => !existingEmails.has(user.email))
        .map(user => {
            const seed = user.name.split(' ').join('-') || `user-${Date.now()}`;
            const id = `user-${Date.now()}-${userCounter++}-${Math.random()}`;
            return {
                ...user,
                id,
                avatarUrl: `https://picsum.photos/seed/${seed}/40/40`,
            };
        });

    if (newUsers.length > 0) {
        inMemoryUsers = [...newUsers, ...inMemoryUsers];
        broadcastUsers();
    }
};

export const updateUser = (userId: string, updatedInfo: Partial<Omit<User, 'id'>>) => {
    inMemoryUsers = inMemoryUsers.map(u => u.id === userId ? { ...u, ...updatedInfo } : u);
    broadcastUsers();
};

export const deleteUser = (userId: string) => {
    inMemoryUsers = inMemoryUsers.filter(u => u.id !== userId);
    broadcastUsers();
};

export function useUsers() {
    const [users, setUsers] = useState<User[]>(inMemoryUsers);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data
        const timeout = setTimeout(() => {
            setUsers(inMemoryUsers);
            setIsLoading(false);
        }, 500);

        const listener = (newUsers: User[]) => {
            setUsers(newUsers);
        };
        listeners.add(listener);

        return () => {
            listeners.delete(listener);
            clearTimeout(timeout);
        };
    }, []);

    return { users, isLoading, addUser, addUsers, updateUser, deleteUser };
}

    