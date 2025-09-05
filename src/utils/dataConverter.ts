import { Timestamp } from 'firebase/firestore';
import { RobotStatus as FirebaseRobotStatus, StationStatus as FirebaseStationStatus, AirReading as FirebaseAirReading, PlantReading as FirebasePlantReading } from './useFirebaseData';
import { Robot, Station, AirReading, PlantReading } from './LiveMap';

/**
 * Fungsi untuk mengonversi data status robot dari format Firebase ke format frontend.
 * @param firebaseRobot Data robot dari Firestore.
 * @returns Objek Robot yang siap digunakan oleh komponen.
 */
export const convertFirebaseRobot = (firebaseRobot: FirebaseRobotStatus): Robot => {
  return {
    id: firebaseRobot.robot_id,
    robot_id: firebaseRobot.robot_id,
    battery: firebaseRobot.battery,
    city_loc: firebaseRobot.city_loc,
    last_seen: firebaseRobot.last_seen instanceof Timestamp ? firebaseRobot.last_seen.toDate() : new Date(),
    location: firebaseRobot.location,
    signal_strength: firebaseRobot.signal_strength,
    fan_status: firebaseRobot.fan_status,
  };
};

/**
 * Fungsi untuk mengonversi data status stasiun dari format Firebase ke format frontend.
 * @param firebaseStation Data stasiun dari Firestore.
 * @returns Objek Station yang siap digunakan oleh komponen.
 */
export const convertFirebaseStation = (firebaseStation: FirebaseStationStatus): Station => {
  return {
    id: firebaseStation.station_id,
    station_id: firebaseStation.station_id,
    battery: firebaseStation.battery,
    city_loc: firebaseStation.city_loc,
    last_seen: firebaseStation.last_seen instanceof Timestamp ? firebaseStation.last_seen.toDate() : new Date(),
    location: firebaseStation.location,
    signal_strength: firebaseStation.signal_strength,
    watering_status: firebaseStation.watering_status,
    last_plant_watering: firebaseStation.last_plant_watering,
  };
};

/**
 * Fungsi untuk mengonversi data bacaan sensor udara dari format Firebase ke format frontend.
 * @param firebaseReading Data sensor udara dari Firestore.
 * @returns Objek AirReading yang siap digunakan oleh komponen.
 */
export const convertFirebaseAirReading = (firebaseReading: FirebaseAirReading): AirReading => {
  return {
    robot_id: firebaseReading.robot_id,
    aq_number: firebaseReading.aq_number,
    aq_status: firebaseReading.aq_status,
    distance: firebaseReading.distance,
    dust_pm25: firebaseReading.dust_pm25,
    gas_ppm: firebaseReading.gas_ppm,
    humidity: firebaseReading.humidity,
    temperature: firebaseReading.temperature,
    timestamp: firebaseReading.timestamp instanceof Timestamp ? firebaseReading.timestamp.toDate() : new Date(),
  };
};

/**
 * Fungsi untuk mengonversi data bacaan sensor tanaman dari format Firebase ke format frontend.
 * @param firebaseReading Data sensor tanaman dari Firestore.
 * @returns Objek PlantReading yang siap digunakan oleh komponen.
 */
export const convertFirebasePlantReading = (firebaseReading: FirebasePlantReading): PlantReading => {
  return {
    station_id: firebaseReading.station_id,
    moisture_percent: firebaseReading.moisture_percent,
    condition: firebaseReading.condition,
    last_update: firebaseReading.last_update instanceof Timestamp ? firebaseReading.last_update.toDate() : new Date(),
    timestamp: firebaseReading.timestamp instanceof Timestamp ? firebaseReading.timestamp.toDate() : new Date(),
  };
};

// Fungsi pembantu untuk menentukan nama stasiun
export const generateStationName = (stationId: string): string => {
  const stationMapping: { [key: string]: string } = {
    'grenova-station-001': 'Stasiun Taman Bungkul',
    'grenova-station-002': 'Stasiun Alun-Alun',
    'grenova-station-003': 'Stasiun Taman Prestasi',
  };
  return stationMapping[stationId] || `Stasiun ${stationId}`;
};

// Fungsi pembantu untuk mengonversi kekuatan sinyal
export const signalStrengthToPercentage = (dbm: number): number => {
  const minDbm = -90;
  const maxDbm = -30;
  const clampedDbm = Math.max(minDbm, Math.min(maxDbm, dbm));
  return Math.round(((clampedDbm - minDbm) / (maxDbm - minDbm)) * 100);
};
