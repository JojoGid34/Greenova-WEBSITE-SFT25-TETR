import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Bot,
  Activity,
  Thermometer,
  Droplets,
  Wind,
  Sun,
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
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Calendar,
  TrendingUp,
  Gauge
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ROBOT_DATA, Robot } from '../data/robotData';

interface DashboardProps {
  selectedRobotId: string;
  onRobotSelect: (robotId: string) => void;
}

// Mock data untuk charts
const sensorHistory = [
  { time: '06:00', temperature: 25.2, humidity: 68, airQuality: 82 },
  { time: '08:00', temperature: 26.1, humidity: 65, airQuality: 85 },
  { time: '10:00', temperature: 28.5, humidity: 62, airQuality: 87 },
  { time: '12:00', temperature: 30.1, humidity: 58, airQuality: 83 },
  { time: '14:00', temperature: 31.2, humidity: 55, airQuality: 79 },
  { time: '16:00', temperature: 29.8, humidity: 59, airQuality: 81 },
  { time: '18:00', temperature: 27.9, humidity: 63, airQuality: 86 },
];

const taskPerformance = [
  { task: 'Penyiraman', completed: 95, failed: 5 },
  { task: 'Monitoring', completed: 98, failed: 2 },
  { task: 'Pemupukan', completed: 87, failed: 13 },
  { task: 'Pembersihan', completed: 92, failed: 8 },
];

