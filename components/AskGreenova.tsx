import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  PaperclipIcon,
  Sparkles,
  Clock,
  CheckCircle2,
  Thermometer,
  Droplets,
  Wind,
  TreePine,
  Gauge,
  ArrowDown
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  typing?: boolean;
}

const quickQuestions = [
  "Berapa suhu udara hari ini?",
  "Bagaimana kualitas udara sekarang?",
  "Apakah kelembaban udara normal?",
  "Status robot GREENOVA bagaimana?",
  "Data PM2.5 terbaru berapa?",
  "Rekomendasi waktu penyiraman?"
];

const generateAIResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  
  // Environmental data responses
  if (message.includes('suhu') || message.includes('temperature')) {
    return `🌡️ **Data Suhu Terkini:**
    
Suhu udara saat ini: **28.5°C** 
Rentang hari ini: 24°C - 32°C
Status: Optimal untuk pertumbuhan tanaman

**Analisis:** Suhu berada dalam rentang ideal untuk sebagian besar tanaman. Robot GREENOVA merekomendasikan penyiraman pada pagi hari (06:00-08:00) untuk efisiensi maksimal.`;
  }
  
  if (message.includes('kelembaban') || message.includes('humidity')) {
    return `💧 **Data Kelembaban Udara:**
    
Kelembaban relatif: **65%**
Status: Baik - dalam rentang optimal
Tren: Stabil dalam 2 jam terakhir

**Rekomendasi:** Kelembaban ideal untuk fotosintesis tanaman. Sistem penyiraman otomatis dalam mode standby.`;
  }
  
  if (message.includes('kualitas udara') || message.includes('air quality') || message.includes('pm')) {
    return `🌬️ **Analisis Kualitas Udara:**
    
• PM2.5: **45 μg/m³** (Sedang)
• PM10: **78 μg/m³** (Sedang) 
• AQI: **58** (Moderate)
• O₃: **35 ppb** (Baik)

**Status:** Kualitas udara sedang. Robot GREENOVA aktif memfilter polutan dan memonitor perubahan setiap 5 menit.`;
  }
  
  if (message.includes('robot') || message.includes('greenova') || message.includes('status')) {
    return `🤖 **Status Robot GREENOVA:**
    
✅ **Online** - Beroperasi normal
📍 Lokasi: Taman Pojok, Jakarta
🔋 Baterai: 87% (4.2 jam tersisa)
📡 Koneksi: Kuat (WiFi: -45dBm)

**Aktivitas Terakhir:**
• 13:45 - Pengukuran sensor lengkap
• 13:40 - Penyiraman otomatis zona A
• 13:35 - Deteksi tanaman baru (3 bibit)`;
  }
  
  if (message.includes('penyiraman') || message.includes('air') || message.includes('siram')) {
    return `🌱 **Rekomendasi Penyiraman:**
    
**Waktu Optimal:**
• Pagi: 06:00 - 08:00 ⭐
• Sore: 17:00 - 19:00

**Kondisi Saat Ini:**
• Kelembaban tanah: 45% (Perlu siram)
• Prediksi hujan: 20% (24 jam ke depan)
• Evapotranspirasi: Sedang

**Next Action:** Robot akan mulai penyiraman otomatis dalam 15 menit.`;
  }
  
  if (message.includes('tanaman') || message.includes('plant')) {
    return `🌿 **Status Tanaman Terpantau:**
    
**Zona A (Sayuran):**
• 15 tanaman sehat ✅
• 2 tanaman perlu perhatian ⚠️
• Tingkat pertumbuhan: Baik

**Zona B (Bunga):**
• 8 tanaman sehat ✅
• Fase berbunga: 60%

**Rekomendasi:** Tingkatkan frekuensi penyiraman untuk tanaman di zona A yang memerlukan perhatian.`;
  }
  
  // General responses
  if (message.includes('halo') || message.includes('hai') || message.includes('hello')) {
    return `👋 Halo! Saya GREENOVA AI, asisten pintar untuk monitoring lingkungan dan pertanian! 

Saya bisa membantu Anda dengan:
• 📊 Data sensor real-time (suhu, kelembaban, kualitas udara)
• 🤖 Status dan lokasi robot GREENOVA  
• 🌱 Analisis kondisi tanaman dan rekomendasi perawatan
• 💧 Jadwal penyiraman optimal
• 🌍 Prediksi cuaca dan dampaknya pada tanaman

Ada yang ingin Anda ketahui tentang kondisi lingkungan hari ini?`;
  }
  
  if (message.includes('cuaca') || message.includes('weather')) {
    return `🌤️ **Prakiraan Cuaca:**
    
**Hari Ini:**
• Suhu: 24°C - 32°C
• Kelembaban: 60-75%
• Angin: 8 km/jam (Tenggara)
• Hujan: 20% (sore hari)

**Dampak pada Tanaman:**
• Kondisi baik untuk fotosintesis
• Penyiraman pagi direkomendasikan
• Waspada evaporasi tinggi siang hari`;
  }
  
  // Default response untuk pertanyaan lain
  return `🤔 Pertanyaan yang menarik! Sebagai GREENOVA AI, saya fokus pada:

🌡️ **Data Lingkungan:** Suhu, kelembaban, kualitas udara
🤖 **Status Robot:** Lokasi, aktivitas, kondisi operasional  
🌱 **Kondisi Tanaman:** Kesehatan, pertumbuhan, kebutuhan air
💧 **Sistem Irigasi:** Jadwal optimal, kondisi tanah

Coba tanyakan hal-hal seperti:
• "Bagaimana kualitas udara hari ini?"
• "Status robot GREENOVA dimana?"
• "Kapan waktu penyiraman yang baik?"

Ada yang bisa saya bantu dengan topik-topik di atas? 😊`;
};

