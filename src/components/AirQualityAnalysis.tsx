import React, { useState, useEffect } from 'react';
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
import { useFirebaseData } from '../hooks/useFirebaseData';
import { usePrediction } from '../hooks/usePrediction';

// Fungsi pembantu untuk mengonversi data dengan urutan waktu yang benar
const processDataForCharts = (data: any[]) => {
  // Always return safe default data structure
  const defaultComposition = [
    { name: 'PM2.5', value: 15, color: '#ef4444' },
    { name: 'PM10', value: 22, color: '#f59e0b' },
    { name: 'O3', value: 25, color: '#22c55e' },
    { name: 'NO2', value: 18, color: '#3b82f6' },
    { name: 'SO2', value: 12, color: '#8b5cf6' },
    { name: 'CO', value: 8, color: '#64748b' }
  ];

  // Handle empty or invalid data
  if (!Array.isArray(data) || data.length === 0) {
    return {
      hourly: [],
      composition: defaultComposition
    };
  }
  
  try {
    // Sortir data berdasarkan timestamp (dari lama ke baru)
    const sortedData = data.filter(item => item && typeof item === 'object').sort((a, b) => {
      const timeA = a.timestamp?.seconds || 0;
      const timeB = b.timestamp?.seconds || 0;
      return timeA - timeB;
    });
    
    const hourly = sortedData.map((doc) => {
      // Ensure safe data extraction
      const timestamp = doc.timestamp?.seconds;
      const timeString = timestamp 
        ? new Date(timestamp * 1000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        : new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      
      return {
        time: timeString,
        pm25: Number(doc.dust_pm25) || 0,
        pm10: Number(doc.dust_pm25) ? Number(doc.dust_pm25) * 1.5 : 0,
        temperature: Number(doc.temperature) || 0,
        humidity: Number(doc.humidity) || 0,
        timestamp: timestamp || 0
      };
    }).slice(-24); // Ambil 24 data terakhir dengan urutan waktu yang benar

    // Get the latest valid data
    const latestData = sortedData[sortedData.length - 1];
    if (latestData && typeof latestData === 'object') {
      const pm25Value = Number(latestData.dust_pm25) || 0;
      const pm10Value = pm25Value > 0 ? pm25Value * 1.5 : 0;

      // Only update composition if we have valid PM data
      if (pm25Value > 0) {
        const composition = [
          { name: 'PM2.5', value: Math.round(pm25Value), color: '#ef4444' },
          { name: 'PM10', value: Math.round(pm10Value), color: '#f59e0b' },
          { name: 'O3', value: 25, color: '#22c55e' },
          { name: 'NO2', value: 18, color: '#3b82f6' },
          { name: 'SO2', value: 12, color: '#8b5cf6' },
          { name: 'CO', value: 8, color: '#64748b' }
        ].filter(item => Number(item.value) > 0 && Number.isFinite(item.value));

        return { hourly, composition };
      }
    }

    // Fallback to default composition if no valid data
    return { hourly, composition: defaultComposition };
    
  } catch (error) {
    console.warn('Error processing chart data:', error);
    return {
      hourly: [],
      composition: defaultComposition
    };
  }
};

const getColorForPollutant = (pollutant: string) => {
  switch (pollutant) {
    case 'pm25': return '#ef4444';
    case 'pm10': return '#f59e0b';
    case 'o3': return '#22c55e';
    case 'no2': return '#3b82f6';
    case 'so2': return '#8b5cf6';
    case 'co': return '#64748b';
    default: return '#cccccc';
  }
};

const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) return { status: 'Baik', color: 'bg-green-500', textColor: 'text-green-500' };
  if (aqi <= 100) return { status: 'Sedang', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
  if (aqi <= 150) return { status: 'Tidak Sehat untuk Sensitif', color: 'bg-orange-500', textColor: 'text-orange-500' };
  if (aqi <= 200) return { status: 'Tidak Sehat', color: 'bg-red-500', textColor: 'text-red-500' };
  return { status: 'Sangat Tidak Sehat', color: 'bg-purple-500', textColor: 'text-purple-500' };
};

