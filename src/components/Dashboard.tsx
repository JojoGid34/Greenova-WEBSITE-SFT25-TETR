import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Bot,
  Activity,
  Thermometer,
  Droplets,
  Wind,
  Battery,
  Signal,
  Settings,
  Zap,
  Wifi,
  WifiOff,
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Download,
  TrendingUp,
  Gauge,
  Camera,
  Brain,
  Eye,
  TreePine,
  Lightbulb,
  BarChart3,
  Target,
  Award,
  Cpu
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useFirebaseData } from '../hooks/useFirebaseData';

interface DashboardProps {
  selectedRobotId: string;
  onRobotSelect: (robotId: string) => void;
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

// Custom Tooltip for better formatting
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border">
        <p className="font-medium">{`Waktu: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey === 'temperature' ? 'Suhu' : 
               entry.dataKey === 'humidity' ? 'Kelembaban' : 
               entry.dataKey === 'pm25' ? 'PM2.5' : 
               entry.dataKey === 'aqi' ? 'AQI' : entry.dataKey}: ${entry.value.toFixed(2)}`}
            {entry.dataKey === 'temperature' ? '°C' : 
             entry.dataKey === 'humidity' ? '%' : 
             entry.dataKey === 'pm25' ? ' μg/m³' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function Dashboard({ selectedRobotId, onRobotSelect }: DashboardProps) {
  const { robots, airReadings, loading, error } = useFirebaseData();
  
  // Find selected robot
  const selectedRobot = robots.find(robot => robot.robot_id === selectedRobotId);
  
  // Filter air readings for selected robot and process data
  const robotAirReadings = useMemo(() => {
    if (!airReadings || !selectedRobotId) return [];
    
    return airReadings
      .filter(reading => reading.robot_id === selectedRobotId)
      .sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeA - timeB;
      });
  }, [airReadings, selectedRobotId]);

  // Process chart data (last 15 readings)
  const chartData = useMemo(() => {
    if (!robotAirReadings.length) return [];
    
    return robotAirReadings.slice(-15).map(reading => {
      const pm25 = Number(reading.dust_pm25) || 0;
      const gasPpm = Number(reading.gas_ppm) || 0;
      const aqi = pm25 > 0 ? Math.round((pm25 * 2.5) + (gasPpm * 0.5)) : 0;
      
      return {
        time: formatDateTime(reading.timestamp),
        temperature: Number(reading.temperature) || 0,
        humidity: Number(reading.humidity) || 0,
        pm25: pm25,
        aqi: aqi,
        timestamp: reading.timestamp?.seconds || 0
      };
    });
  }, [robotAirReadings]);

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    if (!robotAirReadings.length || !selectedRobot) {
      return {
        uptime: 0,
        dataPoints: 0,
        avgTemperature: 0,
        avgHumidity: 0,
        efficiency: 0,
        lastMaintenance: 'N/A'
      };
    }

    const last24Hours = robotAirReadings.filter(reading => {
      const readingTime = reading.timestamp?.seconds * 1000;
      const now = Date.now();
      return (now - readingTime) <= 24 * 60 * 60 * 1000;
    });

    const uptime = selectedRobot.battery > 10 && selectedRobot.signal_strength > 20 ? 
      Math.min(99.5, (last24Hours.length / 24) * 100) : 0;

    const avgTemperature = last24Hours.length > 0 ?
      last24Hours.reduce((sum, reading) => sum + (Number(reading.temperature) || 0), 0) / last24Hours.length : 0;

    const avgHumidity = last24Hours.length > 0 ?
      last24Hours.reduce((sum, reading) => sum + (Number(reading.humidity) || 0), 0) / last24Hours.length : 0;

    // Calculate efficiency based on data consistency and sensor readings
    const efficiency = Math.min(100, 
      (uptime * 0.4) + 
      (selectedRobot.battery * 0.3) + 
      (selectedRobot.signal_strength * 0.3)
    );