export function AskGreenova() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `👋 Halo! Saya **GREENOVA AI**, asisten pintar untuk monitoring lingkungan dan pertanian berkelanjutan!

🌱 Saya bisa membantu Anda dengan:
• **Data sensor real-time** (suhu, kelembaban, PM2.5)
• **Status robot GREENOVA** dan lokasinya
• **Analisis kondisi tanaman** dan rekomendasi
• **Jadwal penyiraman optimal** berdasarkan cuaca
• **Prediksi kualitas udara** dan dampaknya

Silakan tanya apa saja tentang data lingkungan! 😊`,
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Auto scroll to bottom when messages change
    setTimeout(() => {
      const scrollContainer = document.querySelector('[data-radix-scroll-area-content]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }, 100);
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputValue),
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    // Focus the input after setting the value
    setTimeout(() => {
      const input = document.querySelector('input[placeholder*="Tanyakan tentang"]') as HTMLInputElement;
      input?.focus();
    }, 0);
  };

  const scrollToBottom = () => {
    const scrollContainer = document.querySelector('[data-radix-scroll-area-content]');
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  };

  const formatMessage = (text: string) => {
    // Convert markdown-like formatting to HTML
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-t-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-xl font-semibold">GREENOVA AI Assistant</h1>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Online - Siap membantu Anda
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col rounded-t-none border-t-0">
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="relative flex-1">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {message.isBot && (
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.isBot ? 'order-2' : 'order-1'}`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.isBot 
                        ? 'bg-muted text-muted-foreground' 
                        : 'bg-primary text-primary-foreground ml-auto'
                    }`}>
                      <div 
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: formatMessage(message.text)
                        }}
                      />
                    </div>
                    <div className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${
                      message.isBot ? 'justify-start' : 'justify-end'
                    }`}>
                      <Clock className="h-3 w-3" />
                      {message.timestamp.toLocaleTimeString('id-ID', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                      {!message.isBot && <CheckCircle2 className="h-3 w-3" />}
                    </div>
                  </div>

                  {!message.isBot && (
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </ScrollArea>
            
            {/* Scroll to bottom button */}
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-4 right-4 w-8 h-8 rounded-full shadow-lg"
              onClick={scrollToBottom}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Questions */}
          <div className="px-4 py-2 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Pertanyaan Cepat:</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickQuestions.map((question, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Badge>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tanyakan tentang data lingkungan, status robot, atau kondisi tanaman..."
                  className="pr-20 bg-input-background"
                />
              </div>
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="px-6"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              💡 GREENOVA AI dapat memberikan informasi real-time tentang lingkungan dan pertanian
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Status Bar */}
      <Card className="mt-4 rounded-t-none border-t-0">
        <CardContent className="p-3">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Thermometer className="h-4 w-4 text-red-500" />
              <span className="text-sm">28.5°C</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-sm">65%</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Wind className="h-4 w-4 text-gray-500" />
              <span className="text-sm">AQI 58</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <TreePine className="h-4 w-4 text-green-500" />
              <span className="text-sm">23 Tanaman</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <span className="text-sm">Online</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}