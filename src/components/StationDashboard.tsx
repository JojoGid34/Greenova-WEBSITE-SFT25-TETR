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
  Droplets,
  Leaf,
  RefreshCw,
  AlertTriangle,
  Clock,
  TreePine,
  Activity,
  Settings,
  Save,
  Info
} from 'lucide-react';
import { toast } from "sonner@2.0.3";
import { useFirebaseData } from '../hooks/useFirebaseData';
import { FirebaseStatus } from './FirebaseStatus';

interface StationDashboardProps {
  selectedStationId: string;
  onStationSelect: (stationId: string) => void;
}



const getPlantConditionStatus = (condition: string) => {
  switch (condition?.toLowerCase()) {
    case 'baik':
      return { status: 'Baik', color: 'bg-green-500', textColor: 'text-green-500' };
    case 'sedang':
      return { status: 'Sedang', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
    case 'buruk':
      return { status: 'Buruk', color: 'bg-red-500', textColor: 'text-red-500' };
    default:
      return { status: 'N/A', color: 'bg-gray-500', textColor: 'text-gray-500' };
  }
};

export function StationDashboard({ selectedStationId, onStationSelect }: StationDashboardProps) {
  const { 
    tamanData, 
    formatDateTime, 
    loading, 
    error, 
    refreshData,
    lastUpdate 
  } = useFirebaseData();

  // Control system settings state
  const [stationSettings, setStationSettings] = useState({
    autoWatering: true,
    moistureMonitoring: true,
    alertSystem: true,
    scheduleWatering: false
  });

  const [plantThresholds, setPlantThresholds] = useState({
    moistureMin: 30,
    moistureMax: 80,
    wateringDuration: 5,
    wateringInterval: 24
  });

  // Get current plants data (dari struktur database yang benar)
  const plantA = tamanData?.A;
  const plantB = tamanData?.B;
  const plants = [
    { id: 'A', name: 'Tanaman A', ...plantA },
    { id: 'B', name: 'Tanaman B', ...plantB }
  ].filter(plant => plant.kelembaban !== undefined);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!plants.length) {
      return {
        totalPlants: 0,
        healthyPlants: 0,
        averageMoisture: 0,
        lastWatering: 'N/A'
      };
    }

    const totalMoisture = plants.reduce((sum, plant) => sum + (plant.kelembaban || 0), 0);
    const averageMoisture = totalMoisture / plants.length;
    
    const healthyPlants = plants.filter(plant => 
      plant.kondisi && plant.kondisi.toLowerCase() === 'baik'
    ).length;
    
    const lastWatering = plants
      .filter(plant => plant.terakhir_siram)
      .map(plant => plant.terakhir_siram!)
      .sort((a, b) => new Date(b.replace(/(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1')).getTime() - 
                      new Date(a.replace(/(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1')).getTime())[0] || 'N/A';

    return {
      totalPlants: plants.length,
      healthyPlants,
      averageMoisture: Math.round(averageMoisture * 10) / 10,
      lastWatering
    };
  }, [plants]);

  // Control system handlers
  const handleSaveStationSettings = () => {
    toast.success("Pengaturan kontrol station berhasil disimpan");
  };

  const handleSavePlantThresholds = () => {
    toast.success("Pengaturan threshold tanaman berhasil disimpan");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Memuat data station...</p>
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

  if (!tamanData || !plants.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <TreePine className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p>Tidak ada data taman tersedia</p>
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
        isConnected={!!tamanData && !error} 
        error={error}
        lastUpdate={lastUpdate}
        onRetry={refreshData}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Station Dashboard</h1>
          <p className="text-muted-foreground">
            Monitoring tanaman pada GREENOVA Station
          </p>
          {tamanData && (
            <p className="text-sm text-muted-foreground">
              Terakhir update: {formatDateTime(tamanData.A?.terakhir_update || tamanData.B?.terakhir_update)}
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tanaman</p>
                <p className="text-2xl font-bold">{summaryStats.totalPlants}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                <TreePine className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tanaman Sehat</p>
                <p className="text-2xl font-bold">{summaryStats.healthyPlants}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rata-rata Kelembaban</p>
                <p className="text-2xl font-bold">{summaryStats.averageMoisture}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Terakhir Siram</p>
                <p className="text-lg font-bold">
                  {summaryStats.lastWatering !== 'N/A' ? 
                    formatDateTime(summaryStats.lastWatering) : 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Tanaman Saat Ini */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Status Tanaman Saat Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plants.map((plant, index) => {
              const status = getPlantConditionStatus(plant.kondisi);
              return (
                <div key={plant.id} className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <TreePine className="h-5 w-5" />
                      {plant.name}
                    </h4>
                    <Badge className={`${status.color} text-white`}>
                      {status.status}
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Kelembaban:</span>
                      <span className="text-2xl font-bold">{plant.kelembaban}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Kondisi:</span>
                      <span className={`font-medium ${status.textColor}`}>{plant.kondisi}</span>
                    </div>
                    {plant.terakhir_siram && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Terakhir Siram:</span>
                        <span className="text-sm font-medium">
                          {formatDateTime(plant.terakhir_siram)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Last Update:</span>
                      <span className="text-sm font-medium">
                        {formatDateTime(plant.terakhir_update)}
                      </span>
                    </div>
                    
                    {/* Progress bar untuk kelembaban */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Kelembaban Tanah</span>
                        <span>{plant.kelembaban}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
                        <div 
                          className={`h-4 rounded-full transition-all duration-300 ${
                            plant.kelembaban >= 60 ? 'bg-green-500' :
                            plant.kelembaban >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, plant.kelembaban))}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Kering</span>
                        <span>Optimal</span>
                        <span>Basah</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reading Data Tanaman (seperti di homepage) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Data Reading Tanaman
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plants.map((plant) => {
              const status = getPlantConditionStatus(plant.kondisi);
              return (
                <Card key={plant.id} className="border-2">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <TreePine className="h-5 w-5" />
                        {plant.name}
                      </span>
                      <Badge className={`${status.color} text-white`}>
                        {status.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Kelembaban Display */}
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">{plant.kelembaban}%</div>
                      <p className="text-sm text-muted-foreground mb-4">Kelembaban Tanah</p>
                      
                      {/* Progress bar untuk kelembaban */}
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                        <div 
                          className={`h-4 rounded-full transition-all duration-300 ${
                            plant.kelembaban >= 60 ? 'bg-green-500' :
                            plant.kelembaban >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, plant.kelembaban))}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Kering (0%)</span>
                        <span>Optimal (60%)</span>
                        <span>Basah (100%)</span>
                      </div>
                    </div>

                    {/* Detail Info */}
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Kondisi:</span>
                        <span className={`font-medium ${status.textColor}`}>{plant.kondisi}</span>
                      </div>
                      
                      {plant.terakhir_siram && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Terakhir Siram:</span>
                          <span className="text-sm font-medium">
                            {formatDateTime(plant.terakhir_siram)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Update:</span>
                        <span className="text-sm font-medium">
                          {formatDateTime(plant.terakhir_update)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Station Control System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Sistem Kontrol Station
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
                    <Label className="text-base">Penyiraman Otomatis</Label>
                    <p className="text-sm text-muted-foreground">Aktifkan sistem penyiraman otomatis berdasarkan kelembaban</p>
                  </div>
                  <Switch
                    checked={stationSettings.autoWatering}
                    onCheckedChange={(checked) => 
                      setStationSettings(prev => ({ ...prev, autoWatering: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Monitoring Kelembaban</Label>
                    <p className="text-sm text-muted-foreground">Pantau kelembaban tanah secara real-time</p>
                  </div>
                  <Switch
                    checked={stationSettings.moistureMonitoring}
                    onCheckedChange={(checked) => 
                      setStationSettings(prev => ({ ...prev, moistureMonitoring: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Sistem Alert</Label>
                    <p className="text-sm text-muted-foreground">Notifikasi saat kelembaban tanah rendah</p>
                  </div>
                  <Switch
                    checked={stationSettings.alertSystem}
                    onCheckedChange={(checked) => 
                      setStationSettings(prev => ({ ...prev, alertSystem: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Penjadwalan Siram</Label>
                    <p className="text-sm text-muted-foreground">Atur jadwal penyiraman rutin</p>
                  </div>
                  <Switch
                    checked={stationSettings.scheduleWatering}
                    onCheckedChange={(checked) => 
                      setStationSettings(prev => ({ ...prev, scheduleWatering: checked }))
                    }
                  />
                </div>

                <Button onClick={handleSaveStationSettings} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Pengaturan Kontrol
                </Button>
              </div>
            </TabsContent>

            {/* Threshold Settings */}
            <TabsContent value="thresholds" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Kelembaban Minimum (%)</Label>
                  <Input
                    type="number"
                    value={plantThresholds.moistureMin}
                    onChange={(e) => setPlantThresholds(prev => ({ ...prev, moistureMin: Number(e.target.value) }))}
                  />
                  <p className="text-sm text-muted-foreground">Batas kelembaban untuk memicu penyiraman</p>
                </div>

                <div className="space-y-2">
                  <Label>Kelembaban Maximum (%)</Label>
                  <Input
                    type="number"
                    value={plantThresholds.moistureMax}
                    onChange={(e) => setPlantThresholds(prev => ({ ...prev, moistureMax: Number(e.target.value) }))}
                  />
                  <p className="text-sm text-muted-foreground">Batas kelembaban untuk menghentikan penyiraman</p>
                </div>

                <div className="space-y-2">
                  <Label>Durasi Penyiraman (detik)</Label>
                  <Input
                    type="number"
                    value={plantThresholds.wateringDuration}
                    onChange={(e) => setPlantThresholds(prev => ({ ...prev, wateringDuration: Number(e.target.value) }))}
                  />
                  <p className="text-sm text-muted-foreground">Lama waktu penyiraman sekali aktif</p>
                </div>

                <div className="space-y-2">
                  <Label>Interval Penyiraman (jam)</Label>
                  <Input
                    type="number"
                    value={plantThresholds.wateringInterval}
                    onChange={(e) => setPlantThresholds(prev => ({ ...prev, wateringInterval: Number(e.target.value) }))}
                  />
                  <p className="text-sm text-muted-foreground">Jeda minimum antar penyiraman</p>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Pengaturan threshold ini akan mempengaruhi sistem penyiraman otomatis. 
                  Pastikan nilai yang dimasukkan sesuai dengan kebutuhan tanaman.
                </AlertDescription>
              </Alert>

              <Button onClick={handleSavePlantThresholds} className="w-full">
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