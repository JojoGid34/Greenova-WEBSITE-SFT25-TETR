import React from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  CheckCircle, 
  AlertTriangle, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  Info
} from 'lucide-react';

interface FirebaseStatusProps {
  isConnected: boolean;
  error?: string | null;
  lastUpdate?: Date;
  onRetry?: () => void;
}

export function FirebaseStatus({ isConnected, error, lastUpdate, onRetry }: FirebaseStatusProps) {
  const getStatusInfo = () => {
    if (isConnected) {
      return {
        icon: <CheckCircle className="h-4 w-4" />,
        status: 'Connected',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else {
      return {
        icon: <AlertTriangle className="h-4 w-4" />,
        status: error || 'Disconnected',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Alert className={`${statusInfo.bgColor} ${statusInfo.borderColor} border`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isConnected ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-yellow-600" />
          )}
          <div>
            <AlertDescription className={`${statusInfo.color} font-medium`}>
              Firebase Database: {statusInfo.status}
            </AlertDescription>
            {lastUpdate && (
              <p className="text-xs text-muted-foreground mt-1">
                Last update: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
            {!isConnected && (
              <div className="text-xs text-muted-foreground mt-1">
                <p>Using demo data - Configure firebase-config.js for real-time data</p>
                <p className="mt-1">
                  Expected database structure: /robot/{'{aqi_lokal, debu, gas, jarak, kelembaban, suhu, terakhir_update}'}, /taman/{'{A: {...}, B: {...}}'}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? 'Real-time' : 'Demo Mode'}
          </Badge>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-3 w-3 mr-1" />
              {isConnected ? 'Refresh' : 'Retry'}
            </Button>
          )}
        </div>
      </div>
    </Alert>
  );
}