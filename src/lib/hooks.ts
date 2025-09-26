
"use client";

import { useState, useEffect } from 'react';
import { ZoneStatus } from './types';
import type { Zone, SensorValues, HistoricalDataPoint, User, MaintenanceTask, Thresholds } from './types';

// --- Configuration ---
const ZONES_CONFIG: Omit<Zone, 'status' | 'currentData' | 'historicalData' | 'location' | 'lastUpdated'>[] = [
  { id: 'zone-library', name: 'Main Library', mapPosition: { top: '10%', left: '10%', width: '30%', height: '30%' } },
  { id: 'zone-cafeteria', name: 'Cafeteria', mapPosition: { top: '10%', left: '50%', width: '40%', height: '20%' } },
  { id: 'zone-sciencelab', name: 'Science Lab', mapPosition: { top: '45%', left: '10%', width: '30%', height: '45%' } },
  { id: 'zone-dorm-a', name: 'Dormitory A', mapPosition: { top: '35%', left: '50%', width: '20%', height: '55%' } },
  { id: 'zone-gym', name: 'Gymnasium', mapPosition: { top: '70%', left: '75%', width: '15%', height: '20%' } },
];

const UPDATE_INTERVAL = 2000; // 2 seconds

// --- Sensor Thresholds (WHO guidelines) ---
const DEFAULT_THRESHOLDS: Thresholds = {
  pm25: { good: 12, warning: 35, unsafe: 55, limit: 35 },
  co2: { good: 800, warning: 1500, unsafe: 2500, limit: 1500 },
  voc: { good: 250, warning: 500, unsafe: 1000, limit: 500 },
  temperature: { good: 25, warning: 28, unsafe: 32, limit: 28 },
  humidity: { good: 50, warning: 70, unsafe: 80, limit: 80 },
  noise: { good: 60, warning: 70, unsafe: 85, limit: 70 },
};

export const THRESHOLDS = DEFAULT_THRESHOLDS; // For components that don't use the hook

// --- Helper Functions ---
const generateInitialSensorData = (): SensorValues => ({
  pm25: 5 + Math.random() * 30, // Start with values that can be good or warning
  co2: 400 + Math.random() * 1200,
  voc: 100 + Math.random() * 400,
  temperature: 20 + Math.random() * 7,
  humidity: 40 + Math.random() * 35,
  noise: 30 + Math.random() * 35,
});

const simulateDataChange = (value: number, fluctuation: number, spikeChance: number = 0.05, min: number, max: number): number => {
  let newValue = value + (Math.random() - 0.5) * fluctuation;
  if (Math.random() < spikeChance) {
    newValue *= (1.5 + Math.random() * 0.5); // Occasional spike
  }
  return Math.max(min, Math.min(newValue, max));
};

const getZoneStatus = (data: SensorValues, thresholds: Thresholds): ZoneStatus => {
  let unsafeCount = 0;
  let warningCount = 0;

  for (const key of Object.keys(thresholds)) {
    const metric = key as keyof SensorValues;
    if (data[metric] > thresholds[metric].unsafe) {
      unsafeCount++;
    } else if (data[metric] > thresholds[metric].warning) {
      warningCount++;
    }
  }

  if (unsafeCount > 0) return ZoneStatus.Unsafe;
  if (warningCount > 1) return ZoneStatus.Unsafe;
  if (warningCount > 0) return ZoneStatus.Warning;
  return ZoneStatus.Safe;
};

// --- In-memory state and listeners ---
let thresholdsState: Thresholds = JSON.parse(JSON.stringify(DEFAULT_THRESHOLDS));
const thresholdListeners: Set<(thresholds: Thresholds) => void> = new Set();

const broadcastThresholds = () => {
    thresholdListeners.forEach(listener => listener(JSON.parse(JSON.stringify(thresholdsState))));
};

// --- Main Hook ---
export function useCampusData() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentThresholds, setCurrentThresholds] = useState(thresholdsState);

  useEffect(() => {
    const listener = (newThresholds: Thresholds) => setCurrentThresholds(newThresholds);
    thresholdListeners.add(listener);
    return () => { thresholdListeners.delete(listener); };
  }, []);

  useEffect(() => {
    // Initial data generation
    const now = Date.now();
    const initialZones = ZONES_CONFIG.map((config, index) => {
      const historicalData: HistoricalDataPoint[] = Array.from({ length: 60 }).map((_, i) => {
        return {
          ...generateInitialSensorData(),
          timestamp: now - (60 - i) * UPDATE_INTERVAL,
        };
      });
      const currentData = historicalData[historicalData.length - 1];
      return {
        ...config,
        currentData,
        historicalData,
        status: getZoneStatus(currentData, currentThresholds),
        location: `Building ${String.fromCharCode(65 + index)}, Floor ${index + 1}`,
        lastUpdated: new Date().toISOString(),
      };
    });
    setZones(initialZones);
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    if (isLoading) return;

    const intervalId = setInterval(() => {
      setZones(prevZones => {
        return prevZones.map(zone => {
          const newValues: SensorValues = {
            pm25: simulateDataChange(zone.currentData.pm25, 3, zone.id === 'zone-sciencelab' ? 0.1 : 0.05, 5, 60),
            co2: simulateDataChange(zone.currentData.co2, 100, zone.id === 'zone-cafeteria' ? 0.15 : 0.05, 400, 3000),
            voc: simulateDataChange(zone.currentData.voc, 50, zone.id === 'zone-sciencelab' ? 0.2 : 0.05, 100, 1200),
            temperature: simulateDataChange(zone.currentData.temperature, 1, 0.02, 18, 35),
            humidity: simulateDataChange(zone.currentData.humidity, 5, 0.05, 30, 90),
            noise: simulateDataChange(zone.currentData.noise, 10, zone.id === 'zone-gym' ? 0.2 : 0.1, 30, 95),
          };

          const newHistoricalData = [...zone.historicalData, { ...newValues, timestamp: Date.now() }].slice(-100);

          return {
            ...zone,
            currentData: newValues,
            historicalData: newHistoricalData,
            status: getZoneStatus(newValues, currentThresholds),
            lastUpdated: new Date().toISOString(),
          };
        });
      });
    }, UPDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isLoading, currentThresholds]);

  return { zones, isLoading };
}


