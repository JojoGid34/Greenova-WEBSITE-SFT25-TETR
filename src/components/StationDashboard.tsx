import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import {
  Droplets,
  Activity,
  Thermometer,
  Battery,
  Signal,
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
  Timer,
  TreePine,
  Target,
  BarChart3,
  TrendingUp,
  Award,
  Cpu,
  Calendar,
  Save
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from "sonner";
import { useFirebaseData } from '../hooks/useFirebaseData';

interface StationDashboardProps {
  selectedStationId: string;
  onStationSelect: (stationId: string) => void;
}

// Utility functions
const formatDateTime = (timestamp: any) => {
  if (!timestamp) return 'N/A';
  const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'short' 
  }) + ', ' + date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusColor = (battery: number, signal: number) => {
  const isOnline = battery > 10 && signal > 20;
  if (isOnline) return 'text-green-500';
  if (battery <= 10) return 'text-red-500';
  return 'text-yellow-500';
};

const getStatusIcon = (battery: number, signal: number) => {
  const isOnline = battery > 10 && signal > 20;
  if (isOnline) return <Wifi className="h-4 w-4 text-green-500" />;
  if (battery <= 10) return <WifiOff className="h-4 w-4 text-red-500" />;
  return <Wrench className="h-4 w-4 text-yellow-500" />;
};

const getStatusText = (battery: number, signal: number) => {
  const isOnline = battery > 10 && signal > 20;
  if (isOnline) return 'Online';
  if (battery <= 10) return 'Baterai Rendah';
  return 'Maintenance';
};

const getBatteryStatus = (battery: number) => {
  if (battery > 50) return { status: 'Baik', color: 'bg-green-500' };
  if (battery > 20) return { status: 'Rendah', color: 'bg-yellow-500' };
  return { status: 'Kritis', color: 'bg-red-500' };
};

const getSignalStatus = (signal: number) => {
  if (signal > 70) return { status: 'Kuat', color: 'bg-green-500' };
  if (signal > 30) return { status: 'Sedang', color: 'bg-yellow-500' };
  return { status: 'Lemah', color: 'bg-red-500' };
};

