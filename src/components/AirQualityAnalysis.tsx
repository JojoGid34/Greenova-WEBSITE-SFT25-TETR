import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Wind, 
  Thermometer, 
  Droplets, 
  Gauge,
  RefreshCw,
  AlertTriangle,
  Info,
  MapPin,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useFirebaseData } from '../hooks/useFirebaseData';

export function AirQualityAnalysis() {
  const { 
    robotData, 
    formatDateTime, 
    loading, 
    error, 
    refreshData 
  } = useFirebaseData();

  // Air quality recommendations based on AQI status string
  const getRecommendations = (aqiStatus: string) => {
    const status = aqiStatus.toLowerCase();
    
    if (status === 'baik') {
      return {
        level: 'Baik',
        color: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        icon: '😊',
        advice: 'Kualitas udara sangat baik. Ideal untuk aktivitas outdoor.',
        actions: ['Nikmati aktivitas di luar ruangan', 'Buka jendela untuk sirkulasi udara']
      };
    } else if (status === 'sedang') {
      return {
        level: 'Sedang',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        icon: '😐',
        advice: 'Kualitas udara dapat diterima untuk sebagian besar orang.',
        actions: ['Aktivitas outdoor masih aman', 'Perhatikan gejala jika sensitif terhadap polusi']
      };
    } else {
      // Default to 'buruk' for any other status
      return {
        level: 'Buruk',
        color: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        icon: '😰',
        advice: 'Semua orang sebaiknya mengurangi aktivitas outdoor.',
        actions: ['Hindari aktivitas outdoor', 'Gunakan masker N95', 'Tutup semua jendela', 'Nyalakan air purifier']
      };
    }
  };

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

  if (!robotData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Wind className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p>Tidak ada data kualitas udara tersedia</p>
          <Button onClick={refreshData} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  const recommendations = getRecommendations(robotData.aqi_lokal);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analisis Kualitas Udara</h1>
          <p className="text-muted-foreground">
            Monitoring kualitas udara real-time dengan GREENOVA
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Terakhir update: {formatDateTime(robotData.terakhir_update)}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={robotData.isOnline ? "default" : "destructive"}>
            {robotData.isOnline ? 'Online' : 'Offline'}
          </Badge>
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Current AQI Status */}
      <Card className={`${recommendations.bgColor} ${recommendations.borderColor} border-2`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold"
              style={{ 
                backgroundColor: robotData.aqi_color + '20', 
                color: robotData.aqi_color,
                border: `3px solid ${robotData.aqi_color}40`
              }}
            >
              {robotData.calculatedAQI || robotData.aqi_status}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                Air Quality Index (AQI)
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{recommendations.icon}</span>
                <div>
                  <Badge 
                    className="text-white text-lg px-4 py-2"
                    style={{ backgroundColor: robotData.aqi_color }}
                  >
                    {robotData.aqi_lokal}
                  </Badge>
                  <p className={`mt-2 ${recommendations.color} font-medium`}>
                    {recommendations.advice}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">PM2.5</p>
                <p className="text-2xl font-bold">{robotData.debu}</p>
                <p className="text-xs text-muted-foreground">μg/m³</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <Wind className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gas</p>
                <p className="text-2xl font-bold">{robotData.gas}</p>
                <p className="text-xs text-muted-foreground">ppm</p>
              </div>
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Gauge className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suhu</p>
                <p className="text-2xl font-bold">{robotData.suhu}°C</p>
                <Badge className={`mt-2 ${
                  robotData.suhu >= 20 && robotData.suhu <= 30 ? 'bg-green-500' :
                  robotData.suhu >= 15 && robotData.suhu <= 35 ? 'bg-yellow-500' : 'bg-red-500'
                } text-white`}>
                  {robotData.suhu >= 20 && robotData.suhu <= 30 ? 'Optimal' :
                   robotData.suhu >= 15 && robotData.suhu <= 35 ? 'Normal' : 'Ekstrem'}
                </Badge>
              </div>
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Thermometer className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kelembaban</p>
                <p className="text-2xl font-bold">{robotData.kelembaban}%</p>
                <Badge className={`mt-2 ${
                  robotData.kelembaban >= 40 && robotData.kelembaban <= 70 ? 'bg-green-500' :
                  robotData.kelembaban >= 30 && robotData.kelembaban <= 80 ? 'bg-yellow-500' : 'bg-red-500'
                } text-white`}>
                  {robotData.kelembaban >= 40 && robotData.kelembaban <= 70 ? 'Optimal' :
                   robotData.kelembaban >= 30 && robotData.kelembaban <= 80 ? 'Normal' : 'Ekstrem'}
                </Badge>
              </div>
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Rekomendasi Kesehatan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className={`${recommendations.bgColor} ${recommendations.borderColor}`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className={recommendations.color}>
                <strong>Status Saat Ini:</strong> {recommendations.advice}
              </AlertDescription>
            </Alert>
            
            <div>
              <h4 className="font-semibold mb-3">Tindakan yang Disarankan:</h4>
              <ul className="space-y-2">
                {recommendations.actions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Data Sensor Tambahan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded">
                <span className="text-muted-foreground">Jarak Sensor:</span>
                <span className="font-bold">{robotData.jarak} cm</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded">
                <span className="text-muted-foreground">Update Terakhir:</span>
                <span className="font-bold">{robotData.terakhir_update}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded">
                <span className="text-muted-foreground">Status Sensor:</span>
                <Badge variant={robotData.isOnline ? "default" : "destructive"}>
                  {robotData.isOnline ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 border rounded">
                <span className="text-muted-foreground">AQI Status:</span>
                <Badge 
                  className="text-white"
                  style={{ backgroundColor: robotData.aqi_color }}
                >
                  {robotData.aqi_status}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tentang AQI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/30 rounded">
                <span>0-50: Baik</span>
                <div className="w-4 h-4 bg-green-500 rounded"></div>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded">
                <span>51-100: Sedang</span>
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              </div>
              <div className="flex justify-between items-center p-2 bg-orange-50 dark:bg-orange-900/30 rounded">
                <span>101-150: Tidak Sehat untuk Kelompok Sensitif</span>
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/30 rounded">
                <span>151-200: Tidak Sehat</span>
                <div className="w-4 h-4 bg-red-500 rounded"></div>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-50 dark:bg-purple-900/30 rounded">
                <span>201-300: Sangat Tidak Sehat</span>
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-100 dark:bg-red-900/40 rounded">
                <span>301+: Berbahaya</span>
                <div className="w-4 h-4 bg-red-800 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Lokasi Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span>Status: {robotData.isOnline ? 'Online' : 'Offline'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Update: {formatDateTime(robotData.terakhir_update)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-purple-500" />
                <span>Sensor: GREENOVA Air Quality Monitor</span>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Data diambil dari sensor kualitas udara GREENOVA yang memantau PM2.5, 
                  gas berbahaya, suhu, dan kelembaban secara real-time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}