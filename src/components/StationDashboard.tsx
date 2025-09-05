import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import {
  Droplets,
  Activity,
  Thermometer,
  Battery,
  Signal,
  MapPin,
  Settings,
  Play,
  Pause,
  Square,
  RotateCcw,
  Zap,
  Wifi,
  WifiOff,
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Gauge,
  Leaf,
  Beaker,
  Timer
} from 'lucide-react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

import { toast } from "sonner";
import { useFirebaseData } from '../hooks/useFirebaseData';
import { 
  formatValue,
  formatNumber,
  formatPercentage,
  formatTimestamp,
  formatTimeAgo,
  formatSignalStrength,
  formatBatteryLevel,
  getStatusColor
} from '../utils/displayUtils';

interface StationDashboardProps {
  selectedStationId: string;
  onStationSelect: (stationId: string) => void;
}

export function StationDashboard({ selectedStationId, onStationSelect }: StationDashboardProps) {
  const { stations, plantReadings, loading } = useFirebaseData();
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const selectedStation = stations.find(station => station.station_id === selectedStationId);
  const plantHistory = plantReadings.filter(p => p.station_id === selectedStationId);

  useEffect(() => {
    // Memperbarui waktu terakhir update
    if (selectedStation) {
      setLastUpdate(selectedStation.last_seen?.seconds ? new Date(selectedStation.last_seen.seconds * 1000) : new Date());
    }
  }, [selectedStation]);

  if (loading || !selectedStation) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Memuat data stasiun...</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-blue-500';
      case 'inactive':
        return 'text-gray-500';
      case 'maintenance':
        return 'text-yellow-500';
      case 'offline':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Droplets className="h-4 w-4 text-blue-500" />;
      case 'inactive':
        return <Droplets className="h-4 w-4 text-gray-500" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-yellow-500" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPlantConditionColor = (condition: string) => {
    switch (condition) {
      case 'baik':
        return 'bg-green-500';
      case 'sedang':
        return 'bg-yellow-500';
      case 'buruk':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleToggleWatering = async (newStatus: string) => {
    try {
      // Check if Firebase is available
      const isFirebaseAvailable = typeof (globalThis as any).__firebase_config !== 'undefined';
      
      if (isFirebaseAvailable) {
        try {
          const { getFirestore, doc, updateDoc } = await import('firebase/firestore');
          const db = getFirestore();
          const stationDocRef = doc(db, 'stationStatus', selectedStationId);
          await updateDoc(stationDocRef, {
            watering_status: newStatus === 'active'
          });
          toast.success(`Status penyiraman diubah menjadi: ${newStatus}`);
        } catch (e) {
          console.error("Error updating watering status:", e);
          toast.error('Gagal mengubah status penyiraman via Firebase, menggunakan mock update');
          // Mock update for demo
          toast.success(`Status penyiraman diubah menjadi: ${newStatus} (demo mode)`);
        }
      } else {
        // Firebase not available, use mock update
        toast.success(`Status penyiraman diubah menjadi: ${newStatus} (demo mode)`);
      }
    } catch (e) {
      toast.error('Gagal mengubah status penyiraman');
      console.error("Error updating watering status:", e);
    }
  };

  // Mock plant data for demo
  const allPlants = [
    { key: 'plant_A', moisture: 67, condition: 'baik' },
    { key: 'plant_B', moisture: 52, condition: 'sedang' }
  ];

  const healthyPlants = allPlants.filter(plant => plant.condition === 'baik').length;
  const averageMoisture = Math.round(allPlants.reduce((sum, plant) => sum + plant.moisture, 0) / allPlants.length);

  // Data mock untuk chart (karena data historis belum ada di Firestore)
  const moistureHistory = [
    { time: '06:00', moisture: 65, ph: 6.8, temperature: 24.2 },
    { time: '08:00', moisture: 68, ph: 6.7, temperature: 26.1 },
    { time: '10:00', moisture: 72, ph: 6.9, temperature: 28.5 },
    { time: '12:00', moisture: 75, ph: 6.8, temperature: 30.1 },
    { time: '14:00', moisture: 71, ph: 6.6, temperature: 31.2 },
    { time: '16:00', moisture: 68, ph: 6.7, temperature: 29.8 },
    { time: '18:00', moisture: 70, ph: 6.8, temperature: 27.9 },
  ];

  const wateringPerformance = [
    { task: 'Penyiraman Rutin', completed: 98, failed: 2 },
    { task: 'Monitoring pH', completed: 95, failed: 5 },
    { task: 'Sensor Check', completed: 89, failed: 11 },
    { task: 'Refill Tangki', completed: 92, failed: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Dashboard Stasiun</h1>
          <Badge variant="outline">{selectedStation.station_id}</Badge>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Station Selector */}
          <Select value={selectedStationId} onValueChange={onStationSelect}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pilih Stasiun" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((station) => (
                <SelectItem key={station.station_id} value={station.station_id}>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(station.watering_status ? 'active' : 'inactive')}
                    <span>{station.station_id}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Time Range */}
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 Jam</SelectItem>
              <SelectItem value="24h">24 Jam</SelectItem>
              <SelectItem value="7d">7 Hari</SelectItem>
              <SelectItem value="30d">30 Hari</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Station Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Stasiun</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(selectedStation.watering_status ? 'active' : 'inactive')}
              <span className={`text-2xl font-bold capitalize ${getStatusColor(selectedStation.watering_status ? 'active' : 'inactive')}`}>
                {selectedStation.watering_status ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Update: {formatTimeAgo(selectedStation.last_seen)}
            </p>
          </CardContent>
        </Card>

        {/* Water Tank Level */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level Tangki</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <Progress value={75} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Mencukupi
            </p>
          </CardContent>
        </Card>

        {/* Battery Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Baterai</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(selectedStation.battery, 'battery')}`}>
              {formatBatteryLevel(selectedStation.battery)}
            </div>
            <Progress value={selectedStation.battery || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {(selectedStation.battery || 0) > 50 ? 'Baik' : (selectedStation.battery || 0) > 20 ? 'Rendah' : 'Kritis'}
            </p>
          </CardContent>
        </Card>

        {/* Plant Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tanaman Sehat</CardTitle>
            <Leaf className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthyPlants}</div>
            <p className="text-xs text-muted-foreground mt-1">
              dari {allPlants.length} total tanaman
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plants">Plant Monitoring</TabsTrigger>
          <TabsTrigger value="watering">Watering Control</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quick Control</CardTitle>
                <Zap className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Penyiraman Otomatis</span>
                  <Switch
                    checked={selectedStation.watering_status}
                    onCheckedChange={(checked) => handleToggleWatering(checked ? 'active' : 'inactive')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Flow Rate</span>
                  <span className="text-sm font-medium">2.5 L/min</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jadwal Berikutnya</CardTitle>
                <Timer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Durasi: 5 menit
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rata-rata Kelembaban</CardTitle>
                <Gauge className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageMoisture}%</div>
                <Progress value={averageMoisture} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Moisture History Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Kelembaban Tanah</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={moistureHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="moisture"
                      stroke="var(--color-chart-2)"
                      strokeWidth={2}
                      name="Kelembaban (%)"
                    />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="var(--color-chart-1)"
                      strokeWidth={2}
                      name="Suhu (°C)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Location & System Status */}
            <div className="space-y-6">
              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Lokasi Stasiun
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{formatValue(selectedStation.city_loc)}</p>
                    <p className="text-sm text-muted-foreground">
                      Lat: {formatValue(selectedStation.location?.latitude?.toFixed(6))}, Lng: {formatValue(selectedStation.location?.longitude?.toFixed(6))}
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      Lihat di Peta
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Signal Strength</span>
                      <span>{formatPercentage(selectedStation.signal_strength)}</span>
                    </div>
                    <Progress value={selectedStation.signal_strength || 0} className="h-2" />

                    <div className="flex justify-between text-sm">
                      <span>Water Tank</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />

                    <div className="flex justify-between text-sm">
                      <span>Battery</span>
                      <span>{formatBatteryLevel(selectedStation.battery)}</span>
                    </div>
                    <Progress value={selectedStation.battery || 0} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={wateringPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="task" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="var(--color-chart-1)" name="Berhasil" />
                  <Bar dataKey="failed" fill="var(--color-chart-4)" name="Gagal" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plants Tab */}
        <TabsContent value="plants" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPlants.map((plant) => (
              <Card key={plant.key} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-base font-medium">
                    {plant.key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </CardTitle>
                  <Leaf className={`h-4 w-4 ${plant.condition === 'baik' ? 'text-green-500' : plant.condition === 'sedang' ? 'text-yellow-500' : 'text-red-500'}`} />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Kelembaban Tanah</span>
                      <span className="font-medium">{plant.moisture}%</span>
                    </div>
                    <Progress value={plant.moisture} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Kondisi</span>
                    <Badge variant={plant.condition === 'baik' ? 'default' : plant.condition === 'sedang' ? 'secondary' : 'destructive'}>
                      {plant.condition.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
