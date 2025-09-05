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
  BarChart3,
  BarChart
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { LineChartData } from 'recharts';

interface HistoryProps {
  selectedRobotId: string;
  onRobotSelect: (robotId: string) => void;
}

// Helper function untuk mengonversi data dari Firebase ke format chart
const processDataForCharts = (data: any[]) => {
  const chartData = data.map((doc: any) => {
    // Pastikan timestamp ada dan berupa objek Firestore Timestamp
    const date = doc.timestamp?.seconds ? new Date(doc.timestamp.seconds * 1000) : new Date();
    return {
      time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      timestamp: date.toISOString(), // Gunakan ISO string untuk data mentah
      temperature: doc.temperature,
      humidity: doc.humidity,
      aqi: doc.aq_number,
      pm25: doc.dust_pm25,
      pm10: doc.dust_pm25 ? (doc.dust_pm25 * 1.5) : 0
    };
  });
  return chartData;
};

// Helper function untuk mendapatkan status AQI
const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) return 'Baik';
  if (aqi <= 100) return 'Sedang';
  if (aqi <= 150) return 'Tidak Sehat untuk Sensitif';
  if (aqi <= 200) return 'Tidak Sehat';
  return 'Sangat Tidak Sehat';
};


export function History({ selectedRobotId, onRobotSelect }: HistoryProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Menggunakan data real-time dari Firebase
  const { robots, airReadings, loading } = useFirebaseData();
  
  const selectedRobot = robots.find(robot => robot.robot_id === selectedRobotId);
  const robotAirReadings = airReadings.filter(reading => reading.robot_id === selectedRobotId);
  
  // Mengonversi data untuk chart dan mengurutkan secara kronologis
  const sensorHistory = processDataForCharts(robotAirReadings).reverse();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  if (!selectedRobot) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Robot tidak ditemukan</p>
      </div>
    );
  }

  // Menghitung statistik sederhana dari data yang ada
  const totalReadings = robotAirReadings.length;
  const avgTemp = (robotAirReadings.reduce((sum, r) => sum + (r.temperature || 0), 0) / totalReadings).toFixed(1);
  const avgAqi = (robotAirReadings.reduce((sum, r) => sum + (r.aq_number || 0), 0) / totalReadings).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Riwayat Robot</h1>
          <Badge variant="outline">{selectedRobot.robot_id}</Badge>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Robot Selector */}
          <Select value={selectedRobotId} onValueChange={onRobotSelect}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pilih Robot" />
            </SelectTrigger>
            <SelectContent>
              {robots.map((robot) => (
                <SelectItem key={robot.robot_id} value={robot.robot_id}>
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span>{robot.robot_id}</span>
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
            <CardTitle className="text-sm font-medium">Total Data</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReadings}</div>
            <p className="text-xs text-muted-foreground">sensor readings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTemp}°C</div>
            <p className="text-xs text-muted-foreground">rata-rata suhu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. AQI</CardTitle>
            <Wind className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAqi}</div>
            <p className="text-xs text-muted-foreground">rata-rata kualitas udara</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">data belum tersedia</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="sensors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sensors">Sensor Data</TabsTrigger>
          <TabsTrigger value="tasks">Task History</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Sensors Data Tab */}
        <TabsContent value="sensors" className="space-y-6">
          {/* Sensor Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sensor Data Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sensorHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tickFormatter={(value) => value}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label) => `Waktu: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Suhu (°C)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Kelembaban (%)"
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
                    <TableHead>Suhu (°C)</TableHead>
                    <TableHead>Kelembaban (%)</TableHead>
                    <TableHead>PM2.5 (μg/m³)</TableHead>
                    <TableHead>PM10 (μg/m³)</TableHead>
                    <TableHead>AQI</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {robotAirReadings.slice(0, 50).map((reading, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(reading.timestamp.seconds * 1000).toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell>{reading.temperature}</TableCell>
                      <TableCell>{reading.humidity}</TableCell>
                      <TableCell>{reading.dust_pm25}</TableCell>
                      <TableCell>{reading.dust_pm25 ? (reading.dust_pm25 * 1.5).toFixed(1) : 'N/A'}</TableCell>
                      <TableCell>{reading.aq_number}</TableCell>
                      <TableCell>
                        <Badge variant={reading.aq_status === 'Baik' ? 'default' : 'destructive'}>
                          {reading.aq_status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Task History Tab - placeholder */}
        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Riwayat Tugas</CardTitle></CardHeader>
            <CardContent>
              <div className="text-center p-8 text-muted-foreground">
                <p>Data riwayat tugas belum tersedia.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab - placeholder */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Riwayat Maintenance</CardTitle></CardHeader>
            <CardContent>
              <div className="text-center p-8 text-muted-foreground">
                <p>Data riwayat maintenance belum tersedia.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab - placeholder */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>System Alerts</CardTitle></CardHeader>
            <CardContent>
              <div className="text-center p-8 text-muted-foreground">
                <p>Data peringatan sistem belum tersedia.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
