import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowRight,
  Leaf,
  Shield,
  Activity,
  Users,
  MapPin,
  Bot,
  Heart,
  Lightbulb,
  TreePine,
  Wind,
  Droplets,
  CheckCircle2,
  Star,
  Globe,
  Zap,
  Target
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const reasons = [
    {
      icon: Wind,
      title: "Polusi Udara Meningkat",
      description: "Kualitas udara di kota-kota besar Indonesia semakin memburuk akibat emisi kendaraan dan industri. PM2.5 mencapai level berbahaya bagi kesehatan."
    },
    {
      icon: TreePine,
      title: "Ruang Hijau Berkurang",
      description: "Urbanisasi yang cepat mengurangi ruang hijau kota. Kita perlu solusi cerdas untuk menciptakan oasis hijau di tengah kota."
    },
    {
      icon: Droplets,
      title: "Konsumsi Air Berlebihan",
      description: "Sistem irigasi konvensional membuang 40% air. Teknologi pintar dapat mengoptimalkan penggunaan air untuk pertanian urban."
    },
    {
      icon: Activity,
      title: "Kurangnya Monitoring Real-time",
      description: "Pemantauan lingkungan masih manual dan tidak real-time, sehingga sulit mengambil tindakan pencegahan yang tepat waktu."
    }
  ];

  const solutions = [
    {
      icon: Shield,
      title: "Pembersih Udara Aktif",
      description: "Memfilter polutan dan partikel berbahaya dari udara sekitar menggunakan sistem filtrasi canggih."
    },
    {
      icon: Bot,
      title: "Perawat Lingkungan Otomatis",
      description: "Melakukan penyiraman, pemupukan, dan perawatan tanaman secara otomatis berdasarkan data sensor."
    },
    {
      icon: Activity,
      title: "Monitor Lingkungan Interaktif",
      description: "Memberikan informasi real-time tentang kualitas udara, suhu, kelembaban, dan kondisi tanaman."
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section id="home" className="text-center space-y-8 py-8">
        <div className="space-y-6">
          <Badge className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white border-0 mb-4">
            <Leaf className="h-4 w-4 mr-2" />
            Teknologi Pertanian Berkelanjutan
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Menumbuhkan{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Udara Bersih
            </span>
            <br />
            di Daerah Anda
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            GREENOVA AI menghadirkan robot pintar yang menggabungkan teknologi AI, IoT, dan computer vision 
            untuk menciptakan lingkungan yang lebih bersih dan sehat melalui pertanian urban yang berkelanjutan.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              size="lg" 
              className="text-lg px-8 py-4"
              onClick={() => onNavigate('air-quality')}
            >
              <Wind className="h-5 w-5 mr-2" />
              Lihat Kualitas Udara Sekitar
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              <Bot className="h-5 w-5 mr-2" />
              Demo Robot
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16">
          {[
            { icon: Wind, number: "40%", label: "Pengurangan Polutan" },
            { icon: Droplets, number: "60%", label: "Penghematan Air" },
            { icon: TreePine, number: "100+", label: "Tanaman Terpantau" },
            { icon: Users, number: "24/7", label: "Monitoring Real-time" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{stat.number}</div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why This is Important */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Why this is important for us?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Indonesia menghadapi tantangan lingkungan yang serius. Teknologi GREENOVA AI hadir sebagai solusi inovatif 
            untuk menciptakan masa depan yang lebih berkelanjutan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20">
                    <reason.icon className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{reason.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{reason.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Our Solution */}
      <section id="solution" className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 md:p-12 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">GREENOVA: Our Solution</h2>
          <Badge className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white text-lg">
            3-in-1 Solution
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Solutions List */}
          <div className="space-y-8">
            {solutions.map((solution, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg">
                  <solution.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{solution.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{solution.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Robot Image Placeholder */}
          <div className="relative">
            <Card className="p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-primary/20">
              <CardContent className="text-center space-y-6">
                <div className="relative w-48 h-48 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl">
                  <Bot className="h-24 w-24 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full animate-pulse flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Robot GREENOVA AI</h3>
                  <p className="text-muted-foreground">Dilengkapi ESP32-CAM & Teachable Machine</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span>Status: Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span>Battery: 87%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/20 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-secondary/20 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* How It Works CTA */}
        <div className="text-center space-y-6 pt-8 border-t border-primary/20">
          <h3 className="text-2xl font-semibold">Penasaran gimana cara kerjanya?</h3>
          <Button 
            size="lg" 
            className="text-lg px-8 py-4"
            onClick={() => onNavigate('how-it-works')}
          >
            <Lightbulb className="h-5 w-5 mr-2" />
            Intip cara kerjanya di sini...
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Live Map Teaser */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Live Map Teaser</h2>
          <p className="text-lg text-muted-foreground">
            Pantau lokasi dan aktivitas robot GREENOVA secara real-time di peta interaktif
          </p>
        </div>

        <Card className="relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-0 relative">
            {/* Map Preview */}
            <div className="h-64 md:h-80 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 relative">
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              
              {/* Simulated Map Elements */}
              <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-400 opacity-50"></div>
              <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-gray-400 opacity-50"></div>
              
              {/* Robot Pins */}
              <div className="absolute top-1/2 left-1/3 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="absolute top-1/3 left-1/2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <Bot className="h-4 w-4 text-white" />
              </div>
              
              {/* Overlay Info */}
              <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Taman Pojok</p>
                    <p className="text-sm text-green-500">AQI: 55 (Baik)</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">2 Robot Online</span>
                </div>
              </div>

              {/* Center Overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[1px]">
                <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Peta Interaktif Real-time</h3>
                    <p className="text-muted-foreground mb-4">
                      Lihat lokasi robot, status, dan data sensor dalam peta yang interaktif
                    </p>
                    <Button onClick={() => onNavigate('live-map')}>
                      <Globe className="h-4 w-4 mr-2" />
                      Jelajahi peta selengkapnya...
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Feature Highlights */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Mengapa Memilih GREENOVA AI?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Star,
              title: "Teknologi Terdepan",
              description: "Menggunakan AI, IoT, dan Computer Vision terbaru untuk hasil optimal"
            },
            {
              icon: Shield,
              title: "Ramah Lingkungan",
              description: "Mengurangi penggunaan air hingga 60% dan meningkatkan kualitas udara"
            },
            {
              icon: Activity,
              title: "Monitoring 24/7",
              description: "Pemantauan real-time dengan notifikasi otomatis untuk kondisi kritis"
            }
          ].map((feature, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Collaboration Section */}
      <section id="collaboration" className="bg-gradient-to-r from-primary to-secondary text-white rounded-3xl p-8 md:p-12 text-center space-y-8">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Mari Berkolaborasi</h2>
          <h3 className="text-2xl md:text-3xl font-semibold opacity-90">Untuk Indonesia yang lebih bersih</h3>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Bergabunglah dengan gerakan teknologi hijau Indonesia. Bersama-sama kita dapat menciptakan 
            lingkungan yang lebih bersih dan sehat untuk generasi masa depan melalui inovasi teknologi pertanian berkelanjutan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="text-primary font-semibold px-8 py-4">
            <Heart className="h-5 w-5 mr-2" />
            Hubungi Kami
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Button 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 py-6"
            onClick={() => onNavigate('about')}
          >
            <Users className="h-5 w-5 mr-2" />
            Tentang Kami
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 py-6"
            onClick={() => onNavigate('support')}
          >
            <Target className="h-5 w-5 mr-2" />
            Kolaborasi
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 py-6"
            onClick={() => onNavigate('support')}
          >
            <Heart className="h-5 w-5 mr-2" />
            Donasi
          </Button>
        </div>
      </section>
    </div>
  );
}