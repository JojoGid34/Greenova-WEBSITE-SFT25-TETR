import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Calendar,
  Clock,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Filter,
  Search,
  RefreshCw,
  Bot,
  Thermometer,
  Droplets,
  Wind,
  Battery,
  Signal,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ROBOT_DATA, Robot } from '../data/robotData';

interface HistoryProps {
  selectedRobotId: string;
  onRobotSelect: (robotId: string) => void;
}

// Mock historical data
const mockHistoryData = {
  tasks: [
    {
      id: '1',
      robotId: 'GRN-001',
      taskName: 'Penyiraman Zona A',
      status: 'completed',
      startTime: '2024-01-15T06:00:00Z',
      endTime: '2024-01-15T06:15:00Z',
      duration: 15,
      details: 'Penyiraman otomatis berhasil dilakukan, volume air: 2.5L'
    },
    {
      id: '2',
      robotId: 'GRN-001',
      taskName: 'Monitoring Kualitas Udara',
      status: 'completed',
      startTime: '2024-01-15T08:00:00Z',
      endTime: '2024-01-15T10:00:00Z',
      duration: 120,
      details: 'Pemantauan kualitas udara, rata-rata AQI: 85'
    },
    {
      id: '3',
      robotId: 'GRN-001',
      taskName: 'Pemupukan Organik',
      status: 'failed',
      startTime: '2024-01-14T14:00:00Z',
      endTime: '2024-01-14T14:05:00Z',
      duration: 5,
      details: 'Gagal: Level pupuk organik habis'
    },
    {
      id: '4',
      robotId: 'GRN-002',
      taskName: 'Pemantauan Polusi',
      status: 'completed',
      startTime: '2024-01-15T09:00:00Z',
      endTime: '2024-01-15T11:00:00Z',
      duration: 120,
      details: 'Deteksi polusi udara, level PM2.5: 25 µg/m³'
    }
  ],
  sensors: [
    {
      timestamp: '2024-01-15T10:00:00Z',
      robotId: 'GRN-001',
      temperature: 28.5,
      humidity: 65,
      airQuality: 85,
      soilMoisture: 45,
      lightLevel: 75,
      battery: 87,
      signal: 92
    },
    {
      timestamp: '2024-01-15T09:00:00Z',
      robotId: 'GRN-001',
      temperature: 27.8,
      humidity: 68,
      airQuality: 82,
      soilMoisture: 42,
      lightLevel: 70,
      battery: 89,
      signal: 91
    },
    {
      timestamp: '2024-01-15T08:00:00Z',
      robotId: 'GRN-001',
      temperature: 26.9,
      humidity: 72,
      airQuality: 80,
      soilMoisture: 38,
      lightLevel: 65,
      battery: 91,
      signal: 90
    }
  ],
  maintenance: [
    {
      id: '1',
      robotId: 'GRN-001',
      type: 'Pembersihan Filter',
      status: 'completed',
      date: '2024-01-10',
      technician: 'Ahmad Susanto',
      notes: 'Filter udara dibersihkan, performa normal'
    },
    {
      id: '2',
      robotId: 'GRN-003',
      type: 'Penggantian Baterai',
      status: 'scheduled',
      date: '2024-01-16',
      technician: 'Budi Santoso',
      notes: 'Baterai menunjukkan penurunan kapasitas'
    }
  ],
  alerts: [
    {
      id: '1',
      robotId: 'GRN-001',
      type: 'warning',
      message: 'Level air rendah',
      timestamp: '2024-01-15T10:30:00Z',
      resolved: true
    },
    {
      id: '2',
      robotId: 'GRN-004',
      type: 'error',
      message: 'Robot offline - koneksi terputus',
      timestamp: '2024-01-14T18:20:00Z',
      resolved: false
    },
    {
      id: '3',
      robotId: 'GRN-003',
      type: 'info',
      message: 'Maintenance terjadwal besok',
      timestamp: '2024-01-15T09:00:00Z',
      resolved: false
    }
  ]
};

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export function History({ selectedRobotId, onRobotSelect }: HistoryProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const selectedRobot = ROBOT_DATA.find(robot => robot.id === selectedRobotId);
  
  if (!selectedRobot) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Robot tidak ditemukan</p>
      </div>
    );
  }

  // Filter data berdasarkan robot yang dipilih
  const robotTasks = mockHistoryData.tasks.filter(task => task.robotId === selectedRobotId);
  const robotSensors = mockHistoryData.sensors.filter(sensor => sensor.robotId === selectedRobotId);
  const robotMaintenance = mockHistoryData.maintenance.filter(maintenance => maintenance.robotId === selectedRobotId);
  const robotAlerts = mockHistoryData.alerts.filter(alert => alert.robotId === selectedRobotId);

  // Task status statistics
  const taskStats = [
    { name: 'Completed', value: robotTasks.filter(t => t.status === 'completed').length, color: '#22c55e' },
    { name: 'Failed', value: robotTasks.filter(t => t.status === 'failed').length, color: '#ef4444' },
    { name: 'In Progress', value: robotTasks.filter(t => t.status === 'in-progress').length, color: '#3b82f6' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Riwayat Robot</h1>
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
                    <Bot className="h-4 w-4" />
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
              <SelectItem value="1d">1 Hari</SelectItem>
              <SelectItem value="7d">7 Hari</SelectItem>
              <SelectItem value="30d">30 Hari</SelectItem>
              <SelectItem value="90d">90 Hari</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tugas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{robotTasks.length}</div>
            <p className="text-xs text-muted-foreground">dalam 7 hari terakhir</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((robotTasks.filter(t => t.status === 'completed').length / robotTasks.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">tingkat keberhasilan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">waktu operasional</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{robotSensors.length * 24}</div>
            <p className="text-xs text-muted-foreground">sensor readings</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks">Task History</TabsTrigger>
          <TabsTrigger value="sensors">Sensor Data</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Tasks History Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task Statistics Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Task Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={taskStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {taskStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {taskStats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: stat.color }}
                      ></div>
                      <span>{stat.name}: {stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Task List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Riwayat Tugas</CardTitle>
                    <div className="flex gap-2">
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Status</SelectItem>
                          <SelectItem value="completed">Selesai</SelectItem>
                          <SelectItem value="failed">Gagal</SelectItem>
                          <SelectItem value="in-progress">Berlangsung</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {robotTasks
                      .filter(task => filterStatus === 'all' || task.status === filterStatus)
                      .map((task) => (
                      <div key={task.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="mt-1">
                          {getStatusIcon(task.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{task.taskName}</h4>
                            <Badge variant={task.status === 'completed' ? 'default' : task.status === 'failed' ? 'destructive' : 'secondary'}>
                              {task.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{task.details}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {new Date(task.startTime).toLocaleDateString('id-ID')}
                            </span>
                            <span>
                              <Clock className="h-3 w-3 inline mr-1" />
                              {formatDuration(task.duration)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Sensors Data Tab */}
        <TabsContent value="sensors" className="space-y-6">
          {/* Sensor Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sensor Data Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={robotSensors.slice().reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleString('id-ID')}
                  />
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

          {/* Sensor Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Sensor Readings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Temp (°C)</TableHead>
                    <TableHead>Humidity (%)</TableHead>
                    <TableHead>Air Quality</TableHead>
                    <TableHead>Soil Moisture (%)</TableHead>
                    <TableHead>Light Level (%)</TableHead>
                    <TableHead>Battery (%)</TableHead>
                    <TableHead>Signal (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {robotSensors.map((reading, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(reading.timestamp).toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Thermometer className="h-3 w-3" />
                        {reading.temperature}
                      </TableCell>
                      <TableCell>
                        <Droplets className="h-3 w-3 inline mr-1" />
                        {reading.humidity}
                      </TableCell>
                      <TableCell>
                        <Wind className="h-3 w-3 inline mr-1" />
                        {reading.airQuality}
                      </TableCell>
                      <TableCell>{reading.soilMoisture}</TableCell>
                      <TableCell>{reading.lightLevel}</TableCell>
                      <TableCell>
                        <Battery className="h-3 w-3 inline mr-1" />
                        {reading.battery}
                      </TableCell>
                      <TableCell>
                        <Signal className="h-3 w-3 inline mr-1" />
                        {reading.signal}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {robotMaintenance.map((maintenance) => (
                  <div key={maintenance.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="mt-1">
                      {maintenance.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{maintenance.type}</h4>
                        <Badge variant={maintenance.status === 'completed' ? 'default' : 'secondary'}>
                          {maintenance.status === 'completed' ? 'Selesai' : 'Terjadwal'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{maintenance.notes}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {new Date(maintenance.date).toLocaleDateString('id-ID')}
                        </span>
                        <span>Teknisi: {maintenance.technician}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {robotAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{alert.message}</h4>
                        <Badge variant={
                          alert.resolved ? 'default' : 
                          alert.type === 'error' ? 'destructive' : 
                          alert.type === 'warning' ? 'destructive' : 'secondary'
                        }>
                          {alert.resolved ? 'Resolved' : 'Active'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          <Clock className="h-3 w-3 inline mr-1" />
                          {new Date(alert.timestamp).toLocaleString('id-ID')}
                        </span>
                        <span className="capitalize">{alert.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}