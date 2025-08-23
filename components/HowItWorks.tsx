import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Bot,
  Wifi,
  Cloud,
  Database,
  Brain,
  Smartphone,
  Laptop,
  Bell,
  Activity,
  Thermometer,
  Droplets,
  Gauge,
  Radio,
  Server,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  Zap,
  Eye,
  Shield,
  Clock
} from 'lucide-react';

const steps = [
  {
    number: "01",
    title: "Pengumpulan Data Sensor",
    subtitle: "Data Collection",
    description: "Robot Greenova AI, yang dilengkapi dengan berbagai sensor (suhu, kelembaban, pH tanah, dll.), mengumpulkan data lingkungan dari lokasi yang telah ditentukan.",
    icon: Bot,
    color: "bg-blue-500",
    features: [
      { icon: Thermometer, label: "Sensor Suhu", value: "±0.1°C" },
      { icon: Droplets, label: "Kelembaban", value: "0-100%" },
      { icon: Gauge, label: "pH Tanah", value: "0-14 pH" },
      { icon: Activity, label: "Real-time", value: "24/7" }
    ],
    visual: "robot-sensors"
  },
  {
    number: "02", 
    title: "Pengiriman Data Real-time",
    subtitle: "Data Transmission",
    description: "Data yang terkumpul dikirim secara instan melalui Wi-Fi atau jaringan seluler ke server backend menggunakan protokol MQTT.",
    icon: Wifi,
    color: "bg-green-500",
    features: [
      { icon: Wifi, label: "Wi-Fi 802.11", value: "2.4/5GHz" },
      { icon: Radio, label: "MQTT Protocol", value: "Secure" },
      { icon: Zap, label: "Latency", value: "<100ms" },
      { icon: Shield, label: "Encryption", value: "TLS 1.3" }
    ],
    visual: "data-transmission"
  },
  {
    number: "03",
    title: "Analisis Data di Server", 
    subtitle: "Processing & Analysis",
    description: "Server backend (Flask) memproses data, menyimpannya di database, dan menganalisisnya dengan model AI untuk mendeteksi anomali atau pola penting.",
    icon: Brain,
    color: "bg-purple-500",
    features: [
      { icon: Server, label: "Flask Backend", value: "Python" },
      { icon: Database, label: "Database", value: "PostgreSQL" },
      { icon: Brain, label: "AI Model", value: "TensorFlow" },
      { icon: TrendingUp, label: "Analytics", value: "Real-time" }
    ],
    visual: "ai-processing"
  },
  {
    number: "04",
    title: "Informasi untuk Anda",
    subtitle: "Visualization & Notification", 
    description: "Data yang telah dianalisis divisualisasikan dalam dashboard yang interaktif dan mudah dipahami. Sistem juga akan mengirimkan notifikasi penting, seperti peringatan dini bencana, ke perangkat Anda.",
    icon: Smartphone,
    color: "bg-orange-500",
    features: [
      { icon: BarChart3, label: "Dashboard", value: "Interactive" },
      { icon: Bell, label: "Notifikasi", value: "Push/Email" },
      { icon: Eye, label: "Visualisasi", value: "Real-time" },
      { icon: AlertTriangle, label: "Peringatan", value: "Otomatis" }
    ],
    visual: "dashboard-notification"
  }
];

