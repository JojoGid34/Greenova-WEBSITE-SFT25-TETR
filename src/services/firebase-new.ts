import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off, get, set, push, serverTimestamp, connectDatabaseEmulator } from 'firebase/database';
import { formatDateConsistent, parseDateString } from '../utils/dateUtils';

// Firebase configuration - you can replace this with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyCjGcz4kBFwmFlv_1qeSHMp93EqhNt9fvM",
  authDomain: "greenova-app.firebaseapp.com",
  databaseURL: "https://greenova-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "greenova-app",
  storageBucket: "greenova-app.firebasestorage.app",
  messagingSenderId: "883705279570",
  appId: "1:883705279570:web:78610b1820a2688fd91b8b"
};

// Alternative: Use environment variables if available
const getFirebaseConfig = () => {
  // Check if we're in development mode or if custom config is provided
  if (typeof window !== 'undefined') {
    const customConfig = (window as any).FIREBASE_CONFIG;
    if (customConfig) {
      return customConfig;
    }
  }

  // Return demo config for development
  return firebaseConfig;
};

// Initialize Firebase with error handling
let app;
let database;

try {
  const config = getFirebaseConfig();
  app = initializeApp(config);
  database = getDatabase(app);
  
  // For development: you can use Firebase emulator if needed
  // Uncomment the line below if you want to use Firebase emulator
  // connectDatabaseEmulator(database, 'localhost', 9000);
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create a mock database interface for development
  database = null;
}

// Types for the new database structure
export interface RobotData {
  kelembaban?: number;
  suhu?: number;
  jarak?: number;
  debu?: number;
  gas?: number;
  terakhir_update?: string | number;
  aqi_lokal?: number | string;
}

export interface PlantData {
  kelembaban?: number;
  kondisi?: string;
  terakhir_siram?: string | number;
  terakhir_update?: string | number;
}

export interface TamanData {
  A?: PlantData;
  B?: PlantData;
}

export interface DatabaseSnapshot {
  robot: RobotData;
  taman: TamanData;
}

// Historical data interfaces
export interface HistoricalRobotData extends RobotData {
  timestamp: string;
}

export interface HistoricalPlantData {
  A: PlantData;
  B: PlantData;
  timestamp: string;
}

// Service class for Firebase Realtime Database
export class FirebaseRealtimeService {
  private static instance: FirebaseRealtimeService;
  
  static getInstance(): FirebaseRealtimeService {
    if (!FirebaseRealtimeService.instance) {
      FirebaseRealtimeService.instance = new FirebaseRealtimeService();
    }
    return FirebaseRealtimeService.instance;
  }

  // Subscribe to real-time data
  subscribeToRobotData(callback: (data: RobotData | null) => void): () => void {
    console.log('🔌 Attempting to subscribe to robot data...');
    
    if (!database) {
      console.warn('❌ Database not initialized, providing mock data');
      // Provide mock data for development
      setTimeout(() => {
        const mockData = {
          kelembaban: 65.5,
          suhu: 28.3,
          jarak: 15,
          debu: 25,
          gas: 0.5,
          terakhir_update: formatDateConsistent(new Date()),
          aqi_lokal: "Baik"
        };
        console.log('📊 Mock robot data provided:', mockData);
        callback(mockData);
      }, 1000);
      return () => {};
    }

    const robotRef = ref(database, 'robot');
    console.log('📡 Subscribing to Firebase path: /robot');
    
    const unsubscribe = onValue(robotRef, (snapshot) => {
      console.log('📥 Robot data snapshot received');
      const data = snapshot.val();
      
      if (data) {
        console.log('✅ Robot data received from Firebase:', data);
        // Validate data structure
        if (typeof data.suhu !== 'undefined' && typeof data.kelembaban !== 'undefined') {
          callback(data);
        } else {
          console.warn('⚠️ Invalid robot data structure:', data);
          callback(null);
        }
      } else {
        console.warn('⚠️ No robot data available in Firebase');
        callback(null);
      }
    }, (error) => {
      console.error('❌ Error subscribing to robot data:', error);
      console.error('Firebase error details:', {
        code: error.code,
        message: error.message
      });
      
      // Don't provide mock data on error - let the caller handle it
      callback(null);
    });

    return () => {
      console.log('🔌 Unsubscribing from robot data');
      off(robotRef, 'value', unsubscribe);
    };
  }

