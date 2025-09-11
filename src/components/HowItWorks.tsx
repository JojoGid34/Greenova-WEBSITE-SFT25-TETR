import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Bot,
  Droplets,
  Cpu,
  Database,
  Monitor,
  Zap,
  BarChart3,
  CheckCircle,
  ArrowRight,
  ArrowDown,
  Thermometer,
  Wind,
  Gauge,
  TreePine,
  Wifi,
  Brain,
  Activity,
  Clock,
  TrendingUp,
  Target,
  Settings
} from 'lucide-react';

const workflowSteps = [
  {
    id: 1,
    title: "Data Collection",
    description: "Robot dan Station mengumpulkan data sensor secara real-time",
    icon: <Activity className="h-6 w-6" />,
    details: [
      "Robot membaca sensor suhu, kelembaban udara, debu (PM2.5), dan gas",
      "Station membaca sensor kelembaban tanah dari tanaman",
      "Data dikumpulkan setiap beberapa detik secara kontinyu",
      "Semua pembacaan sensor dikirim ke ESP32 controller"
    ]
  },
  {
    id: 2,
    title: "Data Transmission",
    description: "ESP32 mengirim data ke Firebase Realtime Database",
    icon: <Wifi className="h-6 w-6" />,
    details: [
      "ESP32 pada robot dan station terhubung ke WiFi",
      "Data sensor dikirim ke Firebase Realtime Database",
      "Update database dilakukan setiap beberapa detik",
      "Sistem backup untuk memastikan data tidak hilang"
    ]
  },
  {
    id: 3,
    title: "AI Processing",
    description: "TensorFlow.js melakukan analisis dan prediksi data",
    icon: <Brain className="h-6 w-6" />,
    details: [
      "TensorFlow.js menganalisis pola data historis",
      "Membuat prediksi kondisi lingkungan ke depan",
      "Menghitung Air Quality Index (AQI) otomatis",
      "AI memberikan rekomendasi berdasarkan kondisi"
    ]
  },
  {
    id: 4,
    title: "Real-time Visualization",
    description: "Dashboard menampilkan data dan insights secara real-time",
    icon: <Monitor className="h-6 w-6" />,
    details: [
      "Dashboard web menampilkan data terbaru",
      "Grafik dan chart yang mudah dipahami",
      "Notifikasi alert untuk kondisi berbahaya",
      "Interface yang user-friendly untuk semua kalangan"
    ]
  },
  {
    id: 5,
    title: "Automated Actions",
    description: "Station melakukan tindakan otomatis berdasarkan data",
    icon: <Settings className="h-6 w-6" />,
    details: [
      "Station menyiram tanaman kering secara otomatis",
      "ESP32 mengontrol sistem penyiraman",
      "Penyiraman berdasarkan threshold kelembaban tanah",
      "Log aktivitas penyiraman disimpan ke database"
    ]
  }
];

const robotFeatures = [
  {
    icon: <Thermometer className="h-5 w-5" />,
    title: "Sensor Suhu",
    description: "Monitoring suhu udara untuk analisis kualitas lingkungan"
  },
  {
    icon: <Droplets className="h-5 w-5" />,
    title: "Sensor Kelembaban Udara",
    description: "Mengukur kelembaban udara untuk comfort index"
  },
  {
    icon: <Wind className="h-5 w-5" />,
    title: "Sensor Debu PM2.5",
    description: "Deteksi partikel debu halus yang berbahaya bagi kesehatan"
  },
  {
    icon: <Gauge className="h-5 w-5" />,
    title: "Sensor Gas",
    description: "Monitoring gas berbahaya di udara"
  }
];

const stationFeatures = [
  {
    icon: <Droplets className="h-5 w-5" />,
    title: "Sensor Kelembaban Tanah",
    description: "Monitoring kelembaban tanah untuk kesehatan tanaman"
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Sistem Penyiraman Otomatis",
    description: "ESP32 mengontrol penyiraman berdasarkan kondisi tanah"
  },
  {
    icon: <TreePine className="h-5 w-5" />,
    title: "Monitoring Tanaman",
    description: "Tracking kondisi dan kesehatan tanaman secara real-time"
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Data Analytics",
    description: "Analisis pola pertumbuhan dan kebutuhan air tanaman"
  }
];

