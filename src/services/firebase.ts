import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, onSnapshot, updateDoc, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';

// Ganti placeholder dengan konfigurasi Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyCjGcz4kBFwmFlv_1qeSHMp93EqhNt9fvM",
  authDomain: "greenova-app.firebaseapp.com",
  projectId: "greenova-app",
  storageBucket: "greenova-app.firebasestorage.app",
  messagingSenderId: "883705279570",
  appId: "1:883705279570:web:78610b1820a2688fd91b8b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const COLLECTIONS = {
  STATION_STATUS: 'stationStatus',
  PLANT_READINGS: 'plantReadings',
  ROBOT_STATUS: 'robotStatus',
  AIR_READINGS: 'airReadings'
} as const;

// TypeScript interfaces matching Firebase structure
export interface FirebaseStation {
  station_id: string;
  battery: number;
  city_loc: string;
  last_plant_watering: string;
  last_seen: Timestamp;
  watering_status: boolean;
  signal_strength: number;
  location: {latitude: number, longitude: number};
}

export interface FirebasePlantReading {
  station_id: string;
  timestamp: Timestamp;
  [plantKey: string]: {
    condition: 'Baik' | 'Sedang' | 'Buruk';
    last_update: Timestamp;
    moisture: number;
  } | string | Timestamp;
}

export interface FirebaseRobotStatus {
  robot_id: string;
  battery: number;
  city_loc: string;
  last_seen: Timestamp;
  signal_strength: number;
  location: {latitude: number, longitude: number};
  fan_status: boolean;
}

export interface FirebaseAirReading {
  robot_id: string;
  timestamp: Timestamp;
  dust_pm25: number;
  gas_ppm: number;
  temperature: number;
  humidity: number;
  distance: number;
  aq_status: string;
}

// Service functions
export class StationService {
  static subscribeToStations(callback: (stations: FirebaseStation[]) => void) {
    const stationsRef = collection(db, COLLECTIONS.STATION_STATUS);
    return onSnapshot(stationsRef, (snapshot) => {
      const stations: FirebaseStation[] = [];
      snapshot.forEach((doc) => {
        stations.push({ id: doc.id, ...doc.data() } as FirebaseStation);
      });
      callback(stations);
    });
  }

  static subscribeToStation(stationId: string, callback: (station: FirebaseStation | null) => void) {
    const stationRef = doc(db, COLLECTIONS.STATION_STATUS, stationId);
    return onSnapshot(stationRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data() as FirebaseStation);
      } else {
        callback(null);
      }
    });
  }
}

export class PlantService {
  static subscribeToPlantReadings(stationId: string, callback: (readings: FirebasePlantReading[]) => void) {
    const plantsRef = collection(db, COLLECTIONS.PLANT_READINGS);
    const q = query(
      plantsRef,
      where('station_id', '==', stationId),
      orderBy('timestamp', 'desc'),
      limit(100)
    );
    return onSnapshot(q, (snapshot) => {
      const readings: FirebasePlantReading[] = [];
      snapshot.forEach((doc) => {
        readings.push({ id: doc.id, ...doc.data() } as FirebasePlantReading);
      });
      callback(readings);
    });
  }

  static subscribeToAllPlantReadings(callback: (readings: FirebasePlantReading[]) => void) {
    const plantsRef = collection(db, COLLECTIONS.PLANT_READINGS);
    const q = query(
      plantsRef,
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    return onSnapshot(q, (snapshot) => {
      const readings: FirebasePlantReading[] = [];
      snapshot.forEach((doc) => {
        readings.push({ id: doc.id, ...doc.data() } as FirebasePlantReading);
      });
      callback(readings);
    });
  }
}

export class RobotService {
  static subscribeToRobots(callback: (robots: FirebaseRobotStatus[]) => void) {
    const robotsRef = collection(db, COLLECTIONS.ROBOT_STATUS);
    return onSnapshot(robotsRef, (snapshot) => {
      const robots: FirebaseRobotStatus[] = [];
      snapshot.forEach((doc) => {
        robots.push({ id: doc.id, ...doc.data() } as FirebaseRobotStatus);
      });
      callback(robots);
    });
  }

  static subscribeToRobot(robotId: string, callback: (robot: FirebaseRobotStatus | null) => void) {
    const robotRef = doc(db, COLLECTIONS.ROBOT_STATUS, robotId);
    return onSnapshot(robotRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data() as FirebaseRobotStatus);
      } else {
        callback(null);
      }
    });
  }
}

export class AirService {
  static subscribeToAirReadings(robotId: string, callback: (readings: FirebaseAirReading[]) => void) {
    const airRef = collection(db, COLLECTIONS.AIR_READINGS);
    const q = query(
      airRef,
      where('robot_id', '==', robotId),
      orderBy('timestamp', 'desc'),
      limit(100)
    );
    return onSnapshot(q, (snapshot) => {
      const readings: FirebaseAirReading[] = [];
      snapshot.forEach((doc) => {
        readings.push({ id: doc.id, ...doc.data() } as FirebaseAirReading);
      });
      callback(readings);
    });
  }

  static subscribeToAllAirReadings(callback: (readings: FirebaseAirReading[]) => void) {
    const airRef = collection(db, COLLECTIONS.AIR_READINGS);
    const q = query(
      airRef,
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    return onSnapshot(q, (snapshot) => {
      const readings: FirebaseAirReading[] = [];
      snapshot.forEach((doc) => {
        readings.push({ id: doc.id, ...doc.data() } as FirebaseAirReading);
      });
      callback(readings);
    });
  }
}
