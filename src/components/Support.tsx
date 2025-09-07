import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram,
  ExternalLink,
  Heart,
  Coffee,
  Zap,
  Rocket,
  TreePine,
  Droplets,
  CheckCircle2,
  Gift,
  Users,
  Award,
  Handshake,
  Building2,
  Shield,
  UserPlus,
  Lock,
  Database,
  BarChart3,
  MessageCircle,
  Send,
  Clock
} from 'lucide-react';

export function Support() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-4">
          <Heart className="h-8 w-8 text-white" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dukung Masa Depan Lingkungan
          </h1>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Setiap dukungan Anda</strong> membantu kami mengembangkan teknologi pertanian yang lebih cerdas dan berkelanjutan. 
              Bersama-sama, kita dapat menciptakan solusi inovatif yang tidak hanya menghemat air dan energi, 
              tetapi juga meningkatkan hasil panen untuk petani di seluruh Indonesia.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              💡 <strong className="text-primary">Bayangkan</strong> sebuah dunia di mana setiap tetes air digunakan dengan sempurna, 
              setiap tanaman mendapat perhatian yang tepat waktu, dan petani dapat fokus pada inovasi 
              daripada khawatir tentang pemeliharaan rutin.
            </p>
          </div>
        </div>
      </div>

      {/* Impact Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Droplets, number: "40%", label: "Penghematan Air", color: "text-blue-500" },
          { icon: TreePine, number: "25+", label: "Tanaman Terpantau", color: "text-green-500" },
          { icon: Zap, number: "60%", label: "Efisiensi Energi", color: "text-yellow-500" },
          { icon: Users, number: "100+", label: "Petani Terbantu", color: "text-purple-500" }
        ].map((stat, index) => (
          <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
            <CardContent className="space-y-3">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{stat.number}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Donation Section */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Pilih Cara Anda Berkontribusi</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Setiap kontribusi, sebesar apapun, membuat perbedaan nyata dalam pengembangan teknologi pertanian berkelanjutan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Supporter Tier */}
          <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10">
                  <Coffee className="h-6 w-6 text-blue-500" />
                </div>
                <h4 className="text-xl font-semibold">Supporter</h4>
                <div className="text-3xl font-bold text-blue-500">Rp 50.000</div>
                <p className="text-sm text-muted-foreground">Setara dengan secangkir kopi premium</p>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  <span>Akses eksklusif ke update progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  <span>Sertifikat digital sebagai supporter</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  <span>Nama Anda di Hall of Fame</span>
                </div>
              </div>

              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                <Heart className="h-4 w-4 mr-2" />
                Dukung Sekarang
              </Button>
            </CardContent>
          </Card>

          {/* Sponsor Tier - Featured */}
          <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-primary">
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-secondary text-white text-center py-2 text-sm font-medium">
              🌟 PALING POPULER
            </div>
            <CardContent className="p-8 text-center space-y-6 pt-12">
              <div className="space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold">Sponsor</h4>
                <div className="text-3xl font-bold text-primary">Rp 200.000</div>
                <p className="text-sm text-muted-foreground">Biaya pengembangan sensor selama 1 bulan</p>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Semua benefit Supporter</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Akses beta ke fitur terbaru</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Video call eksklusif dengan tim</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Logo/nama di website & aplikasi</span>
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-white text-base">
                <Rocket className="h-4 w-4 mr-2" />
                Jadi Sponsor
              </Button>
            </CardContent>
          </Card>

          {/* Partner Tier */}
          <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10">
                  <Award className="h-6 w-6 text-purple-500" />
                </div>
                <h4 className="text-xl font-semibold">Partner</h4>
                <div className="text-3xl font-bold text-purple-500">Rp 500.000</div>
                <p className="text-sm text-muted-foreground">Investasi untuk satu unit robot prototype</p>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                  <span>Semua benefit Sponsor</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                  <span>Co-branding opportunity</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                  <span>Akses langsung ke source code</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                  <span>Konsultasi teknis gratis</span>
                </div>
              </div>

              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                <Award className="h-4 w-4 mr-2" />
                Jadi Partner
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Custom Amount */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Kontribusi Custom</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Ingin berkontribusi dengan jumlah yang berbeda? Setiap rupiah berarti bagi kami!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Button variant="outline" className="flex-1">
              Rp 25.000
            </Button>
            <Button variant="outline" className="flex-1">
              Rp 100.000
            </Button>
            <Button variant="outline" className="flex-1">
              Jumlah Lain
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Impact Message */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center space-y-6">
        <div className="space-y-4">
          <h3 className="text-2xl md:text-3xl font-bold">Dampak Nyata dari Dukungan Anda</h3>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">💧 Dengan Rp 50.000</h4>
              <p className="text-muted-foreground">
                Anda membantu mengembangkan algoritma yang dapat menghemat 1000 liter air per bulan untuk setiap petani
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">🤖 Dengan Rp 200.000</h4>
              <p className="text-muted-foreground">
                Anda membiayai pengembangan satu fitur AI baru yang dapat meningkatkan efisiensi penyiraman hingga 40%
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">🌱 Dengan Rp 500.000</h4>
              <p className="text-muted-foreground">
                Anda mendukung riset untuk satu jenis tanaman baru, memperluas kemampuan robot ke lebih banyak komoditas
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">🚀 Dengan Donasi Besar</h4>
              <p className="text-muted-foreground">
                Anda membantu kami menciptakan versi open-source yang bisa diakses petani di seluruh Indonesia secara gratis
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-6">
          <p className="text-lg font-medium mb-4">
            🎯 <strong>Target kami:</strong> Mengumpulkan Rp 10 juta untuk pengembangan fase selanjutnya
          </p>
          <div className="bg-background/50 rounded-full h-4 overflow-hidden mb-4">
            <div className="bg-gradient-to-r from-primary to-secondary h-full w-[23%] rounded-full"></div>
          </div>
          <p className="text-sm text-muted-foreground">
            Rp 2.3 juta terkumpul dari 47 donatur ❤️ • Target: Rp 10 juta
          </p>
        </div>
      </div>

      <Separator />

      {/* Admin Account Application Section */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Daftar Akun Admin</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ajukan akses ke dashboard admin GREENOVA AI untuk monitoring robot, analitik data real-time, dan kontrol sistem
          </p>
        </div>

        {/* Admin Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
              <h4 className="font-semibold">Real-time Monitoring</h4>
              <p className="text-sm text-muted-foreground">
                Pantau status robot, sensor data, dan kondisi lingkungan secara real-time melalui dashboard interaktif
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10">
                <Database className="h-6 w-6 text-green-500" />
              </div>
              <h4 className="font-semibold">Data Analytics</h4>
              <p className="text-sm text-muted-foreground">
                Akses laporan lengkap, analisis tren, dan insights untuk optimasi sistem pertanian
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10">
                <Lock className="h-6 w-6 text-purple-500" />
              </div>
              <h4 className="font-semibold">Remote Control</h4>
              <p className="text-sm text-muted-foreground">
                Kontrol robot dari jarak jauh, atur jadwal penyiraman, dan konfigurasi sistem secara aman
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Application Form */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Formulir Permintaan Akun Admin</h3>
              <p className="text-sm text-muted-foreground">
                Isi formulir di bawah untuk mengajukan akses admin dashboard
              </p>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nama Lengkap</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full p-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full p-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Instansi/Organisasi</label>
                <input 
                  type="text" 
                  placeholder="Universitas/Perusahaan/Organisasi"
                  className="w-full p-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Alasan Mengajukan Akun Admin</label>
                <textarea 
                  placeholder="Jelaskan bagaimana Anda akan menggunakan akses admin ini..."
                  rows={4}
                  className="w-full p-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bidang Keahlian/Minat</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Pertanian', 'Teknologi', 'Penelitian', 'Pendidikan', 
                    'Lingkungan', 'IoT/Robotika', 'Data Science', 'Lainnya'
                  ].map((field, index) => (
                    <label key={index} className="flex items-center gap-2 p-2 border border-border rounded cursor-pointer hover:bg-muted/50">
                      <input type="checkbox" className="text-primary" />
                      <span className="text-sm">{field}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Kirim Permintaan Akun Admin
                </Button>
              </div>
            </form>

            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                📧 Kami akan menghubungi Anda dalam 2-3 hari kerja untuk proses verifikasi
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Atau kirim email langsung ke: 
                <a 
                  href="mailto:admin@greenova.ai?subject=Permintaan Akun Admin"
                  className="text-primary hover:underline ml-1"
                >
                  admin@greenova.ai
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Collaboration Section */}
      <div id="collaboration-section" className="space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Handshake className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Kolaborasi & Partnership</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kami terbuka untuk berbagai bentuk kolaborasi yang dapat mempercepat pengembangan teknologi pertanian berkelanjutan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Academic Partnership */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10">
                <Building2 className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-semibold">Partnership Akademik</h3>
              <p className="text-sm text-muted-foreground">
                Kerja sama dengan universitas untuk riset, pengembangan kurikulum, dan program magang mahasiswa dalam bidang AgriTech.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Program riset bersama</li>
                <li>• Thesis & capstone projects</li>
                <li>• Workshop & seminar</li>
              </ul>
            </CardContent>
          </Card>

          {/* Industry Partnership */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10">
                <Rocket className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="font-semibold">Partnership Industri</h3>
              <p className="text-sm text-muted-foreground">
                Kolaborasi dengan perusahaan teknologi, pertanian, dan startup untuk scaling dan commercialization.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Joint product development</li>
                <li>• Technology licensing</li>
                <li>• Distribution partnership</li>
              </ul>
            </CardContent>
          </Card>

          {/* Government Partnership */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/10">
                <Award className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="font-semibold">Partnership Pemerintah</h3>
              <p className="text-sm text-muted-foreground">
                Bekerja sama dengan pemerintah daerah dan pusat untuk implementasi smart farming dalam program ketahanan pangan.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Pilot project desa digital</li>
                <li>• Program pemberdayaan petani</li>
                <li>• Policy development support</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-muted/30 rounded-xl p-8 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">Hubungi Kami untuk Kolaborasi</h2>
          <p className="text-muted-foreground">
            Mari diskusikan bagaimana kita bisa bekerja sama untuk menciptakan masa depan pertanian yang lebih baik
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-medium">Email Partnership</h4>
            <p className="text-sm text-muted-foreground">partnership@greenova.ai</p>
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-medium">WhatsApp Business</h4>
            <p className="text-sm text-muted-foreground">+62 812-3456-7890</p>
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-medium">Kantor</h4>
            <p className="text-sm text-muted-foreground">Jakarta, Indonesia</p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <h3 className="text-center font-medium">Ikuti Progress Kami</h3>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground">
              <Github className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground">
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground">
              <Instagram className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="text-center space-y-6">
        <h3 className="text-xl font-semibold">Metode Pembayaran yang Aman & Mudah</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { name: "GoPay", logo: "💳" },
            { name: "OVO", logo: "🟣" },
            { name: "DANA", logo: "🔵" },
            { name: "Bank Transfer", logo: "🏛️" }
          ].map((method, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <span className="text-2xl">{method.logo}</span>
              <span className="text-sm font-medium">{method.name}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          🔒 Semua transaksi dienkripsi dan aman. Kami tidak menyimpan data kartu kredit Anda.
        </p>
      </div>

      {/* Feedback Form Section */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Feedback & Laporan Bug</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bantu kami meningkatkan GREENOVA AI dengan memberikan masukan atau melaporkan bug yang Anda temukan
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Formulir Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Setiap masukan Anda sangat berharga untuk pengembangan sistem
              </p>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nama</label>
                  <input 
                    type="text" 
                    placeholder="Nama lengkap"
                    className="w-full p-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input 
                    type="email" 
                    placeholder="email@example.com"
                    className="w-full p-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Kategori</label>
                <select className="w-full p-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Pilih kategori feedback</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Saran Fitur Baru</option>
                  <option value="improvement">Perbaikan UI/UX</option>
                  <option value="performance">Masalah Performa</option>
                  <option value="data">Akurasi Data</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Prioritas</label>
                <div className="flex gap-4">
                  {['Rendah', 'Sedang', 'Tinggi', 'Kritis'].map((priority) => (
                    <label key={priority} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="priority" value={priority.toLowerCase()} />
                      <span className="text-sm">{priority}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Deskripsi Detail</label>
                <textarea 
                  placeholder="Jelaskan masukan, bug, atau saran Anda secara detail..."
                  rows={5}
                  className="w-full p-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Langkah Reproduksi (untuk bug)</label>
                <textarea 
                  placeholder="Jika ini bug report, jelaskan langkah-langkah untuk mereproduksi masalah (opsional)"
                  rows={3}
                  className="w-full p-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Informasi Browser/Device</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Chrome 120.0, Windows 11, Mobile Android"
                  className="w-full p-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="follow-up" />
                <label htmlFor="follow-up" className="text-sm text-muted-foreground">
                  Saya ingin mendapat update mengenai feedback ini via email
                </label>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Kirim Feedback
                </Button>
              </div>
            </form>

            <div className="text-center pt-4 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Data Aman & Privat</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Respon dalam 24 jam</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span>Ditangani Tim Ahli</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Final CTA */}
      <div className="text-center space-y-6 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-8 md:p-12">
        <div className="space-y-4">
          <h3 className="text-2xl md:text-3xl font-bold">Jadilah Bagian dari Revolusi Pertanian! 🌟</h3>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Bergabunglah dengan ratusan supporter lainnya yang percaya pada masa depan pertanian berkelanjutan. 
            Setiap dukungan Anda adalah investasi untuk Indonesia yang lebih hijau dan sejahtera.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-primary font-semibold px-8">
              <Heart className="h-5 w-5 mr-2" />
              DONASI SEKARANG
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Handshake className="h-5 w-5 mr-2" />
              AJUKAN KOLABORASI
            </Button>
          </div>
          <p className="text-sm opacity-75">
            ⚡ Proses hanya 2 menit • 🎁 Dapatkan update eksklusif langsung ke email
          </p>
        </div>
      </div>
    </div>
  );
}