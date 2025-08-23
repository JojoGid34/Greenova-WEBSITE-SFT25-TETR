import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Wind, 
  Gauge, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Thermometer,
  Droplets,
  Eye,
  Activity
} from 'lucide-react';

// Sample data
const hourlyData = [
  { time: '00:00', pm25: 45, pm10: 78, temp: 24, humidity: 72 },
  { time: '01:00', pm25: 42, pm10: 75, temp: 23, humidity: 74 },
  { time: '02:00', pm25: 38, pm10: 71, temp: 22, humidity: 76 },
  { time: '03:00', pm25: 35, pm10: 68, temp: 22, humidity: 78 },
  { time: '04:00', pm25: 40, pm10: 72, temp: 21, humidity: 80 },
  { time: '05:00', pm25: 48, pm10: 82, temp: 22, humidity: 78 },
  { time: '06:00', pm25: 55, pm10: 89, temp: 24, humidity: 75 },
  { time: '07:00', pm25: 62, pm10: 95, temp: 26, humidity: 72 },
  { time: '08:00', pm25: 68, pm10: 102, temp: 28, humidity: 68 },
  { time: '09:00', pm25: 72, pm10: 108, temp: 30, humidity: 65 },
  { time: '10:00', pm25: 75, pm10: 112, temp: 32, humidity: 62 },
  { time: '11:00', pm25: 78, pm10: 118, temp: 33, humidity: 60 },
  { time: '12:00', pm25: 82, pm10: 125, temp: 34, humidity: 58 },
  { time: '13:00', pm25: 85, pm10: 130, temp: 35, humidity: 56 },
  { time: '14:00', pm25: 88, pm10: 135, temp: 36, humidity: 54 },
  { time: '15:00', pm25: 85, pm10: 132, temp: 35, humidity: 56 },
  { time: '16:00', pm25: 80, pm10: 128, temp: 34, humidity: 58 },
  { time: '17:00', pm25: 75, pm10: 120, temp: 32, humidity: 61 },
  { time: '18:00', pm25: 68, pm10: 115, temp: 30, humidity: 64 },
  { time: '19:00', pm25: 62, pm10: 108, temp: 28, humidity: 67 },
  { time: '20:00', pm25: 58, pm10: 102, temp: 27, humidity: 69 },
  { time: '21:00', pm25: 55, pm10: 98, temp: 26, humidity: 70 },
  { time: '22:00', pm25: 52, pm10: 94, temp: 25, humidity: 71 },
  { time: '23:00', pm25: 48, pm10: 88, temp: 24, humidity: 72 }
];

const weeklyData = [
  { day: 'Sen', pm25: 65, pm10: 98, aqi: 72 },
  { day: 'Sel', pm25: 72, pm10: 105, aqi: 78 },
  { day: 'Rab', pm25: 68, pm10: 102, aqi: 75 },
  { day: 'Kam', pm25: 58, pm10: 89, aqi: 65 },
  { day: 'Jum', pm25: 52, pm10: 85, aqi: 58 },
  { day: 'Sab', pm25: 48, pm10: 78, aqi: 55 },
  { day: 'Min', pm25: 45, pm10: 75, aqi: 52 }
];

const compositionData = [
  { name: 'PM2.5', value: 35, color: '#ef4444' },
  { name: 'PM10', value: 25, color: '#f59e0b' },
  { name: 'O₃', value: 20, color: '#22c55e' },
  { name: 'NO₂', value: 12, color: '#3b82f6' },
  { name: 'SO₂', value: 5, color: '#8b5cf6' },
  { name: 'CO', value: 3, color: '#64748b' }
];

const historicalData = [
  { date: '2024-01-15 14:00', temp: 34, humidity: 56, pm25: 85, pm10: 130, status: 'Tidak Sehat' },
  { date: '2024-01-15 13:00', temp: 33, humidity: 58, pm25: 82, pm10: 125, status: 'Tidak Sehat' },
  { date: '2024-01-15 12:00', temp: 32, humidity: 60, pm25: 78, pm10: 118, status: 'Tidak Sehat' },
  { date: '2024-01-15 11:00', temp: 31, humidity: 62, pm25: 75, pm10: 112, status: 'Sedang' },
  { date: '2024-01-15 10:00', temp: 30, humidity: 65, pm25: 72, pm10: 108, status: 'Sedang' },
];

const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) return { status: 'Baik', color: 'bg-green-500', textColor: 'text-green-500' };
  if (aqi <= 100) return { status: 'Sedang', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
  if (aqi <= 150) return { status: 'Tidak Sehat untuk Sensitif', color: 'bg-orange-500', textColor: 'text-orange-500' };
  if (aqi <= 200) return { status: 'Tidak Sehat', color: 'bg-red-500', textColor: 'text-red-500' };
  return { status: 'Sangat Tidak Sehat', color: 'bg-purple-500', textColor: 'text-purple-500' };
};

