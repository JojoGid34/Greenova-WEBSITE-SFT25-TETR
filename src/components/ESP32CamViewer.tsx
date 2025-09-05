import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Camera,
  Video,
  Download,
  RefreshCw,
  Play,
  Pause,
  Square,
  Maximize2,
  Settings,
  Eye,
  Brain,
  Zap
} from 'lucide-react';
import { Robot } from '../data/robotData';

interface ESP32CamViewerProps {
  robot: Robot;
}

export function ESP32CamViewer({ robot }: ESP32CamViewerProps) {
  const [isLiveView, setIsLiveView] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      if (isLiveView && robot.camera.isActive) {
        setLastUpdate(new Date());
      }
    }, 5000); // Update every 5 seconds in live view

    return () => clearInterval(interval);
  }, [isLiveView, robot.camera.isActive]);

  const handleToggleLiveView = () => {
    setIsLiveView(!isLiveView);
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadgeVariant = (confidence: number): "default" | "secondary" | "destructive" | "outline" => {
    if (confidence >= 90) return 'default';
    if (confidence >= 75) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Camera Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              ESP32-CAM Live Feed
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={robot.camera.isActive ? 'default' : 'destructive'}>
                {robot.camera.isActive ? 'Online' : 'Offline'}
              </Badge>
              <Badge variant="outline">
                {robot.camera.resolution}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Camera Display */}
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              {robot.camera.isActive ? (
                <div className="relative w-full h-full">
                  <ImageWithFallback
                    src={robot.camera.imageUrl || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop"}
                    alt={`${robot.name} Camera Feed`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Live indicator */}
                  {isLiveView && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </div>
                  )}
                  
                  {/* Recording indicator */}
                  {isRecording && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      REC
                    </div>
                  )}
                  
                  {/* AI Detection Overlay */}
                  {robot.aiModel.isLoaded && robot.aiModel.detectedObjects.length > 0 && (
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4" />
                        <span className="text-sm font-medium">AI Detection</span>
                      </div>
                      <div className="space-y-1">
                        {robot.aiModel.detectedObjects.slice(0, 3).map((object, index) => (
                          <div key={index} className="text-xs text-green-400">
                            • {object}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Zoom controls */}
                  <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    <Button size="icon" variant="outline" className="bg-white/90 hover:bg-white">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Camera className="h-12 w-12 mb-4" />
                  <p className="text-lg font-medium">Camera Offline</p>
                  <p className="text-sm">ESP32-CAM tidak aktif</p>
                </div>
              )}
            </div>
            
            {/* Camera Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant={isLiveView ? "default" : "outline"}
                  size="sm"
                  onClick={handleToggleLiveView}
                  disabled={!robot.camera.isActive}
                >
                  {isLiveView ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isLiveView ? 'Stop Live' : 'Start Live'}
                </Button>
                
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={handleToggleRecording}
                  disabled={!robot.camera.isActive}
                >
                  {isRecording ? <Square className="h-4 w-4 mr-2" /> : <Video className="h-4 w-4 mr-2" />}
                  {isRecording ? 'Stop Rec' : 'Record'}
                </Button>
                
                <Button variant="outline" size="sm" disabled={!robot.camera.isActive}>
                  <Download className="h-4 w-4 mr-2" />
                  Capture
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Last: {new Date(robot.camera.lastCapture).toLocaleTimeString('id-ID')}
                </span>
                <Button variant="ghost" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Model Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Teachable Machine AI Model
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Model Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${robot.aiModel.isLoaded ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">Model Status</span>
              </div>
              <Badge variant={robot.aiModel.isLoaded ? 'default' : 'destructive'}>
                {robot.aiModel.isLoaded ? 'Loaded' : 'Not Loaded'}
              </Badge>
            </div>
            
            {/* Model Version */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Version</span>
              <span className="text-sm font-mono">{robot.aiModel.modelVersion}</span>
            </div>
            
            {/* Confidence Score */}
            {robot.aiModel.isLoaded && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Confidence Score</span>
                  <Badge variant={getConfidenceBadgeVariant(robot.aiModel.confidence)}>
                    <span className={getConfidenceColor(robot.aiModel.confidence)}>
                      {robot.aiModel.confidence.toFixed(1)}%
                    </span>
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      robot.aiModel.confidence >= 90 ? 'bg-green-500' :
                      robot.aiModel.confidence >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${robot.aiModel.confidence}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Last Inference */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Inference</span>
              <span className="text-sm">
                {new Date(robot.aiModel.lastInference).toLocaleTimeString('id-ID')}
              </span>
            </div>
            
            {/* Detected Objects */}
            {robot.aiModel.detectedObjects.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Detected Objects
                </h4>
                <div className="flex flex-wrap gap-2">
                  {robot.aiModel.detectedObjects.map((object, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {object}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* AI Actions */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" disabled={!robot.aiModel.isLoaded}>
                <Zap className="h-4 w-4 mr-2" />
                Run Inference
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Model
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}