import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  BookOpen, 
  Leaf, 
  Bot, 
  Wind, 
  Droplets, 
  Sun,
  Shield,
  Lightbulb,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Copy,
  Eye,
  Heart,
  Play,
  FileText,
  Download,
  ExternalLink,
  Thermometer,
  Gauge
} from 'lucide-react';

// Educational Dashboard Data
const cityComparisons = [
  { city: 'Jakarta Pusat', pm25: 85, status: 'Tidak Sehat', color: 'text-red-500' },
  { city: 'Bandung', pm25: 45, status: 'Sedang', color: 'text-yellow-500' },
  { city: 'Surabaya', pm25: 62, status: 'Tidak Sehat', color: 'text-red-500' },
  { city: 'Yogyakarta', pm25: 38, status: 'Baik', color: 'text-green-500' },
  { city: 'Lokasi GREENOVA', pm25: 42, status: 'Baik', color: 'text-green-500' },
];

const plantMoisture = [
  { plant: 'Tomat', optimal: '70-80%', current: 75, status: 'Optimal' },
  { plant: 'Selada', optimal: '60-70%', current: 45, status: 'Perlu Air' },
  { plant: 'Cabai', optimal: '65-75%', current: 68, status: 'Optimal' },
  { plant: 'Bayam', optimal: '75-85%', current: 82, status: 'Optimal' },
];

const interactiveContent = [
  {
    id: 1,
    type: 'video',
    title: 'Cara Kerja Sensor GREENOVA',
    duration: '3:45',
    views: 1234,
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
    description: 'Pelajari bagaimana sensor IoT bekerja untuk memantau lingkungan'
  },
  {
    id: 2,
    type: 'article',
    title: 'Dampak Polusi Udara terhadap Kesehatan',
    readTime: '8 min',
    views: 856,
    thumbnail: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=300&h=200&fit=crop',
    description: 'Artikel komprehensif tentang efek polusi udara pada tubuh manusia'
  },
  {
    id: 3,
    type: 'infographic',
    title: 'Tips Merawat Ruang Terbuka Hijau',
    views: 642,
    thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop',
    description: 'Infografis interaktif cara optimal merawat taman kota'
  }
];