// --- User Data Hook ---
const MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Admin User', email: 'admin@ecowatch.com', role: 'Admin', avatarUrl: 'https://picsum.photos/seed/admin/40/40' },
    { id: 'user-2', name: 'Jane Doe', email: 'jane.doe@university.edu', role: 'Student', avatarUrl: 'https://picsum.photos/seed/janedoe/40/40' },
    { id: 'user-3', name: 'John Smith', email: 'john.smith@university.edu', role: 'Staff', avatarUrl: 'https://picsum.photos/seed/johnsmith/40/40' }
];

let userCounter = MOCK_USERS.length + 1;

let inMemoryUsers: User[] = [...MOCK_USERS];
const userListeners: Set<(users: User[]) => void> = new Set();

const broadcastUsers = () => {
    userListeners.forEach(listener => listener([...inMemoryUsers]));
};

export const addUser = (user: Omit<User, 'id' | 'avatarUrl'>) => {
    const seed = user.name.split(' ').join('-') || `user-${Date.now()}`;
    const id = `user-${Date.now()}-${userCounter++}`;
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
            const id = `user-${Date.now()}-${userCounter++}`;
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
        const timeout = setTimeout(() => {
            setUsers(inMemoryUsers);
            setIsLoading(false);
        }, 500);

        const listener = (newUsers: User[]) => {
            setUsers(newUsers);
        };
        userListeners.add(listener);

        return () => {
            userListeners.delete(listener);
            clearTimeout(timeout);
        };
    }, []);

    return { users, isLoading, addUser, addUsers, updateUser, deleteUser };
}

// --- Maintenance Tasks Hook ---
const MOCK_TASKS: MaintenanceTask[] = [
    { id: 'task-1', task: 'Clean HVAC filters', zone: 'Main Library', priority: 'Medium', dueDate: '2024-08-15', status: 'Pending' },
    { id: 'task-2', task: 'Calibrate CO2 sensors', zone: 'Science Lab', priority: 'High', dueDate: '2024-08-10', status: 'Pending' },
];
let taskCounter = MOCK_TASKS.length + 1;
let inMemoryTasks: MaintenanceTask[] = [...MOCK_TASKS];
const taskListeners: Set<(tasks: MaintenanceTask[]) => void> = new Set();
const broadcastTasks = () => taskListeners.forEach(l => l([...inMemoryTasks]));

export function useMaintenanceTasks() {
    const [tasks, setTasks] = useState<MaintenanceTask[]>(inMemoryTasks);

    useEffect(() => {
        const listener = (newTasks: MaintenanceTask[]) => setTasks(newTasks);
        taskListeners.add(listener);
        return () => { taskListeners.delete(listener); };
    }, []);

    const addTask = (task: Omit<MaintenanceTask, 'id'>) => {
        const newTask = { ...task, id: `task-${taskCounter++}` };
        inMemoryTasks = [newTask, ...inMemoryTasks];
        broadcastTasks();
    };

    const deleteTask = (taskId: string) => {
        inMemoryTasks = inMemoryTasks.filter(t => t.id !== taskId);
        broadcastTasks();
    };

    return { tasks, addTask, deleteTask };
}

// --- Thresholds Hook ---
export function useThresholds() {
    const [thresholds, setThresholds] = useState<Thresholds>(thresholdsState);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setThresholds(thresholdsState);
            setIsLoading(false);
        }, 300);

        const listener = (newThresholds: Thresholds) => setThresholds(newThresholds);
        thresholdListeners.add(listener);

        return () => {
            clearTimeout(timeout);
            thresholdListeners.delete(listener);
        };
    }, []);

    const updateThresholds = (newThresholds: Thresholds) => {
        thresholdsState = newThresholds;
        broadcastThresholds();
    };

    const resetThresholds = () => {
        thresholdsState = JSON.parse(JSON.stringify(DEFAULT_THRESHOLDS));
        broadcastThresholds();
        return thresholdsState;
    }

    return { thresholds, setThresholds: updateThresholds, resetThresholds, isLoading };
}