export function AirQualityAnalysis() {
  const { airReadings, loading, error } = useFirebaseData();
  const { predictions, loading: predictionsLoading } = usePrediction(airReadings);
  
  // Proses data untuk grafik dan tabel
  const { hourly, composition } = processDataForCharts(airReadings);
  const currentData = airReadings.length > 0 ? airReadings[0] : null;
  const currentAQI = currentData?.aq_number || 45;
  const aqiStatus = getAQIStatus(currentAQI);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Memuat data kualitas udara...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-3xl font-bold">{currentData?.dust_pm25 || 0}</p>
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
                <p className="text-3xl font-bold">{currentData?.dust_pm25 ? (currentData.dust_pm25 * 1.5).toFixed(1) : 0}</p>
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
                <span className="font-medium">{currentData?.temperature || 0}°C</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Kelembaban</span>
                </div>
                <span className="font-medium">{currentData?.humidity || 0}%</span>
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
              {hourly && hourly.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hourly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => String(value).slice(0, 5)}
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
                        connectNulls={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="pm10"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        name="PM10 (μg/m³)"
                        connectNulls={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  <p>Tidak ada data trend 24 jam tersedia</p>
                </div>
              )}
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
                  <BarChart data={[
                    { day: 'Sen', pm25: 45, pm10: 68, aqi: 92 },
                    { day: 'Sel', pm25: 52, pm10: 78, aqi: 105 },
                    { day: 'Rab', pm25: 38, pm10: 57, aqi: 78 },
                    { day: 'Kam', pm25: 41, pm10: 62, aqi: 85 },
                    { day: 'Jum', pm25: 48, pm10: 72, aqi: 98 },
                    { day: 'Sab', pm25: 35, pm10: 53, aqi: 72 },
                    { day: 'Min', pm25: 32, pm10: 48, aqi: 68 }
                  ]}>
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
                {(() => {
                  try {
                    // Validate composition data thoroughly
                    const validComposition = composition?.filter(item => 
                      item && 
                      typeof item === 'object' && 
                      typeof item.name === 'string' && 
                      typeof item.value === 'number' && 
                      Number.isFinite(item.value) && 
                      item.value > 0 &&
                      typeof item.color === 'string'
                    ) || [];

                    if (validComposition.length === 0) {
                      return (
                        <div className="h-64 flex items-center justify-center text-muted-foreground">
                          <p>Data komposisi tidak tersedia</p>
                        </div>
                      );
                    }

                    return (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={validComposition}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => {
                                try {
                                  if (typeof percent === 'number' && Number.isFinite(percent)) {
                                    return `${name} ${Math.round(percent * 100)}%`;
                                  }
                                  return String(name || '');
                                } catch (e) {
                                  return String(name || '');
                                }
                              }}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {validComposition.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}-${entry.name}`} 
                                  fill={entry.color || '#cccccc'} 
                                />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value, name) => [
                                `${Number(value).toFixed(1)} μg/m³`, 
                                String(name)
                              ]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    );
                  } catch (error) {
                    console.warn('Error rendering PieChart:', error);
                    return (
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <p>Gagal memuat grafik komposisi</p>
                      </div>
                    );
                  }
                })()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detail Polutan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {composition.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.value} μg/m³</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Tren Suhu dan Kelembaban</CardTitle>
              </CardHeader>
              <CardContent>
                {hourly && hourly.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={hourly}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="time"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => String(value).slice(0, 5)}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="temperature"
                          stackId="1"
                          stroke="#ef4444"
                          fill="#ef4444"
                          fillOpacity={0.3}
                          name="Suhu (°C)"
                          connectNulls={false}
                        />
                        <Area
                          type="monotone"
                          dataKey="humidity"
                          stackId="2"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                          name="Kelembaban (%)"
                          connectNulls={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    <p>Tidak ada data trend suhu dan kelembaban tersedia</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Predictions */}
            <Card>
              <CardHeader>
                <CardTitle>Prediksi AI - Kualitas Udara</CardTitle>
              </CardHeader>
              <CardContent>
                {predictionsLoading ? (
                  <div className="text-center p-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-muted-foreground">Memuat prediksi...</p>
                  </div>
                ) : predictions ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">1 Jam Kedepan</span>
                          <Badge variant={predictions.air_quality.next_hour.aq_status === 'Baik' ? 'default' : 
                                         predictions.air_quality.next_hour.aq_status === 'Sedang' ? 'secondary' : 'destructive'}>
                            {predictions.air_quality.next_hour.aq_status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>PM2.5: {predictions.air_quality.next_hour.pm25}</div>
                          <div>Suhu: {predictions.air_quality.next_hour.temperature}°C</div>
                        </div>
                        <div className="mt-2 text-xs">
                          Akurasi: {predictions.air_quality.next_hour.confidence}%
                        </div>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">6 Jam Kedepan</span>
                          <Badge variant={predictions.air_quality.next_6_hours.aq_status === 'Baik' ? 'default' : 
                                         predictions.air_quality.next_6_hours.aq_status === 'Sedang' ? 'secondary' : 'destructive'}>
                            {predictions.air_quality.next_6_hours.aq_status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>PM2.5: {predictions.air_quality.next_6_hours.pm25}</div>
                          <div>Suhu: {predictions.air_quality.next_6_hours.temperature}°C</div>
                        </div>
                        <div className="mt-2 text-xs">
                          Akurasi: {predictions.air_quality.next_6_hours.confidence}%
                        </div>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">24 Jam Kedepan</span>
                          <Badge variant={predictions.air_quality.next_24_hours.aq_status === 'Baik' ? 'default' : 
                                         predictions.air_quality.next_24_hours.aq_status === 'Sedang' ? 'secondary' : 'destructive'}>
                            {predictions.air_quality.next_24_hours.aq_status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>PM2.5: {predictions.air_quality.next_24_hours.pm25}</div>
                          <div>Suhu: {predictions.air_quality.next_24_hours.temperature}°C</div>
                        </div>
                        <div className="mt-2 text-xs">
                          Akurasi: {predictions.air_quality.next_24_hours.confidence}%
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="text-sm font-medium mb-2">Rekomendasi AI:</div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {predictions.environmental.recommendations.slice(0, 3).map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 text-muted-foreground">
                    <p>Prediksi tidak tersedia</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Dynamic Status Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Status Real-time Berdasarkan Database</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* PM2.5 Status */}
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                    (currentData?.dust_pm25 || 0) <= 35 ? 'bg-green-500' : 
                    (currentData?.dust_pm25 || 0) <= 75 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    <Wind className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-medium mb-1">PM2.5</h4>
                  <p className="text-2xl font-bold mb-1">{currentData?.dust_pm25 || 0}</p>
                  <Badge variant={
                    (currentData?.dust_pm25 || 0) <= 35 ? 'default' : 
                    (currentData?.dust_pm25 || 0) <= 75 ? 'secondary' : 'destructive'
                  }>
                    {(currentData?.dust_pm25 || 0) <= 35 ? 'Baik' : 
                     (currentData?.dust_pm25 || 0) <= 75 ? 'Sedang' : 'Buruk'}
                  </Badge>
                </div>

                {/* Temperature Status */}
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                    (currentData?.temperature || 0) <= 30 ? 'bg-blue-500' : 
                    (currentData?.temperature || 0) <= 35 ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    <Thermometer className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-medium mb-1">Suhu</h4>
                  <p className="text-2xl font-bold mb-1">{currentData?.temperature || 0}°C</p>
                  <Badge variant={
                    (currentData?.temperature || 0) <= 30 ? 'secondary' : 
                    (currentData?.temperature || 0) <= 35 ? 'default' : 'destructive'
                  }>
                    {(currentData?.temperature || 0) <= 30 ? 'Sejuk' : 
                     (currentData?.temperature || 0) <= 35 ? 'Normal' : 'Panas'}
                  </Badge>
                </div>

                {/* Humidity Status */}
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                    (currentData?.humidity || 0) >= 40 && (currentData?.humidity || 0) <= 80 ? 'bg-green-500' : 
                    (currentData?.humidity || 0) > 80 ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}>
                    <Droplets className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-medium mb-1">Kelembaban</h4>
                  <p className="text-2xl font-bold mb-1">{currentData?.humidity || 0}%</p>
                  <Badge variant={
                    (currentData?.humidity || 0) >= 40 && (currentData?.humidity || 0) <= 80 ? 'default' : 
                    (currentData?.humidity || 0) > 80 ? 'secondary' : 'destructive'
                  }>
                    {(currentData?.humidity || 0) >= 40 && (currentData?.humidity || 0) <= 80 ? 'Optimal' : 
                     (currentData?.humidity || 0) > 80 ? 'Tinggi' : 'Rendah'}
                  </Badge>
                </div>
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
                {airReadings && airReadings.length > 0 ? (
                  airReadings.slice(0, 10).map((row, index) => {
                    const aqiStatus = getAQIStatus(row.aq_number || 0);
                    return (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          {row.timestamp?.seconds 
                            ? new Date(row.timestamp.seconds * 1000).toLocaleString('id-ID')
                            : 'N/A'
                          }
                        </td>
                        <td className="p-3">{row.temperature || 0}°C</td>
                        <td className="p-3">{row.humidity || 0}%</td>
                        <td className="p-3">{row.dust_pm25 || 0} μg/m³</td>
                        <td className="p-3">{((row.dust_pm25 || 0) * 1.5).toFixed(1)} μg/m³</td>
                        <td className="p-3">
                          <Badge variant={aqiStatus.status === 'Baik' ? 'default' : 'destructive'}>
                            {aqiStatus.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      Tidak ada data historis tersedia
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}