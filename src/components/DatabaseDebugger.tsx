import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { 
  Database, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Info,
  Eye,
  EyeOff
} from 'lucide-react';
import { testDatabaseConnection } from '../services/firebase';

export function DatabaseDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runConnectionTest = async () => {
    setIsLoading(true);
    try {
      const result = await testDatabaseConnection();
      setTestResult(result);
      console.log('Database test result:', result);
    } catch (error) {
      setTestResult({
        success: false,
        message: `Test error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        <Database className="h-4 w-4 mr-2" />
        Debug DB
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-y-auto">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Database Debugger
          </span>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
            <EyeOff className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runConnectionTest} 
          disabled={isLoading}
          size="sm"
          className="w-full"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Database className="h-4 w-4 mr-2" />
          )}
          Test Connection
        </Button>

        {testResult && (
          <Alert className={testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <div className="flex items-start gap-2">
              {testResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <AlertDescription className="text-sm">
                  <div className="font-medium mb-2">
                    {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                  </div>
                  <div className="text-xs">
                    {testResult.message}
                  </div>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        {testResult?.data && (
          <div className="space-y-2">
            <div className="text-xs font-medium">Database Structure:</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs">Robot Data:</span>
                <Badge variant={testResult.data.hasRobot ? "default" : "secondary"} className="text-xs">
                  {testResult.data.hasRobot ? 'Found' : 'Missing'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Taman Data:</span>
                <Badge variant={testResult.data.hasTaman ? "default" : "secondary"} className="text-xs">
                  {testResult.data.hasTaman ? 'Found' : 'Missing'}
                </Badge>
              </div>
            </div>
            
            {testResult.data.allKeys && (
              <div className="mt-2">
                <div className="text-xs font-medium mb-1">Available Keys:</div>
                <div className="text-xs text-muted-foreground">
                  {testResult.data.allKeys.join(', ')}
                </div>
              </div>
            )}

            {testResult.data.robotData && (
              <div className="mt-2">
                <div className="text-xs font-medium mb-1">Robot Data Sample:</div>
                <div className="text-xs text-muted-foreground bg-muted p-2 rounded max-h-32 overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(testResult.data.robotData, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {testResult.data.tamanData && (
              <div className="mt-2">
                <div className="text-xs font-medium mb-1">Taman Data Sample:</div>
                <div className="text-xs text-muted-foreground bg-muted p-2 rounded max-h-32 overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(testResult.data.tamanData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-1 mb-1">
            <Info className="h-3 w-3" />
            Expected Structure:
          </div>
          <div className="text-xs font-mono bg-muted p-2 rounded">
            /robot: {'{'}<br />
            &nbsp;&nbsp;aqi_lokal, debu, gas,<br />
            &nbsp;&nbsp;jarak, kelembaban, suhu,<br />
            &nbsp;&nbsp;terakhir_update<br />
            {'}'}<br />
            /taman: {'{'}<br />
            &nbsp;&nbsp;A: {'{'}, B: {'{}'}
            <br />
            {'}'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}