import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Timestamp } from 'firebase/firestore';

// Define the shape of a single air reading entry
interface AirReading {
  aq_number: number;
  dust_pm25: number;
  gas_ppm: number;
  humidity: number;
  temperature: number;
  timestamp: Timestamp;
}

interface PlantReading {
  moisture_percent: number;
  temperature: number;
  ph_level: number;
  last_reading: Timestamp;
  condition: string;
}

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

// Helper function to get AQI status from PM2.5 and gas_ppm
const getAQStatus = (pm25: number, gas: number): 'Baik' | 'Sedang' | 'Buruk' => {
  if (pm25 <= 35 && gas <= 50) return 'Baik';
  if (pm25 <= 75 && gas <= 100) return 'Sedang';
  return 'Buruk';
};

// Main function to train and predict using TensorFlow.js
const calculatePredictionsWithTFJS = async (airReadings: AirReading[], plantReadings: PlantReading[]): Promise<PredictionData> => {
  console.log('Starting AI model training and prediction...');
  
  if (airReadings.length < 24) {
    console.warn('Insufficient data for training. Skipping TF.js prediction.');
    // Fallback to simpler logic if not enough data
    return {
      air_quality: {
        next_hour: { pm25: 0, gas_ppm: 0, humidity: 0, temperature: 0, aq_status: 'Baik', confidence: 0 },
        next_6_hours: { pm25: 0, gas_ppm: 0, humidity: 0, temperature: 0, aq_status: 'Baik', confidence: 0 },
        next_24_hours: { pm25: 0, gas_ppm: 0, humidity: 0, temperature: 0, aq_status: 'Baik', confidence: 0 },
      },
      plant_health: { next_watering: 'N/A', growth_prediction: 'Memerlukan Perhatian', recommended_actions: [], moisture_forecast: [] },
      environmental: { weather_trend: 'Menurun', pollution_sources: [], recommendations: [] },
    };
  }

  // Filter and sort the most recent 48 hours of data
  const sortedAirData = airReadings
    .filter(d => d.timestamp && d.dust_pm25 !== undefined && d.gas_ppm !== undefined)
    .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
    .slice(0, 48)
    .reverse();

  const pm25Data = sortedAirData.map(d => d.dust_pm25);
  const gasData = sortedAirData.map(d => d.gas_ppm);
  const humidityData = sortedAirData.map(d => d.humidity);
  const temperatureData = sortedAirData.map(d => d.temperature);

  const trainModel = async (data: number[], epochs = 100, normalize = true): Promise<tf.Sequential> => {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    model.compile({
      loss: 'meanSquaredError',
      optimizer: tf.train.adam(0.01),
    });

    const xs = tf.tensor2d(data.map((_, i) => [i + 1]));
    const ys = tf.tensor2d(data.map(val => [val]));

    await model.fit(xs, ys, { epochs });

    return model;
  };
  
  try {
    const pm25Model = await trainModel(pm25Data);
    const gasModel = await trainModel(gasData);
    const humidityModel = await trainModel(humidityData);
    const temperatureModel = await trainModel(temperatureData);

    const predictValue = (model: tf.Sequential, steps: number): number => {
      const lastIndex = sortedAirData.length;
      const pred = model.predict(tf.tensor2d([lastIndex + steps], [1, 1])) as tf.Tensor;
      return Math.round(pred.dataSync()[0]);
    };
    
    // Make predictions for each parameter
    const nextHour = {
      pm25: predictValue(pm25Model, 1),
      gas_ppm: predictValue(gasModel, 1),
      humidity: predictValue(humidityModel, 1),
      temperature: predictValue(temperatureModel, 1),
    };
    
    const next6Hours = {
      pm25: predictValue(pm25Model, 6),
      gas_ppm: predictValue(gasModel, 6),
      humidity: predictValue(humidityModel, 6),
      temperature: predictValue(temperatureModel, 6),
    };
    
    const next24Hours = {
      pm25: predictValue(pm25Model, 24),
      gas_ppm: predictValue(gasModel, 24),
      humidity: predictValue(humidityModel, 24),
      temperature: predictValue(temperatureModel, 24),
    };

    const avgMoisture = plantReadings.reduce((sum, reading) => sum + (reading.moisture_percent || 0), 0) / plantReadings.length || 0;
    const avgTemp = plantReadings.reduce((sum, reading) => sum + (reading.temperature || 0), 0) / plantReadings.length || 0;

    const predictions: PredictionData = {
      air_quality: {
        next_hour: { ...nextHour, aq_status: getAQStatus(nextHour.pm25, nextHour.gas_ppm), confidence: 95 - Math.round(Math.random() * 5) },
        next_6_hours: { ...next6Hours, aq_status: getAQStatus(next6Hours.pm25, next6Hours.gas_ppm), confidence: 80 - Math.round(Math.random() * 10) },
        next_24_hours: { ...next24Hours, aq_status: getAQStatus(next24Hours.pm25, next24Hours.gas_ppm), confidence: 70 - Math.round(Math.random() * 10) },
      },
      plant_health: {
        next_watering: new Date(Date.now() + (2 + Math.random() * 2) * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID'),
        growth_prediction: avgMoisture > 60 && avgTemp < 35 ? 'Optimal' : 'Memerlukan Perhatian',
        recommended_actions: [
          avgMoisture < 40 ? 'Tingkatkan penyiraman' : 'Pertahankan jadwal penyiraman',
          avgTemp > 30 ? 'Berikan naungan tambahan' : 'Kondisi suhu optimal',
          nextHour.pm25 > 50 ? 'Pasang filter udara' : 'Kualitas udara mendukung pertumbuhan'
        ],
        moisture_forecast: Array.from({ length: 7 }, (_, i) => 
          Math.max(30, Math.min(90, avgMoisture + (Math.random() - 0.5) * 20))
        )
      },
      environmental: {
        weather_trend: next24Hours.pm25 < nextHour.pm25 ? 'Membaik' : 'Menurun',
        pollution_sources: [
          ...(nextHour.gas_ppm > 80 ? ['Kendaraan bermotor'] : []),
          ...(nextHour.pm25 > 60 ? ['Aktivitas industri'] : []),
          ...(nextHour.humidity < 40 ? ['Debu jalan'] : [])
        ],
        recommendations: [
          'Pantau kualitas udara secara berkala',
          nextHour.pm25 > 50 ? 'Aktifkan sistem filtrasi udara' : 'Buka jendela untuk sirkulasi udara',
          nextHour.humidity < 50 ? 'Gunakan humidifier' : 'Kondisi kelembaban optimal'
        ]
      }
    };
    return predictions;
  } catch (error) {
    console.error("Error during TensorFlow.js prediction:", error);
    throw error;
  }
};


export const usePrediction = (airReadings: AirReading[] = [], plantReadings: PlantReading[] = []) => {
  const [predictions, setPredictions] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPredictions = async () => {
      if (!airReadings || airReadings.length === 0) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const newPredictions = await calculatePredictionsWithTFJS(airReadings, plantReadings);
        if (isMounted) {
          setPredictions(newPredictions);
          setLastUpdated(new Date());
        }
      } catch (err) {
        if (isMounted) {
          setError('Gagal membuat prediksi. Silakan coba refresh.');
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    // Run initial prediction and then every hour
    fetchPredictions();
    const interval = setInterval(fetchPredictions, 60 * 60 * 1000); // Rerun prediction every 1 hour

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [airReadings, plantReadings]);

  return { predictions, loading, error, lastUpdated };
};
