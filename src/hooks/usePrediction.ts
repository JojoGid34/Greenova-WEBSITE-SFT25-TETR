import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

interface RobotData {
  kelembaban: number;
  suhu: number;
  jarak: number;
  debu: number;
  gas: number;
  terakhir_update: string;
  aqi_lokal: string; // Changed to string since it's status, not number
}

interface PlantData {
  kelembaban: number;
  kondisi: string;
  terakhir_siram?: string;
  terakhir_update: string;
}

interface DashboardData {
  robot: RobotData;
  taman: {
    A: PlantData;
    B: PlantData;
  };
}

interface AIRecommendation {
  environmental_advice: string;
  plant_care_tips: string;
  action_required: string;
  safety_warning?: string;
}

interface PredictionResult {
  kelembaban_A_prediksi: number;
  kelembaban_B_prediksi: number;
  ai_recommendation: AIRecommendation;
}

export const usePrediction = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const db = getDatabase();
    const dbRef = ref(db, '/');

    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val() as DashboardData;
        setData(rawData);
        
        // Memanggil fungsi prediksi setelah data diterima
        const predictedData = runPrediction(rawData);
        setPrediction(predictedData);

        setLoading(false);
      } else {
        setError('Data tidak ditemukan. Menunggu data dari perangkat.');
        setLoading(false);
        setData(null);
        setPrediction(null);
      }
    }, (err) => {
      setError(`Gagal memuat data: ${err.message}`);
      setLoading(false);
      setData(null);
      setPrediction(null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Fungsi untuk mensimulasikan hasil prediksi dan rekomendasi AI
  const runPrediction = (currentData: DashboardData): PredictionResult => {
    // Prediksi untuk kelembaban tanaman A: turun seiring waktu
    const kelembabanAPrediksi = Math.max(0, currentData.taman.A.kelembaban * (1 - Math.random() * 0.05));

    // Prediksi untuk kelembaban tanaman B: turun seiring waktu
    const kelembabanBPrediksi = Math.max(0, currentData.taman.B.kelembaban * (1 - Math.random() * 0.05));

    // Generate AI recommendations based on current data
    const aiRecommendation = generateAIRecommendation(currentData);

    return {
      kelembaban_A_prediksi: parseFloat(kelembabanAPrediksi.toFixed(2)),
      kelembaban_B_prediksi: parseFloat(kelembabanBPrediksi.toFixed(2)),
      ai_recommendation: aiRecommendation,
    };
  };

  // Generate AI recommendation based on sensor data
  const generateAIRecommendation = (data: DashboardData): AIRecommendation => {
    const { robot, taman } = data;
    
    // Environmental advice based on air quality
    let environmental_advice = '';
    let safety_warning = undefined;
    
    if (robot.aqi_lokal === 'baik') {
      environmental_advice = 'Kualitas udara sangat baik! Waktu yang tepat untuk aktivitas outdoor dan olahraga. Manfaatkan udara segar untuk meningkatkan kesehatan.';
    } else if (robot.aqi_lokal === 'sedang') {
      environmental_advice = 'Kualitas udara masih dalam batas normal. Anda masih bisa beraktivitas outdoor, namun hindari olahraga berat dalam waktu lama.';
    } else {
      environmental_advice = 'Kualitas udara kurang baik. Disarankan untuk mengurangi aktivitas outdoor dan menggunakan masker saat keluar rumah.';
      safety_warning = 'Perhatian: Tingkat polusi tinggi terdeteksi! Hindari aktivitas outdoor yang intens.';
    }

    // Plant care tips based on soil moisture
    let plant_care_tips = '';
    const avgMoisture = (taman.A.kelembaban + taman.B.kelembaban) / 2;
    
    if (avgMoisture >= 60) {
      plant_care_tips = 'Kelembaban tanah optimal! Tanaman dalam kondisi baik. Lanjutkan jadwal penyiraman yang sudah ada.';
    } else if (avgMoisture >= 30) {
      plant_care_tips = 'Kelembaban tanah mulai menurun. Pertimbangkan untuk menambah frekuensi penyiraman atau periksa sistem irigasi.';
    } else {
      plant_care_tips = 'Tanah terlalu kering! Segera lakukan penyiraman intensif dan periksa sistem drainase serta penyiraman otomatis.';
    }

    // Action required based on overall conditions
    let action_required = 'Tidak ada tindakan khusus diperlukan saat ini.';
    
    if (robot.aqi_lokal === 'buruk' || avgMoisture < 30) {
      action_required = 'Tindakan segera diperlukan: ';
      const actions = [];
      
      if (robot.aqi_lokal === 'buruk') {
        actions.push('aktifkan air purifier atau ventilasi');
      }
      if (avgMoisture < 30) {
        actions.push('lakukan penyiraman tanaman segera');
      }
      
      action_required += actions.join(' dan ') + '.';
    }

    return {
      environmental_advice,
      plant_care_tips,
      action_required,
      safety_warning
    };
  };

  // Function to generate auto question for Ask GREENOVA AI
  const generateAutoQuestion = () => {
    if (!data) return '';
    
    const { robot, taman } = data;
    const question = `Berdasarkan data sensor terbaru:
- Kualitas udara: ${robot.aqi_lokal}
- Suhu: ${robot.suhu}°C
- Kelembaban udara: ${robot.kelembaban}%
- Debu PM2.5: ${robot.debu} μg/m³
- Gas: ${robot.gas} ppm
- Kelembaban tanaman A: ${taman.A.kelembaban}%
- Kelembaban tanaman B: ${taman.B.kelembaban}%

Apa saran dan rekomendasi yang mudah dipahami untuk menjaga kualitas udara dan kesehatan tanaman berdasarkan data ini?`;
    
    return question;
  };

  return { data, prediction, loading, error, generateAutoQuestion };
};