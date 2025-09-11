import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  GraduationCap,
  Wind,
  Droplets,
  Thermometer,
  TreePine,
  Brain,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Play,
  Download,
  Users,
  Target,
  Award,
  TrendingUp,
  Bot,
  Gauge,
  Activity,
  Heart,
  Leaf,
  Eye
} from 'lucide-react';

const educationTopics = [
  {
    id: "air-quality",
    title: "Kualitas Udara",
    icon: <Wind className="h-6 w-6" />,
    description: "Pelajari tentang polusi udara, AQI, dan dampaknya terhadap kesehatan",
    content: {
      overview: "Kualitas udara adalah indikator penting kesehatan lingkungan yang mempengaruhi kehidupan sehari-hari.",
      topics: [
        {
          title: "Apa itu Air Quality Index (AQI)?",
          content: "AQI adalah sistem rating yang memberikan informasi tentang seberapa bersih atau terpollusinya udara di sekitar kita. GREENOVA mengukur AQI secara real-time menggunakan sensor PM2.5 dan gas."
        },
        {
          title: "Sumber Polusi Udara",
          content: "Polusi udara berasal dari kendaraan bermotor, industri, pembakaran sampah, dan aktivitas manusia lainnya. Robot GREENOVA membantu mengidentifikasi tingkat polusi di area tertentu."
        },
        {
          title: "Dampak Kesehatan",
          content: "Udara yang buruk dapat menyebabkan masalah pernapasan, penyakit jantung, dan mengurangi kualitas hidup. Monitoring real-time membantu mengambil tindakan pencegahan."
        },
        {
          title: "Cara Mengurangi Polusi",
          content: "Gunakan transportasi ramah lingkungan, kurangi pembakaran sampah, dan dukung penggunaan energi terbarukan. GREENOVA membantu memantau efektivitas upaya ini."
        }
      ]
    }
  },
  {
    id: "plant-monitoring",
    title: "Monitoring Tanaman",
    icon: <TreePine className="h-6 w-6" />,
    description: "Memahami cara merawat tanaman dengan teknologi sensor",
    content: {
      overview: "Teknologi monitoring tanaman membantu memberikan perawatan yang tepat berdasarkan data real-time kondisi tanaman.",
      topics: [
        {
          title: "Pentingnya Kelembaban Tanah",
          content: "Kelembaban tanah adalah faktor kunci untuk pertumbuhan tanaman. Station GREENOVA mengukur kelembaban tanah secara real-time untuk memberikan informasi yang akurat."
        },
        {
          title: "Sistem Penyiraman Otomatis",
          content: "ESP32 pada station GREENOVA mengontrol sistem penyiraman otomatis berdasarkan data sensor kelembaban tanah, memastikan tanaman mendapat air yang cukup."
        },
        {
          title: "Indikator Kesehatan Tanaman",
          content: "Kondisi tanaman dinilai berdasarkan kelembaban tanah: Baik (>60%), Sedang (30-60%), Buruk (<30%). Sistem memberikan alert untuk tindakan yang diperlukan."
        },
        {
          title: "Manfaat Teknologi untuk Tanaman",
          content: "Monitoring real-time mengurangi risiko tanaman mati, mengoptimalkan penggunaan air, dan meningkatkan efisiensi perawatan tanaman di rumah atau kantor."
        }
      ]
    }
  },
  {
    id: "iot-technology",
    title: "Teknologi IoT",
    icon: <Bot className="h-6 w-6" />,
    description: "Memahami bagaimana IoT bekerja dalam monitoring lingkungan",
    content: {
      overview: "Internet of Things (IoT) menghubungkan perangkat fisik dengan internet untuk mengumpulkan dan berbagi data secara real-time.",
      topics: [
        {
          title: "ESP32 Microcontroller",
          content: "ESP32 adalah otak dari sistem GREENOVA yang mengontrol sensor, memproses data, dan mengirim informasi ke cloud database melalui WiFi."
        },
        {
          title: "Sensor Networks",
          content: "GREENOVA menggunakan multiple sensor (suhu, kelembaban, PM2.5, gas, soil moisture) yang terhubung dalam satu network untuk monitoring komprehensif."
        },
        {
          title: "Real-time Data Transmission",
          content: "Data dari sensor dikirim ke Firebase Realtime Database setiap beberapa detik, memungkinkan monitoring dan response yang cepat terhadap perubahan kondisi."
        },
        {
          title: "Cloud Computing Benefits",
          content: "Penyimpanan data di cloud memungkinkan akses dari mana saja, backup otomatis, dan kemampuan untuk analisis big data menggunakan AI dan machine learning."
        }
      ]
    }
  },
  {
    id: "ai-predictions",
    title: "AI & Prediksi",
    icon: <Brain className="h-6 w-6" />,
    description: "Bagaimana AI membantu dalam prediksi kondisi lingkungan",
    content: {
      overview: "Artificial Intelligence menganalisis pola data historis untuk membuat prediksi dan memberikan insights yang bermanfaat.",
      topics: [
        {
          title: "TensorFlow.js untuk Prediksi",
          content: "GREENOVA menggunakan TensorFlow.js untuk menganalisis tren data sensor dan membuat prediksi kondisi lingkungan beberapa waktu ke depan."
        },
        {
          title: "Pattern Recognition",
          content: "AI mengenali pola dalam data seperti variasi harian kualitas udara, kebutuhan penyiraman tanaman, dan anomali lingkungan yang memerlukan perhatian."
        },
        {
          title: "Automated Decision Making",
          content: "Berdasarkan analisis AI, sistem dapat membuat keputusan otomatis seperti menyiram tanaman atau memberikan alert kualitas udara buruk."
        },
        {
          title: "Continuous Learning",
          content: "Model AI terus belajar dari data baru untuk meningkatkan akurasi prediksi dan memberikan rekomendasi yang lebih baik seiring waktu."
        }
      ]
    }
  }
];

