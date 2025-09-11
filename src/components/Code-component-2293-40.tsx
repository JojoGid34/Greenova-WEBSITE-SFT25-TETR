import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Globe,
  Navigation,
  Save,
  RotateCcw,
  Info
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country: string;
  isManual: boolean;
}

export function LocationSettings() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [manualAddress, setManualAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGeolocation, setHasGeolocation] = useState(true);

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('greenova-location');
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
      } catch (e) {
        console.error('Error parsing saved location:', e);
      }
    }
  }, []);

  // Check geolocation support
  useEffect(() => {
    setHasGeolocation('geolocation' in navigator);
  }, []);

  const saveLocation = (locationData: LocationData) => {
    localStorage.setItem('greenova-location', JSON.stringify(locationData));
    setLocation(locationData);
    toast.success('Lokasi berhasil disimpan!');
  };

  const getCurrentLocation = async () => {
    if (!hasGeolocation) {
      setError('Geolocation tidak didukung di browser ini');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Mock reverse geocoding (in real app, you'd use a geocoding service)
      const locationData: LocationData = {
        address: `Koordinat: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        latitude,
        longitude,
        city: 'Kota Otomatis',
        region: 'Provinsi Otomatis',
        country: 'Indonesia',
        isManual: false
      };

      saveLocation(locationData);
    } catch (error: any) {
      let errorMessage = 'Gagal mendapatkan lokasi';
      
      if (error.code === 1) {
        errorMessage = 'Akses lokasi ditolak. Silakan aktifkan izin lokasi.';
      } else if (error.code === 2) {
        errorMessage = 'Lokasi tidak tersedia.';
      } else if (error.code === 3) {
        errorMessage = 'Timeout saat mendapatkan lokasi.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const setManualLocation = () => {
    if (!manualAddress.trim()) {
      toast.error('Masukkan alamat terlebih dahulu');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate geocoding delay
    setTimeout(() => {
      // Mock geocoding result (in real app, you'd use a geocoding service)
      const locationData: LocationData = {
        address: manualAddress.trim(),
        latitude: -6.2088 + (Math.random() - 0.5) * 0.1, // Jakarta area with some variation
        longitude: 106.8456 + (Math.random() - 0.5) * 0.1,
        city: 'Jakarta',
        region: 'DKI Jakarta',
        country: 'Indonesia',
        isManual: true
      };

      saveLocation(locationData);
      setManualAddress('');
      setIsLoading(false);
    }, 1500);
  };

  const resetLocation = () => {
    localStorage.removeItem('greenova-location');
    setLocation(null);
    setManualAddress('');
    setError(null);
    toast.success('Lokasi telah direset');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <MapPin className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Pengaturan Lokasi</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Atur lokasi Anda untuk mendapatkan data monitoring yang akurat dari robot GREENOVA
        </p>
      </div>

      {/* Current Location */}
      {location && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <CheckCircle className="h-5 w-5" />
              Lokasi Saat Ini
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Alamat</Label>
                <p className="text-sm text-muted-foreground mt-1">{location.address}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Koordinat</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Kota/Wilayah</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {location.city}, {location.region}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Sumber</Label>
                <Badge variant={location.isManual ? "secondary" : "default"}>
                  {location.isManual ? "Manual" : "GPS"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert className="border-destructive/20 bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Location Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Automatic Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-blue-600" />
              Lokasi Otomatis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gunakan GPS untuk mendapatkan lokasi Anda secara otomatis
            </p>
            
            {!hasGeolocation && (
              <Alert className="border-warning/20 bg-warning/5">
                <Info className="h-4 w-4 text-warning" />
                <AlertDescription className="text-warning">
                  Browser Anda tidak mendukung geolocation
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={getCurrentLocation}
              disabled={isLoading || !hasGeolocation}
              className="w-full"
            >
              <Globe className="h-4 w-4 mr-2" />
              {isLoading ? 'Mendapatkan Lokasi...' : 'Gunakan Lokasi Saat Ini'}
            </Button>
          </CardContent>
        </Card>

        {/* Manual Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-green-600" />
              Lokasi Manual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Masukkan alamat atau lokasi secara manual
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="manual-address">Alamat</Label>
              <Input
                id="manual-address"
                placeholder="Contoh: Jl. Sudirman No. 1, Jakarta"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setManualLocation();
                  }
                }}
              />
            </div>

            <Button 
              onClick={setManualLocation}
              disabled={isLoading || !manualAddress.trim()}
              className="w-full"
              variant="outline"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {isLoading ? 'Menyimpan...' : 'Atur Lokasi Manual'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Information */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium text-blue-900 dark:text-blue-100">
                Mengapa Perlu Mengatur Lokasi?
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                <li>• Data monitoring yang lebih akurat sesuai wilayah Anda</li>
                <li>• Rekomendasi AI yang disesuaikan dengan kondisi lingkungan lokal</li>
                <li>• Analisis kualitas udara yang spesifik untuk area Anda</li>
                <li>• Peta dan visualisasi data yang relevan</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset Button */}
      {location && (
        <div className="text-center">
          <Button 
            onClick={resetLocation}
            variant="outline"
            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Lokasi
          </Button>
        </div>
      )}
    </div>
  );
}