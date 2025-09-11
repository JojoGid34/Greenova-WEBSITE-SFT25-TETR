// Firebase Configuration
// You can replace this with your actual Firebase project configuration

// To use your own Firebase project:
// 1. Go to Firebase Console (https://console.firebase.google.com/)
// 2. Create a new project or select existing project
// 3. Go to Project Settings > General
// 4. Scroll down to "Your apps" section
// 5. Click "Add app" and select Web (</>) 
// 6. Copy the configuration object and replace the config below

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyCjGcz4kBFwmFlv_1qeSHMp93EqhNt9fvM",
  authDomain: "greenova-app.firebaseapp.com",
  databaseURL: "https://greenova-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "greenova-app",
  storageBucket: "greenova-app.firebasestorage.app",
  messagingSenderId: "883705279570",
  appId: "1:883705279570:web:78610b1820a2688fd91b8b"
};

// Example configuration for GREENOVA project:
/*
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBpKD4yyBxcwCcaEQKs-XaJ5Rk_g8r6KGw",
  authDomain: "iot-monitoring-greenova.firebaseapp.com",
  databaseURL: "https://iot-monitoring-greenova-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot-monitoring-greenova", 
  storageBucket: "iot-monitoring-greenova.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012"
};
*/

console.log('Firebase configuration loaded');