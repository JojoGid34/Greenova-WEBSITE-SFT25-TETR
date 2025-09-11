import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Settings as SettingsIcon,
  Bot,
  Wifi,
  Database,
  Bell,
  Shield,
  Download,
  Upload,
  RefreshCw,
  Save,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  EyeOff,
  Copy
} from 'lucide-react';
import { toast } from "sonner@2.0.3";
import { useFirebaseData } from '../hooks/useFirebaseData';

interface SettingsProps {
  selectedRobotId: string;
  onRobotSelect: (robotId: string) => void;
}

export function Settings({ selectedRobotId, onRobotSelect }: SettingsProps) {
  const { 
    robotData, 
    tamanData, 
    formatDateTime, 
    loading, 
    error, 
    refreshData 
  } = useFirebaseData();

  // Settings state
  const [notifications, setNotifications] = useState({
    airQuality: true,
    plantHealth: true,
    systemAlerts: true,
    maintenance: false
  });

  const [systemConfig, setSystemConfig] = useState({
    dataCollection: true,
    autoBackup: true,
    analyticsEnabled: true,
    debugMode: false
  });

  const [thresholds, setThresholds] = useState({
    aqiWarning: 100,
    aqiDanger: 150,
    temperatureMin: 15,
    temperatureMax: 35,
    humidityMin: 30,
    humidityMax: 80,
    moistureMin: 30
  });

  const [apiConfig, setApiConfig] = useState({
    endpoint: 'https://iot-monitoring-greenova-default-rtdb.asia-southeast1.firebasedatabase.app',
    updateInterval: 30,
    timeout: 10000,
    retryAttempts: 3
  });

  const [showApiKey, setShowApiKey] = useState(false);

  const handleSaveNotifications = () => {
    // Simulate saving notifications settings
    toast.success("Pengaturan notifikasi berhasil disimpan");
  };

  const handleSaveSystem = () => {
    // Simulate saving system settings
    toast.success("Pengaturan sistem berhasil disimpan");
  };

  const handleSaveThresholds = () => {
    // Simulate saving threshold settings
    toast.success("Pengaturan threshold berhasil disimpan");
  };

  const handleSaveApiConfig = () => {
    // Simulate saving API configuration
    toast.success("Konfigurasi API berhasil disimpan");
  };

  const handleTestConnection = async () => {
    try {
      toast.loading("Menguji koneksi...");
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Koneksi berhasil!");
    } catch (error) {
      toast.error("Gagal menguji koneksi");
    }
  };

  const handleExportSettings = () => {
    const settings = {
      notifications,
      systemConfig,
      thresholds,
      apiConfig,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `greenova-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast.success("Pengaturan berhasil diekspor");
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);
        
        if (settings.notifications) setNotifications(settings.notifications);
        if (settings.systemConfig) setSystemConfig(settings.systemConfig);
        if (settings.thresholds) setThresholds(settings.thresholds);
        if (settings.apiConfig) setApiConfig(settings.apiConfig);
        
        toast.success("Pengaturan berhasil diimpor");
      } catch (error) {
        toast.error("Gagal mengimpor pengaturan");
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Memuat pengaturan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pengaturan</h1>
          <p className="text-muted-foreground">
            Konfigurasi sistem monitoring GREENOVA
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleExportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" asChild>
            <label htmlFor="import-settings" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </label>
          </Button>
          <input
            id="import-settings"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportSettings}
          />
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status Robot</p>
                <p className="text-lg font-bold">
                  {robotData?.isOnline ? 'Online' : 'Offline'}
                </p>
                <Badge className={robotData?.isOnline ? 'bg-green-500' : 'bg-red-500'}>
                  {robotData?.isOnline ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </div>
              <Bot className={`h-8 w-8 ${robotData?.isOnline ? 'text-green-500' : 'text-red-500'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Koneksi Database</p>
                <p className="text-lg font-bold">Connected</p>
                <Badge className="bg-green-500">Firebase Realtime</Badge>
              </div>
              <Database className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status API</p>
                <p className="text-lg font-bold">Active</p>
                <Badge className="bg-blue-500">Real-time</Badge>
              </div>
              <Wifi className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Update</p>
                <p className="text-sm font-bold">
                  {robotData ? formatDateTime(robotData.terakhir_update) : 'N/A'}
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
          <TabsTrigger value="system">Sistem</TabsTrigger>
          <TabsTrigger value="thresholds">Threshold</TabsTrigger>
          <TabsTrigger value="api">API Config</TabsTrigger>
        </TabsList>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Pengaturan Notifikasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Peringatan Kualitas Udara</Label>
                  <p className="text-sm text-muted-foreground">Notifikasi saat AQI melewati batas aman</p>
                </div>
                <Switch
                  checked={notifications.airQuality}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, airQuality: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Kesehatan Tanaman</Label>
                  <p className="text-sm text-muted-foreground">Notifikasi kondisi tanaman dan kelembaban</p>
                </div>
                <Switch
                  checked={notifications.plantHealth}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, plantHealth: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Alert Sistem</Label>
                  <p className="text-sm text-muted-foreground">Notifikasi error dan masalah sistem</p>
                </div>
                <Switch
                  checked={notifications.systemAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, systemAlerts: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Reminder Maintenance</Label>
                  <p className="text-sm text-muted-foreground">Pengingat jadwal perawatan robot</p>
                </div>
                <Switch
                  checked={notifications.maintenance}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, maintenance: checked }))
                  }
                />
              </div>

              <Button onClick={handleSaveNotifications} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Simpan Pengaturan Notifikasi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Konfigurasi Sistem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Pengumpulan Data</Label>
                  <p className="text-sm text-muted-foreground">Aktifkan pengumpulan data otomatis</p>
                </div>
                <Switch
                  checked={systemConfig.dataCollection}
                  onCheckedChange={(checked) => 
                    setSystemConfig(prev => ({ ...prev, dataCollection: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Auto Backup</Label>
                  <p className="text-sm text-muted-foreground">Backup otomatis data setiap hari</p>
                </div>
                <Switch
                  checked={systemConfig.autoBackup}
                  onCheckedChange={(checked) => 
                    setSystemConfig(prev => ({ ...prev, autoBackup: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Analytics</Label>
                  <p className="text-sm text-muted-foreground">Pengumpulan data analytics untuk analisis</p>
                </div>
                <Switch
                  checked={systemConfig.analyticsEnabled}
                  onCheckedChange={(checked) => 
                    setSystemConfig(prev => ({ ...prev, analyticsEnabled: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">Mode debug untuk troubleshooting</p>
                </div>
                <Switch
                  checked={systemConfig.debugMode}
                  onCheckedChange={(checked) => 
                    setSystemConfig(prev => ({ ...prev, debugMode: checked }))
                  }
                />
              </div>

              <Button onClick={handleSaveSystem} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Simpan Konfigurasi Sistem
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Threshold Settings */}
        <TabsContent value="thresholds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Pengaturan Threshold
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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

                <div className="space-y-2">
                  <Label>Kelembaban Tanah Minimum (%)</Label>
                  <Input
                    type="number"
                    value={thresholds.moistureMin}
                    onChange={(e) => setThresholds(prev => ({ ...prev, moistureMin: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <Button onClick={handleSaveThresholds} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Simpan Pengaturan Threshold
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Configuration */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Konfigurasi API & Database
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Firebase Realtime Database URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={apiConfig.endpoint}
                    onChange={(e) => setApiConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(apiConfig.endpoint)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Update Interval (seconds)</Label>
                  <Input
                    type="number"
                    value={apiConfig.updateInterval}
                    onChange={(e) => setApiConfig(prev => ({ ...prev, updateInterval: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Timeout (ms)</Label>
                  <Input
                    type="number"
                    value={apiConfig.timeout}
                    onChange={(e) => setApiConfig(prev => ({ ...prev, timeout: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Retry Attempts</Label>
                  <Input
                    type="number"
                    value={apiConfig.retryAttempts}
                    onChange={(e) => setApiConfig(prev => ({ ...prev, retryAttempts: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Konfigurasi ini mempengaruhi koneksi ke Firebase Realtime Database. 
                  Pastikan URL endpoint benar dan Anda memiliki akses yang diperlukan.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button onClick={handleTestConnection} variant="outline" className="flex-1">
                  <Wifi className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
                <Button onClick={handleSaveApiConfig} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Konfigurasi
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status Koneksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Firebase Realtime Database</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">Connected</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Data Synchronization</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">Active</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span>Real-time Updates</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">Enabled</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}