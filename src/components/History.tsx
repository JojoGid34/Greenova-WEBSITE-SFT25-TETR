import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { 
  History as HistoryIcon,
  Calendar,
  Download,
  Filter,
  Search,
  RefreshCw,
  AlertTriangle,
  Bot,
  TreePine,
  Wind,
  Droplets,
  Thermometer,
  Activity,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useFirebaseData } from '../hooks/useFirebaseData';

interface HistoryProps {
  selectedRobotId: string;
  onRobotSelect: (robotId: string) => void;
}

export function History({ selectedRobotId, onRobotSelect }: HistoryProps) {
  const { 
    robotData, 
    tamanData,
    formatDateTime, 
    loading, 
    error, 
    refreshData 
  } = useFirebaseData();

  const [activeTab, setActiveTab] = useState<'robot' | 'plants'>('robot');
  const [filterPeriod, setFilterPeriod] = useState<'all' | '24h' | '7d' | '30d'>('7d');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on period
  const filteredRobotData = useMemo(() => {
    if (!historicalRobotData.length) return [];
    
    const now = new Date();
    let cutoffDate = new Date(0);
    
    switch (filterPeriod) {
      case '24h':
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffDate = new Date(0);
    }

    return historicalRobotData.filter(data => {
      const dataDate = new Date(data.terakhir_update.replace(/(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1'));
      return dataDate >= cutoffDate;
    });
  }, [historicalRobotData, filterPeriod]);

  const filteredPlantData = useMemo(() => {
    if (!historicalPlantData.length) return [];
    
    const now = new Date();
    let cutoffDate = new Date(0);
    
    switch (filterPeriod) {
      case '24h':
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffDate = new Date(0);
    }

    return historicalPlantData.filter(data => {
      const dataDate = new Date(data.timestamp.replace(/(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1'));
      return dataDate >= cutoffDate;
    });
  }, [historicalPlantData, filterPeriod]);

  // Get chart data
  const robotChartData = getRobotChartData(50);
  const plantChartData = getPlantChartData(50);

  // Statistics
  const robotStats = useMemo(() => {
    if (!filteredRobotData.length) return {
      avgTemp: 0,
      avgHumidity: 0,
      avgAQI: 0,
      totalReadings: 0
    };

    const totals = filteredRobotData.reduce((acc, data) => ({
      temp: acc.temp + data.suhu,
      humidity: acc.humidity + data.kelembaban,
      aqi: acc.aqi + data.aqi_lokal
    }), { temp: 0, humidity: 0, aqi: 0 });

    const count = filteredRobotData.length;

    return {
      avgTemp: Math.round((totals.temp / count) * 10) / 10,
      avgHumidity: Math.round((totals.humidity / count) * 10) / 10,
      avgAQI: Math.round(totals.aqi / count),
      totalReadings: count
    };
  }, [filteredRobotData]);

  const plantStats = useMemo(() => {
    if (!filteredPlantData.length) return {
      avgMoistureA: 0,
      avgMoistureB: 0,
      totalReadings: 0,
      healthyReadings: 0
    };

    const totals = filteredPlantData.reduce((acc, data) => ({
      moistureA: acc.moistureA + (data.A?.kelembaban || 0),
      moistureB: acc.moistureB + (data.B?.kelembaban || 0),
      healthy: acc.healthy + ((data.A?.kondisi === 'Baik' ? 1 : 0) + (data.B?.kondisi === 'Baik' ? 1 : 0))
    }), { moistureA: 0, moistureB: 0, healthy: 0 });

    const count = filteredPlantData.length;

    return {
      avgMoistureA: Math.round((totals.moistureA / count) * 10) / 10,
      avgMoistureB: Math.round((totals.moistureB / count) * 10) / 10,
      totalReadings: count,
      healthyReadings: totals.healthy
    };
  }, [filteredPlantData]);

  const exportData = () => {
    const dataToExport = activeTab === 'robot' ? filteredRobotData : filteredPlantData;
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `greenova-${activeTab}-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Memuat data riwayat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p>Gagal memuat data: {error}</p>
          <Button onClick={refreshData} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Riwayat Data</h1>
          <p className="text-muted-foreground">
            Analisis data historis monitoring GREENOVA
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={filterPeriod} onValueChange={(value: any) => setFilterPeriod(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Jam</SelectItem>
              <SelectItem value="7d">7 Hari</SelectItem>
              <SelectItem value="30d">30 Hari</SelectItem>
              <SelectItem value="all">Semua Data</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
        <TabsList>
          <TabsTrigger value="robot" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Data Robot
          </TabsTrigger>
          <TabsTrigger value="plants" className="flex items-center gap-2">
            <TreePine className="h-4 w-4" />
            Data Tanaman
          </TabsTrigger>
        </TabsList>

        <TabsContent value="robot" className="space-y-6">
          {/* Robot Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rata-rata Suhu</p>
                    <p className="text-2xl font-bold">{robotStats.avgTemp}°C</p>
                  </div>
                  <Thermometer className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rata-rata Kelembaban</p>
                    <p className="text-2xl font-bold">{robotStats.avgHumidity}%</p>
                  </div>
                  <Droplets className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rata-rata AQI</p>
                    <p className="text-2xl font-bold">{robotStats.avgAQI}</p>
                  </div>
                  <Wind className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pembacaan</p>
                    <p className="text-2xl font-bold">{robotStats.totalReadings}</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Robot Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tren Data Robot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {robotChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={robotChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="suhu" stroke="#ef4444" strokeWidth={2} name="Suhu (°C)" />
                      <Line type="monotone" dataKey="kelembaban" stroke="#3b82f6" strokeWidth={2} name="Kelembaban (%)" />
                      <Line type="monotone" dataKey="aqi" stroke="#22c55e" strokeWidth={2} name="AQI" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Tidak ada data grafik tersedia
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Robot Data Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HistoryIcon className="h-5 w-5" />
                Data Robot Detail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Waktu</th>
                      <th className="text-left p-3">Suhu (°C)</th>
                      <th className="text-left p-3">Kelembaban (%)</th>
                      <th className="text-left p-3">PM2.5 (μg/m³)</th>
                      <th className="text-left p-3">Gas (ppm)</th>
                      <th className="text-left p-3">AQI</th>
                      <th className="text-left p-3">Jarak (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRobotData.length > 0 ? 
                      filteredRobotData.slice(0, 20).map((data, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-3 text-sm">{formatDateTime(data.terakhir_update)}</td>
                          <td className="p-3 font-medium">{data.suhu}</td>
                          <td className="p-3 font-medium">{data.kelembaban}</td>
                          <td className="p-3 font-medium">{data.debu}</td>
                          <td className="p-3 font-medium">{data.gas}</td>
                          <td className="p-3">
                            <Badge style={{ backgroundColor: robotData?.aqi_color }}>
                              {data.aqi_lokal}
                            </Badge>
                          </td>
                          <td className="p-3 font-medium">{data.jarak}</td>
                        </tr>
                      ))
                    : (
                      <tr>
                        <td colSpan={7} className="text-center p-8 text-muted-foreground">
                          Tidak ada data riwayat robot tersedia
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plants" className="space-y-6">
          {/* Plant Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rata-rata Kelembaban A</p>
                    <p className="text-2xl font-bold">{plantStats.avgMoistureA}%</p>
                  </div>
                  <TreePine className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rata-rata Kelembaban B</p>
                    <p className="text-2xl font-bold">{plantStats.avgMoistureB}%</p>
                  </div>
                  <TreePine className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pembacaan</p>
                    <p className="text-2xl font-bold">{plantStats.totalReadings}</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Kondisi Sehat</p>
                    <p className="text-2xl font-bold">{plantStats.healthyReadings}</p>
                  </div>
                  <TreePine className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plant Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tren Kelembaban Tanaman
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {plantChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={plantChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="A_kelembaban" stroke="#22c55e" strokeWidth={3} name="Tanaman A" />
                      <Line type="monotone" dataKey="B_kelembaban" stroke="#3b82f6" strokeWidth={3} name="Tanaman B" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Tidak ada data grafik tersedia
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Plant Data Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HistoryIcon className="h-5 w-5" />
                Data Tanaman Detail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Waktu</th>
                      <th className="text-left p-3">Tanaman A - Kelembaban</th>
                      <th className="text-left p-3">Tanaman A - Kondisi</th>
                      <th className="text-left p-3">Tanaman B - Kelembaban</th>
                      <th className="text-left p-3">Tanaman B - Kondisi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlantData.length > 0 ? 
                      filteredPlantData.slice(0, 20).map((data, index) => {
                        const getConditionColor = (kondisi: string) => {
                          switch (kondisi?.toLowerCase()) {
                            case 'baik': return 'bg-green-500';
                            case 'sedang': return 'bg-yellow-500';
                            case 'buruk': return 'bg-red-500';
                            default: return 'bg-gray-500';
                          }
                        };

                        return (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="p-3 text-sm">{formatDateTime(data.timestamp)}</td>
                            <td className="p-3 font-medium">{data.A?.kelembaban || 'N/A'}%</td>
                            <td className="p-3">
                              <Badge className={`${getConditionColor(data.A?.kondisi)} text-white text-xs`}>
                                {data.A?.kondisi || 'N/A'}
                              </Badge>
                            </td>
                            <td className="p-3 font-medium">{data.B?.kelembaban || 'N/A'}%</td>
                            <td className="p-3">
                              <Badge className={`${getConditionColor(data.B?.kondisi)} text-white text-xs`}>
                                {data.B?.kondisi || 'N/A'}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })
                    : (
                      <tr>
                        <td colSpan={5} className="text-center p-8 text-muted-foreground">
                          Tidak ada data riwayat tanaman tersedia
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}