const educationCards = [
  {
    id: 1,
    title: 'Apa itu PM2.5?',
    description: 'Partikel halus berdiameter kurang dari 2.5 mikrometer yang dapat membahayakan kesehatan pernapasan.',
    icon: Wind,
    content: `PM2.5 adalah singkatan dari Particulate Matter dengan diameter kurang dari 2.5 mikrometer. 
    Partikel ini sangat kecil sehingga dapat masuk ke dalam paru-paru dan aliran darah, menyebabkan 
    berbagai masalah kesehatan seperti asma, penyakit jantung, dan gangguan pernapasan lainnya.`,
    category: 'Kualitas Udara',
    level: 'Pemula'
  },
  {
    id: 2,
    title: 'Manfaat Tanaman untuk Udara',
    description: 'Bagaimana tanaman membantu membersihkan udara dan meningkatkan kualitas lingkungan.',
    icon: Leaf,
    content: `Tanaman berperan sebagai filter alami udara dengan menyerap CO2 dan melepaskan O2. 
    Beberapa tanaman juga dapat menyerap polutan berbahaya seperti formaldehyde, benzene, dan 
    xylene. Selain itu, tanaman membantu meningkatkan kelembaban udara dan mengurangi suhu lingkungan.`,
    category: 'Lingkungan',
    level: 'Pemula'
  },
  {
    id: 3,
    title: 'Cara Kerja GREENOVA',
    description: 'Sistem AI dan sensor yang digunakan robot untuk memantau dan merawat lingkungan.',
    icon: Bot,
    content: `GREENOVA menggunakan ESP32-CAM untuk vision dan Teachable Machine untuk AI. 
    Robot dilengkapi sensor kelembaban tanah, kualitas udara, dan sistem navigasi otomatis. 
    Data dari sensor diolah menggunakan algoritma machine learning untuk membuat keputusan 
    penyiraman dan pemantauan lingkungan yang optimal.`,
    category: 'Teknologi',
    level: 'Menengah'
  },
  {
    id: 4,
    title: 'Kelembaban Tanah Optimal',
    description: 'Tingkat kelembaban yang ideal untuk pertumbuhan tanaman yang sehat.',
    icon: Droplets,
    content: `Kelembaban tanah optimal untuk sebagian besar tanaman berkisar antara 60-80%. 
    Kelembaban di bawah 50% menandakan tanaman memerlukan air, sementara di atas 90% 
    dapat menyebabkan akar membusuk. GREENOVA memantau kelembaban secara real-time dan 
    melakukan penyiraman otomatis saat diperlukan.`,
    category: 'Pertanian',
    level: 'Pemula'
  },
  {
    id: 5,
    title: 'Teknologi Machine Learning',
    description: 'Bagaimana AI membantu robot membuat keputusan cerdas dalam perawatan tanaman.',
    icon: Lightbulb,
    content: `GREENOVA menggunakan Teachable Machine untuk mengenali pola dan membuat prediksi. 
    AI dapat mengidentifikasi kondisi tanaman dari gambar, memprediksi kebutuhan air berdasarkan 
    data historis, dan mengoptimalkan rute patroli. Sistem pembelajaran terus berkembang 
    seiring dengan pengumpulan data yang lebih banyak.`,
    category: 'Teknologi',
    level: 'Lanjutan'
  },
  {
    id: 6,
    title: 'Pemeliharaan Robot',
    description: 'Tips dan panduan untuk merawat robot agar tetap berfungsi optimal.',
    icon: Shield,
    content: `Pemeliharaan rutin GREENOVA meliputi pembersihan sensor, pengecekan baterai, 
    kalibrasi sensor kelembaban, dan update software. Robot secara otomatis melakukan 
    self-diagnostic dan akan memberikan notifikasi jika memerlukan maintenance. 
    Pembersihan kamera dan sensor sebaiknya dilakukan setiap minggu.`,
    category: 'Maintenance',
    level: 'Menengah'
  }
];

const faqData = [
  {
    question: 'Berapa lama baterai GREENOVA bertahan?',
    answer: 'Baterai GREENOVA dapat bertahan hingga 8-12 jam tergantung aktivitas. Robot akan secara otomatis kembali ke stasiun pengisian ketika baterai mencapai 20%.'
  },
  {
    question: 'Apakah robot bisa bekerja dalam cuaca hujan?',
    answer: 'GREENOVA memiliki perlindungan IP65 yang memungkinkannya beroperasi dalam hujan ringan. Namun, untuk keamanan maksimal, robot akan mencari shelter saat mendeteksi hujan lebat.'
  },
  {
    question: 'Bagaimana cara menambah tanaman baru ke sistem?',
    answer: 'Anda dapat menambah tanaman baru melalui halaman Pengaturan > Robot > Edit Peta. Klik pada lokasi yang diinginkan dan tentukan jenis tanaman serta jadwal penyiramannya.'
  },
  {
    question: 'Seberapa akurat sensor kualitas udara?',
    answer: 'Sensor PM2.5 memiliki akurasi ±10% dan sensor VOCs ±5%. Kalibrasi otomatis dilakukan setiap 24 jam untuk memastikan pembacaan yang akurat.'
  },
  {
    question: 'Apa yang terjadi jika robot tidak bisa mencapai tanaman?',
    answer: 'Robot memiliki sistem deteksi obstacle dan path planning. Jika ada rintangan, robot akan mencari rute alternatif atau memberikan notifikasi untuk bantuan manual.'
  },
  {
    question: 'Bisakah mengatur jadwal penyiraman manual?',
    answer: 'Ya, Anda dapat mengatur jadwal penyiraman custom untuk setiap tanaman melalui halaman Pengaturan. Robot juga akan tetap melakukan penyiraman otomatis berdasarkan sensor kelembaban.'
  },
  {
    question: 'Bagaimana cara backup data sensor?',
    answer: 'Data sensor secara otomatis disimpan secara lokal dan dapat di-backup ke cloud storage. Anda dapat mengatur backup otomatis di halaman Pengaturan > Sistem.'
  },
  {
    question: 'Apakah robot bisa mendeteksi hama tanaman?',
    answer: 'Dengan kamera ESP32-CAM dan AI, GREENOVA dapat mendeteksi beberapa jenis hama umum dan memberikan alert. Fitur ini masih dalam pengembangan untuk akurasi yang lebih baik.'
  }
];

