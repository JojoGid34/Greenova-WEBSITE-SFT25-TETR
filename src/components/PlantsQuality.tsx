import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Droplets,
  Activity,
  RefreshCw,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Lightbulb,
  TreePine,
  Info,
  BarChart3,
  MapPin,
  TrendingUp,
  TrendingDown,
  Brain,
  Zap
} from 'lucide-react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { PredictionCard } from './PredictionCard';

export function PlantsQuality() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  
  // Menggunakan custom hook untuk mendapatkan data real-time
  const { 
    robotData,
    tamanData, 
    formatDateTime, 
    loading, 
    error, 
    refreshData 
  } = useFirebaseData();
  
  // Get current plants data dari struktur database yang benar
  const plants = tamanData?.plants || [];

  // Overall statistics
  const totalPlants = plants.length;
  const healthyPlants = plants.filter(plant => plant.isHealthy).length;
  const criticalPlants = totalPlants - healthyPlants;
  const averageMoisture = plants.length ? 
    Math.round(plants.reduce((sum, plant) => sum + plant.kelembaban, 0) / plants.length) : 0;

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
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
    switch (condition?.toLowerCase()) {
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
    switch (condition?.toLowerCase()) {
      case 'baik':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'sedang':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'buruk':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMoistureStatus = (moisture: number) => {
    if (moisture >= 60) return { status: 'Optimal', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/20' };
    if (moisture >= 40) return { status: 'Normal', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' };
    if (moisture >= 20) return { status: 'Rendah', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/20' };
    return { status: 'Kritis', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/20' };
  };

  const getRecommendation = (plant: any) => {
    const { moisture, condition, lastWatered, lastUpdate } = {
      moisture: plant.kelembaban,
      condition: plant.kondisi?.toLowerCase(),
      lastWatered: plant.terakhir_siram,
      lastUpdate: plant.terakhir_update
    };

    // Calculate time since last watering (if available)
    let daysSinceWatering = 0;
    if (lastWatered) {
      try {
        const lastWateredDate = new Date(lastWatered);
        const now = new Date();
        daysSinceWatering = Math.floor((now.getTime() - lastWateredDate.getTime()) / (1000 * 60 * 60 * 24));
      } catch (error) {
        // Ignore date parsing errors
      }
    }

    // Critical conditions
    if (moisture < 15) {
      return "🚨 PENYIRAMAN DARURAT! Kelembaban kritis (<15%). Tanaman berisiko mati dalam 24 jam. Lakukan penyiraman intensif segera dan periksa sistem drainase.";
    } else if (moisture < 25 && condition === 'buruk') {
      return "🔴 TINDAKAN SEGERA DIPERLUKAN! Kelembaban rendah dengan kondisi buruk. Aktifkan sistem penyiraman otomatis dan tambahkan nutrisi tanaman.";
    } else if (moisture < 30) {
      const wateringAdvice = daysSinceWatering > 3 ? 
        `Sudah ${daysSinceWatering} hari tidak disiram. ` : '';
      return `⚠️ PENYIRAMAN PRIORITAS! ${wateringAdvice}Kelembaban di bawah 30%. Siram dengan 200-300ml air dan monitor setiap 2 jam.`;
    } 
    
    // Moderate conditions
    else if (moisture < 45) {
      const advice = [];
      if (daysSinceWatering > 2) advice.push(`Terakhir siram ${daysSinceWatering} hari lalu`);
      advice.push('Kelembaban menurun, penyiraman dalam 6-12 jam');
      if (condition === 'sedang') advice.push('Kondisi tanaman sedang, butuh perhatian ekstra');
      return `📊 MONITORING KETAT: ${advice.join('. ')}.`;
    }
    
    // Good conditions
    else if (moisture < 65) {
      if (condition === 'baik') {
        return "✅ KONDISI STABIL: Kelembaban normal dengan kondisi baik. Lanjutkan jadwal penyiraman rutin setiap 2-3 hari.";
      } else {
        return "📈 KONDISI MEMBAIK: Kelembaban cukup namun kondisi tanaman perlu dipantau. Monitor perubahan dalam 24 jam.";
      }
    }
    
    // Optimal conditions
    else {
      const maintenanceAdvice = daysSinceWatering <= 1 ? 
        'Penyiraman terbaru efektif. ' : '';
      return `🌟 KONDISI OPTIMAL: ${maintenanceAdvice}Kelembaban sangat baik (${moisture}%). Pertahankan jadwal perawatan dan lakukan pemupukan mingguan.`;
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
            Monitor kelembaban tanah dan kondisi tanaman secara real-time dengan GREENOVA Station
          </p>
          {tamanData && tamanData.plants.length > 0 && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Terakhir update: {formatDateTime(tamanData.lastUpdate)}</span>
            </div>
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

      {/* Status Overview - Similar to Air Quality */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tanaman</p>
                <p className="text-2xl font-bold">{totalPlants}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <TreePine className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kondisi Sehat</p>
                <p className="text-2xl font-bold text-green-600">{healthyPlants}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center">
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
              <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
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
                <Badge className={`mt-2 ${getMoistureStatus(averageMoisture).color}`}>
                  {getMoistureStatus(averageMoisture).status}
                </Badge>
              </div>
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status Alerts */}
      {plants.length === 0 && !loading && (
        <Alert className="border-yellow-500/50 text-yellow-600">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Tidak ada data tanaman tersedia</p>
              <p>
                {error ? 
                  "Koneksi ke database bermasalah. Periksa koneksi internet dan coba refresh halaman." :
                  "GREENOVA Station belum mengirim data atau sedang dalam proses konfigurasi. Data akan muncul secara otomatis setelah sensor aktif."
                }
              </p>
              <Button onClick={refreshData} size="sm" className="mt-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Current Plant Status - Like Air Quality Main Card */}
      {plants.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {plants.map((plant) => {
            const moistureStatus = getMoistureStatus(plant.kelembaban);
            return (
              <Card key={plant.id} className={`${moistureStatus.bgColor} border-2`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                        style={{ 
                          backgroundColor: plant.kelembaban >= 60 ? '#22c55e20' : 
                                         plant.kelembaban >= 40 ? '#f59e0b20' : '#ef444420',
                          color: plant.kelembaban >= 60 ? '#22c55e' : 
                                 plant.kelembaban >= 40 ? '#f59e0b' : '#ef4444',
                          border: `3px solid ${plant.kelembaban >= 60 ? '#22c55e40' : 
                                              plant.kelembaban >= 40 ? '#f59e0b40' : '#ef444440'}`
                        }}
                      >
                        {plant.kelembaban}%
                      </div>
                      {/* Real-time indicator */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" title="Data Real-time"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-green-600" />
                        {plant.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <Badge variant={getConditionBadge(plant.kondisi)} className="text-sm px-3 py-1">
                          {getConditionIcon(plant.kondisi)}
                          <span className="ml-1">{plant.kondisi}</span>
                        </Badge>
                        <Badge className={`${moistureStatus.color} text-sm px-3 py-1`}>
                          <Droplets className="h-3 w-3 mr-1" />
                          {moistureStatus.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Kelembaban Tanah</span>
                        <span className="font-bold">{plant.kelembaban}%</span>
                      </div>
                      <Progress value={plant.kelembaban} className="h-3" />
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex items-center justify-between p-2 bg-card/50 rounded">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Update Terakhir:</span>
                        </div>
                        <span className="font-medium">{formatDateTime(plant.terakhir_update)}</span>
                      </div>
                      
                      {plant.terakhir_siram && (
                        <div className="flex items-center justify-between p-2 bg-card/50 rounded">
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-blue-500" />
                            <span className="text-muted-foreground">Terakhir Siram:</span>
                          </div>
                          <span className="font-medium">{formatDateTime(plant.terakhir_siram)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* AI Prediction Section */}
      {robotData && tamanData && plants.length >= 2 && (
        <PredictionCard 
          type="plants"
          robotData={{
            pm25: robotData.debu || 0,
            gas: robotData.gas || 0,
            temperature: robotData.suhu || 0,
            humidity: robotData.kelembaban || 0
          }}
          plantData={{
            plantA: plants.find(p => p.id === 'A')?.kelembaban || 0,
            plantB: plants.find(p => p.id === 'B')?.kelembaban || 0
          }}
        />
      )}

      {/* Plant Care Recommendations - Like Air Quality Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Rekomendasi Perawatan Tanaman
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plants.map((plant) => {
              const moistureStatus = getMoistureStatus(plant.kelembaban);
              return (
                <Alert key={plant.id} className={`${moistureStatus.bgColor}`}>
                  <Leaf className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <strong>{plant.name}:</strong>
                        <Badge variant={getConditionBadge(plant.kondisi)} className="text-xs">
                          {plant.kondisi}
                        </Badge>
                      </div>
                      <p>{getRecommendation(plant)}</p>
                    </div>
                  </AlertDescription>
                </Alert>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Plant Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analisis Detail Tanaman
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plants.map((plant) => {
              // Calculate days since last watering
              let daysSinceWatering = 'Tidak diketahui';
              let wateringStatus = 'Unknown';
              if (plant.terakhir_siram) {
                try {
                  const lastWateredDate = new Date(plant.terakhir_siram);
                  const now = new Date();
                  const days = Math.floor((now.getTime() - lastWateredDate.getTime()) / (1000 * 60 * 60 * 24));
                  daysSinceWatering = `${days} hari yang lalu`;
                  wateringStatus = days <= 1 ? 'Baru' : days <= 3 ? 'Normal' : 'Perlu Perhatian';
                } catch (error) {
                  // Keep default values
                }
              }

              // Calculate data freshness
              let dataFreshness = 'Tidak diketahui';
              try {
                const lastUpdateDate = new Date(plant.terakhir_update);
                const now = new Date();
                const minutes = Math.floor((now.getTime() - lastUpdateDate.getTime()) / (1000 * 60));
                if (minutes < 5) dataFreshness = 'Real-time';
                else if (minutes < 30) dataFreshness = `${minutes} menit lalu`;
                else if (minutes < 60) dataFreshness = '< 1 jam lalu';
                else dataFreshness = `${Math.floor(minutes / 60)} jam lalu`;
              } catch (error) {
                // Keep default value
              }

              return (
                <div key={plant.id} className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    {plant.name}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="text-muted-foreground">Kelembaban Saat Ini:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{plant.kelembaban}%</span>
                        {plant.kelembaban >= 60 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="text-muted-foreground">Status Kondisi:</span>
                      <Badge variant={getConditionBadge(plant.kondisi)}>
                        {getConditionIcon(plant.kondisi)}
                        <span className="ml-1">{plant.kondisi}</span>
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="text-muted-foreground">Status Kelembaban:</span>
                      <div className="text-right">
                        <div className="font-bold">{getMoistureStatus(plant.kelembaban).status}</div>
                        <div className="text-xs text-muted-foreground">
                          {plant.kelembaban < 30 ? 'Kritis' : 
                           plant.kelembaban < 50 ? 'Rendah' : 
                           plant.kelembaban < 70 ? 'Normal' : 'Optimal'}
                        </div>
                      </div>
                    </div>

                    {plant.terakhir_siram && (
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span className="text-muted-foreground">Terakhir Siram:</span>
                        <div className="text-right">
                          <div className="font-bold">{formatDateTime(plant.terakhir_siram)}</div>
                          <div className="text-xs text-muted-foreground">{daysSinceWatering}</div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="text-muted-foreground">Update Data:</span>
                      <div className="text-right">
                        <div className="font-bold">{formatDateTime(plant.terakhir_update)}</div>
                        <div className="text-xs text-muted-foreground">{dataFreshness}</div>
                      </div>
                    </div>

                    {/* Environmental correlation with robot data */}
                    {robotData && (
                      <div className="p-3 border rounded bg-muted/50">
                        <div className="text-sm font-medium mb-2">Korelasi Lingkungan:</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>Suhu: {robotData.suhu}°C</div>
                          <div>Kelembaban Udara: {robotData.kelembaban}%</div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {robotData.suhu > 30 && plant.kelembaban < 50 ? 
                            "⚠️ Suhu tinggi + kelembaban rendah = risiko stress" :
                            robotData.kelembaban > 70 && plant.kelembaban > 60 ?
                            "✅ Kondisi lingkungan mendukung pertumbuhan" :
                            "📊 Kondisi lingkungan dalam rentang normal"
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Plant Care Analytics */}
      {plants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              Analisis AI & Prediksi Perawatan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Overall System Analysis */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analisis Sistem Keseluruhan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Efisiensi Sistem:</div>
                    <div className="text-muted-foreground">
                      {healthyPlants === totalPlants ? '100% - Excellent' :
                       healthyPlants / totalPlants > 0.7 ? '85% - Good' :
                       healthyPlants / totalPlants > 0.5 ? '65% - Moderate' : '40% - Needs Attention'}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Prediksi Penyiraman:</div>
                    <div className="text-muted-foreground">
                      {averageMoisture < 30 ? 'Dalam 2-6 jam' :
                       averageMoisture < 50 ? 'Dalam 12-24 jam' :
                       averageMoisture < 70 ? 'Dalam 2-3 hari' : 'Dalam 4-7 hari'}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Skor Kesehatan:</div>
                    <div className="text-muted-foreground">
                      {averageMoisture >= 60 ? '9.5/10 - Excellent' :
                       averageMoisture >= 40 ? '7.5/10 - Good' :
                       averageMoisture >= 20 ? '5.0/10 - Fair' : '2.5/10 - Critical'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Plant Insights */}
              {plants.map((plant) => {
                const trend = plant.kelembaban >= 60 ? 'optimal' : 
                             plant.kelembaban >= 40 ? 'stable' : 
                             plant.kelembaban >= 20 ? 'declining' : 'critical';
                
                return (
                  <div key={plant.id} className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-3 flex items-center gap-2">
                      <Leaf className="h-4 w-4" />
                      AI Insights - {plant.name}
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium mb-2">Analisis Tren:</div>
                        <div className="text-muted-foreground">
                          {trend === 'optimal' && "📈 Tren kelembaban stabil dalam zona optimal. Sistem auto-irrigation bekerja efektif."}
                          {trend === 'stable' && "📊 Tren kelembaban dalam rentang normal. Monitor untuk memastikan tidak menurun lebih lanjut."}
                          {trend === 'declining' && "📉 Tren menurun terdeteksi. Penyiraman preventif disarankan dalam 6-12 jam."}
                          {trend === 'critical' && "🚨 Tren kritis! Intervensi manual diperlukan. Periksa sistem penyiraman dan drainase."}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium mb-2">Rekomendasi AI:</div>
                        <div className="text-muted-foreground">
                          {plant.kelembaban < 25 && "Aktivasi penyiraman darurat + periksa sensor + tambah mulsa"}
                          {plant.kelembaban >= 25 && plant.kelembaban < 45 && "Penyiraman terjadwal + monitoring 2x sehari + evaluasi nutrisi"}
                          {plant.kelembaban >= 45 && plant.kelembaban < 65 && "Penyiraman rutin + monitoring harian + pemeliharaan preventif"}
                          {plant.kelembaban >= 65 && "Pertahankan jadwal + monitoring 2-3 hari sekali + optimasi nutrisi"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Cards - Like Air Quality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tentang Kelembaban Tanah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/30 rounded">
                <span>60-100%: Optimal</span>
                <div className="w-4 h-4 bg-green-500 rounded"></div>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded">
                <span>40-59%: Normal</span>
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              </div>
              <div className="flex justify-between items-center p-2 bg-orange-50 dark:bg-orange-900/30 rounded">
                <span>20-39%: Rendah</span>
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/30 rounded">
                <span>0-19%: Kritis</span>
                <div className="w-4 h-4 bg-red-500 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Sistem Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span>Status: {tamanData ? 'Online' : 'Offline'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span>Sistem: GREENOVA Station Auto-Irrigation</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <span>AI: Predictive Plant Care System</span>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Data diambil dari sensor kelembaban tanah GREENOVA Station yang memantau 
                  kondisi tanah secara real-time dan mengaktifkan sistem penyiraman otomatis 
                  berdasarkan kebutuhan tanaman.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}