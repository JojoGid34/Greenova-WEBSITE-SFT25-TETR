import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram,
  ExternalLink,
  Users,
  Target,
  Lightbulb,
  Award,
  Shield,
  UserPlus,
  Bot,
  Droplets,
  Monitor,
  Cpu
} from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  expertise: string[];
}

interface AboutProps {
  onNavigate: (page: string) => void;
}

const teamMembers: TeamMember[] = [
  {
    name: "Jonathan Gideon",
    role: "Founder & Developer Utama",
    bio: "Passionate tentang teknologi AI dan sistem monitoring lingkungan. Memiliki pengalaman 5+ tahun dalam pengembangan sistem IoT dan machine learning untuk solusi environmental monitoring.",
    avatar: "https://static.vecteezy.com/system/resources/previews/026/630/551/non_2x/profile-icon-symbol-design-illustration-vector.jpg",
    expertise: ["AI/ML", "IoT Systems", "Full-Stack Development"]
  },
  {
    name: "Hernando Alexander",
    role: "Hardware Engineer",
    bio: "Spesialis dalam pengembangan sistem embedded dan sensor integration. Bertanggung jawab atas desain dan implementasi hardware robot dan station GREENOVA yang handal dan efisien.",
    avatar: "https://static.vecteezy.com/system/resources/previews/026/630/551/non_2x/profile-icon-symbol-design-illustration-vector.jpg",
    expertise: ["Embedded Systems", "Sensor Integration", "ESP32 Development"]
  },
  {
    name: "Jeremy Kenneth",
    role: "AI/ML Specialist",
    bio: "Expert dalam TensorFlow.js dan machine learning untuk prediksi lingkungan dan analisis data sensor. Mengembangkan model AI untuk forecasting dan decision making sistem GREENOVA.",
    avatar: "https://static.vecteezy.com/system/resources/previews/026/630/551/non_2x/profile-icon-symbol-design-illustration-vector.jpg",
    expertise: ["TensorFlow.js", "Data Analysis", "Predictive Modeling"]
  },
  {
    name: "Louis Owen", 
    role: "UX/UI Designer",
    bio: "Menciptakan pengalaman pengguna yang intuitif dan menarik untuk dashboard GREENOVA. Fokus pada desain yang user-centered dan accessibility untuk visualisasi data lingkungan.",
    avatar: "https://static.vecteezy.com/system/resources/previews/026/630/551/non_2x/profile-icon-symbol-design-illustration-vector.jpg",
    expertise: ["UI/UX Design", "Data Visualization", "Design Systems"]
  }
];

const features = [
  {
    icon: Target,
    title: "Misi Kami",
    description: "Menyediakan teknologi monitoring lingkungan yang mudah diakses dan dipahami masyarakat untuk membantu membuat keputusan yang lebih baik tentang kondisi lingkungan sekitar."
  },
  {
    icon: Lightbulb,
    title: "Inovasi",
    description: "Menggabungkan AI, sensor IoT, dan sistem monitoring real-time untuk memberikan informasi lingkungan yang akurat dan mudah dipahami melalui teknologi GREENOVA."
  },
  {
    icon: Award,
    title: "Komitmen",
    description: "Berkomitmen membantu masyarakat lebih memahami dan peduli terhadap kondisi lingkungan melalui teknologi yang inovatif dan edukasi yang mudah dipahami."
  }
];