const technicalSpecs = {
  robot: [
    { spec: "Controller", value: "ESP32" },
    { spec: "Sensor Suhu", value: "DHT22/BME280" },
    { spec: "Sensor PM2.5", value: "PMS5003" },
    { spec: "Sensor Gas", value: "MQ-135" },
    { spec: "Konektivitas", value: "WiFi 802.11 b/g/n" },
    { spec: "Update Rate", value: "Setiap beberapa detik" },
    { spec: "Power Supply", value: "DC 5V/USB" },
    { spec: "Database", value: "Firebase Realtime" }
  ],
  station: [
    { spec: "Controller", value: "ESP32" },
    { spec: "Sensor Kelembaban", value: "Soil Moisture Sensor" },
    { spec: "Actuator", value: "Water Pump + Relay" },
    { spec: "Threshold", value: "Configurable" },
    { spec: "Konektivitas", value: "WiFi 802.11 b/g/n" },
    { spec: "Update Rate", value: "Setiap beberapa detik" },
    { spec: "Auto Watering", value: "Based on soil condition" },
    { spec: "Database", value: "Firebase Realtime" }
  ]
};

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <Badge variant="outline" className="text-lg px-4 py-2">
          Cara Kerja GREENOVA
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold">
          Teknologi Monitoring Lingkungan
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Sistem GREENOVA menggabungkan robot dan station pintar untuk monitoring kualitas udara 
          dan perawatan tanaman otomatis dengan teknologi ESP32, sensor IoT, dan AI predictions.
        </p>
      </section>

      {/* System Overview */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Sistem GREENOVA</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dua perangkat yang bekerja secara sinergis untuk monitoring lingkungan komprehensif
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Robot */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bot className="h-6 w-6 text-blue-600" />
                </div>
                GREENOVA Robot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Robot pintar untuk monitoring kualitas udara dengan multiple sensor environment
              </p>

              <div className="space-y-3">
                <h4 className="font-semibold">Fitur Utama:</h4>
                <div className="grid grid-cols-1 gap-3">
                  {robotFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="p-1 bg-primary/10 rounded">
                        {feature.icon}
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">{feature.title}</h5>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Badge className="bg-blue-500">
                  Real-time Air Quality Monitoring
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Station */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Droplets className="h-6 w-6 text-green-600" />
                </div>
                GREENOVA Station
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Station pintar untuk monitoring dan perawatan tanaman otomatis
              </p>

              <div className="space-y-3">
                <h4 className="font-semibold">Fitur Utama:</h4>
                <div className="grid grid-cols-1 gap-3">
                  {stationFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="p-1 bg-green-500/10 rounded">
                        {feature.icon}
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">{feature.title}</h5>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Badge className="bg-green-500">
                  Automated Plant Care System
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works - Workflow */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Alur Kerja Sistem</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Proses end-to-end dari pengumpulan data sensor hingga tindakan otomatis
          </p>
        </div>

        <div className="space-y-8">
          {workflowSteps.map((step, index) => (
            <div key={step.id}>
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  activeStep === step.id 
                    ? 'ring-2 ring-primary shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setActiveStep(step.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      activeStep === step.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {step.icon}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Step {step.id}</Badge>
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                      
                      <p className="text-muted-foreground">{step.description}</p>
                      
                      {activeStep === step.id && (
                        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-semibold mb-2">Detail Proses:</h4>
                          <ul className="space-y-1">
                            {step.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        activeStep === step.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {step.id}
                      </div>
                      
                      {index < workflowSteps.length - 1 && (
                        <ArrowDown className="h-4 w-4 text-muted-foreground mt-2" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Spesifikasi Teknis</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Detail teknis hardware dan software yang digunakan dalam sistem GREENOVA
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="robot">Robot Specs</TabsTrigger>
            <TabsTrigger value="station">Station Specs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <CardContent className="space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Cpu className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Hardware</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• ESP32 Microcontroller</li>
                    <li>• Multiple Environmental Sensors</li>
                    <li>• WiFi Connectivity</li>
                    <li>• Automated Actuators</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="p-6 text-center">
                <CardContent className="space-y-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Database className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Database</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Firebase Realtime Database</li>
                    <li>• Real-time Data Sync</li>
                    <li>• Cloud Storage</li>
                    <li>• Historical Data Archive</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="p-6 text-center">
                <CardContent className="space-y-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold">AI & Analytics</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• TensorFlow.js Predictions</li>
                    <li>• Machine Learning Models</li>
                    <li>• Real-time Analysis</li>
                    <li>• Forecasting System</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="robot">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  GREENOVA Robot - Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {technicalSpecs.robot.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">{item.spec}</span>
                      <span className="text-muted-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="station">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5" />
                  GREENOVA Station - Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {technicalSpecs.station.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">{item.spec}</span>
                      <span className="text-muted-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Benefits Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Keunggulan GREENOVA</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Manfaat yang didapat dengan menggunakan sistem monitoring GREENOVA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <TrendingUp className="h-6 w-6" />,
              title: "Real-time Monitoring",
              description: "Monitoring kondisi lingkungan dan tanaman secara real-time 24/7"
            },
            {
              icon: <Brain className="h-6 w-6" />,
              title: "AI-Powered Insights",
              description: "Analisis cerdas dan prediksi untuk pengambilan keputusan yang tepat"
            },
            {
              icon: <Zap className="h-6 w-6" />,
              title: "Automated Actions",
              description: "Sistem otomatis untuk perawatan tanaman tanpa intervensi manual"
            },
            {
              icon: <Target className="h-6 w-6" />,
              title: "Precision Monitoring",
              description: "Sensor akurat untuk pembacaan data lingkungan yang presisi"
            },
            {
              icon: <Monitor className="h-6 w-6" />,
              title: "User-Friendly Interface",
              description: "Dashboard yang mudah dipahami untuk semua kalangan pengguna"
            },
            {
              icon: <Clock className="h-6 w-6" />,
              title: "Historical Analysis",
              description: "Analisis tren dan pola dari data historis untuk insights mendalam"
            }
          ].map((benefit, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Siap Mencoba GREENOVA?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Jelajahi dashboard real-time dan lihat bagaimana GREENOVA dapat membantu 
            Anda memahami kondisi lingkungan dengan lebih baik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Lihat Dashboard Live
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Download Technical Specs
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}