export function HowItWorks() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <Badge className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white border-0">
            <Bot className="h-4 w-4 mr-2" />
            Sistem Greenova AI
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Bagaimana Cara Kerjanya?
          </h1>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Sistem robot Greenova AI bekerja melalui 4 tahapan utama untuk memberikan solusi pertanian pintar yang efisien dan berkelanjutan.
            </p>
            <p className="text-base text-muted-foreground">
              Dari pengumpulan data sensor hingga notifikasi cerdas - mari pelajari alur kerja teknologi revolusioner ini.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: Clock, label: "Response Time", value: "<100ms", color: "text-blue-500" },
          { icon: Shield, label: "Security", value: "99.9%", color: "text-green-500" },
          { icon: Activity, label: "Uptime", value: "24/7", color: "text-purple-500" },
          { icon: CheckCircle2, label: "Accuracy", value: "95%+", color: "text-orange-500" }
        ].map((stat, index) => (
          <Card key={index} className="p-4 text-center hover:shadow-lg transition-shadow">
            <CardContent className="space-y-2">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Workflow */}
      <div className="space-y-16">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Desktop Layout */}
            <div className="hidden lg:block">
              <div className={`grid grid-cols-12 gap-8 items-center ${index % 2 === 0 ? '' : 'direction-rtl'}`}>
                {/* Content Side */}
                <div className={`col-span-6 space-y-6 ${index % 2 === 0 ? '' : 'order-2'}`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-16 h-16 rounded-2xl ${step.color} text-white text-xl font-bold`}>
                        {step.number}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{step.title}</h2>
                        <p className="text-primary font-medium">{step.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {step.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${step.color}/10`}>
                          <feature.icon className={`h-4 w-4 ${step.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{feature.label}</p>
                          <p className="text-xs text-muted-foreground">{feature.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Side */}
                <div className={`col-span-6 ${index % 2 === 0 ? '' : 'order-1'}`}>
                  <Card className="p-8 bg-gradient-to-br from-muted/30 to-muted/10 border-2 border-muted hover:shadow-xl transition-all duration-300">
                    <CardContent className="text-center space-y-6">
                      <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl ${step.color} text-white`}>
                        <step.icon className="h-12 w-12" />
                      </div>
                      
                      {/* Visual Workflow */}
                      <div className="space-y-4">
                        {step.visual === "robot-sensors" && (
                          <div className="space-y-4">
                            <div className="flex justify-center gap-2">
                              {[Thermometer, Droplets, Gauge, Activity].map((Icon, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 p-3 bg-background rounded-lg shadow-sm">
                                  <Icon className="h-6 w-6 text-blue-500" />
                                  <div className="w-8 h-1 bg-blue-500 rounded animate-pulse"></div>
                                </div>
                              ))}
                            </div>
                            <div className="text-sm text-muted-foreground">Data sensor real-time</div>
                          </div>
                        )}

                        {step.visual === "data-transmission" && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-center gap-4">
                              <div className="p-3 bg-background rounded-lg shadow-sm">
                                <Bot className="h-8 w-8 text-green-500" />
                              </div>
                              <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                  <div key={i} className={`w-2 h-2 rounded-full bg-green-500 animate-pulse`} style={{animationDelay: `${i * 0.2}s`}}></div>
                                ))}
                              </div>
                              <div className="p-3 bg-background rounded-lg shadow-sm">
                                <Cloud className="h-8 w-8 text-green-500" />
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">Transmisi data aman</div>
                          </div>
                        )}

                        {step.visual === "ai-processing" && (
                          <div className="space-y-4">
                            <div className="flex justify-center gap-3">
                              <div className="p-3 bg-background rounded-lg shadow-sm">
                                <Server className="h-6 w-6 text-purple-500" />
                              </div>
                              <div className="p-3 bg-background rounded-lg shadow-sm">
                                <Database className="h-6 w-6 text-purple-500" />
                              </div>
                              <div className="p-3 bg-background rounded-lg shadow-sm relative">
                                <Brain className="h-6 w-6 text-purple-500" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">AI menganalisis data</div>
                          </div>
                        )}

                        {step.visual === "dashboard-notification" && (
                          <div className="space-y-4">
                            <div className="flex justify-center gap-3">
                              <div className="p-3 bg-background rounded-lg shadow-sm">
                                <Laptop className="h-6 w-6 text-orange-500" />
                              </div>
                              <div className="p-3 bg-background rounded-lg shadow-sm relative">
                                <Smartphone className="h-6 w-6 text-orange-500" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
                              </div>
                              <div className="p-3 bg-background rounded-lg shadow-sm">
                                <BarChart3 className="h-6 w-6 text-orange-500" />
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">Dashboard & notifikasi real-time</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden space-y-6">
              <Card className="p-6 bg-gradient-to-br from-muted/30 to-muted/10 border-2 border-muted">
                <CardContent className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${step.color} text-white font-bold`}>
                      {step.number}
                    </div>
                    <div className={`flex items-center justify-center w-16 h-16 rounded-2xl ${step.color} text-white`}>
                      <step.icon className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-primary font-medium">{step.subtitle}</p>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Features for Mobile */}
                  <div className="grid grid-cols-2 gap-3">
                    {step.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-2 p-2 bg-background rounded-lg shadow-sm">
                        <feature.icon className={`h-4 w-4 ${step.color.replace('bg-', 'text-')}`} />
                        <div className="text-left">
                          <p className="text-xs font-medium">{feature.label}</p>
                          <p className="text-xs text-muted-foreground">{feature.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Arrow Connector (not for last item) */}
            {index < steps.length - 1 && (
              <div className="flex justify-center my-8">
                <div className="hidden lg:block">
                  <ArrowDown className="h-8 w-8 text-primary animate-bounce" />
                </div>
                <div className="lg:hidden">
                  <ArrowDown className="h-6 w-6 text-primary animate-bounce" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl p-8 md:p-12 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Mengapa Sistem Ini Efektif?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kombinasi teknologi canggih yang memberikan solusi pertanian pintar dan berkelanjutan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "Respons Cepat",
              description: "Sistem bereaksi dalam hitungan detik untuk memberikan solusi optimal",
              color: "text-yellow-500"
            },
            {
              icon: Brain,
              title: "AI Cerdas",
              description: "Machine learning yang terus belajar untuk hasil yang semakin akurat",
              color: "text-purple-500"
            },
            {
              icon: Shield,
              title: "Keamanan Tinggi",
              description: "Enkripsi end-to-end melindungi semua data yang dikumpulkan",
              color: "text-blue-500"
            }
          ].map((benefit, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted ${benefit.color}`}>
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-6 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-8 md:p-12">
        <div className="space-y-4">
          <h3 className="text-2xl md:text-3xl font-bold">Siap Merasakan Teknologi Ini?</h3>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Jelajahi dashboard interaktif dan lihat bagaimana Greenova AI dapat mengubah cara Anda bercocok tanam
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="text-primary font-semibold px-8">
            <Activity className="h-5 w-5 mr-2" />
            Lihat Dashboard
          </Button>
          <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Bot className="h-5 w-5 mr-2" />
            Pelajari Lebih Lanjut
          </Button>
        </div>
      </div>
    </div>
  );
}