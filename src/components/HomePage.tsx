import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Wind, 
  Thermometer, 
  Droplets, 
  TreePine,
  Bot,
  Gauge,
  RefreshCw,
  AlertTriangle,
  Activity,
  MapPin,
  Clock,
  Leaf,
  ArrowRight,
  CheckCircle,
  Info,
  X,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { usePrediction } from '../hooks/usePrediction';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onAskGreenova?: (autoMessage?: string) => void;
}

export function HomePage({ onNavigate, onAskGreenova }: HomePageProps) {
  const { 
    robotData, 
    tamanData, 
    formatDateTime, 
    loading, 
    error, 
    refreshData 
  } = useFirebaseData();

  const { 
    prediction, 
    generateAutoQuestion 
  } = usePrediction();

  const [showScrollNotification, setShowScrollNotification] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollNotification(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const closeScrollNotification = () => {
    setShowScrollNotification(false);
  };

  // Get AQI status color and recommendation based on string status
  const getAQIInfo = (aqiStatus: string) => {
    const status = aqiStatus.toLowerCase();
    
    if (status === 'baik') return { 
      status: 'Baik', 
      color: '#22c55e', 
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: '😊',
      recommendation: 'Udara sangat bersih. Sempurna untuk aktivitas outdoor!'
    };
    if (status === 'sedang') return { 
      status: 'Sedang', 
      color: '#eab308',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: '😐',
      recommendation: 'Kualitas udara masih dapat diterima untuk kebanyakan orang.'
    };
    // Default to 'buruk' for any other status
    return { 
      status: 'Buruk', 
      color: '#ef4444',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: '😰',
      recommendation: 'Hindari aktivitas outdoor. Gunakan masker saat keluar.'
    };
  };

  const aqiInfo = robotData ? getAQIInfo(robotData.aqi_lokal) : null;

  const handleAskAI = () => {
    const autoQuestion = generateAutoQuestion();
    if (onAskGreenova) {
      onAskGreenova(autoQuestion);
    } else {
      // Fallback to navigation with stored message
      sessionStorage.setItem('autoMessage', autoQuestion);
      onNavigate('ask-greenova');
    }
  };

  return (
    <div className="space-y-12">
      {/* Scroll Notification */}
      {showScrollNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg max-w-md animate-in slide-in-from-top-5">
          <div className="flex items-center gap-3">
            <div className="animate-bounce">
              <ArrowRight className="h-4 w-4 rotate-90" />
            </div>
            <span className="text-sm">Scroll ke bawah untuk melihat kualitas udara dan info selanjutnya</span>
            <button 
              onClick={closeScrollNotification}
              className="ml-2 hover:bg-white/20 rounded p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center py-16 space-y-8">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            GREENOVA AI
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Solusi Teknologi Pintar untuk Lingkungan Bersih dan Sehat
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Robot GREENOVA menghadirkan monitoring kualitas udara real-time dan sistem 
            pertanian urban berkelanjutan untuk menciptakan masa depan yang lebih hijau.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => onNavigate('air-quality')}
            className="text-lg px-8"
          >
            <Wind className="h-5 w-5 mr-2" />
            Lihat Kualitas Udara
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => onNavigate('how-it-works')}
            className="text-lg px-8"
          >
            <Bot className="h-5 w-5 mr-2" />
            Cara Kerja Robot
          </Button>
        </div>
      </section>

      {/* Real-time Data Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Robot Status */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status Robot</p>
                <p className="text-2xl font-bold">
                  {loading ? 'Loading...' : robotData?.isOnline ? 'Online' : 'Offline'}
                </p>
                {robotData && (
                  <Badge className={robotData.isOnline ? 'bg-green-500' : 'bg-red-500'}>
                    {robotData.isOnline ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                )}
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Bot className={`h-6 w-6 ${robotData?.isOnline ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </div>
            {robotData && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${robotData.isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-muted-foreground">
                  Update: {formatDateTime(robotData.terakhir_update)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Air Quality Status */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kualitas Udara</p>
                <p className="text-2xl font-bold">
                  {loading ? 'Loading...' : robotData ? robotData.aqi_lokal : 'N/A'}
                </p>
                {robotData && aqiInfo && (
                  <Badge style={{ backgroundColor: aqiInfo.color }} className="text-white">
                    {aqiInfo.status}
                  </Badge>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Wind className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dust Level */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Debu PM2.5</p>
                <p className="text-2xl font-bold">
                  {loading ? 'Loading...' : robotData ? `${robotData.debu}` : 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">μg/m³</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <Wind className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gas Level */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gas</p>
                <p className="text-2xl font-bold">
                  {loading ? 'Loading...' : robotData ? `${robotData.gas}` : 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">ppm</p>
              </div>
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <Gauge className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temperature */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suhu Udara</p>
                <p className="text-2xl font-bold">
                  {loading ? 'Loading...' : robotData ? `${robotData.suhu}°C` : 'N/A'}
                </p>
                {robotData && (
                  <Badge className={`mt-2 ${
                    robotData.suhu >= 20 && robotData.suhu <= 30 ? 'bg-green-500' :
                    robotData.suhu >= 15 && robotData.suhu <= 35 ? 'bg-yellow-500' : 'bg-red-500'
                  } text-white`}>
                    {robotData.suhu >= 20 && robotData.suhu <= 30 ? 'Optimal' :
                     robotData.suhu >= 15 && robotData.suhu <= 35 ? 'Normal' : 'Ekstrem'}
                  </Badge>
                )}
              </div>
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <Thermometer className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* AI Recommendations Section */}
      {prediction?.ai_recommendation && (
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Rekomendasi AI GREENOVA
            </h2>
            <p className="text-muted-foreground">
              Saran dan rekomendasi berdasarkan analisis data sensor real-time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Wind className="h-5 w-5" />
                  Saran Lingkungan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{prediction.ai_recommendation.environmental_advice}</p>
                {prediction.ai_recommendation.safety_warning && (
                  <Alert className="mt-4 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-700 dark:text-orange-200">
                      {prediction.ai_recommendation.safety_warning}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <TreePine className="h-5 w-5" />
                  Tips Perawatan Tanaman
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{prediction.ai_recommendation.plant_care_tips}</p>
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium text-primary">Tindakan yang Diperlukan:</p>
                  <p className="text-sm mt-1">{prediction.ai_recommendation.action_required}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={handleAskAI}
              size="lg"
              className="text-lg px-8"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Tanya AI Untuk Saran Lebih Detail
            </Button>
          </div>
        </section>
      )}

      {/* Air Quality Section */}
      {robotData && aqiInfo && (
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Kualitas Udara Saat Ini</h2>
            <p className="text-muted-foreground">
              Monitoring real-time kualitas udara dengan teknologi GREENOVA
            </p>
          </div>

          <Card className={`${"bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-primary/20"} ${aqiInfo.borderColor} border-2`}>
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-6">
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold"
                    style={{ 
                      backgroundColor: aqiInfo.color + '20', 
                      color: aqiInfo.color,
                      border: `3px solid ${aqiInfo.color}40`
                    }}
                  >
                    {aqiInfo.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-3xl font-bold mb-2">Status Kualitas Udara</h3>
                    <div className="flex items-center gap-3">
                      <Badge 
                        className="text-white text-lg px-4 py-2"
                        style={{ backgroundColor: aqiInfo.color }}
                      >
                        {aqiInfo.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Alert className={`${aqiInfo.bgColor} ${aqiInfo.borderColor}`}>
                  <Info className="h-4 w-4" />
                  <AlertDescription className={aqiInfo.textColor}>
                    <strong>Rekomendasi:</strong> {aqiInfo.recommendation}
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-card/50 border border-border rounded-lg">
                    <Wind className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">PM2.5</p>
                    <p className="text-xl font-bold">{robotData.debu} μg/m³</p>
                  </div>
                  <div className="text-center p-4 bg-card/50 border border-border rounded-lg">
                    <Gauge className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Gas</p>
                    <p className="text-xl font-bold">{robotData.gas} ppm</p>
                  </div>
                  <div className="text-center p-4 bg-card/50 border border-border rounded-lg">
                    <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="text-xl font-bold">{robotData.jarak} cm</p>
                  </div>
                </div>

                <Button 
                  onClick={() => onNavigate('air-quality')}
                  className="text-lg px-8"
                >
                  Lihat Analisis Lengkap
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Plant Monitoring Section */}
      {tamanData && tamanData.plants.length > 0 && (
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Monitoring Tanaman</h2>
            <p className="text-muted-foreground">
              Sistem pemantauan tanaman otomatis dengan sensor kelembaban tanah
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tamanData.plants.map((plant, index) => {
              const getConditionColor = (kondisi: string) => {
                switch (kondisi.toLowerCase()) {
                  case 'baik': return 'bg-green-500';
                  case 'sedang': return 'bg-yellow-500';
                  case 'buruk': return 'bg-red-500';
                  default: return 'bg-gray-500';
                }
              };

              return (
                <Card key={index} className="hover:shadow-lg transition-all hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-green-600" />
                      {plant.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Kelembaban:</span>
                      <span className="text-2xl font-bold">{plant.kelembaban}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Kondisi:</span>
                      <Badge className={`${getConditionColor(plant.kondisi)} text-white`}>
                        {plant.kondisi}
                      </Badge>
                    </div>

                    {plant.terakhir_siram && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Terakhir Siram:</span>
                        <span className="text-sm font-medium">
                          {formatDateTime(plant.terakhir_siram)}
                        </span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Kelembaban Tanah</span>
                        <span>{plant.kelembaban}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            plant.kelembaban >= 60 ? 'bg-green-500' :
                            plant.kelembaban >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, plant.kelembaban))}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Fitur GREENOVA</h2>
          <p className="text-muted-foreground">
            Teknologi canggih untuk monitoring lingkungan dan pertanian berkelanjutan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all hover:scale-105">
            <CardContent className="p-6 text-center">
              <Wind className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Monitor Kualitas Udara</h3>
              <p className="text-muted-foreground">
                Pemantauan real-time PM2.5, gas berbahaya, dan kualitas udara dengan sensor presisi tinggi.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:scale-105">
            <CardContent className="p-6 text-center">
              <TreePine className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Pertanian Pintar</h3>
              <p className="text-muted-foreground">
                Sistem monitoring kelembaban tanah dan kondisi tanaman dengan teknologi IoT.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:scale-105">
            <CardContent className="p-6 text-center">
              <Bot className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
              <p className="text-muted-foreground">
                Chatbot AI yang membantu memberikan informasi dan rekomendasi lingkungan.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <section className="text-center py-8">
          <Alert className="max-w-md mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Terjadi kesalahan saat memuat data: {error}
            </AlertDescription>
          </Alert>
          <Button onClick={refreshData} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        </section>
      )}

      {/* CTA Section */}
      <section className="text-center py-16 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl border border-border">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Mulai Monitoring Lingkungan Anda</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Bergabunglah dengan revolusi teknologi hijau. Pantau kualitas udara dan 
            kelola pertanian urban dengan teknologi GREENOVA yang canggih.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => onNavigate('air-quality')}
              className="text-lg px-8"
            >
              Mulai Monitoring
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => onNavigate('about')}
              className="text-lg px-8"
            >
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}