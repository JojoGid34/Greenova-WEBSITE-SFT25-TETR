import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
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
  Area,
} from "recharts";
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
  Activity,
  Bot,
  Lightbulb,
  Info,
  Table,
} from "lucide-react";
import { useFirebaseData } from "../hooks/useFirebaseData";
import { usePrediction } from "../hooks/usePrediction";

// Utility functions
const formatDateTime = (timestamp: any) => {
  if (!timestamp) return 'N/A';
  const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'short' 
  }) + ', ' + date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const formatTime = (timestamp: any) => {
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

const getAQIStatus = (aqi: number) => {
  if (aqi <= 50)
    return {
      status: "Baik",
      color: "bg-green-500",
      textColor: "text-green-500",
      icon: CheckCircle2,
    };
  if (aqi <= 100)
    return {
      status: "Sedang",
      color: "bg-yellow-500",
      textColor: "text-yellow-500",
      icon: Info,
    };
  if (aqi <= 150)
    return {
      status: "Tidak Sehat untuk Sensitif",
      color: "bg-orange-500",
      textColor: "text-orange-500",
      icon: AlertTriangle,
    };
  if (aqi <= 200)
    return {
      status: "Tidak Sehat",
      color: "bg-red-500",
      textColor: "text-red-500",
      icon: AlertTriangle,
    };
  return {
    status: "Sangat Tidak Sehat",
    color: "bg-purple-500",
    textColor: "text-purple-500",
    icon: AlertTriangle,
  };
};

const getPMStatus = (value: number, type: 'PM2.5' | 'PM10') => {
  const limits = type === 'PM2.5' ? [35, 75, 115] : [75, 150, 250];
  
  if (value <= limits[0])
    return {
      status: "Baik",
      color: "bg-green-500",
      textColor: "text-green-500",
      icon: CheckCircle2,
    };
  if (value <= limits[1])
    return {
      status: "Sedang",
      color: "bg-yellow-500",
      textColor: "text-yellow-500",
      icon: Info,
    };
  if (value <= limits[2])
    return {
      status: "Tidak Sehat",
      color: "bg-orange-500",
      textColor: "text-orange-500",
      icon: AlertTriangle,
    };
  return {
    status: "Berbahaya",
    color: "bg-red-500",
    textColor: "text-red-500",
    icon: AlertTriangle,
  };
};

// Custom Tooltip Component for better formatting
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border">
        <p className="font-medium">{`Waktu: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey === 'pm25' ? 'PM2.5' : entry.dataKey === 'pm10' ? 'PM10' : entry.dataKey === 'aqi' ? 'AQI' : entry.dataKey}: ${entry.value.toFixed(2)}`}
            {entry.dataKey === 'pm25' || entry.dataKey === 'pm10' ? ' μg/m³' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AirQualityAnalysis() {
  const { airReadings, loading, error } = useFirebaseData();
  
  // Processed data with memoization to prevent unnecessary re-renders
  const processedData = useMemo(() => {
    if (!airReadings || airReadings.length === 0) {
      return {
        current: null,
        hourly: [],
        daily: [],
        composition: [],
        trends: { aqi: 0, pm25: 0, pm10: 0 }
      };
    }

    // Sort data by timestamp (oldest to newest)
    const sortedData = airReadings
      .filter(item => item && item.timestamp)
      .sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeA - timeB;
      });

    // Current data (latest)
    const current = sortedData[sortedData.length - 1];

    // Last 15 data points for hourly chart
    const hourly = sortedData.slice(-15).map(item => {
      const pm25 = Number(item.dust_pm25) || 0;
      const gasPpm = Number(item.gas_ppm) || 0;
      const aqi = pm25 > 0 ? Math.round((pm25 * 2.5) + (gasPpm * 0.5)) : 0;
      
      return {
        time: formatTime(item.timestamp),
        pm25: pm25,
        pm10: gasPpm, // Using gas_ppm as PM10 equivalent
        aqi: aqi,
        temperature: Number(item.temperature) || 0,
        humidity: Number(item.humidity) || 0,
        timestamp: item.timestamp?.seconds || 0
      };
    });

    // Group by day for weekly chart
    const groupedByDay = {};
    sortedData.forEach(item => {
      if (!item.timestamp) return;
      
      const date = new Date(item.timestamp.seconds * 1000);
      const dayKey = date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short' 
      });
      
      if (!groupedByDay[dayKey]) {
        groupedByDay[dayKey] = [];
      }
      groupedByDay[dayKey].push(item);
    });

    // Calculate daily averages for last 7 days
    const daily = Object.entries(groupedByDay)
      .slice(-7)
      .map(([day, data]: [string, any[]]) => {
        const avgPm25 = data.reduce((sum, item) => sum + (Number(item.dust_pm25) || 0), 0) / data.length;
        const avgGas = data.reduce((sum, item) => sum + (Number(item.gas_ppm) || 0), 0) / data.length;
        const avgAqi = avgPm25 > 0 ? Math.round((avgPm25 * 2.5) + (avgGas * 0.5)) : 0;
        
        return {
          day,
          pm25: Number(avgPm25.toFixed(1)),
          pm10: Number(avgGas.toFixed(1)),
          aqi: avgAqi
        };
      });

    // Composition from current data
    const composition = current ? [
      {
        name: "PM2.5",
        value: Number(current.dust_pm25) || 0,
        color: "#ef4444",
      },
      {
        name: "Gas",
        value: Number(current.gas_ppm) || 0,
        color: "#f59e0b",
      },
    ].filter(item => item.value > 0) : [];

    // Calculate trends (compare current with previous day average if available)
    const trends = { aqi: 0, pm25: 0, pm10: 0 };
    if (sortedData.length > 1) {
      const yesterday = sortedData.slice(-48, -24); // Rough estimate for previous day
      if (yesterday.length > 0) {
        const currentPm25 = Number(current?.dust_pm25) || 0;
        const currentGas = Number(current?.gas_ppm) || 0;
        const currentAqi = currentPm25 > 0 ? Math.round((currentPm25 * 2.5) + (currentGas * 0.5)) : 0;
        
        const avgYesterdayPm25 = yesterday.reduce((sum, item) => sum + (Number(item.dust_pm25) || 0), 0) / yesterday.length;
        const avgYesterdayGas = yesterday.reduce((sum, item) => sum + (Number(item.gas_ppm) || 0), 0) / yesterday.length;
        const avgYesterdayAqi = avgYesterdayPm25 > 0 ? Math.round((avgYesterdayPm25 * 2.5) + (avgYesterdayGas * 0.5)) : 0;
        
        trends.pm25 = avgYesterdayPm25 > 0 ? Math.round(((currentPm25 - avgYesterdayPm25) / avgYesterdayPm25) * 100) : 0;
        trends.pm10 = avgYesterdayGas > 0 ? Math.round(((currentGas - avgYesterdayGas) / avgYesterdayGas) * 100) : 0;
        trends.aqi = avgYesterdayAqi > 0 ? Math.round(((currentAqi - avgYesterdayAqi) / avgYesterdayAqi) * 100) : 0;
      }
    }

    return { current, hourly, daily, composition, trends };
  }, [airReadings]);

  // AI-generated recommendations using Gemini API
  const [recommendations, setRecommendations] = useState({ text: '', icon: Lightbulb });
  const [trendsText, setTrendsText] = useState('');

  useEffect(() => {
    const generateRecommendations = async () => {
      if (!processedData.current) return;

      const current = processedData.current;
      const pm25 = Number(current.dust_pm25) || 0;
      const gasPpm = Number(current.gas_ppm) || 0;
      const aqi = pm25 > 0 ? Math.round((pm25 * 2.5) + (gasPpm * 0.5)) : 0;
      
      const prompt = `
        Berikan rekomendasi singkat (maksimal 2 kalimat) dalam Bahasa Indonesia untuk kondisi udara saat ini:
        - PM2.5: ${pm25} μg/m³
        - Gas PPM: ${gasPpm} ppm
        - AQI: ${aqi}
        - Suhu: ${current.temperature || 'N/A'}°C
        - Kelembaban: ${current.humidity || 'N/A'}%

        Berikan rekomendasi praktis untuk aktivitas sehari-hari.
      `;

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyB9EsmQ8_mthCuXGMSL3e5EezFhRuqYg-Q`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          }
        );
        
        const result = await response.json();
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
          setRecommendations({
            text: result.candidates[0].content.parts[0].text,
            icon: aqi <= 50 ? CheckCircle2 : aqi <= 100 ? Info : AlertTriangle
          });
        }
      } catch (error) {
        console.error('Error generating recommendations:', error);
        setRecommendations({
          text: 'Pantau terus kualitas udara dan gunakan masker jika diperlukan.',
          icon: Info
        });
      }
    };

    const generateTrends = async () => {
      if (!processedData.trends) return;

      const { aqi, pm25, pm10 } = processedData.trends;
      const prompt = `
        Jelaskan tren kualitas udara dalam 1 kalimat singkat berdasarkan perubahan:
        - AQI: ${aqi > 0 ? '+' : ''}${aqi}%
        - PM2.5: ${pm25 > 0 ? '+' : ''}${pm25}%
        - Gas PPM: ${pm10 > 0 ? '+' : ''}${pm10}%
        
        Gunakan Bahasa Indonesia yang natural.
      `;

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyB9EsmQ8_mthCuXGMSL3e5EezFhRuqYg-Q`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          }
        );
        
        const result = await response.json();
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
          setTrendsText(result.candidates[0].content.parts[0].text);
        }
      } catch (error) {
        console.error('Error generating trends:', error);
        setTrendsText('Tren kualitas udara dalam monitoring.');
      }
    };

    if (processedData.current) {
      generateRecommendations();
      generateTrends();
    }
  }, [processedData.current]);

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

  if (error || !processedData.current) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p>Tidak ada data tersedia</p>
        </div>
      </div>
    );
  }

  const { current, hourly, daily, composition, trends } = processedData;
  const currentPm25 = Number(current.dust_pm25) || 0;
  const currentGas = Number(current.gas_ppm) || 0;
  const currentAqi = currentPm25 > 0 ? Math.round((currentPm25 * 2.5) + (currentGas * 0.5)) : 0;
  
  const aqiStatus = getAQIStatus(currentAqi);
  const pm25Status = getPMStatus(currentPm25, 'PM2.5');
  const pm10Status = getPMStatus(currentGas, 'PM10');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analisis Kualitas Udara</h1>
          <p className="text-muted-foreground">
            Monitoring real-time dan analisis tren kualitas udara
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Current Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AQI Card */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-base text-muted-foreground mb-2">Air Quality Index</p>
                <p className="text-4xl font-bold mb-3">{currentAqi || 'N/A'}</p>
                <Badge className={`${aqiStatus.color} text-white`}>
                  {aqiStatus.status}
                </Badge>
              </div>
              <div className={`w-16 h-16 rounded-full ${aqiStatus.color} flex items-center justify-center flex-shrink-0`}>
                <aqiStatus.icon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              {trends.aqi >= 0 ? (
                <TrendingUp className={`h-4 w-4 ${trends.aqi > 5 ? 'text-red-500' : 'text-green-500'}`} />
              ) : (
                <TrendingDown className={`h-4 w-4 ${trends.aqi < -5 ? 'text-green-500' : 'text-red-500'}`} />
              )}
              <span className={trends.aqi >= 0 ? (trends.aqi > 5 ? 'text-red-500' : 'text-green-500') : (trends.aqi < -5 ? 'text-green-500' : 'text-red-500')}>
                {trends.aqi > 0 ? '+' : ''}{trends.aqi}% dari kemarin
              </span>
            </div>
          </CardContent>
        </Card>

        {/* PM2.5 Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-base text-muted-foreground mb-2">PM2.5</p>
                <p className="text-4xl font-bold mb-3">{currentPm25 > 0 ? currentPm25.toFixed(1) : 'N/A'}</p>
                <Badge className={`${pm25Status.color} text-white`}>
                  {pm25Status.status}
                </Badge>
              </div>
              <div className={`w-16 h-16 rounded-full ${pm25Status.color} flex items-center justify-center flex-shrink-0`}>
                <pm25Status.icon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              {trends.pm25 >= 0 ? (
                <TrendingUp className={`h-4 w-4 ${trends.pm25 > 5 ? 'text-red-500' : 'text-green-500'}`} />
              ) : (
                <TrendingDown className={`h-4 w-4 ${trends.pm25 < -5 ? 'text-green-500' : 'text-red-500'}`} />
              )}
              <span className={trends.pm25 >= 0 ? (trends.pm25 > 5 ? 'text-red-500' : 'text-green-500') : (trends.pm25 < -5 ? 'text-green-500' : 'text-red-500')}>
                {trends.pm25 > 0 ? '+' : ''}{trends.pm25}% dari kemarin
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Gas PPM Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-base text-muted-foreground mb-2">Gas PPM</p>
                <p className="text-4xl font-bold mb-3">{currentGas > 0 ? currentGas.toFixed(1) : 'N/A'}</p>
                <Badge className={`${pm10Status.color} text-white`}>
                  {pm10Status.status}
                </Badge>
              </div>
              <div className={`w-16 h-16 rounded-full ${pm10Status.color} flex items-center justify-center flex-shrink-0`}>
                <pm10Status.icon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              {trends.pm10 >= 0 ? (
                <TrendingUp className={`h-4 w-4 ${trends.pm10 > 5 ? 'text-red-500' : 'text-green-500'}`} />
              ) : (
                <TrendingDown className={`h-4 w-4 ${trends.pm10 < -5 ? 'text-green-500' : 'text-red-500'}`} />
              )}
              <span className={trends.pm10 >= 0 ? (trends.pm10 > 5 ? 'text-red-500' : 'text-green-500') : (trends.pm10 < -5 ? 'text-green-500' : 'text-red-500')}>
                {trends.pm10 > 0 ? '+' : ''}{trends.pm10}% dari kemarin
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <recommendations.icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Rekomendasi AI GREENOVA</h3>
              <p className="text-muted-foreground leading-relaxed">{recommendations.text}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="24h" className="space-y-6">
        <TabsList>
          <TabsTrigger value="24h">24 Jam Terakhir</TabsTrigger>
          <TabsTrigger value="7d">7 Hari Terakhir</TabsTrigger>
          <TabsTrigger value="composition">Komposisi</TabsTrigger>
        </TabsList>

        <TabsContent value="24h" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grafik 15 Data Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourly}>
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
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="aqi"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="AQI"
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
                      dataKey="pm10"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Gas PPM"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="7d" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Tren 7 Hari - {daily.length > 0 ? 
                  `${daily[0]?.day} - ${daily[daily.length - 1]?.day}` : 
                  'Tidak ada data'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={daily}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="aqi" fill="#ef4444" name="AQI" />
                    <Bar dataKey="pm25" fill="#f59e0b" name="PM2.5" />
                    <Bar dataKey="pm10" fill="#3b82f6" name="Gas PPM" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="composition" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Komposisi Polutan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={composition}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {composition.map((entry, index) => (
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
                <CardTitle>Analisis Tren</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Ringkasan Tren</h4>
                    <p className="text-sm text-muted-foreground">{trendsText || 'Sedang menganalisis data...'}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span>AQI</span>
                    <div className="flex items-center gap-2">
                      {trends.aqi >= 0 ? <TrendingUp className="h-4 w-4 text-red-500" /> : <TrendingDown className="h-4 w-4 text-green-500" />}
                      <span className={trends.aqi >= 0 ? 'text-red-500' : 'text-green-500'}>
                        {trends.aqi > 0 ? '+' : ''}{trends.aqi}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span>PM2.5</span>
                    <div className="flex items-center gap-2">
                      {trends.pm25 >= 0 ? <TrendingUp className="h-4 w-4 text-red-500" /> : <TrendingDown className="h-4 w-4 text-green-500" />}
                      <span className={trends.pm25 >= 0 ? 'text-red-500' : 'text-green-500'}>
                        {trends.pm25 > 0 ? '+' : ''}{trends.pm25}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span>Gas PPM</span>
                    <div className="flex items-center gap-2">
                      {trends.pm10 >= 0 ? <TrendingUp className="h-4 w-4 text-red-500" /> : <TrendingDown className="h-4 w-4 text-green-500" />}
                      <span className={trends.pm10 >= 0 ? 'text-red-500' : 'text-green-500'}>
                        {trends.pm10 > 0 ? '+' : ''}{trends.pm10}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Historical Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table className="h-5 w-5" />
            Data Historis (20 Terbaru)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Waktu</th>
                  <th className="text-left p-2">AQI</th>
                  <th className="text-left p-2">PM2.5</th>
                  <th className="text-left p-2">Gas PPM</th>
                  <th className="text-left p-2">Suhu</th>
                  <th className="text-left p-2">Kelembaban</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {airReadings.slice(0, 20).map((reading, index) => {
                  const pm25 = Number(reading.dust_pm25) || 0;
                  const gasPpm = Number(reading.gas_ppm) || 0;
                  const aqi = pm25 > 0 ? Math.round((pm25 * 2.5) + (gasPpm * 0.5)) : 0;
                  const status = getAQIStatus(aqi);
                  
                  return (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-2">{formatDateTime(reading.timestamp)}</td>
                      <td className="p-2">{aqi || 'N/A'}</td>
                      <td className="p-2">{pm25 > 0 ? pm25.toFixed(1) : 'N/A'}</td>
                      <td className="p-2">{gasPpm > 0 ? gasPpm.toFixed(1) : 'N/A'}</td>
                      <td className="p-2">{reading.temperature || 'N/A'}°C</td>
                      <td className="p-2">{reading.humidity || 'N/A'}%</td>
                      <td className="p-2">
                        <Badge className={`${status.color} text-white`}>
                          {status.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}