const getPlantConditionStatus = (condition: string) => {
  switch (condition?.toLowerCase()) {
    case 'baik':
      return { status: 'Baik', color: 'bg-green-500', textColor: 'text-green-500' };
    case 'sedang':
      return { status: 'Sedang', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
    case 'buruk':
      return { status: 'Buruk', color: 'bg-red-500', textColor: 'text-red-500' };
    default:
      return { status: 'N/A', color: 'bg-gray-500', textColor: 'text-gray-500' };
  }
};

// Custom Tooltip for better formatting
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border">
        <p className="font-medium">{`Waktu: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value.toFixed(2)}${entry.dataKey.includes('moisture') ? '%' : ''}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function StationDashboard({ selectedStationId, onStationSelect }: StationDashboardProps) {
  const { stations, plantReadings, loading, error } = useFirebaseData();
  
  // Local state for watering control
  const [wateringSettings, setWateringSettings] = useState({
    autoMode: true,
    moistureThreshold: 30,
    wateringDuration: 5,
    wateringInterval: 12
  });

  // Find selected station
  const selectedStation = stations.find(station => station.station_id === selectedStationId);
  
  // Filter plant readings for selected station and process data
  const stationPlantReadings = useMemo(() => {
    if (!plantReadings || !selectedStationId) return [];
    
    return plantReadings
      .filter(reading => reading.station_id === selectedStationId)
      .sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeA - timeB;
      });
  }, [plantReadings, selectedStationId]);

  // Process chart data (last 15 readings)
  const chartData = useMemo(() => {
    if (!stationPlantReadings.length) return [];
    
    return stationPlantReadings.slice(-15).map(reading => {
      // Extract plant data (assuming plant keys are dynamic)
      const plantKeys = Object.keys(reading).filter(key => 
        key !== 'station_id' && key !== 'timestamp' && typeof reading[key] === 'object'
      );
      
      const chartPoint: any = {
        time: formatDateTime(reading.timestamp),
        timestamp: reading.timestamp?.seconds || 0
      };

      plantKeys.forEach(plantKey => {
        if (reading[plantKey] && typeof reading[plantKey] === 'object') {
          chartPoint[`${plantKey}_moisture`] = Number(reading[plantKey].moisture) || 0;
        }
      });

      return chartPoint;
    });
  }, [stationPlantReadings]);

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    if (!stationPlantReadings.length || !selectedStation) {
      return {
        uptime: 0,
        dataPoints: 0,
        avgMoisture: 0,
        wateringEfficiency: 0,
        plantsMonitored: 0,
        lastWatering: 'N/A'
      };
    }

    const last24Hours = stationPlantReadings.filter(reading => {
      const readingTime = reading.timestamp?.seconds * 1000;
      const now = Date.now();
      return (now - readingTime) <= 24 * 60 * 60 * 1000;
    });

    const uptime = selectedStation.battery > 10 && selectedStation.signal_strength > 20 ? 
      Math.min(99.5, (last24Hours.length / 24) * 100) : 0;

    // Calculate average moisture from all plants
    let totalMoisture = 0;
    let moistureCount = 0;
    let plantsMonitored = 0;

    last24Hours.forEach(reading => {
      const plantKeys = Object.keys(reading).filter(key => 
        key !== 'station_id' && key !== 'timestamp' && typeof reading[key] === 'object'
      );
      
      plantsMonitored = Math.max(plantsMonitored, plantKeys.length);
      
      plantKeys.forEach(plantKey => {
        if (reading[plantKey] && typeof reading[plantKey] === 'object' && reading[plantKey].moisture) {
          totalMoisture += Number(reading[plantKey].moisture) || 0;
          moistureCount++;
        }
      });
    });

    const avgMoisture = moistureCount > 0 ? totalMoisture / moistureCount : 0;

    // Calculate watering efficiency (mock calculation based on moisture levels and watering frequency)
    const wateringEfficiency = Math.min(100, 
      (avgMoisture > 40 ? 90 : avgMoisture > 20 ? 70 : 50) + 
      (selectedStation.watering_status ? 10 : 0)
    );

    return {
      uptime: Math.round(uptime * 10) / 10,
      dataPoints: stationPlantReadings.length,
      avgMoisture: Math.round(avgMoisture * 10) / 10,
      wateringEfficiency: Math.round(wateringEfficiency),
      plantsMonitored,
      lastWatering: selectedStation.last_plant_watering || 'N/A'
    };
  }, [stationPlantReadings, selectedStation]);

  // Get latest plant reading for current status
  const latestReading = stationPlantReadings[stationPlantReadings.length - 1];
  const currentPlants = useMemo(() => {
    if (!latestReading) return [];
    
    const plantKeys = Object.keys(latestReading).filter(key => 
      key !== 'station_id' && key !== 'timestamp' && typeof latestReading[key] === 'object'
    );
    
    return plantKeys.map(plantKey => ({
      id: plantKey,
      name: plantKey.charAt(0).toUpperCase() + plantKey.slice(1),
      ...latestReading[plantKey]
    }));
  }, [latestReading]);

  const handleWateringToggle = () => {
    toast.success("Watering system " + (selectedStation?.watering_status ? "stopped" : "started"));
  };

  const handleWateringSettings = () => {
    toast.success("Watering settings saved successfully");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Memuat data station...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedStation) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p>Station tidak ditemukan atau tidak ada data</p>
        </div>
      </div>
    );
  }

  const batteryStatus = getBatteryStatus(selectedStation.battery);
  const signalStatus = getSignalStatus(selectedStation.signal_strength);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Station Dashboard</h1>
          <p className="text-muted-foreground">
            Monitoring dan kontrol station GREENOVA
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedStationId} onValueChange={onStationSelect}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Pilih Station" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((station) => (
                <SelectItem key={station.station_id} value={station.station_id}>
                  <div className="flex items-center gap-2">
                    <TreePine className="h-4 w-4" />
                    {station.station_id}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Station Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Station Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status Station</p>
                <p className="text-2xl font-bold">
                  {getStatusText(selectedStation.battery, selectedStation.signal_strength)}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                {getStatusIcon(selectedStation.battery, selectedStation.signal_strength)}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Update: {formatDateTime(selectedStation.last_seen)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Battery */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Baterai</p>
                <p className="text-2xl font-bold">{selectedStation.battery}%</p>
                <Badge className={`${batteryStatus.color} text-white mt-2`}>
                  {batteryStatus.status}
                </Badge>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Battery className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={selectedStation.battery} className="w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Signal Strength */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sinyal</p>
                <p className="text-2xl font-bold">{selectedStation.signal_strength}%</p>
                <Badge className={`${signalStatus.color} text-white mt-2`}>
                  {signalStatus.status}
                </Badge>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Signal className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={selectedStation.signal_strength} className="w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Watering Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sistem Penyiraman</p>
                <p className="text-2xl font-bold">
                  {selectedStation.watering_status ? 'Aktif' : 'Nonaktif'}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Droplets className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Last: {selectedStation.last_plant_watering || 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Plants Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Status Tanaman Saat Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentPlants.length > 0 ? currentPlants.map((plant, index) => {
              const status = getPlantConditionStatus(plant.condition);
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{plant.name}</h4>
                    <Badge className={`${status.color} text-white`}>
                      {status.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Kelembaban:</span>
                      <span className="font-medium">{plant.moisture || 'N/A'}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Update:</span>
                      <span className="font-medium">
                        {plant.last_update ? formatDateTime(plant.last_update) : 'N/A'}
                      </span>
                    </div>
                    <Progress value={plant.moisture || 0} className="w-full" />
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Tidak ada data tanaman tersedia
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Uptime (24h)</p>
                  <p className="text-xl font-bold">{performanceMetrics.uptime}%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Data Points</p>
                  <p className="text-xl font-bold">{performanceMetrics.dataPoints}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-50 rounded-full flex items-center justify-center">
                  <Droplets className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Moisture (24h)</p>
                  <p className="text-xl font-bold">{performanceMetrics.avgMoisture}%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                  <TreePine className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plants Monitored</p>
                  <p className="text-xl font-bold">{performanceMetrics.plantsMonitored}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                  <Gauge className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Watering Efficiency</p>
                  <p className="text-xl font-bold">{performanceMetrics.wateringEfficiency}%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center">
                  <Timer className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Watering</p>
                  <p className="text-sm font-medium">{performanceMetrics.lastWatering}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="sensors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sensors">Data Sensor</TabsTrigger>
          <TabsTrigger value="watering">Watering Control</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="sensors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grafik Kelembaban Tanaman - 15 Data Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    {Object.keys(chartData[0] || {})
                      .filter(key => key.includes('moisture'))
                      .map((key, index) => (
                        <Line
                          key={key}
                          type="monotone"
                          dataKey={key}
                          stroke={`hsl(${index * 60}, 70%, 50%)`}
                          strokeWidth={2}
                          name={key.replace('_moisture', '').toUpperCase()}
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watering" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Kontrol Penyiraman</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Manual Watering</Label>
                    <p className="text-sm text-muted-foreground">Start/stop watering manually</p>
                  </div>
                  <Button 
                    variant={selectedStation.watering_status ? "destructive" : "default"}
                    onClick={handleWateringToggle}
                  >
                    {selectedStation.watering_status ? (
                      <>
                        <Square className="h-4 w-4 mr-2" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Status Sistem:</Label>
                    <Badge className={selectedStation.watering_status ? 'bg-green-500' : 'bg-gray-500'}>
                      {selectedStation.watering_status ? 'AKTIF' : 'NONAKTIF'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Last Watering:</Label>
                    <span className="text-sm">{selectedStation.last_plant_watering || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Watering Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Next scheduled watering:</span>
                    <span className="font-medium">In 6 hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Daily frequency:</span>
                    <span className="font-medium">2 times</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Duration per session:</span>
                    <span className="font-medium">5 minutes</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Recent Activity</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Watered 2 hours ago (5 min)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Watered 8 hours ago (5 min)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Watered 14 hours ago (5 min)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Soil Sensor Calibration</p>
                      <p className="text-sm text-muted-foreground">Completed 3 days ago</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500">Complete</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Water Pump Check</p>
                      <p className="text-sm text-muted-foreground">Due in 2 days</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-500">Pending</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">Nutrient Tank Refill</p>
                      <p className="text-sm text-muted-foreground">Overdue by 2 days</p>
                    </div>
                  </div>
                  <Badge className="bg-red-500">Overdue</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Watering Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Auto Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable automatic watering based on moisture levels</p>
                  </div>
                  <Switch 
                    checked={wateringSettings.autoMode}
                    onCheckedChange={(checked) => 
                      setWateringSettings(prev => ({ ...prev, autoMode: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Moisture Threshold: {wateringSettings.moistureThreshold}%</Label>
                  <Slider
                    value={[wateringSettings.moistureThreshold]}
                    onValueChange={(value) => 
                      setWateringSettings(prev => ({ ...prev, moistureThreshold: value[0] }))
                    }
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">Water when moisture drops below this level</p>
                </div>

                <div className="space-y-2">
                  <Label>Watering Duration: {wateringSettings.wateringDuration} minutes</Label>
                  <Slider
                    value={[wateringSettings.wateringDuration]}
                    onValueChange={(value) => 
                      setWateringSettings(prev => ({ ...prev, wateringDuration: value[0] }))
                    }
                    min={1}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Watering Interval: {wateringSettings.wateringInterval} hours</Label>
                  <Slider
                    value={[wateringSettings.wateringInterval]}
                    onValueChange={(value) => 
                      setWateringSettings(prev => ({ ...prev, wateringInterval: value[0] }))
                    }
                    min={1}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>

                <Button onClick={handleWateringSettings} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Station ID:</span>
                    <span className="font-medium">{selectedStation.station_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Battery:</span>
                    <span className="font-medium">{selectedStation.battery}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Signal:</span>
                    <span className="font-medium">{selectedStation.signal_strength}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Seen:</span>
                    <span className="font-medium">{formatDateTime(selectedStation.last_seen)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Points:</span>
                    <span className="font-medium">{stationPlantReadings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plants Monitored:</span>
                    <span className="font-medium">{currentPlants.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}