const quizQuestions = [
  {
    id: 1,
    question: "Apa kepanjangan dari AQI?",
    options: ["Air Quality Index", "Automatic Quality Indicator", "Air Quantity Index", "Advanced Quality Information"],
    correct: 0,
    explanation: "AQI stands for Air Quality Index - sistem rating untuk mengukur kualitas udara."
  },
  {
    id: 2,
    question: "Sensor apa yang digunakan GREENOVA Robot untuk mengukur debu halus?",
    options: ["DHT22", "MQ-135", "PMS5003", "BME280"],
    correct: 2,
    explanation: "PMS5003 adalah sensor PM2.5 yang digunakan untuk mengukur partikel debu halus di udara."
  },
  {
    id: 3,
    question: "Pada tingkat kelembaban tanah berapa Station GREENOVA akan menyiram tanaman?",
    options: ["Di atas 60%", "30-60%", "Di bawah 30%", "Selalu otomatis"],
    correct: 2,
    explanation: "Station menyiram otomatis ketika kelembaban tanah di bawah 30% yang menandakan tanah kering."
  },
  {
    id: 4,
    question: "Teknologi AI apa yang digunakan GREENOVA untuk prediksi?",
    options: ["TensorFlow.js", "PyTorch", "Scikit-learn", "OpenCV"],
    correct: 0,
    explanation: "GREENOVA menggunakan TensorFlow.js untuk analisis data dan prediksi kondisi lingkungan."
  },
  {
    id: 5,
    question: "Microcontroller apa yang digunakan dalam sistem GREENOVA?",
    options: ["Arduino Uno", "ESP32", "Raspberry Pi", "NodeMCU"],
    correct: 1,
    explanation: "ESP32 adalah microcontroller utama yang digunakan GREENOVA karena memiliki WiFi built-in."
  },
  {
    id: 6,
    question: "Berapa nilai AQI yang menunjukkan kualitas udara 'Baik'?",
    options: ["0-50", "51-100", "101-150", "151-200"],
    correct: 0,
    explanation: "AQI 0-50 menunjukkan kualitas udara baik dan aman untuk aktivitas outdoor."
  },
  {
    id: 7,
    question: "Apa fungsi utama sensor MQ-135 pada robot GREENOVA?",
    options: ["Mengukur suhu", "Mengukur kelembaban", "Mengukur gas berbahaya", "Mengukur jarak"],
    correct: 2,
    explanation: "MQ-135 adalah sensor gas yang mendeteksi CO2, ammonia, dan gas berbahaya lainnya."
  },
  {
    id: 8,
    question: "Database apa yang digunakan GREENOVA untuk menyimpan data real-time?",
    options: ["MySQL", "PostgreSQL", "Firebase Realtime Database", "MongoDB"],
    correct: 2,
    explanation: "Firebase Realtime Database dipilih untuk sinkronisasi data real-time yang cepat."
  },
  {
    id: 9,
    question: "Kondisi apa yang menunjukkan tanaman dalam keadaan 'Baik'?",
    options: ["Kelembaban >60%", "Kelembaban 30-60%", "Kelembaban <30%", "Suhu >30°C"],
    correct: 0,
    explanation: "Kelembaban tanah di atas 60% menunjukkan tanaman memiliki cukup air dan dalam kondisi baik."
  },
  {
    id: 10,
    question: "Berapa sering robot GREENOVA mengirim data ke database?",
    options: ["Setiap detik", "Setiap 5 menit", "Setiap 30 menit", "Setiap jam"],
    correct: 0,
    explanation: "Robot mengirim data setiap beberapa detik untuk monitoring real-time yang akurat."
  },
  {
    id: 11,
    question: "Apa yang dimaksud dengan PM2.5?",
    options: ["Partikel berukuran 2.5 meter", "Partikel berukuran 2.5 cm", "Partikel berukuran 2.5 mikron", "Tingkat polusi 2.5"],
    correct: 2,
    explanation: "PM2.5 adalah partikel matter berukuran 2.5 mikron atau lebih kecil yang berbahaya bagi kesehatan."
  },
  {
    id: 12,
    question: "Teknologi apa yang memungkinkan GREENOVA memberikan rekomendasi otomatis?",
    options: ["Machine Learning", "Blockchain", "Cloud Computing", "IoT"],
    correct: 0,
    explanation: "Machine Learning memungkinkan GREENOVA menganalisis pola data dan memberikan rekomendasi yang tepat."
  },
  {
    id: 13,
    question: "Kapan sistem penyiraman otomatis akan aktif?",
    options: ["Setiap pagi", "Saat kelembaban rendah", "Setiap 2 jam", "Saat suhu tinggi"],
    correct: 1,
    explanation: "Sistem penyiraman otomatis aktif ketika sensor mendeteksi kelembaban tanah rendah."
  },
  {
    id: 14,
    question: "Apa keunggulan utama monitoring real-time dibanding manual?",
    options: ["Lebih murah", "Data lebih akurat dan cepat", "Tidak perlu listrik", "Lebih sederhana"],
    correct: 1,
    explanation: "Monitoring real-time memberikan data yang lebih akurat dan respon yang lebih cepat terhadap perubahan."
  },
  {
    id: 15,
    question: "Sensor apa yang mengukur jarak pada robot GREENOVA?",
    options: ["DHT22", "Ultrasonic HC-SR04", "PMS5003", "MQ-135"],
    correct: 1,
    explanation: "Sensor ultrasonic HC-SR04 digunakan untuk mengukur jarak dan navigasi robot."
  }
];

