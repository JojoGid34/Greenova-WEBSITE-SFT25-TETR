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
import { useFirebaseData } from '../hooks/useFirebaseData';

export function PlantsQuality() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  
  // Menggunakan custom hook untuk mendapatkan data real-time
  const { 
    tamanData, 
    formatDateTime, 
    loading, 
    error, 
    refreshData 
  } = useFirebaseData();
  
  // Get current plants data dari struktur database yang benar
  const plantA = tamanData?.A;
  const plantB = tamanData?.B;
  const plants = [
    { id: 'A', name: 'Tanaman A', ...plantA },
    { id: 'B', name: 'Tanaman B', ...plantB }
  ].filter(plant => plant.kelembaban !== undefined);

  // Overall statistics
  const totalPlants = plants.length;
  const healthyPlants = plants.filter(plant => 
    plant.kondisi && plant.kondisi.toLowerCase() === 'baik'
  ).length;
  const criticalPlants = totalPlants - healthyPlants;
  const averageMoisture = plants.length ? 
    Math.round(plants.reduce((sum, plant) => sum + (plant.kelembaban || 0), 0) / plants.length) : 0;

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'baik':
        return 'text-green-600';
      case 'sedang':
        return 'text-yellow-600';
      case 'buruk':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getConditionBadge = (condition: string): "default" | "secondary" | "destructive" => {
    switch (condition.toLowerCase()) {
      case 'baik':
        return 'default';
      case 'sedang':
        return 'secondary';
      case 'buruk':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'baik':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'sedang':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'buruk':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  // Tampilkan layar loading jika data belum siap
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Memuat data tanaman...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p>Gagal memuat data tanaman: {error}</p>
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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Kualitas Tanaman</h1>
          <p className="text-muted-foreground">
            Pantau kondisi dan kelembaban tanah dari stasiun penyiraman GREENOVA
          </p>
          {tamanData && (
            <p className="text-sm text-muted-foreground mt-1">
              Terakhir update: {formatDateTime(tamanData.A?.terakhir_update || tamanData.B?.terakhir_update)}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Rentang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Jam</SelectItem>
              <SelectItem value="7d">7 Hari</SelectItem>
              <SelectItem value="30d">30 Hari</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={refreshData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tanaman</p>
                <p className="text-2xl font-bold">{totalPlants}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tanaman Sehat</p>
                <p className="text-2xl font-bold text-green-600">{healthyPlants}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Perlu Perhatian</p>
                <p className="text-2xl font-bold text-yellow-600">{criticalPlants}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rata-rata Kelembaban</p>
                <p className="text-2xl font-bold">{averageMoisture}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plant Cards */}
      {plants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plants.map((plant) => (
            <Card key={plant.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    <span>{plant.name}</span>
                  </div>
                  <Badge variant={getConditionBadge(plant.kondisi)}>
                    {getConditionIcon(plant.kondisi)}
                    <span className="ml-1">{plant.kondisi}</span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Kelembaban Tanah</span>
                    <span className="font-bold">{plant.kelembaban}%</span>
                  </div>
                  <Progress value={plant.kelembaban} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Update terakhir:</span>
                    <span>{formatDateTime(plant.terakhir_update)}</span>
                  </div>
                  
                  {plant.terakhir_siram && (
                    <div className="flex items-center gap-2 text-sm">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="text-muted-foreground">Terakhir disiram:</span>
                      <span>{formatDateTime(plant.terakhir_siram)}</span>
                    </div>
                  )}
                </div>

                {/* Status dan rekomendasi */}
                <div className="mt-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Rekomendasi:</p>
                      <p className="text-muted-foreground">
                        {plant.kelembaban >= 60 
                          ? "Kelembaban tanah optimal. Pertahankan kondisi ini."
                          : plant.kelembaban >= 30
                          ? "Kelembaban agak rendah. Pertimbangkan untuk menyiram."
                          : "Kelembaban sangat rendah! Segera lakukan penyiraman."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Additional Plant Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Informasi Detail Tanaman
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plants.map((plant) => (
              <div key={plant.id} className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  {plant.name}
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="text-muted-foreground">Kelembaban Saat Ini:</span>
                    <span className="font-bold">{plant.kelembaban}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="text-muted-foreground">Kondisi:</span>
                    <Badge variant={getConditionBadge(plant.kondisi)}>
                      {plant.kondisi}
                    </Badge>
                  </div>
                  {plant.terakhir_siram && (
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="text-muted-foreground">Terakhir Siram:</span>
                      <span className="font-bold">{formatDateTime(plant.terakhir_siram)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="text-muted-foreground">Update Terakhir:</span>
                    <span className="font-bold">{formatDateTime(plant.terakhir_update)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}