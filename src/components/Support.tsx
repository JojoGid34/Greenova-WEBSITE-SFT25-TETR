import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  Users,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  ExternalLink,
  Download,
  Bot,
  Droplets,
  Settings,
  Wifi,
  Database,
  Zap,
  BookOpen,
  UserPlus
} from 'lucide-react';
import { toast } from "sonner@2.0.3";

const faqCategories = [
  {
    id: "general",
    title: "Umum",
    icon: <HelpCircle className="h-5 w-5" />,
    faqs: [
      {
        question: "Apa itu GREENOVA?",
        answer: "GREENOVA adalah sistem monitoring lingkungan yang terdiri dari robot dan station pintar untuk memantau kualitas udara dan kondisi tanaman secara real-time menggunakan sensor IoT dan AI."
      },
      {
        question: "Bagaimana cara kerja sistem GREENOVA?",
        answer: "Robot GREENOVA menggunakan sensor untuk mengukur suhu, kelembaban udara, PM2.5, dan gas. Station GREENOVA memantau kelembaban tanah dan menyiram tanaman otomatis. Data dikirim ke Firebase dan dianalisis menggunakan TensorFlow.js."
      },
      {
        question: "Apakah data GREENOVA akurat?",
        answer: "Ya, GREENOVA menggunakan sensor berkualitas tinggi dan kalibrasi yang tepat. Data diperbarui setiap beberapa detik dan melalui validasi AI untuk memastikan akurasi."
      },
      {
        question: "Dimana saya bisa melihat data real-time?",
        answer: "Data real-time dapat dilihat melalui dashboard web GREENOVA yang menampilkan grafik, chart, dan informasi kondisi lingkungan terkini."
      }
    ]
  },
  {
    id: "technical",
    title: "Teknis",
    icon: <Settings className="h-5 w-5" />,
    faqs: [
      {
        question: "Hardware apa saja yang digunakan GREENOVA?",
        answer: "GREENOVA menggunakan ESP32 sebagai microcontroller, sensor DHT22/BME280 untuk suhu dan kelembaban, PMS5003 untuk PM2.5, MQ-135 untuk gas, dan soil moisture sensor untuk kelembaban tanah."
      },
      {
        question: "Bagaimana koneksi internet untuk GREENOVA?",
        answer: "GREENOVA terhubung melalui WiFi 802.11 b/g/n. Pastikan koneksi WiFi stabil untuk pengiriman data real-time ke Firebase database."
      },
      {
        question: "Berapa sering data diperbarui?",
        answer: "Data sensor diperbarui setiap beberapa detik dan dikirim ke database Firebase secara real-time untuk monitoring yang akurat."
      },
      {
        question: "Apakah sistem dapat bekerja offline?",
        answer: "Sistem memerlukan koneksi internet untuk sinkronisasi data real-time. Namun, data dapat disimpan sementara di ESP32 dan dikirim ketika koneksi tersedia kembali."
      }
    ]
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: <AlertTriangle className="h-5 w-5" />,
    faqs: [
      {
        question: "Robot tidak mengirim data ke dashboard",
        answer: "Periksa koneksi WiFi ESP32, pastikan konfigurasi Firebase sudah benar, dan restart sistem jika diperlukan. Cek juga power supply dan kabel koneksi."
      },
      {
        question: "Station tidak menyiram tanaman otomatis",
        answer: "Pastikan sensor kelembaban tanah terpasang dengan benar, pompa air berfungsi, dan threshold penyiraman sudah dikonfigurasi. Periksa juga level air di reservoir."
      },
      {
        question: "Data sensor tidak akurat",
        answer: "Lakukan kalibrasi sensor, bersihkan sensor dari debu atau kotoran, dan pastikan penempatan sensor sesuai dengan guidelines untuk mendapatkan pembacaan yang akurat."
      },
      {
        question: "Dashboard menampilkan data lama",
        answer: "Refresh browser, periksa koneksi internet, dan pastikan Firebase database dapat diakses. Jika masalah berlanjut, hubungi support team."
      }
    ]
  },
  {
    id: "features",
    title: "Fitur",
    icon: <Bot className="h-5 w-5" />,
    faqs: [
      {
        question: "Bagaimana cara kerja AI predictions?",
        answer: "GREENOVA menggunakan TensorFlow.js untuk menganalisis pola data historis dan membuat prediksi kondisi lingkungan beberapa waktu ke depan, termasuk prediksi AQI dan kebutuhan penyiraman."
      },
      {
        question: "Apakah bisa mengatur threshold penyiraman?",
        answer: "Ya, threshold penyiraman dapat dikonfigurasi melalui admin dashboard. Default setting adalah menyiram ketika kelembaban tanah di bawah 30%."
      },
      {
        question: "Bagaimana sistem menghitung AQI?",
        answer: "AQI dihitung berdasarkan data sensor PM2.5 dan gas menggunakan formula standar yang diimplementasikan dalam kode JavaScript untuk memberikan rating kualitas udara real-time."
      },
      {
        question: "Apakah ada notifikasi alert?",
        answer: "Ya, sistem memberikan alert untuk kondisi kualitas udara buruk, tanaman yang perlu disiram, dan status sistem melalui dashboard dan bisa dikonfigurasi untuk email notifications."
      }
    ]
  }
];

