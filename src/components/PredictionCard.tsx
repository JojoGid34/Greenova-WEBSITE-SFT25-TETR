import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Activity, 
  RefreshCw,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PredictionService, PredictionResult, RobotPredictionData, PlantPredictionData } from '../services/predictionService';

interface PredictionCardProps {
  type: 'air-quality' | 'plants';
  robotData?: {
    pm25: number;
    gas: number;
    temperature: number;
    humidity: number;
  };
  plantData?: {
    plantA: number;
    plantB: number;
  };
}

export function PredictionCard({ type, robotData, plantData }: PredictionCardProps) {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePrediction = async () => {
    if (!robotData || !plantData) return;

    setLoading(true);
    setError(null);

    try {
      const predictionService = PredictionService.getInstance();
      const result = await predictionService.generatePrediction(robotData, plantData);
      setPrediction(result);
    } catch (err) {
      setError('Gagal membuat prediksi. Silakan coba lagi.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (robotData && plantData) {
      generatePrediction();
    }
  }, [robotData, plantData]);

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'secondary';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Membuat prediksi AI...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={generatePrediction} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!prediction) {
    return null;
  }

  if (type === 'air-quality') {
    const chartData = prediction.robot.timestamps.map((time, index) => ({
      time,
      PM25: prediction.robot.pm25_24h[index],
      Gas: prediction.robot.gas_24h[index],
      Suhu: prediction.robot.temperature_24h[index],
      Kelembaban: prediction.robot.humidity_24h[index]
    }));

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Prediksi Kualitas Udara AI (4 Jam Ke Depan)
            <Badge variant={getRiskBadgeVariant(prediction.aiInsights.riskLevel)} className="ml-2">
              {getRiskIcon(prediction.aiInsights.riskLevel)}
              <span className="ml-1 capitalize">{prediction.aiInsights.riskLevel} Risk</span>
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Insights */}
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Analisis AI:</strong> {prediction.aiInsights.airQuality}
            </AlertDescription>
          </Alert>

          {/* Prediction Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="PM25" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Gas" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Suhu" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Kelembaban" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Predictions Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">PM2.5 (4h)</p>
              <p className="font-bold">{prediction.robot.pm25_24h[3]?.toFixed(1)} μg/m³</p>
              <div className="flex items-center justify-center mt-1">
                {prediction.robot.pm25_24h[3] > (robotData?.pm25 || 0) ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Gas (4h)</p>
              <p className="font-bold">{prediction.robot.gas_24h[3]?.toFixed(1)} ppm</p>
              <div className="flex items-center justify-center mt-1">
                {prediction.robot.gas_24h[3] > (robotData?.gas || 0) ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Suhu (4h)</p>
              <p className="font-bold">{prediction.robot.temperature_24h[3]?.toFixed(1)}°C</p>
              <div className="flex items-center justify-center mt-1">
                {prediction.robot.temperature_24h[3] > (robotData?.temperature || 0) ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-blue-500" />
                )}
              </div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Kelembaban (4h)</p>
              <p className="font-bold">{prediction.robot.humidity_24h[3]?.toFixed(1)}%</p>
              <div className="flex items-center justify-center mt-1">
                {prediction.robot.humidity_24h[3] > (robotData?.humidity || 0) ? (
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold">
              <BarChart3 className="h-4 w-4" />
              Rekomendasi AI
            </h4>
            <ul className="space-y-2">
              {prediction.aiInsights.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center">
            <Button onClick={generatePrediction} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Perbarui Prediksi
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Plants prediction view
  const plantChartData = prediction.plants.timestamps.map((time, index) => ({
    time,
    'Tanaman A': prediction.plants.plantA_24h[index],
    'Tanaman B': prediction.plants.plantB_24h[index]
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-green-600" />
          Prediksi Kelembaban Tanaman AI (4 Jam Ke Depan)
          <Badge variant={getRiskBadgeVariant(prediction.aiInsights.riskLevel)} className="ml-2">
            {getRiskIcon(prediction.aiInsights.riskLevel)}
            <span className="ml-1 capitalize">{prediction.aiInsights.riskLevel} Risk</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Insights */}
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <strong>Analisis AI:</strong> {prediction.aiInsights.plantCare}
          </AlertDescription>
        </Alert>

        {/* Prediction Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={plantChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                label={{ value: 'Kelembaban (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Tanaman A" 
                stroke="#22c55e" 
                strokeWidth={3}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="Tanaman B" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Predictions Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
            <h4 className="font-semibold mb-2">Tanaman A (4 jam)</h4>
            <p className="text-2xl font-bold text-green-600">
              {prediction.plants.plantA_24h[3]?.toFixed(1)}%
            </p>
            <div className="flex items-center justify-center mt-2">
              {prediction.plants.plantA_24h[3] > (plantData?.plantA || 0) ? (
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">Meningkat</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span className="text-sm">Menurun</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-center p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <h4 className="font-semibold mb-2">Tanaman B (4 jam)</h4>
            <p className="text-2xl font-bold text-blue-600">
              {prediction.plants.plantB_24h[3]?.toFixed(1)}%
            </p>
            <div className="flex items-center justify-center mt-2">
              {prediction.plants.plantB_24h[3] > (plantData?.plantB || 0) ? (
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">Meningkat</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span className="text-sm">Menurun</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-semibold">
            <BarChart3 className="h-4 w-4" />
            Rekomendasi AI
          </h4>
          <ul className="space-y-2">
            {prediction.aiInsights.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center">
          <Button onClick={generatePrediction} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Perbarui Prediksi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}