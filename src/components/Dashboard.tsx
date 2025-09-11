import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Bot,
  Activity,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  RefreshCw,
  AlertTriangle,
  Clock,
  TrendingUp,
  Target,
  Award,
  Settings,
  Bell,
  Shield,
  Save,
  Info
} from 'lucide-react';
import { toast } from "sonner@2.0.3";
import { useFirebaseData } from '../hooks/useFirebaseData';
import { FirebaseStatus } from './FirebaseStatus';
import { firebaseService } from '../services/firebase';

interface DashboardProps {
  selectedRobotId: string;
  onRobotSelect: (robotId: string) => void;
}



export function Dashboard({ selectedRobotId, onRobotSelect }: DashboardProps) {
  const { 
    robotData, 
    formatDateTime, 
    loading, 
    error, 
    refreshData,
    lastUpdate 
  } = useFirebaseData();

  // Control system settings state
  const [controlSettings, setControlSettings] = useState({
    autoMonitoring: true,
    dataLogging: true,
    alertSystem: true,
    remoteControl: false
  });

  const [thresholds, setThresholds] = useState({
    aqiWarning: 100,
    aqiDanger: 150,
    temperatureMin: 15,
    temperatureMax: 35,
    humidityMin: 30,
    humidityMax: 80
  });

  // Calculate performance metrics and AQI
  const performanceMetrics = useMemo(() => {
    if (!robotData) {
      return {
        uptime: 0,
        efficiency: 0,
        lastUpdate: 'N/A',
        calculatedAQI: 0,
        aqiStatus: 'N/A'
      };
    }

    const uptime = robotData.isOnline ? 99.5 : 0;
    const efficiency = robotData.isOnline ? 95 : 0;
    
    // Use the already calculated AQI from processed data
    const calculatedAQI = robotData.calculatedAQI;
    
    // Get status from database aqi_lokal field (which stores status like "baik", "sedang", "buruk")
    const aqiStatus = robotData.aqi_status;

    return {
      uptime: Math.round(uptime * 10) / 10,
      efficiency: Math.round(efficiency),
      lastUpdate: formatDateTime(robotData.terakhir_update),
      calculatedAQI,
      aqiStatus
    };
  }, [robotData, formatDateTime]);

  // Control system handlers
  const handleSaveControlSettings = () => {
    toast.success("Pengaturan kontrol robot berhasil disimpan");
  };

  const handleSaveThresholds = () => {
    toast.success("Pengaturan threshold berhasil disimpan");
  };

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
          <Bot className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p>Tidak ada data robot tersedia</p>
          <Button onClick={refreshData} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Firebase Status */}
      <FirebaseStatus 
        isConnected={!!robotData && !error} 
        error={error}
        lastUpdate={lastUpdate}
        onRetry={refreshData}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Robot Dashboard</h1>
          <p className="text-muted-foreground">
            Monitoring dan kontrol robot GREENOVA
          </p>
          {robotData && (
            <p className="text-sm text-muted-foreground">
              Terakhir update: {formatDateTime(robotData.terakhir_update)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={refreshData}>
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
                  {robotData.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Bot className={`h-6 w-6 ${robotData.isOnline ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${robotData.isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-muted-foreground">
                Update: {formatDateTime(robotData.terakhir_update)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Suhu */}
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
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                <Thermometer className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kelembaban */}
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
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AQI */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AQI</p>
                <p className="text-2xl font-bold" style={{ color: firebaseService.getAQIColor(performanceMetrics.calculatedAQI) }}>
                  {performanceMetrics.calculatedAQI}
                </p>
                <Badge 
                  className="mt-2 text-white"
                  style={{ backgroundColor: firebaseService.getAQIColor(performanceMetrics.calculatedAQI) }}
                >
                  {performanceMetrics.aqiStatus}
                </Badge>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Wind className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-xl font-bold">{performanceMetrics.uptime}%</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Efficiency</p>
                <p className="text-xl font-bold">{performanceMetrics.efficiency}%</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Update</p>
                <p className="text-sm font-medium">{performanceMetrics.lastUpdate}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Environmental Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Data Lingkungan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded">
              <span className="text-muted-foreground">Jarak Sensor:</span>
              <span className="font-bold">{robotData.jarak} cm</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <span className="text-muted-foreground">Terakhir Update:</span>
              <span className="font-bold">{robotData.terakhir_update}s yang lalu</span>
            </div>
          </CardContent>
        </Card>

        {/* Air Quality Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5" />
              Detail Kualitas Udara
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded">
              <span className="text-muted-foreground">PM2.5:</span>
              <span className="font-bold">{robotData.debu} μg/m³</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <span className="text-muted-foreground">Gas:</span>
              <span className="font-bold">{robotData.gas} ppm</span>
            </div>
          </CardContent>
        </Card>

        {/* Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Status Robot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 border rounded-lg">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: firebaseService.getAQIColor(performanceMetrics.calculatedAQI) + '20', color: firebaseService.getAQIColor(performanceMetrics.calculatedAQI) }}
              >
                <span className="text-xl font-bold">{performanceMetrics.calculatedAQI}</span>
              </div>
              <Badge 
                className="text-white"
                style={{ backgroundColor: firebaseService.getAQIColor(performanceMetrics.calculatedAQI) }}
              >
                {performanceMetrics.aqiStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Robot Control System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Sistem Kontrol Robot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="control" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="control">Kontrol</TabsTrigger>
              <TabsTrigger value="thresholds">Threshold</TabsTrigger>
            </TabsList>

            {/* Control Settings */}
            <TabsContent value="control" className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Monitoring Otomatis</Label>
                    <p className="text-sm text-muted-foreground">Aktifkan pengumpulan data sensor otomatis</p>
                  </div>
                  <Switch
                    checked={controlSettings.autoMonitoring}
                    onCheckedChange={(checked) => 
                      setControlSettings(prev => ({ ...prev, autoMonitoring: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Data Logging</Label>
                    <p className="text-sm text-muted-foreground">Simpan data sensor ke database</p>
                  </div>
                  <Switch
                    checked={controlSettings.dataLogging}
                    onCheckedChange={(checked) => 
                      setControlSettings(prev => ({ ...prev, dataLogging: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Sistem Alert</Label>
                    <p className="text-sm text-muted-foreground">Notifikasi saat nilai sensor melebihi batas</p>
                  </div>
                  <Switch
                    checked={controlSettings.alertSystem}
                    onCheckedChange={(checked) => 
                      setControlSettings(prev => ({ ...prev, alertSystem: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Remote Control</Label>
                    <p className="text-sm text-muted-foreground">Izinkan kontrol jarak jauh robot</p>
                  </div>
                  <Switch
                    checked={controlSettings.remoteControl}
                    onCheckedChange={(checked) => 
                      setControlSettings(prev => ({ ...prev, remoteControl: checked }))
                    }
                  />
                </div>

                <Button onClick={handleSaveControlSettings} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Pengaturan Kontrol
                </Button>
              </div>
            </TabsContent>

            {/* Threshold Settings */}
            <TabsContent value="thresholds" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>AQI Warning Level</Label>
                  <Input
                    type="number"
                    value={thresholds.aqiWarning}
                    onChange={(e) => setThresholds(prev => ({ ...prev, aqiWarning: Number(e.target.value) }))}
                  />
                  <p className="text-sm text-muted-foreground">Batas peringatan AQI</p>
                </div>

                <div className="space-y-2">
                  <Label>AQI Danger Level</Label>
                  <Input
                    type="number"
                    value={thresholds.aqiDanger}
                    onChange={(e) => setThresholds(prev => ({ ...prev, aqiDanger: Number(e.target.value) }))}
                  />
                  <p className="text-sm text-muted-foreground">Batas bahaya AQI</p>
                </div>

                <div className="space-y-2">
                  <Label>Suhu Minimum (°C)</Label>
                  <Input
                    type="number"
                    value={thresholds.temperatureMin}
                    onChange={(e) => setThresholds(prev => ({ ...prev, temperatureMin: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Suhu Maximum (°C)</Label>
                  <Input
                    type="number"
                    value={thresholds.temperatureMax}
                    onChange={(e) => setThresholds(prev => ({ ...prev, temperatureMax: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Kelembaban Minimum (%)</Label>
                  <Input
                    type="number"
                    value={thresholds.humidityMin}
                    onChange={(e) => setThresholds(prev => ({ ...prev, humidityMin: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Kelembaban Maximum (%)</Label>
                  <Input
                    type="number"
                    value={thresholds.humidityMax}
                    onChange={(e) => setThresholds(prev => ({ ...prev, humidityMax: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Pengaturan threshold ini akan mempengaruhi sistem peringatan robot. 
                  Pastikan nilai yang dimasukkan sesuai dengan kondisi lingkungan yang diinginkan.
                </AlertDescription>
              </Alert>

              <Button onClick={handleSaveThresholds} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Simpan Pengaturan Threshold
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}