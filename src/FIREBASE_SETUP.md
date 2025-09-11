# Firebase Realtime Database Setup Guide

## Quick Start

The GREENOVA dashboard application uses Firebase Realtime Database for real-time IoT data monitoring. By default, it runs with demo data, but you can connect it to your own Firebase project.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select existing project
3. Follow the setup wizard
4. Enable Firebase Realtime Database:
   - Go to "Realtime Database" in left sidebar
   - Click "Create database"
   - Choose your security rules (start in test mode for development)

## Step 2: Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web (`</>`)
4. Register your app with a nickname
5. Copy the configuration object

## Step 3: Configure Application

Open `firebase-config.js` and replace the configuration:

```javascript
window.FIREBASE_CONFIG = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com", 
  databaseURL: "https://your-project-default-rtdb.region.firebasedatabase.app",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Step 4: Database Structure

The application expects this structure in your Realtime Database:

```json
{
  "robot": {
    "kelembaban": 65.5,
    "suhu": 28.3,
    "jarak": 15,
    "debu": 25,
    "gas": 0.5,
    "terakhir_update": "10-09-2025 22:12:17",
    "aqi_lokal": 45
  },
  "taman": {
    "A": {
      "kelembaban": 75,
      "kondisi": "Baik",
      "terakhir_siram": "10-09-2025 20:12:15",
      "terakhir_update": "10-09-2025 22:12:17"
    },
    "B": {
      "kelembaban": 68,
      "kondisi": "Baik", 
      "terakhir_update": "10-09-2025 22:12:17"
    }
  }
}
```

### Data Fields Explanation:

**Robot Data:**
- `kelembaban`: Air humidity (%)
- `suhu`: Temperature (°C)
- `jarak`: Distance sensor reading (cm)
- `debu`: PM2.5 dust particles (μg/m³)
- `gas`: Gas concentration (ppm)
- `aqi_lokal`: Local Air Quality Index
- `terakhir_update`: Last update timestamp (DD-MM-YYYY HH:MM:SS)

**Plant Data (Taman A & B):**
- `kelembaban`: Soil moisture (%)
- `kondisi`: Plant condition ("Baik", "Sedang", "Buruk")
- `terakhir_siram`: Last watering time (optional)
- `terakhir_update`: Last sensor update

## Step 5: Security Rules (Development)

For development, you can use these basic rules:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**⚠️ Warning:** These rules allow anyone to read/write your database. Use proper authentication rules in production!

## Step 6: Historical Data (Optional)

For historical charts, you can also store data in this structure:

```json
{
  "history": {
    "robot": {
      "2025-09-10T22:12:17.000Z": {
        "kelembaban": 65.5,
        "suhu": 28.3,
        // ... other robot data
      }
    },
    "taman": {
      "2025-09-10T22:12:17.000Z": {
        "A": { /* plant A data */ },
        "B": { /* plant B data */ }
      }
    }
  }
}
```

## Troubleshooting

### Built-in Debug Tools

The application includes several debugging tools to help diagnose Firebase connection issues:

1. **Firebase Status Indicator**: Shows connection status in dashboard pages
2. **Database Debugger**: Click "Debug DB" button (bottom-right) to test connection and view database structure
3. **Console Logging**: Detailed logs in browser developer tools

### Firebase Connection Issues

1. **Check Console**: Open browser developer tools (F12) and check for error messages
2. **Use Debug Tool**: Click the "Debug DB" button to test your connection
3. **Verify URL**: Ensure `databaseURL` matches your region:
   - US Central: `firebaseio.com`
   - Other regions: `firebasedatabase.app` with region prefix
4. **Security Rules**: Make sure your database rules allow read access
5. **Network**: Check if your network/firewall blocks Firebase connections

### Demo Mode

If Firebase connection fails, the application will automatically fall back to demo mode with mock data. You'll see:
- Status indicator showing "Demo Mode" instead of "Real-time"
- Yellow warning in Firebase Status card
- Console messages indicating fallback data is being used

### Database Structure Validation

Use the Database Debugger to check:
- ✅ **Robot Data Found**: /robot path exists with required fields
- ✅ **Taman Data Found**: /taman path exists with A and B plants
- ❌ **Missing Data**: Shows which paths are missing

### Common Errors

1. **"Database not initialized"**: Wrong Firebase config in `firebase-config.js`
2. **"Permission denied"**: Check your security rules allow read access
3. **"Network error"**: Check internet connection and firewall settings
4. **"No robot/taman data found"**: Database structure doesn't match expected format

### Step-by-Step Debugging

1. Open application in browser
2. Click "Debug DB" button (bottom-right corner)
3. Click "Test Connection" button
4. Review the test results:
   - **Green ✅**: Connection successful, data found
   - **Red ❌**: Connection failed, check configuration
   - **Data structure**: Shows what data is available in your database

### Console Log Messages

Look for these messages in browser console (F12):
- 🚀 `Connecting to Firebase Realtime Database...`
- ✅ `Robot data received from Firebase:` (success)
- ⚠️ `No robot data received, using fallback` (missing data)
- ❌ `Error subscribing to robot data:` (connection failed)

## ESP32 Integration

To send data from ESP32 to Firebase:

```cpp
#include <WiFi.h>
#include <FirebaseESP32.h>

// Firebase config
#define FIREBASE_HOST "your-project-default-rtdb.region.firebasedatabase.app"
#define FIREBASE_AUTH "your-database-secret-or-token"

// Send robot data
Firebase.setFloat("robot/suhu", temperatureValue);
Firebase.setFloat("robot/kelembaban", humidityValue);
Firebase.setInt("robot/debu", pm25Value);
Firebase.setString("robot/terakhir_update", getCurrentTimestamp());

// Send plant data  
Firebase.setFloat("taman/A/kelembaban", soilMoistureA);
Firebase.setString("taman/A/kondisi", getPlantCondition(soilMoistureA));
```

## Production Deployment

1. **Use Environment Variables**: Don't commit real API keys to version control
2. **Implement Authentication**: Use Firebase Auth for user management
3. **Secure Database Rules**: Implement proper read/write permissions
4. **Enable Backup**: Set up automated database backups
5. **Monitor Usage**: Watch Firebase usage quotas and billing

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Firebase configuration matches your project
3. Test database connection from Firebase Console
4. Review security rules and permissions

The application includes a Firebase Status indicator that will show connection status and help diagnose issues.