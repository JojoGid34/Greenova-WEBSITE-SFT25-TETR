// Robot data structure
export interface Robot {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  sensors: {
    temperature: number;
    humidity: number;
    airQuality: number;
    soilMoisture: number;
    lightLevel: number;
  };
  battery: number;
  signal: number;
  lastUpdated: string;
  tasks: {
    id: string;
    name: string;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    progress: number;
  }[];
  maintenanceSchedule?: {
    nextDate: string;
    type: string;
  };
}

// Example robot data
export const ROBOT_DATA: Robot[] = [
  {
    id: "GRN-001",
    name: "Greenova Alpha",
    status: "online",
    location: {
      lat: -6.2088,
      lng: 106.8456,
      address: "Taman Menteng, Jakarta Pusat"
    },
    sensors: {
      temperature: 28.5,
      humidity: 65,
      airQuality: 85,
      soilMoisture: 45,
      lightLevel: 75
    },
    battery: 87,
    signal: 92,
    lastUpdated: "2024-01-15T10:30:00Z",
    tasks: [
      { id: "1", name: "Penyiraman Zona A", status: "completed", progress: 100 },
      { id: "2", name: "Monitoring Kualitas Udara", status: "in-progress", progress: 60 },
      { id: "3", name: "Pemupukan Organik", status: "pending", progress: 0 }
    ],
    maintenanceSchedule: {
      nextDate: "2024-01-20",
      type: "Pembersihan Filter"
    }
  },
  {
    id: "GRN-002",
    name: "Greenova Beta",
    status: "online",
    location: {
      lat: -6.1751,
      lng: 106.8650,
      address: "Taman Suropati, Jakarta Pusat"
    },
    sensors: {
      temperature: 27.8,
      humidity: 70,
      airQuality: 78,
      soilMoisture: 52,
      lightLevel: 82
    },
    battery: 94,
    signal: 88,
    lastUpdated: "2024-01-15T10:28:00Z",
    tasks: [
      { id: "1", name: "Pemantauan Polusi", status: "in-progress", progress: 45 },
      { id: "2", name: "Penyiraman Otomatis", status: "completed", progress: 100 },
      { id: "3", name: "Deteksi Hama", status: "pending", progress: 0 }
    ]
  },
  {
    id: "GRN-003",
    name: "Greenova Gamma",
    status: "maintenance",
    location: {
      lat: -6.2297,
      lng: 106.8260,
      address: "Monas Park, Jakarta Pusat"
    },
    sensors: {
      temperature: 29.2,
      humidity: 62,
      airQuality: 72,
      soilMoisture: 38,
      lightLevel: 68
    },
    battery: 23,
    signal: 76,
    lastUpdated: "2024-01-15T09:45:00Z",
    tasks: [
      { id: "1", name: "Pemeliharaan Sistem", status: "in-progress", progress: 80 },
      { id: "2", name: "Penggantian Sensor", status: "pending", progress: 0 }
    ],
    maintenanceSchedule: {
      nextDate: "2024-01-16",
      type: "Penggantian Baterai"
    }
  },
  {
    id: "GRN-004",
    name: "Greenova Delta",
    status: "offline",
    location: {
      lat: -6.1944,
      lng: 106.8229,
      address: "Bundaran HI, Jakarta Pusat"
    },
    sensors: {
      temperature: 0,
      humidity: 0,
      airQuality: 0,
      soilMoisture: 0,
      lightLevel: 0
    },
    battery: 0,
    signal: 0,
    lastUpdated: "2024-01-14T18:20:00Z",
    tasks: [
      { id: "1", name: "Troubleshooting Koneksi", status: "failed", progress: 0 }
    ]
  },
  {
    id: "GRN-005",
    name: "Greenova Epsilon",
    status: "online",
    location: {
      lat: -6.2615,
      lng: 106.7810,
      address: "Taman Mini Indonesia Indah"
    },
    sensors: {
      temperature: 26.9,
      humidity: 75,
      airQuality: 89,
      soilMoisture: 58,
      lightLevel: 91
    },
    battery: 76,
    signal: 85,
    lastUpdated: "2024-01-15T10:32:00Z",
    tasks: [
      { id: "1", name: "Eksplorasi Area Baru", status: "in-progress", progress: 30 },
      { id: "2", name: "Dokumentasi Flora", status: "completed", progress: 100 }
    ]
  }
];