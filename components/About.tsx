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
  UserPlus
} from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  expertise: string[];
}

const teamMembers: TeamMember[] = [
  {
    name: "Jojo Gid",
    role: "Founder & Developer Utama",
    bio: "Passionate tentang teknologi AI dan robotika untuk solusi pertanian berkelanjutan. Memiliki pengalaman 5+ tahun dalam pengembangan sistem IoT dan machine learning.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    expertise: ["AI/ML", "IoT Systems", "Full-Stack Development"]
  },
  {
    name: "Nando",
    role: "Hardware Engineer",
    bio: "Spesialis dalam pengembangan sistem embedded dan sensor integration. Bertanggung jawab atas desain dan implementasi hardware robot GREENOVA yang handal dan efisien.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    expertise: ["Embedded Systems", "Sensor Integration", "Circuit Design"]
  },
  {
    name: "Kenneth",
    role: "AI/ML Specialist",
    bio: "Expert dalam computer vision dan machine learning untuk deteksi tanaman dan analisis lingkungan. Mengembangkan model Teachable Machine yang digunakan robot untuk decision making.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    expertise: ["Computer Vision", "Machine Learning", "Data Analysis"]
  },
  {
    name: "Louis", 
    role: "UX/UI Designer",
    bio: "Menciptakan pengalaman pengguna yang intuitif dan menarik untuk dashboard GREENOVA. Fokus pada desain yang user-centered dan accessibility untuk semua kalangan pengguna.",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
    expertise: ["UI/UX Design", "User Research", "Design Systems"]
  }
];

const features = [
  {
    icon: Target,
    title: "Misi Kami",
    description: "Mengembangkan teknologi robotika AI yang membuat pertanian lebih efisien, berkelanjutan, dan mudah diakses untuk semua."
  },
  {
    icon: Lightbulb,
    title: "Inovasi",
    description: "Menggabungkan kecerdasan buatan, sensor IoT, dan computer vision untuk menciptakan solusi pertanian otomatis yang cerdas."
  },
  {
    icon: Award,
    title: "Komitmen",
    description: "Berkomitmen untuk mengurangi penggunaan air dan pestisida melalui teknologi precision agriculture yang ramah lingkungan."
  }
];

export function About() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            About Us
          </h1>
          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Greenova AI</strong> adalah proyek inovatif yang menggabungkan kecerdasan buatan, 
              robotika, dan teknologi IoT untuk menciptakan solusi pertanian yang cerdas dan berkelanjutan. 
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Dengan menggunakan ESP32-CAM dan model Teachable Machine, robot GREENOVA mampu memantau 
              lingkungan secara real-time, mendeteksi kebutuhan tanaman, dan melakukan penyiraman otomatis 
              yang tepat sasaran.
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

      {/* Team Section */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">Tim Kami</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tim multidisiplin yang berdedikasi untuk menghadirkan teknologi pertanian masa depan
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
            Stack teknologi modern untuk solusi pertanian yang handal dan scalable
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[
            { name: "ESP32-CAM", desc: "Microcontroller & Camera" },
            { name: "Teachable Machine", desc: "AI Model Training" },
            { name: "React + TypeScript", desc: "Frontend Dashboard" },
            { name: "IoT Sensors", desc: "Environmental Monitoring" },
            { name: "Computer Vision", desc: "Plant Detection" },
            { name: "Real-time Data", desc: "Live Monitoring" }
          ].map((tech, index) => (
            <Card key={index} className="p-4 text-center hover:shadow-md transition-shadow">
              <CardContent className="space-y-2">
                <div className="w-8 h-8 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                  <ExternalLink className="h-4 w-4 text-primary" />
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
      <div className="bg-muted/30 rounded-xl p-8 space-y-8">
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
            <p className="text-sm text-muted-foreground">hello@greenova.ai</p>
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-medium">Telepon</h4>
            <p className="text-sm text-muted-foreground">+62 812-3456-7890</p>
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-medium">Lokasi</h4>
            <p className="text-sm text-muted-foreground">Jakarta, Indonesia</p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <h3 className="text-center font-medium">Ikuti Kami</h3>
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

        {/* Call to Action */}
        <div className="text-center space-y-4 pt-6 border-t border-border">
          <h3 className="font-medium">Siap untuk Berkolaborasi?</h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="gap-2">
              <Mail className="h-4 w-4" />
              Kirim Email
            </Button>
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Lihat Portfolio
            </Button>
          </div>
        </div>

        {/* Admin Account Application */}
        <div className="text-center space-y-4 pt-6 border-t border-border">
          <div className="space-y-2">
            <Shield className="h-8 w-8 text-primary mx-auto" />
            <h3 className="font-medium">Butuh Akses Admin Dashboard?</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Ajukan akun admin untuk mengakses dashboard monitoring robot dan analitik data real-time
            </p>
          </div>
          <Button 
            variant="secondary" 
            className="gap-2"
            onClick={() => window.location.href = 'mailto:admin@greenova.ai?subject=Permintaan Akun Admin GREENOVA&body=Halo tim GREENOVA,%0A%0ASaya tertarik untuk mengajukan akun admin untuk dashboard GREENOVA AI.%0A%0ANama:%0AInstansi/Organisasi:%0AEmail:%0ATujuan penggunaan:%0A%0ATerima kasih.'}
          >
            <UserPlus className="h-4 w-4" />
            Ajukan Akun Admin
          </Button>
        </div>
      </div>
    </div>
  );
}