// Function to get random quiz questions
const getRandomQuizQuestions = (count: number = 4) => {
  const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export function Education() {
  const [activeTab, setActiveTab] = useState("learning");
  const [selectedTopic, setSelectedTopic] = useState("air-quality");
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState<typeof quizQuestions>([]);

  // Initialize quiz with random questions
  const initializeQuiz = () => {
    const randomQuestions = getRandomQuizQuestions(5); // Get 5 random questions
    setCurrentQuizQuestions(randomQuestions);
    setCurrentQuiz(0);
    setQuizAnswers([]);
    setShowQuizResult(false);
    setQuizScore(0);
  };

  // Initialize quiz on component mount or when quiz tab is selected
  React.useEffect(() => {
    if (activeTab === 'quiz' && currentQuizQuestions.length === 0) {
      initializeQuiz();
    }
  }, [activeTab]);

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuiz] = answerIndex;
    setQuizAnswers(newAnswers);

    if (currentQuiz < currentQuizQuestions.length - 1) {
      setCurrentQuiz(currentQuiz + 1);
    } else {
      // Calculate score
      const score = newAnswers.reduce((total, answer, index) => {
        return total + (answer === currentQuizQuestions[index].correct ? 1 : 0);
      }, 0);
      setQuizScore(score);
      setShowQuizResult(true);
    }
  };

  const resetQuiz = () => {
    initializeQuiz();
  };

  const getScoreMessage = (score: number) => {
    const percentage = (score / currentQuizQuestions.length) * 100;
    if (percentage >= 80) return { message: "Excellent! Anda sangat memahami teknologi GREENOVA!", color: "text-green-600" };
    if (percentage >= 60) return { message: "Good! Pemahaman Anda cukup baik tentang GREENOVA.", color: "text-blue-600" };
    return { message: "Keep Learning! Mari pelajari lebih lanjut tentang GREENOVA.", color: "text-orange-600" };
  };

  const currentTopic = educationTopics.find(topic => topic.id === selectedTopic);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <Badge variant="outline" className="text-lg px-4 py-2">
          <GraduationCap className="h-4 w-4 mr-2" />
          Edukasi GREENOVA
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold">
          Pelajari Teknologi Lingkungan
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Pahami cara kerja teknologi monitoring lingkungan GREENOVA dan bagaimana 
          AI membantu kita memahami kondisi udara dan tanaman di sekitar kita.
        </p>
      </section>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="learning">
            <BookOpen className="h-4 w-4 mr-2" />
            Materi Pembelajaran
          </TabsTrigger>
          <TabsTrigger value="interactive">
            <Lightbulb className="h-4 w-4 mr-2" />
            Demo Interaktif
          </TabsTrigger>
          <TabsTrigger value="quiz">
            <Award className="h-4 w-4 mr-2" />
            Quiz
          </TabsTrigger>
        </TabsList>

        {/* Learning Materials */}
        <TabsContent value="learning" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Topic Sidebar */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Pilih Topik</h3>
              <div className="space-y-2">
                {educationTopics.map((topic) => (
                  <Button
                    key={topic.id}
                    variant={selectedTopic === topic.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedTopic(topic.id)}
                  >
                    {topic.icon}
                    <span className="ml-2">{topic.title}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {currentTopic && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        {currentTopic.icon}
                        {currentTopic.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg text-muted-foreground">
                        {currentTopic.content.overview}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    {currentTopic.content.topics.map((subtopic, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <h4 className="font-semibold text-lg mb-3">{subtopic.title}</h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {subtopic.content}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Interactive Demo */}
        <TabsContent value="interactive" className="space-y-8">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Demo Interaktif GREENOVA</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Jelajahi sistem GREENOVA secara interaktif dan lihat bagaimana data sensor 
              diproses untuk memberikan insights yang berguna.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Robot Demo */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Simulasi Robot GREENOVA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      Suhu
                    </span>
                    <span className="font-mono">28.3°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Droplets className="h-4 w-4" />
                      Kelembaban
                    </span>
                    <span className="font-mono">65.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Wind className="h-4 w-4" />
                      PM2.5
                    </span>
                    <span className="font-mono">25 μg/m³</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Gauge className="h-4 w-4" />
                      AQI
                    </span>
                    <Badge className="bg-green-500">45 - Baik</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Data ini diperbarui secara real-time setiap beberapa detik dari sensor robot.
                </p>
              </CardContent>
            </Card>

            {/* Station Demo */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5" />
                  Simulasi Station GREENOVA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Tanaman A</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Kelembaban Tanah:</span>
                        <span className="font-mono">75%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kondisi:</span>
                        <Badge className="bg-green-500">Baik</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Tanaman B</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Kelembaban Tanah:</span>
                        <span className="font-mono">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kondisi:</span>
                        <Badge className="bg-red-500">Perlu Disiram</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Station otomatis menyiram tanaman ketika kelembaban di bawah 30%.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* AI Prediction Demo */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Prediction Demo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Prediksi Kualitas Udara</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI memprediksi AQI akan meningkat menjadi 65 dalam 2 jam ke depan
                  </p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Droplets className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Prediksi Penyiraman</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tanaman B akan memerlukan penyiraman dalam 4 jam berdasarkan pola konsumsi air
                  </p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Rekomendasi AI</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Disarankan menggunakan masker saat aktivitas outdoor sore ini
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quiz Section */}
        <TabsContent value="quiz" className="space-y-8">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Quiz GREENOVA</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Uji pemahaman Anda tentang teknologi dan cara kerja sistem GREENOVA
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              {!showQuizResult ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">
                      Pertanyaan {currentQuiz + 1} dari {currentQuizQuestions.length}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Progress: {Math.round(((currentQuiz + 1) / currentQuizQuestions.length) * 100)}%
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">
                      {currentQuizQuestions[currentQuiz]?.question}
                    </h3>
                    
                    <div className="space-y-3">
                      {currentQuizQuestions[currentQuiz]?.options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-3 px-4"
                          onClick={() => handleQuizAnswer(index)}
                        >
                          <span className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-sm mr-3">
                            {String.fromCharCode(65 + index)}
                          </span>
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Quiz Selesai!</h3>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-primary">
                        {quizScore} / {currentQuizQuestions.length}
                      </p>
                      <p className={`text-lg ${getScoreMessage(quizScore).color}`}>
                        {getScoreMessage(quizScore).message}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Pembahasan:</h4>
                    <div className="space-y-3 text-left">
                      {currentQuizQuestions.map((question, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                              quizAnswers[index] === question.correct 
                                ? 'bg-green-500 text-white' 
                                : 'bg-red-500 text-white'
                            }`}>
                              {quizAnswers[index] === question.correct ? '✓' : '✗'}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{question.question}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {question.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={resetQuiz} className="w-full">
                    Ulangi Quiz
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Learning Resources */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Sumber Pembelajaran Tambahan</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Materi tambahan untuk memperdalam pemahaman tentang teknologi monitoring lingkungan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Video Tutorial IoT",
              description: "Pelajari dasar-dasar ESP32 dan sensor integration",
              icon: <Play className="h-5 w-5" />,
              type: "Video",
              duration: "15 menit"
            },
            {
              title: "E-book AI & Machine Learning",
              description: "Panduan lengkap TensorFlow.js untuk pemula",
              icon: <Download className="h-5 w-5" />,
              type: "PDF",
              duration: "50 halaman"
            },
            {
              title: "Workshop Online",
              description: "Sesi live tentang environmental monitoring",
              icon: <Users className="h-5 w-5" />,
              type: "Live",
              duration: "2 jam"
            },
            {
              title: "Case Study GREENOVA",
              description: "Implementasi real-world sistem monitoring",
              icon: <BookOpen className="h-5 w-5" />,
              type: "Artikel",
              duration: "10 menit"
            },
            {
              title: "Technical Documentation",
              description: "Dokumentasi lengkap API dan hardware specs",
              icon: <Eye className="h-5 w-5" />,
              type: "Docs",
              duration: "30 menit"
            },
            {
              title: "Community Forum",
              description: "Diskusi dengan pengguna GREENOVA lainnya",
              icon: <Users className="h-5 w-5" />,
              type: "Forum",
              duration: "Ongoing"
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
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{resource.duration}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Mulai Eksplorasi GREENOVA</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Terapkan pengetahuan yang sudah dipelajari dengan menjelajahi dashboard 
            real-time dan berinteraksi dengan AI GREENOVA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Jelajahi Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Tanya AI GREENOVA
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}