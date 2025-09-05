// Utility functions for displaying data with N/A fallbacks

export const formatValue = (value: any, defaultValue: string = 'N/A'): string => {
  if (value === null || value === undefined || value === '' || 
      (typeof value === 'number' && isNaN(value))) {
    return defaultValue;
  }
  return String(value);
};

export const formatNumber = (value: number | null | undefined, decimals: number = 1, unit: string = ''): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return `${value.toFixed(decimals)}${unit}`;
};

export const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return `${Math.round(value)}%`;
};

export const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) {
    return 'N/A';
  }
  
  try {
    let date: Date;
    
    if (timestamp.seconds) {
      // Firebase Timestamp
      date = new Date(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else {
      return 'N/A';
    }
    
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta'
    });
  } catch (error) {
    console.warn('Error formatting timestamp:', error);
    return 'N/A';
  }
};

export const formatTimeAgo = (timestamp: any): string => {
  if (!timestamp) {
    return 'N/A';
  }
  
  try {
    let date: Date;
    
    if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }
    
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Baru saja';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} menit lalu`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} jam lalu`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} hari lalu`;
    }
  } catch (error) {
    console.warn('Error formatting time ago:', error);
    return 'N/A';
  }
};

export const formatLocation = (location: { latitude?: number; longitude?: number } | null | undefined): string => {
  if (!location || location.latitude === undefined || location.longitude === undefined ||
      isNaN(location.latitude) || isNaN(location.longitude)) {
    return 'N/A';
  }
  
  return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
};

export const formatSignalStrength = (strength: number | null | undefined): string => {
  if (strength === null || strength === undefined || isNaN(strength)) {
    return 'N/A';
  }
  
  if (strength >= 80) return 'Sangat Baik';
  if (strength >= 60) return 'Baik';
  if (strength >= 40) return 'Sedang';
  if (strength >= 20) return 'Lemah';
  return 'Sangat Lemah';
};

export const formatBatteryLevel = (battery: number | null | undefined): string => {
  if (battery === null || battery === undefined || isNaN(battery)) {
    return 'N/A';
  }
  
  return `${Math.round(battery)}%`;
};

export const formatAirQualityStatus = (status: string | null | undefined): string => {
  if (!status || status.trim() === '') {
    return 'N/A';
  }
  return status;
};

export const formatPlantCondition = (condition: string | null | undefined): string => {
  if (!condition || condition.trim() === '') {
    return 'N/A';
  }
  return condition;
};

export const getStatusColor = (value: any, type: 'battery' | 'signal' | 'air_quality' | 'plant_condition' = 'battery'): string => {
  if (value === null || value === undefined || value === 'N/A') {
    return 'text-muted-foreground';
  }
  
  switch (type) {
    case 'battery':
      if (typeof value === 'number') {
        if (value >= 80) return 'text-success';
        if (value >= 50) return 'text-warning';
        return 'text-destructive';
      }
      break;
      
    case 'signal':
      if (typeof value === 'number') {
        if (value >= 80) return 'text-success';
        if (value >= 60) return 'text-success';
        if (value >= 40) return 'text-warning';
        return 'text-destructive';
      }
      break;
      
    case 'air_quality':
      if (typeof value === 'string') {
        const status = value.toLowerCase();
        if (status.includes('baik')) return 'text-success';
        if (status.includes('sedang')) return 'text-warning';
        if (status.includes('buruk')) return 'text-destructive';
      }
      break;
      
    case 'plant_condition':
      if (typeof value === 'string') {
        const condition = value.toLowerCase();
        if (condition.includes('sehat') || condition.includes('baik')) return 'text-success';
        if (condition.includes('sedang')) return 'text-warning';
        if (condition.includes('buruk') || condition.includes('kritis')) return 'text-destructive';
      }
      break;
  }
  
  return 'text-foreground';
};