import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Shield,
  Settings,
  Bot,
  Wifi,
  Power,
  Activity,
  Eye,
  EyeOff,
  LogIn,
  LogOut,
  Users,
  Database,
  Cpu,
  Thermometer,
  Droplets,
  Wind,
  TreePine,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Zap,
  Camera,
  Wrench,
  BarChart3,
  Clock,
  MapPin,
  Info,
  Construction,
  Leaf
} from 'lucide-react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { DatabaseDebugger } from './DatabaseDebugger';

export function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showComingSoon, setShowComingSoon] = useState(false);
  
  // Get real data from Firebase with error handling
  const firebaseData = useFirebaseData();
  const { robotData, tamanData, formatDateTime, loading, error, refreshData } = firebaseData || {
    robotData: null,
    tamanData: null,
    formatDateTime: (date: string) => date,
    loading: false,
    error: null,
    refreshData: () => {}
  };

  // Check if already logged in from localStorage
  useEffect(() => {
    const adminSession = localStorage.getItem('greenova_admin_session');
    if (adminSession === 'logged_in') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication (in production, use proper authentication)
    if (username === 'admin' && password === 'greenova-tetr-2025') {
      setIsLoggedIn(true);
      setLoginError('');
      localStorage.setItem('greenova_admin_session', 'logged_in');
    } else {
      setLoginError('Username atau password salah');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    localStorage.removeItem('greenova_admin_session');
  };

  const handleControlAction = () => {
    setShowComingSoon(true);
  };

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Admin Panel GREENOVA</CardTitle>
            <p className="text-muted-foreground">
              Masuk untuk mengakses sistem kontrol robot dan station
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {loginError && (
                <Alert className="border-destructive/50 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full">
                <LogIn className="h-4 w-4 mr-2" />
                Masuk
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Demo Credentials:</h4>
              <p className="text-sm text-muted-foreground">
                Username: <code className="bg-background px-1 rounded">admin</code>
              </p>
              <p className="text-sm text-muted-foreground">
                Password: <code className="bg-background px-1 rounded">greenova2024</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin Panel GREENOVA
          </h1>
          <p className="text-muted-foreground">
            Kontrol dan monitor sistem robot dan station secara real-time
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Robot Status</p>
                <p className="text-2xl font-bold">
                  {robotData ? 'Online' : 'Offline'}
                </p>
                <Badge className={robotData ? 'bg-green-500' : 'bg-red-500'}>
                  {robotData ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </div>
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Station Status</p>
                <p className="text-2xl font-bold">
                  {tamanData ? 'Online' : 'Offline'}
                </p>
                <Badge className={tamanData ? 'bg-green-500' : 'bg-red-500'}>
                  {tamanData ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </div>
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <TreePine className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Database</p>
                <p className="text-2xl font-bold">Connected</p>
                <Badge className="bg-green-500">Firebase Active</Badge>
              </div>
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Tabs */}
      <Tabs defaultValue="robot" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="robot">Robot Control</TabsTrigger>
          <TabsTrigger value="station">Station Control</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
        </TabsList>

        {/* Robot Control Tab */}
        <TabsContent value="robot" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                GREENOVA Robot Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Robot Data */}
              {robotData && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-muted-foreground">Suhu</span>
                    </div>
                    <p className="text-xl font-bold">{robotData.suhu}°C</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground">Kelembaban</span>
                    </div>
                    <p className="text-xl font-bold">{robotData.kelembaban}%</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-muted-foreground">PM2.5</span>
                    </div>
                    <p className="text-xl font-bold">{robotData.debu} μg/m³</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">Gas</span>
                    </div>
                    <p className="text-xl font-bold">{robotData.gas} ppm</p>
                  </div>
                </div>
              )}

              <Separator />

              {/* Robot Control Actions */}
              <div className="space-y-4">
                <h4 className="font-semibold">Actions & Control</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={handleControlAction} className="flex items-center gap-2">
                    <Power className="h-4 w-4" />
                    Restart Robot
                  </Button>
                  <Button onClick={handleControlAction} variant="outline" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Activate Camera
                  </Button>
                  <Button onClick={handleControlAction} variant="outline" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Set Location
                  </Button>
                  <Button onClick={handleControlAction} variant="outline" className="flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    Calibrate Sensors
                  </Button>
                </div>
              </div>

              {/* Robot Settings */}
              <div className="space-y-4">
                <h4 className="font-semibold">Robot Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-monitoring">Auto Monitoring</Label>
                      <Switch id="auto-monitoring" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="data-upload">Data Upload</Label>
                      <Switch id="data-upload" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="alert-system">Alert System</Label>
                      <Switch id="alert-system" defaultChecked />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="interval">Monitoring Interval (minutes)</Label>
                      <Input 
                        id="interval" 
                        type="number" 
                        defaultValue="5" 
                        min="1" 
                        max="60"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Robot Location</Label>
                      <Input 
                        id="location" 
                        placeholder="Enter location name"
                        defaultValue="Outdoor Garden"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Station Control Tab */}
        <TabsContent value="station" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="h-5 w-5" />
                GREENOVA Station Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Station Data */}
              {tamanData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-500" />
                      Plant A
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Kelembaban:</span>
                        <span className="font-bold">{tamanData.A?.kelembaban}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Kondisi:</span>
                        <Badge className={tamanData.A?.kondisi === 'baik' ? 'bg-green-500' : 'bg-yellow-500'}>
                          {tamanData.A?.kondisi}
                        </Badge>
                      </div>
                      <Progress value={tamanData.A?.kelembaban || 0} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-500" />
                      Plant B
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Kelembaban:</span>
                        <span className="font-bold">{tamanData.B?.kelembaban}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Kondisi:</span>
                        <Badge className={tamanData.B?.kondisi === 'baik' ? 'bg-green-500' : 'bg-yellow-500'}>
                          {tamanData.B?.kondisi}
                        </Badge>
                      </div>
                      <Progress value={tamanData.B?.kelembaban || 0} className="h-2" />
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Station Control Actions */}
              <div className="space-y-4">
                <h4 className="font-semibold">Irrigation Control</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={handleControlAction} className="flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    Water Plant A
                  </Button>
                  <Button onClick={handleControlAction} className="flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    Water Plant B
                  </Button>
                  <Button onClick={handleControlAction} variant="outline" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Auto Irrigation ON
                  </Button>
                  <Button onClick={handleControlAction} variant="outline" className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Calibrate Sensors
                  </Button>
                </div>
              </div>

              {/* Station Settings */}
              <div className="space-y-4">
                <h4 className="font-semibold">Station Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-irrigation">Auto Irrigation</Label>
                      <Switch id="auto-irrigation" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="plant-monitoring">Plant Monitoring</Label>
                      <Switch id="plant-monitoring" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="moisture-alerts">Moisture Alerts</Label>
                      <Switch id="moisture-alerts" defaultChecked />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="moisture-threshold">Moisture Threshold (%)</Label>
                      <Input 
                        id="moisture-threshold" 
                        type="number" 
                        defaultValue="30" 
                        min="10" 
                        max="80"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="watering-duration">Watering Duration (seconds)</Label>
                      <Input 
                        id="watering-duration" 
                        type="number" 
                        defaultValue="10" 
                        min="5" 
                        max="60"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Network Settings */}
              <div className="space-y-4">
                <h4 className="font-semibold">Network Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wifi-ssid">WiFi SSID</Label>
                    <Input 
                      id="wifi-ssid" 
                      placeholder="Enter WiFi network name"
                      defaultValue="GREENOVA_Network"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wifi-password">WiFi Password</Label>
                    <Input 
                      id="wifi-password" 
                      type="password" 
                      placeholder="Enter WiFi password"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Database Settings */}
              <div className="space-y-4">
                <h4 className="font-semibold">Database Configuration</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-backup">Auto Backup</Label>
                    <Switch id="auto-backup" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="data-retention">Data Retention (days)</Label>
                    <Input 
                      id="data-retention" 
                      type="number" 
                      defaultValue="30" 
                      min="7" 
                      max="365"
                      className="w-24"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Database Debug Tools */}
              <div className="space-y-4">
                <h4 className="font-semibold">Database Debug Tools</h4>
                <div className="bg-muted/50 rounded-lg p-4">
                  <DatabaseDebugger />
                </div>
              </div>

              <Separator />

              {/* System Actions */}
              <div className="space-y-4">
                <h4 className="font-semibold">System Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={handleControlAction} variant="outline" className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Restart System
                  </Button>
                  <Button onClick={handleControlAction} variant="outline" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Backup Data
                  </Button>
                  <Button onClick={handleControlAction} variant="outline" className="flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    System Diagnostics
                  </Button>
                  <Button onClick={handleControlAction} variant="outline" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Export Logs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Coming Soon Dialog */}
      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Construction className="h-5 w-5 text-yellow-500" />
              Coming Soon - In Production
            </DialogTitle>
            <DialogDescription className="space-y-3">
              <p>
                Fitur kontrol sistem sedang dalam tahap pengembangan dan akan segera tersedia.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Status Pengembangan:</span>
                </div>
                <ul className="text-sm space-y-1 ml-6">
                  <li>• Sistem kontrol robot: 85% selesai</li>
                  <li>• Auto-irrigation control: 90% selesai</li>
                  <li>• Remote sensor calibration: 60% selesai</li>
                  <li>• Real-time system control: 70% selesai</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                Saat ini Anda dapat memantau data secara real-time. Fitur kontrol akan aktif setelah testing selesai.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowComingSoon(false)}>
              Mengerti
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}