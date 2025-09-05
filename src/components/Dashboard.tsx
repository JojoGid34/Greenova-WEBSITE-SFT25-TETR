import { useState, useEffect } from 'react';
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
  Gauge,
  Camera,
  Brain,
  Eye,
  TreePine,
  Lightbulb
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { usePrediction } from '../hooks/usePrediction';
import { 
  formatValue,
  formatNumber,
  formatPercentage,
  formatTimestamp,
  formatTimeAgo,
  formatSignalStrength,
  formatBatteryLevel,
  formatAirQualityStatus,
  getStatusColor
} from '../utils/displayUtils';

interface DashboardProps {
  selectedRobotId: string;
  onRobotSelect: (robotId: string) => void;
}

// Helper function untuk mendapatkan status warna
const getStatusColor = (status: string) => {
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

const getStatusIcon = (status: string) => {
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

const getSignalStrengthStatus = (signal: number) => {
  if (signal > 70) return 'Kuat';
  if (signal > 30) return 'Sedang';
  return 'Lemah';
};

const getBatteryStatus = (battery: number) => {
  if (battery > 50) return 'Baik';
  if (battery > 20) return 'Rendah';
  return 'Kritis';
};

const getAirQualityStatus = (aqi: number) => {
  if (aqi > 80) return 'Baik';
  if (aqi > 50) return 'Sedang';
  return 'Buruk';
};

const getAQIStatusColor = (aqi: number) => {
  if (aqi > 80) return 'bg-green-500';
  if (aqi > 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getAQIStatusText = (aqi: number) => {
  if (aqi > 80) return 'Baik';
  if (aqi > 50) return 'Sedang';
  return 'Buruk';
};


// Mengonversi data dari Firebase ke format chart dengan urutan waktu yang benar
const processDataForCharts = (data: any[]) => {
  if (!data || data.length === 0) return [];
  
  // Sortir data berdasarkan timestamp (dari lama ke baru)
  const sortedData = [...data].sort((a, b) => {
    const timeA = a.timestamp?.seconds || 0;
    const timeB = b.timestamp?.seconds || 0;
    return timeA - timeB;
  });
  
  const hourly = sortedData.map((doc: any) => ({
    time: new Date(doc.timestamp?.seconds * 1000).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    temperature: doc.temperature || 0,
    humidity: doc.humidity || 0,
    airQuality: doc.aq_number || 0,
    pm25: doc.dust_pm25 || 0,
    timestamp: doc.timestamp?.seconds || 0
  }));
  
  // Ambil 20 data terakhir dengan urutan waktu yang benar (kiri ke kanan: lama ke baru)
  return hourly.slice(-20);
};

export function Dashboard({ selectedRobotId, onRobotSelect }: DashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Menggunakan data real-time dari Firebase
  const { robots, airReadings, loading } = useFirebaseData();
  
  // Menggunakan hook prediksi
  const { predictions, loading: predictionsLoading } = usePrediction(airReadings);
  
  const selectedRobot = robots.find(robot => robot.robot_id === selectedRobotId);
  const robotAirReadings = airReadings.filter(reading => reading.robot_id === selectedRobotId);
  const latestAirReading = robotAirReadings.length > 0 ? robotAirReadings[0] : null;

  const sensorHistory = processDataForCharts(robotAirReadings);

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

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Dashboard Robot</h1>
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
                    {getStatusIcon('online')}
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
              {getStatusIcon('online')}
              <span className={`text-2xl font-bold capitalize ${getStatusColor('online')}`}>
                online
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Update: {formatTimeAgo(selectedRobot.last_seen)}
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
            <div className={`text-2xl font-bold ${getStatusColor(selectedRobot.battery, 'battery')}`}>
              {formatBatteryLevel(selectedRobot.battery)}
            </div>
            <Progress value={selectedRobot.battery || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {getBatteryStatus(selectedRobot.battery || 0)}
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
            <div className={`text-2xl font-bold ${getStatusColor(selectedRobot.signal_strength, 'signal')}`}>
              {formatPercentage(selectedRobot.signal_strength)}
            </div>
            <Progress value={selectedRobot.signal_strength || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {formatSignalStrength(selectedRobot.signal_strength)}
            </p>
          </CardContent>
        </Card>

        {/* Air Quality */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kualitas Udara</CardTitle>
            <Wind className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(latestAirReading?.aq_status, 'air_quality')}`}>
              {formatAirQualityStatus(latestAirReading?.aq_status)}
            </div>
            <Badge className={`${getAQIStatusColor(latestAirReading?.aq_number || 0)} text-white mt-2`}>
              {getAQIStatusText(latestAirReading?.aq_number || 0)}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              PM2.5: {formatNumber(latestAirReading?.dust_pm25, 1, ' μg/m³')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sensors">Sensor Data</TabsTrigger>
          <TabsTrigger value="predictions">Prediksi AI</TabsTrigger>
          <TabsTrigger value="controls">Robot Controls</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suhu & Kelembaban</CardTitle>
                <Thermometer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{formatNumber(latestAirReading?.temperature, 1, '°C')}</span>
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-2xl font-bold">{formatPercentage(latestAirReading?.humidity)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Kelembaban: {formatPercentage(latestAirReading?.humidity)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status Kipas</CardTitle>
                <Wind className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {selectedRobot.fan_status ? 'Menyala' : 'Mati'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Status berdasarkan kualitas udara
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prediksi 1 Jam</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {predictionsLoading ? (
                  <div className="text-muted-foreground">Memuat prediksi...</div>
                ) : predictions ? (
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {predictions.air_quality.next_hour.aq_status}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      PM2.5: {predictions.air_quality.next_hour.pm25} μg/m³
                    </p>
                    <Badge variant="outline" className="text-xs">
                      Akurasi: {predictions.air_quality.next_hour.confidence}%
                    </Badge>
                  </div>
                ) : (
                  <div className="text-muted-foreground">Data tidak tersedia</div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sensor Data Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {sensorHistory && sensorHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sensorHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
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
                      dataKey="airQuality"
                      stroke="#22c55e"
                      strokeWidth={2}
                      name="Kualitas Udara"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <p>Tidak ada data sensor tersedia</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictionsLoading ? (
              <Card className="col-span-full">
                <CardContent className="p-6 text-center">
                  <div className="text-muted-foreground">Memuat prediksi AI...</div>
                </CardContent>
              </Card>
            ) : predictions ? (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Prediksi 1 Jam</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-lg font-bold text-center">
                        {predictions.air_quality.next_hour.aq_status}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>PM2.5: {predictions.air_quality.next_hour.pm25}</div>
                        <div>Gas: {predictions.air_quality.next_hour.gas_ppm}</div>
                        <div>Suhu: {predictions.air_quality.next_hour.temperature}°C</div>
                        <div>RH: {predictions.air_quality.next_hour.humidity}%</div>
                      </div>
                      <Badge variant="outline" className="w-full justify-center">
                        Akurasi: {predictions.air_quality.next_hour.confidence}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Prediksi 6 Jam</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-lg font-bold text-center">
                        {predictions.air_quality.next_6_hours.aq_status}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>PM2.5: {predictions.air_quality.next_6_hours.pm25}</div>
                        <div>Gas: {predictions.air_quality.next_6_hours.gas_ppm}</div>
                        <div>Suhu: {predictions.air_quality.next_6_hours.temperature}°C</div>
                        <div>RH: {predictions.air_quality.next_6_hours.humidity}%</div>
                      </div>
                      <Badge variant="outline" className="w-full justify-center">
                        Akurasi: {predictions.air_quality.next_6_hours.confidence}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Prediksi 24 Jam</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-lg font-bold text-center">
                        {predictions.air_quality.next_24_hours.aq_status}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>PM2.5: {predictions.air_quality.next_24_hours.pm25}</div>
                        <div>Gas: {predictions.air_quality.next_24_hours.gas_ppm}</div>
                        <div>Suhu: {predictions.air_quality.next_24_hours.temperature}°C</div>
                        <div>RH: {predictions.air_quality.next_24_hours.humidity}%</div>
                      </div>
                      <Badge variant="outline" className="w-full justify-center">
                        Akurasi: {predictions.air_quality.next_24_hours.confidence}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="col-span-full">
                <CardContent className="p-6 text-center">
                  <div className="text-muted-foreground">Prediksi tidak tersedia</div>
                </CardContent>
              </Card>
            )}
          </div>

          {predictions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Rekomendasi Lingkungan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Trend Cuaca:</h4>
                      <Badge variant={predictions.environmental.weather_trend === 'Membaik' ? 'default' : 
                                   predictions.environmental.weather_trend === 'Stabil' ? 'secondary' : 'destructive'}>
                        {predictions.environmental.weather_trend}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Sumber Polusi:</h4>
                      <div className="flex flex-wrap gap-1">
                        {predictions.environmental.pollution_sources.map((source, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Rekomendasi:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {predictions.environmental.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Sensors Tab */}
        <TabsContent value="sensors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suhu Lingkungan</CardTitle>
                <Thermometer className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(latestAirReading?.temperature, 1, '°C')}</div>
                <div className="mt-2">
                  <Progress
                    value={latestAirReading ? Math.min((latestAirReading.temperature / 50) * 100, 100) : 0}
                    className="h-2"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Range: 20-35°C (Normal)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kelembaban Udara</CardTitle>
                <Droplets className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPercentage(latestAirReading?.humidity)}</div>
                <div className="mt-2">
                  <Progress value={latestAirReading?.humidity || 0} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Range: 40-80% (Optimal)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">PM2.5</CardTitle>
                <Wind className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(latestAirReading?.dust_pm25, 1, ' μg/m³')}</div>
                <div className="mt-2">
                  <Progress value={latestAirReading ? Math.min((latestAirReading.dust_pm25 / 150) * 100, 100) : 0} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Batas Aman: &lt; 35 μg/m³
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">PM10</CardTitle>
                <Wind className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(latestAirReading?.dust_pm25 ? latestAirReading.dust_pm25 * 1.5 : undefined, 1, ' μg/m³')}</div>
                <div className="mt-2">
                  <Progress value={latestAirReading ? Math.min((latestAirReading.dust_pm25 * 1.5 / 200) * 100, 100) : 0} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Batas Aman: &lt; 50 μg/m³
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gas PPM</CardTitle>
                <Zap className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(latestAirReading?.gas_ppm, 2, ' ppm')}</div>
                <div className="mt-2">
                  <Progress value={latestAirReading ? Math.min((latestAirReading.gas_ppm / 500) * 100, 100) : 0} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Range: 0-500 ppm
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>



        {/* Controls Tab */}
        <TabsContent value="controls" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Manual Control</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline"><Play className="h-4 w-4 mr-2" />Start</Button>
                    <Button variant="outline"><Pause className="h-4 w-4 mr-2" />Pause</Button>
                    <Button variant="outline"><Square className="h-4 w-4 mr-2" />Stop</Button>
                    <Button variant="outline"><RotateCcw className="h-4 w-4 mr-2" />Reset</Button>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
