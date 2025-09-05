import { useState, useEffect } from 'react';
import { 
  RobotService, 
  StationService, 
  AirService, 
  PlantService,
  FirebaseRobotStatus,
  FirebaseStation,
  FirebaseAirReading,
  FirebasePlantReading
} from '../services/firebase';

// Simplified interfaces that match the actual Firebase structure
interface Location {
  latitude: number;
  longitude: number;
}

interface RobotStatus {
  robot_id: string;
  battery: number;
  city_loc: string;
  last_seen: any;
  location: Location;
  signal_strength: number;
  fan_status: boolean;
}

interface StationStatus {
  station_id: string;
  battery: number;
  city_loc: string;
  last_seen: any;
  location: Location;
  signal_strength: number;
  watering_status: boolean;
  last_plant_watering: string;
}

interface AirReading {
  robot_id: string;
  aq_status: string;
  distance: number;
  dust_pm25: number;
  gas_ppm: number;
  humidity: number;
  temperature: number;
  timestamp: any;
}

interface PlantReading {
  station_id: string;
  [plantKey: string]: any;
  timestamp: any;
}

export const useFirebaseData = () => {
  const [robots, setRobots] = useState<RobotStatus[]>([]);
  const [stations, setStations] = useState<StationStatus[]>([]);
  const [airReadings, setAirReadings] = useState<AirReading[]>([]);
  const [plantReadings, setPlantReadings] = useState<PlantReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    try {
      // Subscribe to robots
      const unsubscribeRobots = RobotService.subscribeToRobots((firebaseRobots: FirebaseRobotStatus[]) => {
        const robotData: RobotStatus[] = firebaseRobots.map(robot => ({
          robot_id: robot.robot_id || 'N/A',
          battery: robot.battery ?? 0,
          city_loc: robot.city_loc || 'N/A',
          last_seen: robot.last_seen || null,
          location: robot.location || { latitude: 0, longitude: 0 },
          signal_strength: robot.signal_strength ?? 0,
          fan_status: robot.fan_status ?? false
        }));
        setRobots(robotData);
      });
      unsubscribers.push(unsubscribeRobots);

      // Subscribe to stations
      const unsubscribeStations = StationService.subscribeToStations((firebaseStations: FirebaseStation[]) => {
        const stationData: StationStatus[] = firebaseStations.map(station => ({
          station_id: station.station_id || 'N/A',
          battery: station.battery ?? 0,
          city_loc: station.city_loc || 'N/A',
          last_seen: station.last_seen || null,
          location: station.location || { latitude: 0, longitude: 0 },
          signal_strength: station.signal_strength ?? 0,
          watering_status: station.watering_status ?? false,
          last_plant_watering: station.last_plant_watering || 'N/A'
        }));
        setStations(stationData);
      });
      unsubscribers.push(unsubscribeStations);

      // Subscribe to all air readings
      const unsubscribeAir = AirService.subscribeToAllAirReadings((firebaseAirReadings: FirebaseAirReading[]) => {
        const airData: AirReading[] = firebaseAirReadings.map(reading => ({
          robot_id: reading.robot_id || 'N/A',
          aq_status: reading.aq_status || 'N/A',
          distance: reading.distance ?? 0,
          dust_pm25: reading.dust_pm25 ?? 0,
          gas_ppm: reading.gas_ppm ?? 0,
          humidity: reading.humidity ?? 0,
          temperature: reading.temperature ?? 0,
          timestamp: reading.timestamp || null
        }));
        setAirReadings(airData);
      });
      unsubscribers.push(unsubscribeAir);

      // Subscribe to all plant readings
      const unsubscribePlant = PlantService.subscribeToAllPlantReadings((firebasePlantReadings: FirebasePlantReading[]) => {
        const plantData: PlantReading[] = firebasePlantReadings.map(reading => ({
          station_id: reading.station_id || 'N/A',
          timestamp: reading.timestamp || null,
          ...reading // Spread all other plant data fields
        }));
        setPlantReadings(plantData);
      });
      unsubscribers.push(unsubscribePlant);

      console.log('Successfully connected to Firebase database');
      setLoading(false);

    } catch (error) {
      console.error('Firebase connection failed:', error);
      setError('Failed to connect to Firebase database');
      setLoading(false);
      
      // Set empty arrays instead of mock data
      setRobots([]);
      setStations([]);
      setAirReadings([]);
      setPlantReadings([]);
    }

    // Cleanup function
    return () => {
      unsubscribers.forEach(unsubscribe => {
        try {
          unsubscribe();
        } catch (error) {
          console.warn('Error during cleanup:', error);
        }
      });
    };
  }, []);

  return { robots, stations, airReadings, plantReadings, loading, error };
};