const supportChannels = [
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email Support",
    description: "Kirim pertanyaan detail ke tim support",
    contact: "support@greenova.ai",
    responseTime: "< 24 jam",
    availability: "24/7"
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: "Live Chat",
    description: "Chat langsung dengan AI GREENOVA",
    contact: "Melalui floating button",
    responseTime: "Instant",
    availability: "24/7"
  },
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Phone Support",
    description: "Hubungi untuk masalah urgent",
    contact: "+62 896-4301-0219",
    responseTime: "Langsung",
    availability: "09:00 - 17:00 WIB"
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Documentation",
    description: "Panduan lengkap dan tutorial",
    contact: "docs.greenova.ai",
    responseTime: "Self-service",
    availability: "24/7"
  }
];

export function Support() {
  const [activeTab, setActiveTab] = useState("faq");
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    priority: "",
    message: "",
    attachments: null as File[] | null
  });
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    reason: "",
    experience: "",
    message: ""
  });

  const filteredFAQs = React.useMemo(() => {
    const category = faqCategories.find(cat => cat.id === selectedCategory);
    if (!category) return [];
    
    if (!searchQuery) return category.faqs;
    
    return category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedCategory, searchQuery]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Pesan berhasil dikirim! Tim support akan menghubungi Anda segera.");
    setContactForm({
      name: "",
      email: "",
      subject: "",
      category: "",
      priority: "",
      message: "",
      attachments: null
    });
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Permohonan akun admin berhasil dikirim! Tim akan mengevaluasi dalam 1-2 hari kerja.");
    setAdminForm({
      name: "",
      email: "",
      organization: "",
      role: "",
      reason: "",
      experience: "",
      message: ""
    });
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <Badge variant="outline" className="text-lg px-4 py-2">
          <HelpCircle className="h-4 w-4 mr-2" />
          Support Center
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold">
          Bantuan & Dukungan GREENOVA
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Tim support GREENOVA siap membantu Anda dengan pertanyaan teknis, troubleshooting, 
          dan panduan penggunaan sistem monitoring lingkungan.
        </p>
      </section>

      {/* Support Channels */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Cara Menghubungi Kami</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pilih channel support yang sesuai dengan kebutuhan Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportChannels.map((channel, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  {channel.icon}
                </div>
                <h3 className="text-lg font-semibold">{channel.title}</h3>
                <p className="text-sm text-muted-foreground">{channel.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact:</span>
                    <span className="font-medium">{channel.contact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response:</span>
                    <span className="font-medium">{channel.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available:</span>
                    <span className="font-medium">{channel.availability}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Main Support Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Mail className="h-4 w-4 mr-2" />
            Contact Support
          </TabsTrigger>
          <TabsTrigger value="admin">
            <Shield className="h-4 w-4 mr-2" />
            Request Admin Access
          </TabsTrigger>
          <TabsTrigger value="resources">
            <BookOpen className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
        </TabsList>

        {/* FAQ Section */}
        <TabsContent value="faq" className="space-y-8">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari pertanyaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {faqCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Category Sidebar */}
              <div className="space-y-2">
                {faqCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.icon}
                    <span className="ml-2">{category.title}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {category.faqs.length}
                    </Badge>
                  </Button>
                ))}
              </div>

              {/* FAQ Content */}
              <div className="lg:col-span-3 space-y-4">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-3 flex items-start gap-2">
                          <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          {faq.question}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Tidak ada FAQ yang ditemukan untuk "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Contact Form */}
        <TabsContent value="contact" className="space-y-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Hubungi Support Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nama Lengkap</label>
                    <Input
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Ringkasan masalah atau pertanyaan"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Kategori</label>
                    <Select value={contactForm.category} onValueChange={(value) => setContactForm(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="general">General Question</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="account">Account Issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prioritas</label>
                    <Select value={contactForm.priority} onValueChange={(value) => setContactForm(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih prioritas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - General Question</SelectItem>
                        <SelectItem value="medium">Medium - Technical Issue</SelectItem>
                        <SelectItem value="high">High - System Down</SelectItem>
                        <SelectItem value="urgent">Urgent - Critical Problem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Pesan</label>
                  <Textarea
                    required
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Jelaskan masalah atau pertanyaan Anda secara detail..."
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Kirim Pesan
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Access Request */}
        <TabsContent value="admin" className="space-y-8">
          <Card className="max-w-2xl mx-auto" id="admin-form-section">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Request Admin Access
              </CardTitle>
              <p className="text-muted-foreground">
                Ajukan permohonan akun admin untuk mengakses dashboard monitoring GREENOVA
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nama Lengkap</label>
                    <Input
                      required
                      value={adminForm.name}
                      onChange={(e) => setAdminForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      required
                      value={adminForm.email}
                      onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Organisasi/Institusi</label>
                    <Input
                      required
                      value={adminForm.organization}
                      onChange={(e) => setAdminForm(prev => ({ ...prev, organization: e.target.value }))}
                      placeholder="Nama organisasi atau institusi"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Posisi/Jabatan</label>
                    <Input
                      required
                      value={adminForm.role}
                      onChange={(e) => setAdminForm(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="Jabatan dalam organisasi"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Alasan Penggunaan</label>
                  <Select value={adminForm.reason} onValueChange={(value) => setAdminForm(prev => ({ ...prev, reason: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih alasan penggunaan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="research">Penelitian Akademik</SelectItem>
                      <SelectItem value="education">Pendidikan</SelectItem>
                      <SelectItem value="environmental">Monitoring Lingkungan</SelectItem>
                      <SelectItem value="commercial">Komersial</SelectItem>
                      <SelectItem value="personal">Personal Project</SelectItem>
                      <SelectItem value="government">Instansi Pemerintah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Pengalaman dengan IoT/Environmental Monitoring</label>
                  <Select value={adminForm.experience} onValueChange={(value) => setAdminForm(prev => ({ ...prev, experience: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih level pengalaman" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Pemula (&lt; 1 tahun)</SelectItem>
                      <SelectItem value="intermediate">Menengah (1-3 tahun)</SelectItem>
                      <SelectItem value="advanced">Mahir (3-5 tahun)</SelectItem>
                      <SelectItem value="expert">Expert (&gt; 5 tahun)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Detail Penggunaan</label>
                  <Textarea
                    required
                    rows={4}
                    value={adminForm.message}
                    onChange={(e) => setAdminForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Jelaskan bagaimana Anda akan menggunakan sistem GREENOVA dan mengapa memerlukan akses admin..."
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div className="space-y-2 text-sm">
                      <h4 className="font-semibold">Kebijakan Akses Admin:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Akses admin diberikan setelah evaluasi tim GREENOVA</li>
                        <li>• Akun akan diaktivasi dalam 1-2 hari kerja</li>
                        <li>• Penggunaan harus sesuai dengan terms of service</li>
                        <li>• Akses dapat dicabut jika disalahgunakan</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajukan Akses Admin
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources */}
        <TabsContent value="resources" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Getting Started Guide",
                description: "Panduan lengkap untuk memulai menggunakan GREENOVA",
                icon: <BookOpen className="h-5 w-5" />,
                type: "PDF Guide",
                link: "#"
              },
              {
                title: "Technical Documentation",
                description: "Dokumentasi teknis API dan hardware specifications",
                icon: <FileText className="h-5 w-5" />,
                type: "Online Docs",
                link: "#"
              },
              {
                title: "Video Tutorials",
                description: "Tutorial video setup dan troubleshooting",
                icon: <ExternalLink className="h-5 w-5" />,
                type: "Video Series",
                link: "#"
              },
              {
                title: "ESP32 Setup Guide",
                description: "Panduan konfigurasi ESP32 untuk GREENOVA",
                icon: <Zap className="h-5 w-5" />,
                type: "Hardware Guide",
                link: "#"
              },
              {
                title: "Firebase Configuration",
                description: "Setup Firebase Realtime Database",
                icon: <Database className="h-5 w-5" />,
                type: "Config Guide",
                link: "#"
              },
              {
                title: "Sensor Calibration",
                description: "Kalibrasi sensor untuk akurasi optimal",
                icon: <Settings className="h-5 w-5" />,
                type: "Technical Guide",
                link: "#"
              }
            ].map((resource, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      {resource.icon}
                    </div>
                    <Badge variant="outline">{resource.type}</Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Akses Resource
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Status Information */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Status Sistem</h2>
          <p className="text-muted-foreground">Real-time status sistem dan layanan GREENOVA</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <CardContent className="space-y-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">API Services</h3>
                <p className="text-sm text-muted-foreground">Firebase Database</p>
                <Badge className="bg-green-500 mt-2">Operational</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 text-center">
            <CardContent className="space-y-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Web Dashboard</h3>
                <p className="text-sm text-muted-foreground">Frontend Interface</p>
                <Badge className="bg-green-500 mt-2">Operational</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 text-center">
            <CardContent className="space-y-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">AI Services</h3>
                <p className="text-sm text-muted-foreground">TensorFlow.js</p>
                <Badge className="bg-green-500 mt-2">Operational</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}