export function Dashboard({ selectedRobotId, onRobotSelect }: DashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [searchQuery, setSearchQuery] = useState('');
  
  const selectedRobot = ROBOT_DATA.find(robot => robot.id === selectedRobotId);
  
  if (!selectedRobot) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Robot tidak ditemukan</p>
      </div>
    );
  }

  const getStatusColor = (status: Robot['status']) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'offline':
        return 'text-red-500';
      case 'maintenance':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: Robot['status']) => {
    switch (status) {
      case 'online':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Dashboard Robot</h1>
          <Badge variant="outline">{selectedRobot.name}</Badge>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Robot Selector */}
          <Select value={selectedRobotId} onValueChange={onRobotSelect}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pilih Robot" />
            </SelectTrigger>
            <SelectContent>
              {ROBOT_DATA.map((robot) => (
                <SelectItem key={robot.id} value={robot.id}>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(robot.status)}
                    <span>{robot.name}</span>
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
        {/* Robot Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Robot</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(selectedRobot.status)}
              <span className={`text-2xl font-bold capitalize ${getStatusColor(selectedRobot.status)}`}>
                {selectedRobot.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Update: {new Date(selectedRobot.lastUpdated).toLocaleTimeString('id-ID')}
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
            <div className="text-2xl font-bold">{selectedRobot.battery}%</div>
            <Progress value={selectedRobot.battery} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {selectedRobot.battery > 50 ? 'Baik' : selectedRobot.battery > 20 ? 'Rendah' : 'Kritis'}
            </p>
          </CardContent>
        </Card>

        {/* Signal Strength */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sinyal</CardTitle>
            <Signal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedRobot.signal}%</div>
            <Progress value={selectedRobot.signal} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {selectedRobot.signal > 70 ? 'Kuat' : selectedRobot.signal > 30 ? 'Sedang' : 'Lemah'}
            </p>
          </CardContent>
        </Card>

        {/* Active Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tugas Aktif</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedRobot.tasks.filter(task => task.status === 'in-progress').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              dari {selectedRobot.tasks.length} total tugas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sensors">Sensor Data</TabsTrigger>
          <TabsTrigger value="tasks">Task Management</TabsTrigger>
          <TabsTrigger value="controls">Robot Controls</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sensor Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sensor Data Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sensorHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="var(--color-chart-1)" 
                      strokeWidth={2}
                      name="Temperature (°C)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="humidity" 
                      stroke="var(--color-chart-2)" 
                      strokeWidth={2}
                      name="Humidity (%)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="airQuality" 
                      stroke="var(--color-chart-3)" 
                      strokeWidth={2}
                      name="Air Quality"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Location & Current Sensors */}
            <div className="space-y-6">
              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Lokasi Robot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{selectedRobot.location.address}</p>
                    <p className="text-sm text-muted-foreground">
                      Lat: {selectedRobot.location.lat}, Lng: {selectedRobot.location.lng}
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      Lihat di Peta
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Current Sensor Readings */}
              <Card>
                <CardHeader>
                  <CardTitle>Sensor Readings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="text-sm font-medium">{selectedRobot.sensors.temperature}°C</p>
                        <p className="text-xs text-muted-foreground">Suhu</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">{selectedRobot.sensors.humidity}%</p>
                        <p className="text-xs text-muted-foreground">Kelembaban</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">{selectedRobot.sensors.airQuality}</p>
                        <p className="text-xs text-muted-foreground">Kualitas Udara</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      <div>
                        <p className="text-sm font-medium">{selectedRobot.sensors.lightLevel}%</p>
                        <p className="text-xs text-muted-foreground">Intensitas Cahaya</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Task Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Task Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={taskPerformance}>
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

        {/* Sensors Tab */}
        <TabsContent value="sensors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Temperature */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suhu Lingkungan</CardTitle>
                <Thermometer className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedRobot.sensors.temperature}°C</div>
                <div className="mt-2">
                  <Progress 
                    value={(selectedRobot.sensors.temperature / 50) * 100} 
                    className="h-2"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Range: 20-35°C (Normal)
                </p>
              </CardContent>
            </Card>

            {/* Humidity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kelembaban Udara</CardTitle>
                <Droplets className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedRobot.sensors.humidity}%</div>
                <div className="mt-2">
                  <Progress value={selectedRobot.sensors.humidity} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Range: 40-80% (Optimal)
                </p>
              </CardContent>
            </Card>

            {/* Air Quality */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kualitas Udara</CardTitle>
                <Wind className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedRobot.sensors.airQuality}</div>
                <div className="mt-2">
                  <Progress value={selectedRobot.sensors.airQuality} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedRobot.sensors.airQuality > 80 ? 'Baik' : 
                   selectedRobot.sensors.airQuality > 50 ? 'Sedang' : 'Buruk'}
                </p>
              </CardContent>
            </Card>

            {/* Soil Moisture */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kelembaban Tanah</CardTitle>
                <Droplets className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedRobot.sensors.soilMoisture}%</div>
                <div className="mt-2">
                  <Progress value={selectedRobot.sensors.soilMoisture} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedRobot.sensors.soilMoisture > 60 ? 'Basah' : 
                   selectedRobot.sensors.soilMoisture > 30 ? 'Lembab' : 'Kering'}
                </p>
              </CardContent>
            </Card>

            {/* Light Level */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Intensitas Cahaya</CardTitle>
                <Sun className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedRobot.sensors.lightLevel}%</div>
                <div className="mt-2">
                  <Progress value={selectedRobot.sensors.lightLevel} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedRobot.sensors.lightLevel > 70 ? 'Terang' : 
                   selectedRobot.sensors.lightLevel > 30 ? 'Sedang' : 'Gelap'}
                </p>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status Sistem</CardTitle>
                <Gauge className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-1" />
                  <div className="flex justify-between text-sm">
                    <span>Memory</span>
                    <span>62%</span>
                  </div>
                  <Progress value={62} className="h-1" />
                  <div className="flex justify-between text-sm">
                    <span>Storage</span>
                    <span>38%</span>
                  </div>
                  <Progress value={38} className="h-1" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Tasks */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tugas Aktif</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedRobot.tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getTaskStatusColor(task.status)}`}></div>
                          <div>
                            <p className="font-medium">{task.name}</p>
                            <p className="text-sm text-muted-foreground capitalize">{task.status}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-medium">{task.progress}%</p>
                            <Progress value={task.progress} className="w-20 h-1" />
                          </div>
                          <Button variant="outline" size="sm">
                            {task.status === 'in-progress' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Task Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Mulai Penyiraman
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Semua Tugas
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Robot
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Log
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Controls Tab */}
        <TabsContent value="controls" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Manual Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Manual Control</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline">
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                    <Button variant="outline">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                    <Button variant="outline">
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                    <Button variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t">
                    <div>
                      <label className="text-sm font-medium">Kecepatan Motor</label>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm">0%</span>
                        <div className="flex-1 px-3">
                          <input type="range" className="w-full" min="0" max="100" defaultValue="50" />
                        </div>
                        <span className="text-sm">100%</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Intensitas Penyiraman</label>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm">Low</span>
                        <div className="flex-1 px-3">
                          <input type="range" className="w-full" min="1" max="5" defaultValue="3" />
                        </div>
                        <span className="text-sm">High</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Konfigurasi Sistem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Mode Operasi</label>
                    <Select defaultValue="auto">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Otomatis</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="scheduled">Terjadwal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Frekuensi Update</label>
                    <Select defaultValue="30s">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10s">10 detik</SelectItem>
                        <SelectItem value="30s">30 detik</SelectItem>
                        <SelectItem value="1m">1 menit</SelectItem>
                        <SelectItem value="5m">5 menit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Jadwal Penyiraman</label>
                    <Input type="time" className="mt-1" defaultValue="06:00" />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Terapkan Konfigurasi
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Maintenance Schedule */}
          {selectedRobot.maintenanceSchedule && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Jadwal Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Maintenance Terjadwal</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedRobot.maintenanceSchedule.type} - {selectedRobot.maintenanceSchedule.nextDate}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}