  subscribeToTamanData(callback: (data: TamanData | null) => void): () => void {
    console.log('🔌 Attempting to subscribe to taman data...');
    
    if (!database) {
      console.warn('❌ Database not initialized, providing mock taman data');
      // Provide mock data for development
      setTimeout(() => {
        const mockData = {
          A: {
            kelembaban: 75,
            kondisi: "Baik",
            terakhir_siram: formatDateConsistent(new Date(Date.now() - 2 * 60 * 60 * 1000)),
            terakhir_update: formatDateConsistent(new Date())
          },
          B: {
            kelembaban: 68,
            kondisi: "Baik",
            terakhir_update: formatDateConsistent(new Date())
          }
        };
        console.log('🌱 Mock taman data provided:', mockData);
        callback(mockData);
      }, 1000);
      return () => {};
    }

    const tamanRef = ref(database, 'taman');
    console.log('📡 Subscribing to Firebase path: /taman');
    
    const unsubscribe = onValue(tamanRef, (snapshot) => {
      console.log('📥 Taman data snapshot received');
      const data = snapshot.val();
      
      if (data) {
        console.log('✅ Taman data received from Firebase:', data);
        // Validate data structure
        if (data.A || data.B) {
          callback(data);
        } else {
          console.warn('⚠️ Invalid taman data structure:', data);
          callback(null);
        }
      } else {
        console.warn('⚠️ No taman data available in Firebase');
        callback(null);
      }
    }, (error) => {
      console.error('❌ Error subscribing to taman data:', error);
      console.error('Firebase error details:', {
        code: error.code,
        message: error.message
      });
      
      // Don't provide mock data on error - let the caller handle it
      callback(null);
    });

    return () => {
      console.log('🔌 Unsubscribing from taman data');
      off(tamanRef, 'value', unsubscribe);
    };
  }

  subscribeToAllData(callback: (data: DatabaseSnapshot | null) => void): () => void {
    if (!database) {
      console.warn('Database not initialized, providing mock all data');
      return () => {};
    }

    const rootRef = ref(database, '/');
    
    const unsubscribe = onValue(rootRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    }, (error) => {
      console.error('Error subscribing to all data:', error);
      callback(null);
    });

