import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import {
  Bot,
  Settings as SettingsIcon,
  Bell,
  Shield,
  Wifi,
  Battery,
  Clock,
  MapPin,
  Camera,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { toast } from "sonner";

interface SettingsProps {
  selectedRobotId: string;
  onRobotSelect: (robotId: string) => void;
}

export function Settings({ selectedRobotId, onRobotSelect }: SettingsProps) {
  const { robots, loading } = useFirebaseData();
  const [isLoading, setIsLoading] = useState(false);
  const [robotName, setRobotName] = useState('');
  const [robotDescription, setRobotDescription] = useState('');
  const [robotLocation, setRobotLocation] = useState('');
  const [robotLat, setRobotLat] = useState('');
  const [robotLng, setRobotLng] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [autoConnect, setAutoConnect] = useState(true);

  const selectedRobot = robots.find(robot => robot.robot_id === selectedRobotId);

  // Mengisi state lokal saat data dari Firebase dimuat
  useEffect(() => {
    if (selectedRobot) {
      setRobotName(selectedRobot.robot_id); // Gunakan robot_id sebagai nama default
      setRobotDescription('Robot GREENOVA untuk monitoring lingkungan dan perawatan tanaman otomatis.');
      setRobotLocation(selectedRobot.city_loc);
      setRobotLat(selectedRobot.location.latitude.toString());
      setRobotLng(selectedRobot.location.longitude.toString());
      // Untuk bagian network, kita bisa asumsikan data ini ada di database atau hardcoded
      setWifiSsid('GREENOVA_Network');
      setWifiPassword('');
      setAutoConnect(true);
    }
  }, [selectedRobot]);

  if (loading || !selectedRobot) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Memuat data robot...</p>
      </div>
    );
  }

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      if (!selectedRobot) {
        toast.error("Robot tidak ditemukan.");
        return;
      }

      // Check if Firebase is available
      const isFirebaseAvailable = typeof (globalThis as any).__firebase_config !== 'undefined';
      
      if (isFirebaseAvailable) {
        // Try to use Firebase
        try {
          const { getFirestore, doc, updateDoc } = await import('firebase/firestore');
          const db = getFirestore();
          const robotDocRef = doc(db, 'robotStatus', selectedRobot.robot_id);

          // Objek konfigurasi yang akan diupdate
          const newConfig = {
            // General settings
            name: robotName,
            description: robotDescription,
            city_loc: robotLocation,
            location: {
              latitude: parseFloat(robotLat),
              longitude: parseFloat(robotLng),
            },
            // Network settings (hanya contoh)
            network: {
              wifi_ssid: wifiSsid,
              wifi_password: wifiPassword,
              auto_connect: autoConnect,
            }
            // Tambahkan pengaturan lain di sini
          };

          await updateDoc(robotDocRef, newConfig);
          toast.success("Pengaturan berhasil disimpan ke Firebase!");
        } catch (e) {
          console.error("Error saving to Firebase:", e);
          toast.error("Gagal menyimpan ke Firebase, menggunakan localStorage sebagai fallback");
          // Fallback to localStorage
          localStorage.setItem(`robot_settings_${selectedRobot.robot_id}`, JSON.stringify({
            name: robotName,
            description: robotDescription,
            city_loc: robotLocation,
            location: { latitude: parseFloat(robotLat), longitude: parseFloat(robotLng) },
            network: { wifi_ssid: wifiSsid, wifi_password: wifiPassword, auto_connect: autoConnect }
          }));
          toast.success("Pengaturan disimpan secara lokal!");
        }
      } else {
        // Firebase not available, use localStorage
        localStorage.setItem(`robot_settings_${selectedRobot.robot_id}`, JSON.stringify({
          name: robotName,
          description: robotDescription,
          city_loc: robotLocation,
          location: { latitude: parseFloat(robotLat), longitude: parseFloat(robotLng) },
          network: { wifi_ssid: wifiSsid, wifi_password: wifiPassword, auto_connect: autoConnect }
        }));
        toast.success("Pengaturan disimpan secara lokal!");
      }

    } catch (e) {
      console.error("Gagal menyimpan pengaturan:", e);
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Pengaturan Robot</h1>
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

          <Button onClick={handleSaveSettings} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Simpan Semua
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="sensors">Sensor</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="automation">Otomasi</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Robot Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Informasi Robot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="robot-name">Nama Robot</Label>
                  <Input 
                    id="robot-name" 
                    value={robotName} 
                    onChange={(e) => setRobotName(e.target.value)} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="robot-id">Robot ID</Label>
                  <Input id="robot-id" defaultValue={selectedRobot.robot_id} disabled />
                </div>
                
                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Deskripsi robot..." 
                    defaultValue={robotDescription}
                    onChange={(e) => setRobotDescription(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Lokasi</Label>
                  <Input 
                    id="location" 
                    value={robotLocation}
                    onChange={(e) => setRobotLocation(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input 
                      id="latitude" 
                      value={robotLat}
                      onChange={(e) => setRobotLat(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input 
                      id="longitude" 
                      value={robotLng}
                      onChange={(e) => setRobotLng(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-4 w-4" />
                  Pengaturan Sistem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="update-interval">Interval Update (detik)</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 detik</SelectItem>
                      <SelectItem value="30">30 detik</SelectItem>
                      <SelectItem value="60">1 menit</SelectItem>
                      <SelectItem value="300">5 menit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Zona Waktu</Label>
                  <Select defaultValue="asia-jakarta">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-jakarta">Asia/Jakarta (WIB)</SelectItem>
                      <SelectItem value="asia-makassar">Asia/Makassar (WITA)</SelectItem>
                      <SelectItem value="asia-jayapura">Asia/Jayapura (WIT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="auto-restart" defaultChecked />
                  <Label htmlFor="auto-restart">Auto Restart saat Error</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="debug-mode" />
                  <Label htmlFor="debug-mode">Mode Debug</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="sleep-mode" />
                  <Label htmlFor="sleep-mode">Mode Hemat Energi</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Power Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Battery className="h-4 w-4" />
                Manajemen Daya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="low-battery-threshold">Threshold Baterai Rendah (%)</Label>
                  <Input id="low-battery-threshold" type="number" defaultValue="20" min="5" max="50" />
                </div>
                
                <div>
                  <Label htmlFor="critical-battery-threshold">Threshold Baterai Kritis (%)</Label>
                  <Input id="critical-battery-threshold" type="number" defaultValue="10" min="1" max="20" />
                </div>
                
                <div>
                  <Label htmlFor="charging-schedule">Jadwal Charging</Label>
                  <Input id="charging-schedule" type="time" defaultValue="22:00" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sensor Settings */}
        <TabsContent value="sensors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Temperature Sensor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  Sensor Suhu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="temp-enabled" defaultChecked />
                  <Label htmlFor="temp-enabled">Aktifkan Sensor</Label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="temp-min">Minimum (°C)</Label>
                    <Input id="temp-min" type="number" defaultValue="15" />
                  </div>
                  <div>
                    <Label htmlFor="temp-max">Maximum (°C)</Label>
                    <Input id="temp-max" type="number" defaultValue="40" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="temp-calibration">Kalibrasi Offset</Label>
                  <Input id="temp-calibration" type="number" step="0.1" defaultValue="0.0" />
                </div>
              </CardContent>
            </Card>

            {/* Humidity Sensor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  Sensor Kelembaban
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="humidity-enabled" defaultChecked />
                  <Label htmlFor="humidity-enabled">Aktifkan Sensor</Label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="humidity-min">Minimum (%)</Label>
                    <Input id="humidity-min" type="number" defaultValue="30" />
                  </div>
                  <div>
                    <Label htmlFor="humidity-max">Maximum (%)</Label>
                    <Input id="humidity-max" type="number" defaultValue="90" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="humidity-calibration">Kalibrasi Offset</Label>
                  <Input id="humidity-calibration" type="number" step="0.1" defaultValue="0.0" />
                </div>
              </CardContent>
            </Card>

            {/* Air Quality Sensor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-green-500" />
                  Sensor Kualitas Udara
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="air-enabled" defaultChecked />
                  <Label htmlFor="air-enabled">Aktifkan Sensor</Label>
                </div>
                
                <div>
                  <Label htmlFor="air-threshold">Threshold Buruk</Label>
                  <Input id="air-threshold" type="number" defaultValue="50" />
                </div>
                
                <div>
                  <Label htmlFor="air-type">Tipe Sensor</Label>
                  <Select defaultValue="pm25">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pm25">PM2.5</SelectItem>
                      <SelectItem value="pm10">PM10</SelectItem>
                      <SelectItem value="co2">CO2</SelectItem>
                      <SelectItem value="voc">VOC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Light Sensor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-yellow-500" />
                  Sensor Cahaya
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="light-enabled" defaultChecked />
                  <Label htmlFor="light-enabled">Aktifkan Sensor</Label>
                </div>
                
                <div>
                  <Label htmlFor="light-sensitivity">Sensitivitas</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Rendah</SelectItem>
                      <SelectItem value="medium">Sedang</SelectItem>
                      <SelectItem value="high">Tinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="light-units">Unit Pengukuran</Label>
                  <Select defaultValue="lux">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lux">Lux</SelectItem>
                      <SelectItem value="percent">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Network Settings */}
        <TabsContent value="network" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* WiFi Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  Koneksi WiFi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="wifi-ssid">SSID</Label>
                  <Input 
                    id="wifi-ssid" 
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="wifi-password">Password</Label>
                  <Input 
                    id="wifi-password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="wifi-auto-connect" 
                    checked={autoConnect}
                    onCheckedChange={setAutoConnect}
                  />
                  <Label htmlFor="wifi-auto-connect">Auto Connect</Label>
                </div>
                
                <div>
                  <Label htmlFor="wifi-backup">Backup Network</Label>
                  <Input id="wifi-backup" placeholder="SSID cadangan" />
                </div>
              </CardContent>
            </Card>

            {/* Server Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Server Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="server-url">Server URL</Label>
                  <Input id="server-url" defaultValue="https://api.greenova.id" />
                </div>
                
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input id="api-key" type="password" placeholder="••••••••••••••••" />
                </div>
                
                <div>
                  <Label htmlFor="heartbeat-interval">Heartbeat Interval (menit)</Label>
                  <Select defaultValue="5">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 menit</SelectItem>
                      <SelectItem value="5">5 menit</SelectItem>
                      <SelectItem value="10">10 menit</SelectItem>
                      <SelectItem value="30">30 menit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="ssl-verify" defaultChecked />
                  <Label htmlFor="ssl-verify">Verifikasi SSL</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status Koneksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">WiFi</p>
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Server</p>
                    <p className="text-sm text-muted-foreground">Online</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Signal</p>
                    <p className="text-sm text-muted-foreground">{selectedRobot.signal_strength}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Settings */}
        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Watering Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  Jadwal Penyiraman
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="auto-watering" defaultChecked />
                  <Label htmlFor="auto-watering">Aktifkan Penyiraman Otomatis</Label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="watering-time-1">Jadwal 1</Label>
                    <Input id="watering-time-1" type="time" defaultValue="06:00" />
                  </div>
                  <div>
                    <Label htmlFor="watering-time-2">Jadwal 2</Label>
                    <Input id="watering-time-2" type="time" defaultValue="18:00" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="watering-duration">Durasi (menit)</Label>
                  <Input id="watering-duration" type="number" defaultValue="5" min="1" max="30" />
                </div>
                
                <div>
                  <Label htmlFor="soil-threshold">Threshold Kelembaban Tanah (%)</Label>
                  <Input id="soil-threshold" type="number" defaultValue="40" min="10" max="80" />
                </div>
              </CardContent>
            </Card>

            {/* Environmental Triggers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  Trigger Lingkungan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="temp-trigger" defaultChecked />
                  <Label htmlFor="temp-trigger">Trigger Suhu Tinggi</Label>
                </div>
                
                <div>
                  <Label htmlFor="temp-trigger-value">Suhu Maximum (°C)</Label>
                  <Input id="temp-trigger-value" type="number" defaultValue="35" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="air-trigger" defaultChecked />
                  <Label htmlFor="air-trigger">Trigger Kualitas Udara Buruk</Label>
                </div>
                
                <div>
                  <Label htmlFor="air-trigger-value">AQI Minimum</Label>
                  <Input id="air-trigger-value" type="number" defaultValue="50" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="emergency-mode" />
                  <Label htmlFor="emergency-mode">Mode Darurat</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Task Automation */}
          <Card>
            <CardHeader>
              <CardTitle>Otomasi Tugas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Pembersihan Filter Otomatis</h4>
                    <p className="text-sm text-muted-foreground">Setiap 7 hari sekali</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Update Firmware</h4>
                    <p className="text-sm text-muted-foreground">Otomatis saat tersedia</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Laporan Harian</h4>
                    <p className="text-sm text-muted-foreground">Kirim laporan setiap jam 19:00</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Tugas Otomatis
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Settings */}
        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Maintenance Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Jadwal Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="maintenance-interval">Interval Maintenance (hari)</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 hari</SelectItem>
                      <SelectItem value="14">14 hari</SelectItem>
                      <SelectItem value="30">30 hari</SelectItem>
                      <SelectItem value="90">90 hari</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="next-maintenance">Maintenance Berikutnya</Label>
                  <Input id="next-maintenance" type="date" defaultValue="2024-01-20" />
                </div>
                
                <div>
                  <Label htmlFor="maintenance-technician">Teknisi</Label>
                  <Select defaultValue="ahmad">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ahmad">Ahmad Susanto</SelectItem>
                      <SelectItem value="budi">Budi Santoso</SelectItem>
                      <SelectItem value="citra">Citra Dewi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="auto-notification" defaultChecked />
                  <Label htmlFor="auto-notification">Notifikasi Otomatis</Label>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Filter Status</span>
                    <Badge variant="default">Baik</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sensor Accuracy</span>
                    <Badge variant="default">98%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Motor Performance</span>
                    <Badge variant="default">Optimal</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Check</span>
                    <span className="text-sm text-muted-foreground">2 jam yang lalu</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Run Health Check
                </Button>
              </CardContent>
            </Card>

            {/* Backup & Recovery */}
            <Card>
              <CardHeader>
                <CardTitle>Backup & Recovery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Download className="h-6 w-6" />
                    <span>Backup Config</span>
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Upload className="h-6 w-6" />
                    <span>Restore Config</span>
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex-col gap-2 border-red-200 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-6 w-6" />
                    <span>Factory Reset</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
