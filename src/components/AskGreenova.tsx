import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Clock,
  CheckCircle2,
  Thermometer,
  Droplets,
  Wind,
  TreePine,
  ArrowDown
} from 'lucide-react';
import { useFirebaseData } from '../hooks/useFirebaseData'; // Impor custom hook

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  typing?: boolean;
}

const quickQuestions = [
  "Bagaimana kualitas udara sekarang?",
  "Apa itu PM2.5?",
  "Bagaimana kelembaban tanah di tanaman A?",
  "Rekomendasi untuk lingkungan?"
];

// Helper function untuk mendapatkan status AQI
const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) return 'Baik';
  if (aqi <= 100) return 'Sedang';
  if (aqi <= 150) return 'Tidak Sehat untuk Sensitif';
  if (aqi <= 200) return 'Tidak Sehat';
  return 'Sangat Tidak Sehat';
};

export function AskGreenova() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `👋 Halo! Saya **GREENOVA AI**, asisten pintar untuk monitoring lingkungan dan pertanian berkelanjutan!

🌱 Saya bisa membantu Anda dengan:
• **Data sensor real-time** (suhu, kelembaban, PM2.5)
• **Kondisi tanaman** dan rekomendasi penyiraman
• **Analisis tren lingkungan**
• **Prediksi kualitas udara** dan dampaknya

Silakan tanya apa saja tentang data lingkungan! 😊`,
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Menggunakan custom hook untuk mendapatkan data real-time
  const { airReadings, plantReadings, loading, error } = useFirebaseData();

  // Dapatkan data terbaru dari array
  const latestAirReading = airReadings.length > 0 ? airReadings[0] : null;
  const latestPlantReading = plantReadings.length > 0 ? plantReadings[0] : null;

  // Check untuk auto message saat component dimuat
  useEffect(() => {
    const autoMessage = sessionStorage.getItem('autoMessage');
    if (autoMessage) {
      setInputValue(autoMessage);
      sessionStorage.removeItem('autoMessage'); // Hapus setelah digunakan
      
      // Auto-send message setelah 1 detik
      setTimeout(async () => {
        const userMessage: Message = {
          id: Date.now().toString(),
          text: autoMessage,
          isBot: false,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        const botResponseText = await fetchAIResponse(userMessage.text);

        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponseText,
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const scrollContainer = document.querySelector('[data-radix-scroll-area-content]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }, 100);
  }, [messages]);

  const fetchAIResponse = async (prompt: string): Promise<string> => {
    setIsTyping(true);
    
    // Gabungkan data sensor udara dan tanaman terbaru
    let combinedDataText = '';
    if (latestAirReading) {
      combinedDataText += `
Data Udara Terbaru:
- Suhu: ${latestAirReading.temperature}°C
- Kelembaban Udara: ${latestAirReading.humidity}%
- PM2.5: ${latestAirReading.dust_pm25} μg/m³
- PM10: ${latestAirReading.dust_pm25 ? (latestAirReading.dust_pm25 * 1.5).toFixed(1) : 'N/A'} μg/m³
- Kualitas Udara (AQI): ${latestAirReading.aq_number} (${getAQIStatus(latestAirReading.aq_number)})
      `.trim();
    }
    if (latestPlantReading) {
      combinedDataText += `\n\nData Tanaman Terbaru:
- Kelembaban Tanaman A: ${latestPlantReading.moisture_percent}% (${latestPlantReading.condition})
      `.trim();
    }
    
    // Prompt yang menggabungkan data dan instruksi penolakan
    const combinedPrompt = `
      Anda adalah GREENOVA AI. Jawablah pertanyaan pengguna dalam Bahasa Indonesia yang santai, ramah, dan tidak kaku.
      Gunakan data sensor yang disediakan di bawah ini untuk menjawab pertanyaan spesifik tentang kondisi lingkungan terkini.

      ${combinedDataText}

      Instruksi Penting:
      1. Anda HANYA boleh menjawab pertanyaan yang berkaitan dengan data lingkungan (udara, tanah, suhu, kelembaban) dan tidak ada yang lain.
      2. Jangan pernah menjawab pertanyaan tentang status sistem, seperti level baterai robot, kekuatan sinyal, atau status kipas.
      3. Jika pertanyaan di luar topik (misalnya: tentang sejarah, matematika, atau status sistem), berikan respons yang sopan bahwa Anda tidak bisa menjawab.

      Contoh respons penolakan yang relevan:
      - "Maaf, saya tidak dapat memberikan informasi tentang status sistem seperti baterai atau sinyal. Fokus saya adalah pada data lingkungan."
      - "Topik itu di luar keahlian saya, nih. Kalau mau tanya seputar polusi udara atau kondisi tanaman, saya siap bantu kok!"
      
      Pertanyaan Pengguna: ${prompt}
    `;

    const chatHistory = [{ role: "user", parts: [{ text: combinedPrompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = "AIzaSyB9EsmQ8_mthCuXGMSL3e5EezFhRuqYg-Q";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      
      if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        return result.candidates[0].content.parts[0].text;
      } else {
        return "Maaf, saya tidak dapat memproses permintaan ini saat ini. Silakan coba lagi nanti.";
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Terjadi kesalahan saat memproses permintaan. Mohon maaf atas ketidaknyamanannya.";
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    const botResponseText = await fetchAIResponse(userMessage.text);

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponseText,
      isBot: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botResponse]);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
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
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
  };

  // Tampilkan layar loading jika data belum siap
  if (loading) {
    return <div>Memuat data...</div>;
  }

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
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
              <div className={`w-2 h-2 ${isTyping ? 'bg-orange-400' : 'bg-green-400'} rounded-full ${isTyping ? 'animate-pulse' : ''}`}></div>
              {isTyping ? "Mengetik..." : "Online - Siap membantu Anda"}
            </div>
          </div>
        </div>
      </div>

      <Card className="flex-1 flex flex-col rounded-t-none border-t-0">
        <CardContent className="flex-1 flex flex-col p-0">
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
              </div>
            </ScrollArea>
            
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-4 right-4 w-8 h-8 rounded-full shadow-lg"
              onClick={scrollToBottom}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>

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

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tanyakan tentang data lingkungan, status robot, atau kondisi tanaman..."
                  className="pr-20 bg-input-background"
                  disabled={isTyping}
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

      <Card className="mt-4 rounded-t-none border-t-0">
        <CardContent className="p-3">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Thermometer className="h-4 w-4 text-red-500" />
              <span className="text-sm">
                {latestAirReading?.temperature || 0}°C
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-sm">
                {latestAirReading?.humidity || 0}%
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Wind className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                AQI {latestAirReading?.aq_number || 0}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <TreePine className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                Tanaman A: {latestPlantReading?.condition || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <span className="text-sm">
                {loading ? 'Menghubungkan...' : error ? 'Error' : 'Online'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
