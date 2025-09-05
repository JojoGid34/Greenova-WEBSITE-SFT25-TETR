import { useState, useEffect } from 'react';

export interface PredictionData {
  air_quality: {
    next_hour: {
      pm25: number;
      gas_ppm: number;
      humidity: number;
      temperature: number;
      aq_status: 'Baik' | 'Sedang' | 'Buruk';
      confidence: number;
    };
    next_6_hours: {
      pm25: number;
      gas_ppm: number;
      humidity: number;
      temperature: number;
      aq_status: 'Baik' | 'Sedang' | 'Buruk';
      confidence: number;
    };
    next_24_hours: {
      pm25: number;
      gas_ppm: number;
      humidity: number;
      temperature: number;
      aq_status: 'Baik' | 'Sedang' | 'Buruk';
      confidence: number;
    };
  };
  plant_health: {
    next_watering: string;
    growth_prediction: 'Optimal' | 'Baik' | 'Memerlukan Perhatian';
    recommended_actions: string[];
    moisture_forecast: number[];
  };
  environmental: {
    weather_trend: 'Membaik' | 'Stabil' | 'Menurun';
    pollution_sources: string[];
    recommendations: string[];
  };
}

// Fungsi untuk menghitung prediksi berdasarkan data historis
const calculatePredictions = (airReadings: any[], plantReadings: any[]): PredictionData => {
  // Ambil data terbaru untuk analisis trend
  const recentAirData = airReadings.slice(-24); // 24 data terakhir
  const recentPlantData = plantReadings.slice(-12); // 12 data terakhir

  // Hitung rata-rata untuk prediksi
  const avgPM25 = recentAirData.reduce((sum, reading) => sum + (reading.dust_pm25 || 0), 0) / recentAirData.length || 0;
  const avgGas = recentAirData.reduce((sum, reading) => sum + (reading.gas_ppm || 0), 0) / recentAirData.length || 0;
  const avgHumidity = recentAirData.reduce((sum, reading) => sum + (reading.humidity || 0), 0) / recentAirData.length || 0;
  const avgTemp = recentAirData.reduce((sum, reading) => sum + (reading.temperature || 0), 0) / recentAirData.length || 0;

  // Prediksi status kualitas udara
  const predictAQStatus = (pm25: number, gas: number): 'Baik' | 'Sedang' | 'Buruk' => {
    if (pm25 <= 35 && gas <= 50) return 'Baik';
    if (pm25 <= 75 && gas <= 100) return 'Sedang';
    return 'Buruk';
  };

  // Hitung trend dengan variasi random untuk simulasi ML
  const getVariation = (base: number, factor: number = 0.1) => {
    return base + (Math.random() - 0.5) * base * factor;
  };

  const predictions: PredictionData = {
    air_quality: {
      next_hour: {
        pm25: Math.round(getVariation(avgPM25, 0.05)),
        gas_ppm: Math.round(getVariation(avgGas, 0.05)),
        humidity: Math.round(getVariation(avgHumidity, 0.03)),
        temperature: Math.round(getVariation(avgTemp, 0.02) * 10) / 10,
        aq_status: predictAQStatus(getVariation(avgPM25, 0.05), getVariation(avgGas, 0.05)),
        confidence: 85 + Math.round(Math.random() * 10)
      },
      next_6_hours: {
        pm25: Math.round(getVariation(avgPM25, 0.15)),
        gas_ppm: Math.round(getVariation(avgGas, 0.15)),
        humidity: Math.round(getVariation(avgHumidity, 0.1)),
        temperature: Math.round(getVariation(avgTemp, 0.05) * 10) / 10,
        aq_status: predictAQStatus(getVariation(avgPM25, 0.15), getVariation(avgGas, 0.15)),
        confidence: 70 + Math.round(Math.random() * 15)
      },
      next_24_hours: {
        pm25: Math.round(getVariation(avgPM25, 0.25)),
        gas_ppm: Math.round(getVariation(avgGas, 0.25)),
        humidity: Math.round(getVariation(avgHumidity, 0.2)),
        temperature: Math.round(getVariation(avgTemp, 0.1) * 10) / 10,
        aq_status: predictAQStatus(getVariation(avgPM25, 0.25), getVariation(avgGas, 0.25)),
        confidence: 60 + Math.round(Math.random() * 15)
      }
    },
    plant_health: {
      next_watering: new Date(Date.now() + (2 + Math.random() * 2) * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID'),
      growth_prediction: avgHumidity > 60 ? 'Optimal' : avgHumidity > 40 ? 'Baik' : 'Memerlukan Perhatian',
      recommended_actions: [
        avgHumidity < 40 ? 'Tingkatkan penyiraman' : 'Pertahankan jadwal penyiraman',
        avgTemp > 30 ? 'Berikan naungan tambahan' : 'Kondisi suhu optimal',
        avgPM25 > 50 ? 'Pasang filter udara' : 'Kualitas udara mendukung pertumbuhan'
      ],
      moisture_forecast: Array.from({ length: 7 }, (_, i) => 
        Math.max(30, Math.min(90, avgHumidity + (Math.random() - 0.5) * 20))
      )
    },
    environmental: {
      weather_trend: avgPM25 < 35 ? 'Membaik' : avgPM25 < 75 ? 'Stabil' : 'Menurun',
      pollution_sources: [
        ...(avgGas > 80 ? ['Kendaraan bermotor'] : []),
        ...(avgPM25 > 60 ? ['Aktivitas industri'] : []),
        ...(avgHumidity < 40 ? ['Debu jalan'] : [])
      ],
      recommendations: [
        'Pantau kualitas udara secara berkala',
        avgPM25 > 50 ? 'Aktifkan sistem filtrasi udara' : 'Buka jendela untuk sirkulasi udara',
        avgHumidity < 50 ? 'Gunakan humidifier' : 'Kondisi kelembaban optimal'
      ]
    }
  };

  return predictions;
};

export const usePrediction = (airReadings: any[] = [], plantReadings: any[] = []) => {
  const [predictions, setPredictions] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    // Simulasi loading untuk efek realistis
    const timer = setTimeout(() => {
      if (airReadings.length > 0 || plantReadings.length > 0) {
        const newPredictions = calculatePredictions(airReadings, plantReadings);
        setPredictions(newPredictions);
        setLastUpdated(new Date());
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [airReadings, plantReadings]);

  // Update prediksi setiap 30 menit
  useEffect(() => {
    const interval = setInterval(() => {
      if (airReadings.length > 0 || plantReadings.length > 0) {
        const newPredictions = calculatePredictions(airReadings, plantReadings);
        setPredictions(newPredictions);
        setLastUpdated(new Date());
      }
    }, 30 * 60 * 1000); // 30 menit

    return () => clearInterval(interval);
  }, [airReadings, plantReadings]);

  return { predictions, loading, lastUpdated };
};