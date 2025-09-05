import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Droplets,
  Thermometer,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Lightbulb
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFirebaseData } from '../hooks/useFirebaseData';

// Tipe data untuk PlantReading
interface PlantReading {
  station_id: string;
  plant_A: {
    moisture: number;
    condition: string;
    last_update: any;
  };
  plant_B: {
    moisture: number;
    condition: string;
    last_update: any;
  };
  timestamp: any;
}

export function PlantsQuality() {
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  
  // Menggunakan custom hook untuk mendapatkan data real-time
  const { stations, plantReadings, loading } = useFirebaseData();
  
  // Ambil stasiun pertama sebagai default jika belum ada yang terpilih
  const selectedStationId = selectedStation || (stations.length > 0 ? stations[0].station_id : '');
  const selectedStationData = stations.find(s => s.station_id === selectedStationId);
  
  const stationReadings = plantReadings
    .filter(reading => reading.station_id === selectedStationId)
    .slice(0, 24); // Ambil 24 data terbaru

  const latestReading = stationReadings.length > 0 ? stationReadings[0] : null;

  // Generate chart data for the selected plant
  const formattedChartData = stationReadings.map((reading) => ({
    time: reading.timestamp ? new Date(reading.timestamp.seconds * 1000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
    moistureA: reading.plant_A.moisture,
    moistureB: reading.plant_B.moisture,
  })).reverse(); // Balik urutan agar data terbaru ada di paling kanan grafik

  // Overall statistics
  const healthyPlants = (latestReading?.plant_A.condition === 'Baik' ? 1 : 0) + (latestReading?.plant_B.condition === 'Baik' ? 1 : 0);
  const criticalPlants = (latestReading?.plant_A.condition === 'Buruk' ? 1 : 0) + (latestReading?.plant_B.condition === 'Buruk' ? 1 : 0);
  const totalPlants = latestReading ? 2 : 0;
  const averageMoisture = latestReading ? Math.round((latestReading.plant_A.moisture + latestReading.plant_B.moisture) / 2) : 0;

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Baik':
        return 'text-green-600';
      case 'Sedang':
        return 'text-yellow-600';
      case 'Buruk':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getConditionBadge = (condition: string): "default" | "secondary" | "destructive" => {
    switch (condition) {
      case 'Baik':
        return 'default';
      case 'Sedang':
        return 'secondary';
      case 'Buruk':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'Baik':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'Sedang':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'Buruk':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous + 5) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (current < previous - 5) return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-gray-500" />;
  };

  // Tampilkan layar loading jika data belum siap
  if (loading || !selectedStationData) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Kualitas Tanaman</h1>
          <p className="text-muted-foreground">
            Pantau kondisi dan kelembaban tanah dari jaringan stasiun penyiraman GREENOVA
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedStationId} onValueChange={setSelectedStation}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pilih Stasiun" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((station) => (
                <SelectItem key={station.station_id} value={station.station_id}>
                  <div className="flex items-center gap-2">
                    <Droplets className={`h-4 w-4 ${
                      station.watering_status ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <span>{station.station_id}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tanaman</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlants}</div>
            <p className="text-xs text-muted-foreground">
              di {selectedStationData.city_loc || 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kondisi Sehat</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthyPlants}</div>
            <p className="text-xs text-muted-foreground">
              tanaman dalam kondisi baik
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perlu Perhatian</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalPlants}</div>
            <p className="text-xs text-muted-foreground">
              tanaman kondisi buruk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Kelembaban</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMoisture}%</div>
            <p className="text-xs text-muted-foreground">
              kelembaban tanah
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Station Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Informasi Stasiun
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Status Operasi</p>
              <Badge variant={selectedStationData.watering_status ? 'default' : 'destructive'}>
                {selectedStationData.watering_status ? 'MENYIRAM' : 'STANDBY'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Baterai</p>
              <div className="flex items-center gap-2">
                <Progress value={selectedStationData.battery} className="flex-1" />
                <span className="text-sm font-medium">{selectedStationData.battery}%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Kekuatan Sinyal</p>
              <div className="flex items-center gap-2">
                <Progress value={selectedStationData.signal_strength} className="flex-1" />
                <span className="text-sm font-medium">{selectedStationData.signal_strength}%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Terakhir Disiram</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{selectedStationData.last_plant_watering || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>📍 {selectedStationData.city_loc || 'N/A'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Update: {selectedStationData.last_seen ? new Date(selectedStationData.last_seen.seconds * 1000).toLocaleTimeString('id-ID') : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plant Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {latestReading && Object.entries(latestReading).filter(([key, _]) => key.startsWith('plant_')).map(([plantKey, plant]) => (
          <Card key={plantKey} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium">
                {plantKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </CardTitle>
              {getConditionIcon(plant.condition)}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Kelembaban Tanah</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{plant.moisture}%</span>
                    {getTrendIcon(plant.moisture, 50)} {/* Placeholder untuk trend */}
                  </div>
                </div>
                <Progress value={plant.moisture} className="h-2" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Kondisi</span>
                <Badge variant={getConditionBadge(plant.condition)}>
                  {plant.condition.toUpperCase()}
                </Badge>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Update: {plant.last_update ? new Date(plant.last_update.seconds * 1000).toLocaleTimeString('id-ID') : 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Historical Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Kelembaban Tanah (24 Jam Terakhir)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={formattedChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="moistureA" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Kelembaban Tanaman A"
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="moistureB" 
                stroke="#22c55e" 
                strokeWidth={2}
                name="Kelembaban Tanaman B"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
