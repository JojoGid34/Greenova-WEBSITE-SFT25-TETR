import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  MapPin,
  Navigation,
  Search,
  Filter,
  Bot,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Activity,
  Wifi,
  WifiOff,
  Wrench,
  RefreshCw,
  Maximize2
} from 'lucide-react';
import { ROBOT_DATA, Robot } from '../data/robotData';

export function LiveMap() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);

  const filteredRobots = ROBOT_DATA.filter(robot =>
    robot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    robot.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    robot.location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: Robot['status']) => {
    switch (status) {
      case 'online':
        return <Wifi className="h-3 w-3 text-green-500" />;
      case 'offline':
        return <WifiOff className="h-3 w-3 text-red-500" />;
      case 'maintenance':
        return <Wrench className="h-3 w-3 text-yellow-500" />;
      default:
        return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  const getAQIStatus = (aqi: number) => {
    if (aqi >= 80) return { label: 'Baik', color: 'text-green-600' };
    if (aqi >= 60) return { label: 'Sedang', color: 'text-yellow-600' };
    return { label: 'Buruk', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Peta Robot Live</h1>
          <p className="text-muted-foreground">
            Pantau lokasi dan data sensor robot GREENOVA secara real-time
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari robot atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Robot</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ROBOT_DATA.length}</div>
            <p className="text-xs text-muted-foreground">aktif di lapangan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Robot Online</CardTitle>
            <Wifi className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ROBOT_DATA.filter(r => r.status === 'online').length}</div>
            <p className="text-xs text-muted-foreground">sedang beroperasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata AQI</CardTitle>
            <Wind className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(ROBOT_DATA.reduce((sum, r) => sum + r.sensors.airQuality, 0) / ROBOT_DATA.length)}
            </div>
            <p className="text-xs text-muted-foreground">kualitas udara baik</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Area Coverage</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">wilayah Jakarta</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Peta Interaktif
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              {/* Simulated Map */}
              <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 rounded-lg overflow-hidden">
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}></div>
                
                {/* Roads */}
                <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-400 opacity-50"></div>
                <div className="absolute top-2/3 left-0 right-0 h-1 bg-gray-400 opacity-50"></div>
                <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-gray-400 opacity-50"></div>
                <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-gray-400 opacity-50"></div>
                
                {/* Robot markers */}
                {ROBOT_DATA.map((robot, index) => (
                  <div
                    key={robot.id}
                    className={`absolute w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transform transition-all duration-200 hover:scale-110 shadow-lg ${
                      selectedRobot?.id === robot.id ? 'ring-4 ring-primary ring-opacity-50' : ''
                    }`}
                    style={{
                      left: `${20 + (index * 15)}%`,
                      top: `${30 + (index * 10)}%`,
                      backgroundColor: robot.status === 'online' ? '#22c55e' : 
                                     robot.status === 'maintenance' ? '#f59e0b' : '#ef4444'
                    }}
                    onClick={() => setSelectedRobot(robot)}
                  >
                    <Bot className="h-4 w-4 text-white" />
                    {robot.status === 'online' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                ))}
                
                {/* Region labels */}
                <div className="absolute top-6 left-6 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg">
                  <h4 className="font-medium text-sm">Jakarta Pusat</h4>
                  <p className="text-xs text-muted-foreground">AQI: 85 (Baik)</p>
                </div>
                
                <div className="absolute top-6 right-6 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg">
                  <h4 className="font-medium text-sm">Area Online</h4>
                  <p className="text-xs text-green-500">{ROBOT_DATA.filter(r => r.status === 'online').length} Robot Aktif</p>
                </div>

                {/* Navigation controls */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                  <Button size="icon" variant="outline" className="bg-white/90 hover:bg-white">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="bg-white/90 hover:bg-white">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Robot List & Details */}
        <div className="space-y-6">
          {/* Robot Details */}
          {selectedRobot ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  {selectedRobot.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedRobot.status)}
                  <Badge variant={selectedRobot.status === 'online' ? 'default' : selectedRobot.status === 'maintenance' ? 'secondary' : 'destructive'}>
                    {selectedRobot.status}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Lokasi</p>
                    <p className="text-xs text-muted-foreground">{selectedRobot.location.address}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="text-sm font-medium">{selectedRobot.sensors.temperature}°C</p>
                        <p className="text-xs text-muted-foreground">Suhu</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">{selectedRobot.sensors.humidity}%</p>
                        <p className="text-xs text-muted-foreground">Kelembaban</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">{selectedRobot.sensors.airQuality}</p>
                        <p className="text-xs text-muted-foreground">Kualitas Udara</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      <div>
                        <p className="text-sm font-medium">{selectedRobot.sensors.lightLevel}%</p>
                        <p className="text-xs text-muted-foreground">Cahaya</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">
                  <Navigation className="h-4 w-4 mr-2" />
                  Navigate ke Lokasi
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Klik pada marker robot di peta untuk melihat detail</p>
              </CardContent>
            </Card>
          )}

          {/* Robot List */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Robot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredRobots.map((robot) => (
                  <div
                    key={robot.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                      selectedRobot?.id === robot.id ? 'bg-accent border-primary' : ''
                    }`}
                    onClick={() => setSelectedRobot(robot)}
                  >
                    <div className="relative">
                      <Bot className="h-5 w-5" />
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                        robot.status === 'online' ? 'bg-green-500' :
                        robot.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{robot.name}</p>
                      <p className="text-xs text-muted-foreground">{robot.id}</p>
                      {robot.status === 'online' && (
                        <div className={`text-xs ${getAQIStatus(robot.sensors.airQuality).color}`}>
                          AQI: {robot.sensors.airQuality} ({getAQIStatus(robot.sensors.airQuality).label})
                        </div>
                      )}
                    </div>
                    {getStatusIcon(robot.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}