import { useState, useEffect } from 'react';
import { 
  firebaseService, 
  RobotData, 
  TamanData, 
  HistoricalRobotData, 
  HistoricalPlantData,
  DatabaseSnapshot 
} from '../services/firebase';

// Interfaces for processed data
export interface ProcessedRobotData extends RobotData {
  isOnline: boolean;
  aqi_status: string;
  aqi_color: string;
  lastUpdateDate: Date;
  calculatedAQI: number; // Calculated numerical AQI
}

export interface ProcessedPlantData {
  id: 'A' | 'B';
  name: string;
  kelembaban: number;
  kondisi: string;
  terakhir_siram?: string;
  terakhir_update: string;
  lastUpdateDate: Date;
  isHealthy: boolean;
}

export interface ProcessedTamanData {
  plants: ProcessedPlantData[];
  lastUpdate: string;
  totalPlants: number;
  healthyPlants: number;
}

export const useFirebaseData = () => {
  const [robotData, setRobotData] = useState<ProcessedRobotData | null>(null);
  const [tamanData, setTamanData] = useState<ProcessedTamanData | null>(null);
  const [historicalRobotData, setHistoricalRobotData] = useState<HistoricalRobotData[]>([]);
  const [historicalPlantData, setHistoricalPlantData] = useState<HistoricalPlantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Process robot data
  const processRobotData = (data: RobotData): ProcessedRobotData => {
    try {
      const lastUpdateDate = firebaseService.parseDate(data.terakhir_update);
      const now = new Date();
      const timeDiff = now.getTime() - lastUpdateDate.getTime();
      const isOnline = timeDiff < 5 * 60 * 1000; // Online if updated within 5 minutes

      // Calculate numerical AQI from dust (PM2.5) and gas sensor data
      const calculatedAQI = firebaseService.calculateAQI(data.debu || 0, data.gas || 0);
      
      // Use aqi_lokal from database if it's a string status, otherwise use calculated status
      const aqiStatusFromDB = typeof data.aqi_lokal === 'string' ? data.aqi_lokal : null;
      
      return {
        ...data,
        // Ensure all numeric values have fallbacks
        kelembaban: data.kelembaban || 0,
        suhu: data.suhu || 0,
        jarak: data.jarak || 0,
        debu: data.debu || 0,
        gas: data.gas || 0,
        terakhir_update: typeof data.terakhir_update === 'string' 
          ? data.terakhir_update 
          : firebaseService.formatDate(lastUpdateDate),
        aqi_lokal: aqiStatusFromDB || calculatedAQI, // Store status if string, number if calculated
        calculatedAQI, // Always store the calculated numerical AQI
        isOnline,
        aqi_status: aqiStatusFromDB || firebaseService.getAQIStatus(calculatedAQI),
        aqi_color: firebaseService.getAQIColor(calculatedAQI),
        lastUpdateDate
      };
    } catch (error) {
      console.error('Error processing robot data:', error, 'Data received:', data);
      // Return safe fallback data
      const now = new Date();
      return {
        kelembaban: 0,
        suhu: 0,
        jarak: 0,
        debu: 0,
        gas: 0,
        terakhir_update: firebaseService.formatDate(now),
        aqi_lokal: 0,
        calculatedAQI: 0,
        isOnline: false,
        aqi_status: 'Tidak Diketahui',
        aqi_color: '#6b7280',
        lastUpdateDate: now
      };
    }
  };

  // Process taman data
  const processTamanData = (data: TamanData): ProcessedTamanData => {
    const plants: ProcessedPlantData[] = [];
    
    try {
      // Process plant A
      if (data.A) {
        const lastUpdateDateA = firebaseService.parseDate(data.A.terakhir_update);
        plants.push({
          id: 'A',
          name: 'Tanaman A',
          kelembaban: data.A.kelembaban || 0,
          kondisi: data.A.kondisi || 'Tidak Diketahui',
          terakhir_siram: typeof data.A.terakhir_siram === 'string' 
            ? data.A.terakhir_siram 
            : (data.A.terakhir_siram ? firebaseService.formatDate(firebaseService.parseDate(data.A.terakhir_siram)) : undefined),
          terakhir_update: typeof data.A.terakhir_update === 'string' 
            ? data.A.terakhir_update 
            : firebaseService.formatDate(lastUpdateDateA),
          lastUpdateDate: lastUpdateDateA,
          isHealthy: (data.A.kondisi || '').toLowerCase() === 'baik'
        });
      }

      // Process plant B
      if (data.B) {
        const lastUpdateDateB = firebaseService.parseDate(data.B.terakhir_update);
        plants.push({
          id: 'B',
          name: 'Tanaman B',
          kelembaban: data.B.kelembaban || 0,
          kondisi: data.B.kondisi || 'Tidak Diketahui',
          terakhir_siram: typeof data.B.terakhir_siram === 'string' 
            ? data.B.terakhir_siram 
            : (data.B.terakhir_siram ? firebaseService.formatDate(firebaseService.parseDate(data.B.terakhir_siram)) : undefined),
          terakhir_update: typeof data.B.terakhir_update === 'string' 
            ? data.B.terakhir_update 
            : firebaseService.formatDate(lastUpdateDateB),
          lastUpdateDate: lastUpdateDateB,
          isHealthy: (data.B.kondisi || '').toLowerCase() === 'baik'
        });
      }

      const healthyPlants = plants.filter(plant => plant.isHealthy).length;
      const latestUpdate = plants.reduce((latest, plant) => {
        return plant.lastUpdateDate > latest ? plant.lastUpdateDate : latest;
      }, new Date(0));

      return {
        plants,
        lastUpdate: firebaseService.formatDate(latestUpdate),
        totalPlants: plants.length,
        healthyPlants
      };
    } catch (error) {
      console.error('Error processing taman data:', error, 'Data received:', data);
      // Return safe fallback data
      return {
        plants: [],
        lastUpdate: firebaseService.formatDate(new Date()),
        totalPlants: 0,
        healthyPlants: 0
      };
    }
  };

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    try {
      console.log('🚀 Connecting to Firebase Realtime Database...');
      setError(null); // Clear any previous errors

      // Subscribe to robot data
      const unsubscribeRobot = firebaseService.subscribeToRobotData((data) => {
        try {
          if (data) {
            const processedData = processRobotData(data);
            setRobotData(processedData);
            console.log('✅ Robot data processed and updated:', processedData);
            setError(null); // Clear errors on successful data
          } else {
            console.warn('⚠️ No robot data received, using fallback');
            // Provide fallback data if none exists yet
            if (!robotData) {
              const fallbackData = processRobotData({
                kelembaban: 65.5,
                suhu: 28.3,
                jarak: 15,
                debu: 25,
                gas: 0.5,
                terakhir_update: new Date().toLocaleString('id-ID', {
                  day: '2-digit',
                  month: '2-digit', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                }).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$1-$2-$3'),
                aqi_lokal: "Baik"
              });
              setRobotData(fallbackData);
              console.log('🔄 Using fallback robot data:', fallbackData);
            }
          }
        } catch (processError) {
          console.error('❌ Error processing robot data:', processError);
          setError('Error processing robot data');
        }
      });
      unsubscribers.push(unsubscribeRobot);

      // Subscribe to taman data
      const unsubscribeTaman = firebaseService.subscribeToTamanData((data) => {
        try {
          if (data) {
            const processedData = processTamanData(data);
            setTamanData(processedData);
            console.log('✅ Taman data processed and updated:', processedData);
            setError(null); // Clear errors on successful data
          } else {
            console.warn('⚠️ No taman data received, using fallback');
            // Provide fallback data if none exists yet
            if (!tamanData) {
              const fallbackData = processTamanData({
                A: {
                  kelembaban: 75,
                  kondisi: "Baik",
                  terakhir_siram: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$1-$2-$3'),
                  terakhir_update: new Date().toLocaleString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$1-$2-$3')
                },
                B: {
                  kelembaban: 68,
                  kondisi: "Baik",
                  terakhir_update: new Date().toLocaleString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$1-$2-$3')
                }
              });
              setTamanData(fallbackData);
              console.log('🔄 Using fallback taman data:', fallbackData);
            }
          }
        } catch (processError) {
          console.error('❌ Error processing taman data:', processError);
          setError('Error processing plant data');
        }
      });
      unsubscribers.push(unsubscribeTaman);

      // Load historical data
      const loadHistoricalData = async () => {
        try {
          console.log('📚 Loading historical data...');
          const [robotHistory, plantHistory] = await Promise.all([
            firebaseService.getHistoricalRobotData(100),
            firebaseService.getHistoricalPlantData(100)
          ]);
          
          setHistoricalRobotData(robotHistory);
          setHistoricalPlantData(plantHistory);
          console.log('✅ Historical data loaded:', { robotHistory: robotHistory.length, plantHistory: plantHistory.length });
        } catch (error) {
          console.error('❌ Error loading historical data:', error);
          // Don't set this as a critical error since we can still show current data
        }
      };

      loadHistoricalData();
      
      // Set loading to false after initial connection attempt
      setTimeout(() => {
        setLoading(false);
        setLastUpdate(new Date());
        
        // Log final status with detailed information
        console.log('📊 Final connection status:');
        console.log('  - Robot data:', robotData ? '✅ Available' : '❌ Not available');
        console.log('  - Taman data:', tamanData ? '✅ Available' : '❌ Not available');
        console.log('  - Error state:', error || 'None');
        
        if (!error && (robotData || tamanData)) {
          console.log('✅ Firebase Realtime Database connected successfully');
        } else {
          console.log('ℹ️ Firebase connection issue - Running in demo mode with fallback data');
          console.log('📋 To connect to real Firebase, configure firebase-config.js with your project settings');
          console.log('🔧 Make sure your Firebase Realtime Database has the following structure:');
          console.log('   /robot: {aqi_lokal, debu, gas, jarak, kelembaban, suhu, terakhir_update}');
          console.log('   /taman: {A: {...}, B: {...}}');
        }
      }, 3000); // Increased timeout for better data loading

      console.log('🔄 Firebase Realtime Database connection initiated');

    } catch (error) {
      console.error('❌ Firebase connection setup failed:', error);
      setError('Failed to initialize Firebase connection');
      setLoading(false);
    }

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up Firebase subscriptions...');
      unsubscribers.forEach(unsubscribe => {
        try {
          unsubscribe();
        } catch (error) {
          console.warn('⚠️ Error during cleanup:', error);
        }
      });
    };
  }, []);

  // Refresh data manually
  const refreshData = async () => {
    try {
      setLoading(true);
      
      // First test the database connection
      const { testDatabaseConnection } = await import('../services/firebase');
      const connectionTest = await testDatabaseConnection();
      
      console.log('🔍 Database connection test result:', connectionTest);
      
      if (!connectionTest.success) {
        console.warn('⚠️ Database connection failed:', connectionTest.message);
        setError(connectionTest.message);
        return;
      }
      
      // If connection successful, try to load historical data
      const [robotHistory, plantHistory] = await Promise.all([
        firebaseService.getHistoricalRobotData(100),
        firebaseService.getHistoricalPlantData(100)
      ]);
      
      setHistoricalRobotData(robotHistory);
      setHistoricalPlantData(plantHistory);
      setLastUpdate(new Date());
      setError(null);
      
      console.log('✅ Data refresh completed successfully');
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  // Get chart data for robot sensors
  const getRobotChartData = (limit = 20) => {
    if (!historicalRobotData.length && robotData) {
      // If no historical data, use current data
      return [{
        time: new Date().toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        suhu: robotData.suhu,
        kelembaban: robotData.kelembaban,
        debu: robotData.debu,
        gas: robotData.gas,
        aqi: robotData.aqi_lokal,
        jarak: robotData.jarak
      }];
    }

    return historicalRobotData.slice(-limit).map(data => ({
      time: firebaseService.parseDate(data.terakhir_update).toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      suhu: data.suhu,
      kelembaban: data.kelembaban,
      debu: data.debu,
      gas: data.gas,
      aqi: typeof data.aqi_lokal === 'number' ? data.aqi_lokal : firebaseService.calculateAQI(data.debu || 0, data.gas || 0),
      jarak: data.jarak,
      timestamp: data.terakhir_update
    }));
  };

  // Get chart data for plant moisture
  const getPlantChartData = (limit = 20) => {
    if (!historicalPlantData.length && tamanData) {
      // If no historical data, use current data
      const currentTime = new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      return [{
        time: currentTime,
        A_kelembaban: tamanData.plants.find(p => p.id === 'A')?.kelembaban || 0,
        B_kelembaban: tamanData.plants.find(p => p.id === 'B')?.kelembaban || 0
      }];
    }

    return historicalPlantData.slice(-limit).map(data => ({
      time: firebaseService.parseDate(data.timestamp).toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      A_kelembaban: data.A?.kelembaban || 0,
      B_kelembaban: data.B?.kelembaban || 0,
      timestamp: data.timestamp
    }));
  };

  // Format date for display
  const formatDateTime = (dateInput: string | number | undefined | null) => {
    try {
      if (dateInput === null || dateInput === undefined) {
        return 'Tidak diketahui';
      }
      
      const date = firebaseService.parseDate(dateInput);
      
      // Format to dd-mm-yyyy hh:mm:ss
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.warn('Error formatting date:', dateInput, error);
      return typeof dateInput === 'string' ? dateInput : 'Tidak diketahui';
    }
  };

  return { 
    // Current data
    robotData,
    tamanData,
    
    // Historical data
    historicalRobotData,
    historicalPlantData,
    
    // Chart data functions
    getRobotChartData,
    getPlantChartData,
    
    // State
    loading, 
    error,
    lastUpdate,
    
    // Actions
    refreshData,
    formatDateTime,
    
    // Backward compatibility (empty arrays for components that expect these)
    robots: [],
    stations: [],
    airReadings: [],
    plantReadings: []
  };
};