export function AirQualityAnalysis() {
  const currentAQI = 78;
  const aqiStatus = getAQIStatus(currentAQI);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analisis Kualitas Udara</h1>
          <p className="text-muted-foreground">Monitoring real-time dan analisis tren kualitas udara</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Current Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* AQI Card */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Air Quality Index</p>
                <p className="text-3xl font-bold">{currentAQI}</p>
                <Badge className={`${aqiStatus.color} text-white mt-2`}>
                  {aqiStatus.status}
                </Badge>
              </div>
              <div className={`w-16 h-16 rounded-full ${aqiStatus.color} flex items-center justify-center`}>
                <Wind className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <TrendingUp className={`h-4 w-4 ${aqiStatus.textColor}`} />
              <span className={aqiStatus.textColor}>+8% dari kemarin</span>
            </div>
          </CardContent>
        </Card>

        {/* PM2.5 Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">PM2.5</p>
                <p className="text-3xl font-bold">85</p>
                <p className="text-sm text-muted-foreground">μg/m³</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <Gauge className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <span className="text-red-500">Tinggi - Hindari aktivitas outdoor</span>
            </div>
          </CardContent>
        </Card>

        {/* PM10 Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">PM10</p>
                <p className="text-3xl font-bold">135</p>
                <p className="text-sm text-muted-foreground">μg/m³</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <TrendingDown className="h-4 w-4 text-green-500" />
              <span className="text-green-500">Turun 5% dalam 2 jam</span>
            </div>
          </CardContent>
        </Card>

        {/* Environmental Conditions */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Suhu</span>
                </div>
                <span className="font-medium">35°C</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Kelembaban</span>
                </div>
                <span className="font-medium">54%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Jarak Pandang</span>
                </div>
                <span className="font-medium">8 km</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="hourly" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hourly">24 Jam</TabsTrigger>
          <TabsTrigger value="weekly">7 Hari</TabsTrigger>
          <TabsTrigger value="composition">Komposisi</TabsTrigger>
          <TabsTrigger value="trends">Tren</TabsTrigger>
        </TabsList>

        <TabsContent value="hourly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tren Kualitas Udara - 24 Jam Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => value.slice(0, 5)}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="pm25" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="PM2.5 (μg/m³)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pm10" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      name="PM10 (μg/m³)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Mingguan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pm25" fill="#ef4444" name="PM2.5" />
                    <Bar dataKey="pm10" fill="#f59e0b" name="PM10" />
                    <Bar dataKey="aqi" fill="#22c55e" name="AQI" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="composition" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Komposisi Polutan Udara</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={compositionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => {
                          if (percent !== undefined) {
                            return `${name} ${(percent * 100).toFixed(0)}%`;
                          }
                          return name;
                        }}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {compositionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detail Polutan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {compositionData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.value}%</span>
                        {item.value > 30 ? (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tren Suhu dan Kelembaban</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => value.slice(0, 5)}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="temp" 
                      stackId="1" 
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.3}
                      name="Suhu (°C)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="humidity" 
                      stackId="2" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                      name="Kelembaban (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Historical Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Historis Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Waktu</th>
                  <th className="text-left p-3 font-medium">Suhu (°C)</th>
                  <th className="text-left p-3 font-medium">Kelembaban (%)</th>
                  <th className="text-left p-3 font-medium">PM2.5 (μg/m³)</th>
                  <th className="text-left p-3 font-medium">PM10 (μg/m³)</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {historicalData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3">{row.date}</td>
                    <td className="p-3">{row.temp}</td>
                    <td className="p-3">{row.humidity}</td>
                    <td className="p-3">{row.pm25}</td>
                    <td className="p-3">{row.pm10}</td>
                    <td className="p-3">
                      <Badge variant={row.status === 'Baik' ? 'default' : 'destructive'}>
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Rekomendasi Berdasarkan Kualitas Udara Saat Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-700 dark:text-red-400">Aktivitas Luar Ruangan</h4>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    Hindari olahraga dan aktivitas berat di luar ruangan. Gunakan masker jika harus keluar.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-start gap-3">
                <Wind className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-700 dark:text-orange-400">Sirkulasi Udara</h4>
                  <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">
                    Tutup jendela dan gunakan air purifier di dalam ruangan untuk menjaga kualitas udara.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-700 dark:text-green-400">Robot GREENOVA</h4>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    Robot aktif membantu memfilter polutan dan meningkatkan kualitas udara area taman.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}