export function About({ onNavigate }: AboutProps) {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            About GREENOVA
          </h1>
          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              <strong className="text-foreground">GREENOVA</strong> adalah sistem monitoring lingkungan yang menggabungkan 
              robot dan station pintar untuk memantau kualitas udara dan kondisi tanaman secara real-time. 
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Dengan menggunakan ESP32 dan teknologi TensorFlow.js, GREENOVA membantu masyarakat memahami 
              kondisi lingkungan di sekitar mereka dengan mudah melalui data yang akurat dan informasi AI 
              yang mudah dipahami.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-12" />

      {/* GREENOVA System Overview */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Sistem GREENOVA</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dua perangkat pintar yang bekerja sama untuk monitoring lingkungan komprehensif
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">GREENOVA Robot</h3>
              </div>
              
              <p className="text-muted-foreground">
                Robot monitoring kualitas udara dengan multiple sensor untuk pembacaan real-time
              </p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Sensor yang digunakan:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Sensor Suhu & Kelembaban Udara</li>
                  <li>• Sensor Debu (PM2.5)</li>
                  <li>• Sensor Gas</li>
                  <li>• Sensor Jarak untuk navigasi</li>
                </ul>
              </div>
              
              <div className="pt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Update database setiap beberapa detik
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50">
                  <Droplets className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">GREENOVA Station</h3>
              </div>
              
              <p className="text-muted-foreground">
                Station monitoring tanaman dengan sistem otomatis untuk perawatan tanaman
              </p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Fitur utama:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Sensor Kelembaban Tanah</li>
                  <li>• Sistem Penyiraman Otomatis ESP32</li>
                  <li>• Monitoring Kondisi Tanaman</li>
                  <li>• Real-time data transmission</li>
                </ul>
              </div>
              
              <div className="pt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Penyiraman otomatis tanaman kering
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Team Section */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">Tim TETR</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tim multidisiplin yang berdedikasi untuk menghadirkan teknologi monitoring lingkungan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card 
              key={index} 
              className="team-member-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg"
            >
              <CardContent className="text-center space-y-4">
                {/* Profile Image */}
                <div className="relative mx-auto w-24 h-24 md:w-28 md:h-28">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary p-1">
                    <div className="w-full h-full rounded-full bg-background p-1">
                      <ImageWithFallback
                        src={member.avatar}
                        alt={`${member.name} - ${member.role}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Member Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-primary font-medium text-sm">{member.role}</p>
                </div>

                {/* Bio */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {member.expertise.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-12" />

      {/* Technology Stack */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Teknologi yang Kami Gunakan</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stack teknologi modern untuk sistem monitoring lingkungan yang handal dan scalable
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[
            { name: "ESP32", desc: "Microcontroller System", icon: Cpu },
            { name: "TensorFlow.js", desc: "AI Predictions", icon: Bot },
            { name: "React + TypeScript", desc: "Frontend Dashboard", icon: Monitor },
            { name: "Multiple Sensors", desc: "Environmental Monitoring", icon: Target },
            { name: "Firebase Realtime", desc: "Real-time Database", icon: ExternalLink },
            { name: "Real-time Updates", desc: "Live Data Streaming", icon: Lightbulb }
          ].map((tech, index) => (
            <Card key={index} className="p-4 text-center hover:shadow-md transition-shadow">
              <CardContent className="space-y-2">
                <div className="w-8 h-8 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                  <tech.icon className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-medium text-sm">{tech.name}</h4>
                <p className="text-xs text-muted-foreground">{tech.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-12" />

      {/* Contact & Social Media Footer */}
      <div id="contact-section" className="bg-muted/30 rounded-xl p-8 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">Hubungi Kami</h2>
          <p className="text-muted-foreground">
            Tertarik untuk berkolaborasi atau ingin tahu lebih lanjut tentang GREENOVA?
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-medium">Email</h4>
            <a 
              href="mailto:hello@greenova.ai" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              hello@greenova.ai
            </a>
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-medium">Telepon</h4>
            <a 
              href="tel:+6289643010219" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              +62 896-4301-0219
            </a>
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-medium">Lokasi</h4>
            <a 
              href="https://maps.google.com/?q=Surabaya,Indonesia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Surabaya, Indonesia
            </a>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <h3 className="text-center font-medium">Ikuti Kami</h3>
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="hover:bg-primary hover:text-primary-foreground"
              onClick={() => window.open('https://github.com/greenova-ai', '_blank')}
            >
              <Github className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="hover:bg-primary hover:text-primary-foreground"
              onClick={() => window.open('https://linkedin.com/company/greenova-ai', '_blank')}
            >
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="hover:bg-primary hover:text-primary-foreground"
              onClick={() => window.open('https://twitter.com/greenova_ai', '_blank')}
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="hover:bg-primary hover:text-primary-foreground"
              onClick={() => window.open('https://instagram.com/greenova.ai', '_blank')}
            >
              <Instagram className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4 pt-6 border-t border-border">
          <h3 className="font-medium">Siap untuk Berkolaborasi?</h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              className="gap-2"
              onClick={() => window.open('mailto:hello@greenova.ai?subject=Kolaborasi GREENOVA&body=Halo tim GREENOVA,%0A%0ASaya tertarik untuk berkolaborasi dengan tim GREENOVA.%0A%0ANama:%0AInstansi/Organisasi:%0AEmail:%0ATujuan kolaborasi:%0A%0ATerima kasih.', '_blank')}
            >
              <Mail className="h-4 w-4" />
              Kirim Email
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => onNavigate('how-it-works')}
            >
              <ExternalLink className="h-4 w-4" />
              Cara Kerja GREENOVA
            </Button>
          </div>
        </div>

        {/* Admin Account Application */}
        <div className="text-center space-y-4 pt-6 border-t border-border">
          <div className="space-y-2">
            <Shield className="h-8 w-8 text-primary mx-auto" />
            <h3 className="font-medium">Butuh Akses Admin Dashboard?</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Ajukan akun admin untuk mengakses dashboard monitoring robot dan station real-time
            </p>
          </div>
          <Button 
            variant="secondary" 
            className="gap-2"
            onClick={() => {
              onNavigate('support');
              setTimeout(() => {
                const adminSection = document.getElementById('admin-form-section');
                if (adminSection) {
                  adminSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 500);
            }}
          >
            <UserPlus className="h-4 w-4" />
            Ajukan Akun Admin
          </Button>
        </div>
      </div>
    </div>
  );
}