    return {
      uptime: Math.round(uptime * 10) / 10,
      dataPoints: robotAirReadings.length,
      avgTemperature: Math.round(avgTemperature * 10) / 10,
      avgHumidity: Math.round(avgHumidity * 10) / 10,
      efficiency: Math.round(efficiency),
      lastMaintenance: selectedRobot.last_seen ? formatDateTime(selectedRobot.last_seen) : 'N/A'
    };
  }, [robotAirReadings, selectedRobot]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Memuat data robot...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedRobot) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p>Robot tidak ditemukan atau tidak ada data</p>
        </div>
      </div>
    );
  }

  const latestReading = robotAirReadings[robotAirReadings.length - 1];
  const batteryStatus = getBatteryStatus(selectedRobot.battery);
  const signalStatus = getSignalStatus(selectedRobot.signal_strength);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Robot Dashboard</h1>
          <p className="text-muted-foreground">
            Monitoring dan kontrol robot GREENOVA
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedRobotId} onValueChange={onRobotSelect}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Pilih Robot" />
            </SelectTrigger>
            <SelectContent>
              {robots.map((robot) => (
                <SelectItem key={robot.robot_id} value={robot.robot_id}>
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    {robot.robot_id}
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

      {/* Robot Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Robot Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status Robot</p>
                <p className="text-2xl font-bold">
                  {getStatusText(selectedRobot.battery, selectedRobot.signal_strength)}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                {getStatusIcon(selectedRobot.battery, selectedRobot.signal_strength)}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Update: {formatDateTime(selectedRobot.last_seen)}
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
                <p className="text-2xl font-bold">{selectedRobot.battery}%</p>
                <Badge className={`${batteryStatus.color} text-white mt-2`}>
                  {batteryStatus.status}
                </Badge>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Battery className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={selectedRobot.battery} className="w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Signal Strength */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sinyal</p>
                <p className="text-2xl font-bold">{selectedRobot.signal_strength}%</p>
                <Badge className={`${signalStatus.color} text-white mt-2`}>
                  {signalStatus.status}
                </Badge>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Signal className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={selectedRobot.signal_strength} className="w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Current AQI */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AQI Terakhir</p>
                <p className="text-2xl font-bold">
                  {latestReading ? 
                    Math.round((Number(latestReading.dust_pm25) * 2.5) + (Number(latestReading.gas_ppm) * 0.5)) : 
                    'N/A'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Wind className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-green-500">
                {robotAirReadings.length} data points
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

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
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                  <Thermometer className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Temperature (24h)</p>
                  <p className="text-xl font-bold">{performanceMetrics.avgTemperature}°C</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-50 rounded-full flex items-center justify-center">
                  <Droplets className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Humidity (24h)</p>
                  <p className="text-xl font-bold">{performanceMetrics.avgHumidity}%</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                  <Cpu className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Efficiency Score</p>
                  <p className="text-xl font-bold">{performanceMetrics.efficiency}%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center">
                  <Wrench className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Update</p>
                  <p className="text-sm font-medium">{performanceMetrics.lastMaintenance}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="sensors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sensors">Data Sensor</TabsTrigger>
          <TabsTrigger value="control">Kontrol Robot</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="sensors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grafik Sensor - 15 Data Terakhir</CardTitle>
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
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Suhu"
                    />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Kelembaban"
                    />
                    <Line
                      type="monotone"
                      dataKey="pm25"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="PM2.5"
                    />
                    <Line
                      type="monotone"
                      dataKey="aqi"
                      stroke="#22c55e"
                      strokeWidth={2}
                      name="AQI"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="control" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fan Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status Fan:</span>
                  <Badge className={selectedRobot.fan_status ? 'bg-green-500' : 'bg-gray-500'}>
                    {selectedRobot.fan_status ? 'ON' : 'OFF'}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={selectedRobot.fan_status ? "default" : "outline"} 
                    size="sm"
                    className="flex-1"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Turn ON
                  </Button>
                  <Button 
                    variant={!selectedRobot.fan_status ? "default" : "outline"} 
                    size="sm"
                    className="flex-1"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Turn OFF
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Robot ID:</span>
                  <span className="font-medium">{selectedRobot.robot_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{selectedRobot.city_loc || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Seen:</span>
                  <span className="font-medium">{formatDateTime(selectedRobot.last_seen)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data Points:</span>
                  <span className="font-medium">{robotAirReadings.length}</span>
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
                      <p className="font-medium">Sensor Cleaning</p>
                      <p className="text-sm text-muted-foreground">Completed 2 days ago</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500">Complete</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Battery Check</p>
                      <p className="text-sm text-muted-foreground">Due in 5 days</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-500">Pending</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">Filter Replacement</p>
                      <p className="text-sm text-muted-foreground">Overdue by 1 day</p>
                    </div>
                  </div>
                  <Badge className="bg-red-500">Overdue</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}