export function Education() {
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const handleShare = (platform: string, title: string) => {
    const url = window.location.href;
    const text = `Check out this educational content: ${title}`;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Kualitas Udara':
        return 'bg-blue-100 text-blue-800';
      case 'Lingkungan':
        return 'bg-green-100 text-green-800';
      case 'Teknologi':
        return 'bg-purple-100 text-purple-800';
      case 'Pertanian':
        return 'bg-orange-100 text-orange-800';
      case 'Maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Pemula':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'Menengah':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'Lanjutan':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Pusat Edukasi</h1>
          <p className="text-muted-foreground">Pelajari tentang teknologi dan lingkungan</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleShare('facebook', 'GREENOVA Education Hub')}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Educational Dashboard */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="content">Konten</TabsTrigger>
          <TabsTrigger value="learn">Materi</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* City Air Quality Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Perbandingan Kualitas Udara Antar Kota
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cityComparisons.map((city, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-current opacity-50"></div>
                      <span className="font-medium">{city.city}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold">{city.pm25} μg/m³</div>
                        <div className={`text-sm ${city.color}`}>{city.status}</div>
                      </div>
                      <div className="w-24">
                        <Progress value={Math.min((city.pm25 / 150) * 100, 100)} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">Insight:</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                  Lokasi GREENOVA menunjukkan kualitas udara yang baik berkat sistem filtrasi aktif dan perawatan ruang hijau yang optimal.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Plant Moisture Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Kelembaban Tanah Ideal vs Aktual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plantMoisture.map((plant, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{plant.plant}</span>
                      </div>
                      <Badge variant={plant.status === 'Optimal' ? 'default' : 'destructive'}>
                        {plant.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Optimal: {plant.optimal}</span>
                        <span className="font-medium">Saat ini: {plant.current}%</span>
                      </div>
                      <Progress value={plant.current} className="h-2" />
                    </div>
                    {plant.status === 'Perlu Air' && (
                      <div className="mt-3 flex items-center gap-2 text-orange-600 text-sm">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Robot akan menyiram dalam 15 menit</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Interactive Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interactiveContent.map((content) => (
              <Card key={content.id} className="hover:shadow-lg transition-all cursor-pointer group">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={content.thumbnail} 
                    alt={content.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-black/70 text-white">
                      {content.type === 'video' && <Play className="h-3 w-3 mr-1" />}
                      {content.type === 'article' && <FileText className="h-3 w-3 mr-1" />}
                      {content.type === 'infographic' && <BarChart3 className="h-3 w-3 mr-1" />}
                      {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                    </Badge>
                  </div>
                  {content.type === 'video' && (
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {content.duration}
                    </div>
                  )}
                  {content.type === 'article' && (
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {content.readTime} read
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{content.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{content.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {content.views}
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => handleShare('facebook', content.title)}
                      >
                        <Facebook className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => handleShare('twitter', content.title)}
                      >
                        <Twitter className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => handleShare('copy', content.title)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="learn" className="space-y-6">

          {/* Education Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {educationCards.map((card) => (
              <Card key={card.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <card.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Badge className={getCategoryColor(card.category)}>
                      {card.category}
                    </Badge>
                    <Badge variant="outline" className={getLevelColor(card.level)}>
                      {card.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {card.description}
                  </p>
                  <div className="text-sm leading-relaxed">
                    {card.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Frequently Asked Questions (FAQ)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}