    return () => off(rootRef, 'value', unsubscribe);
  }

  // Get historical data (from history node if exists)
  async getHistoricalRobotData(limit = 50): Promise<HistoricalRobotData[]> {
    if (!database) {
      console.warn('Database not initialized, providing mock historical data');
      // Generate mock historical data
      const mockData: HistoricalRobotData[] = [];
      const now = new Date();
      
      for (let i = 0; i < limit; i++) {
        const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000); // Every 30 minutes
        mockData.push({
          kelembaban: 60 + Math.random() * 20,
          suhu: 25 + Math.random() * 10,
          jarak: Math.random() * 30,
          debu: Math.random() * 50,
          gas: Math.random() * 2,
          aqi_lokal: 30 + Math.random() * 40,
          terakhir_update: formatDateConsistent(timestamp),
          timestamp: timestamp.toISOString()
        });
      }
      
      return mockData;
    }

    try {
      const historyRef = ref(database, 'history/robot');
      const snapshot = await get(historyRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const historyArray = Object.keys(data).map(key => ({
          ...data[key],
          timestamp: key
        }));
        
        return historyArray
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, limit);
      }
      
      return [];
    } catch (error) {
      console.error('Error getting historical robot data:', error);
      return [];
    }
  }

  async getHistoricalPlantData(limit = 50): Promise<HistoricalPlantData[]> {
    if (!database) {
      console.warn('Database not initialized, providing mock plant historical data');
      // Generate mock historical plant data
      const mockData: HistoricalPlantData[] = [];
      const now = new Date();
      
      for (let i = 0; i < limit; i++) {
        const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000); // Every 30 minutes
        const moistureA = 50 + Math.random() * 40;
        const moistureB = 50 + Math.random() * 40;
        
        mockData.push({
          A: {
            kelembaban: moistureA,
            kondisi: moistureA > 60 ? "Baik" : moistureA > 30 ? "Sedang" : "Buruk",
            terakhir_update: formatDateConsistent(timestamp)
          },
          B: {
            kelembaban: moistureB,
            kondisi: moistureB > 60 ? "Baik" : moistureB > 30 ? "Sedang" : "Buruk",
            terakhir_update: formatDateConsistent(timestamp)
          },
          timestamp: formatDateConsistent(timestamp)
        });
      }
      
      return mockData;
    }

    try {
      const historyRef = ref(database, 'history/taman');
      const snapshot = await get(historyRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const historyArray = Object.keys(data).map(key => ({
          ...data[key],
          timestamp: key
        }));
        
        return historyArray
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, limit);
      }
      
      return [];
    } catch (error) {
      console.error('Error getting historical plant data:', error);
      return [];
    }
  }

  // Save historical data (optional - for logging purposes)
  async saveHistoricalRobotData(data: RobotData): Promise<void> {
    try {
      const historyRef = ref(database, 'history/robot');
      const timestamp = new Date().toISOString();
      await set(ref(database, `history/robot/${timestamp}`), data);
    } catch (error) {
      console.error('Error saving historical robot data:', error);
    }
  }

  async saveHistoricalPlantData(data: TamanData): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      await set(ref(database, `history/taman/${timestamp}`), data);
    } catch (error) {
      console.error('Error saving historical plant data:', error);
    }
  }

  // Get current data (one-time read)
  async getCurrentRobotData(): Promise<RobotData | null> {
    try {
      const robotRef = ref(database, 'robot');
      const snapshot = await get(robotRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error getting current robot data:', error);
      return null;
    }
  }

  async getCurrentTamanData(): Promise<TamanData | null> {
    try {
      const tamanRef = ref(database, 'taman');
      const snapshot = await get(tamanRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error getting current taman data:', error);
      return null;
    }
  }

  // Update data (for admin controls)
  async updateRobotData(data: Partial<RobotData>): Promise<void> {
    try {
      const robotRef = ref(database, 'robot');
      await set(robotRef, {
        ...await this.getCurrentRobotData(),
        ...data,
        terakhir_update: formatDateConsistent(new Date())
      });
    } catch (error) {
      console.error('Error updating robot data:', error);
      throw error;
    }
  }

  async updatePlantData(plantId: 'A' | 'B', data: Partial<PlantData>): Promise<void> {
    try {
      const plantRef = ref(database, `taman/${plantId}`);
      const currentData = await this.getCurrentTamanData();
      const currentPlantData = currentData?.[plantId] || {};
      
      await set(plantRef, {
        ...currentPlantData,
        ...data,
        terakhir_update: formatDateConsistent(new Date())
      });
    } catch (error) {
      console.error('Error updating plant data:', error);
      throw error;
    }
  }

  // Utility functions
  parseDate(dateInput: string | number | undefined | null): Date {
    // Handle null or undefined values
    if (dateInput === null || dateInput === undefined) {
      console.warn('Null or undefined date provided to parseDate:', dateInput);
      return new Date(); // Return current date as fallback
    }

    try {
      // Handle numeric input (timestamp in seconds or milliseconds)
      if (typeof dateInput === 'number') {
        // If the number is small (like 86), it might be seconds since some epoch
        if (dateInput < 1000000) {
          // Treat as seconds ago from now
          const now = new Date();
          const date = new Date(now.getTime() - (dateInput * 1000));
          return date;
        } else if (dateInput < 10000000000) {
          // Treat as Unix timestamp in seconds
          return new Date(dateInput * 1000);
        } else {
          // Treat as Unix timestamp in milliseconds
          return new Date(dateInput);
        }
      }

      // Handle string input - use the new utility function
      if (typeof dateInput === 'string') {
        return parseDateString(dateInput);
      }

      console.warn('Invalid date input type provided to parseDate:', typeof dateInput, dateInput);
      return new Date(); // Return current date as fallback
    } catch (error) {
      console.error('Error parsing date input:', dateInput, error);
      return new Date(); // Return current date as fallback
    }
  }

  formatDate(date: Date | undefined | null): string {
    return formatDateConsistent(date);
  }

  // Enhanced AQI calculation that considers both PM2.5 (dust) and gas levels with temperature/humidity factors
  calculateAQI(pm25: number, gas: number, temp?: number, humidity?: number): number {
    try {
      // Base AQI calculation using PM2.5 as primary factor
      let baseAQI = 0;
      
      // PM2.5 AQI calculation (primary factor)
      if (pm25 <= 12.0) {
        baseAQI = Math.round((pm25 / 12.0) * 50);
      } else if (pm25 <= 35.5) {
        baseAQI = Math.round(51 + ((pm25 - 12.1) / (35.5 - 12.1)) * 49);
      } else if (pm25 <= 55.4) {
        baseAQI = Math.round(101 + ((pm25 - 35.5) / (55.4 - 35.5)) * 49);
      } else if (pm25 <= 150.4) {
        baseAQI = Math.round(151 + ((pm25 - 55.5) / (150.4 - 55.5)) * 49);
      } else if (pm25 <= 250.4) {
        baseAQI = Math.round(201 + ((pm25 - 150.5) / (250.4 - 150.5)) * 99);
      } else {
        baseAQI = Math.round(301 + ((pm25 - 250.5) / (350.4 - 250.5)) * 99);
      }

      // Gas level adjustment (secondary factor)
      let gasAdjustment = 0;
      if (gas > 1.0) {
        gasAdjustment = Math.min(gas * 10, 50); // Cap gas adjustment at 50 points
      }

      // Environmental factors adjustment
      let environmentalAdjustment = 0;
      if (temp !== undefined && humidity !== undefined) {
        // High temperature and low humidity can worsen air quality perception
        if (temp > 30 && humidity < 40) {
          environmentalAdjustment += 5;
        }
        // Very high humidity can also affect air quality
        if (humidity > 80) {
          environmentalAdjustment += 3;
        }
      }

      const finalAQI = Math.min(baseAQI + gasAdjustment + environmentalAdjustment, 500); // Cap at 500
      return Math.round(finalAQI);
    } catch (error) {
      console.error('Error calculating AQI:', error);
      return 50; // Return safe default value
    }
  }

  getAQIStatus(aqi: number): string {
    if (aqi <= 50) return 'Baik';
    if (aqi <= 100) return 'Sedang';
    if (aqi <= 150) return 'Tidak Sehat untuk Kelompok Sensitif';
    if (aqi <= 200) return 'Tidak Sehat';
    if (aqi <= 300) return 'Sangat Tidak Sehat';
    return 'Berbahaya';
  }

  getAQIColor(aqi: number): string {
    if (aqi <= 50) return '#22c55e'; // Green
    if (aqi <= 100) return '#eab308'; // Yellow
    if (aqi <= 150) return '#f97316'; // Orange
    if (aqi <= 200) return '#ef4444'; // Red
    if (aqi <= 300) return '#8b5cf6'; // Purple
    return '#7f1d1d'; // Maroon
  }
}

// Export the singleton instance
export const firebaseService = FirebaseRealtimeService.getInstance();

// Test database connection
export const testDatabaseConnection = async (): Promise<{success: boolean, message: string, data?: any}> => {
  try {
    if (!database) {
      return {
        success: false,
        message: 'Database not initialized. Check Firebase configuration.'
      };
    }

    console.log('🔍 Testing database connection...');
    
    // Test reading from root
    const rootRef = ref(database, '/');
    const snapshot = await get(rootRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('✅ Database connection successful. Data structure:', Object.keys(data));
      
      // Check for expected structure
      const hasRobot = !!data.robot;
      const hasTaman = !!data.taman;
      
      let message = 'Database connected successfully. ';
      if (hasRobot && hasTaman) {
        message += 'Both robot and taman data found.';
      } else if (hasRobot && !hasTaman) {
        message += 'Robot data found, taman data missing.';
      } else if (!hasRobot && hasTaman) {
        message += 'Taman data found, robot data missing.';
      } else {
        message += 'No robot or taman data found. Check database structure.';
      }
      
      return {
        success: true,
        message,
        data: {
          hasRobot,
          hasTaman,
          robotData: data.robot || null,
          tamanData: data.taman || null,
          allKeys: Object.keys(data)
        }
      };
    } else {
      return {
        success: false,
        message: 'Database is empty. Add data to /robot and /taman paths.'
      };
    }
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return {
      success: false,
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Export database reference for direct use if needed
export { database };