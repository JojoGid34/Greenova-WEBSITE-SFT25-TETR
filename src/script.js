// GREENOVA AI Dashboard - Main JavaScript File

// Global Application State
const AppState = {
  currentPage: 'home',
  isAuthenticated: false,
  userInfo: null,
  isLoading: true,
  darkMode: false,
  selectedRobotId: '',
  selectedStationId: '',
  airReadings: [],
  robots: [],
  stations: [],
  plantReadings: []
};

// Firebase Configuration (Mock implementation for demo)
const FirebaseService = {
  initialized: false,
  
  async initialize() {
    // Mock Firebase initialization
    console.log('Initializing Firebase...');
    this.initialized = true;
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock data
    AppState.airReadings = this.generateMockAirReadings();
    AppState.robots = this.generateMockRobots();
    AppState.stations = this.generateMockStations();
    AppState.plantReadings = this.generateMockPlantReadings();
    
    if (AppState.robots.length > 0) {
      AppState.selectedRobotId = AppState.robots[0].robot_id;
    }
    if (AppState.stations.length > 0) {
      AppState.selectedStationId = AppState.stations[0].station_id;
    }
    
    AppState.isLoading = false;
    UIManager.hideLoadingScreen();
  },
  
  generateMockAirReadings() {
    const readings = [];
    const now = new Date();
    
    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(now - (i * 30 * 60 * 1000)); // 30 minutes intervals
      readings.push({
        robot_id: 'GRN-001',
        timestamp: { seconds: timestamp.getTime() / 1000 },
        temperature: 25 + Math.random() * 10,
        humidity: 60 + Math.random() * 20,
        dust_pm25: 15 + Math.random() * 35,
        gas_ppm: 300 + Math.random() * 200,
        aq_number: Math.floor(30 + Math.random() * 70),
        aq_status: Math.random() > 0.7 ? 'Sedang' : 'Baik'
      });
    }
    
    return readings.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
  },
  
  generateMockRobots() {
    return [
      {
        robot_id: 'GRN-001',
        name: 'GREENOVA Alpha',
        location: 'Surabaya Timur',
        status: 'online',
        battery: 85,
        last_seen: new Date()
      },
      {
        robot_id: 'GRN-002',
        name: 'GREENOVA Beta',
        location: 'Surabaya Barat',
        status: 'online',
        battery: 92,
        last_seen: new Date()
      }
    ];
  },
  
  generateMockStations() {
    return [
      {
        station_id: 'STA-001',
        name: 'Station Alpha',
        location: 'Central Park',
        status: 'active'
      }
    ];
  },
  
  generateMockPlantReadings() {
    return [
      {
        plant_id: 'PLT-001',
        timestamp: new Date(),
        health_status: 'Sehat',
        moisture_level: 75,
        growth_stage: 'Mature'
      }
    ];
  }
};

// Gemini AI Service (Mock implementation)
const GeminiAIService = {
  async generateResponse(prompt) {
    // Mock AI responses
    const responses = [
      "Berdasarkan data kualitas udara yang Anda berikan, saya merekomendasikan untuk meningkatkan ventilasi ruangan dan mengurangi aktivitas outdoor saat PM2.5 tinggi.",
      "Kualitas udara saat ini menunjukkan level yang perlu perhatian. Pertimbangkan untuk menggunakan air purifier dan memperbanyak tanaman indoor.",
      "Data menunjukkan tren yang positif. Terus pantau kondisi dan pertahankan upaya pembersihan udara di area tersebut.",
      "Untuk meningkatkan kualitas udara, saya sarankan implementasi lebih banyak ruang hijau dan pengurangan emisi kendaraan di area ini."
    ];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
};

// Page Templates
const PageTemplates = {
  home: `
    <div class="space-y-16">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="space-y-6">
          <div class="badge badge-default" style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.216-6.894m0 0L8.35 4.207m5.908 1.042.347-1.97m0 0c-1.457-.362-2.917-.58-4.657-.58"></path>
            </svg>
            Teknologi Lingkungan Bersih & Hijau
          </div>
          
          <h1 class="hero-title">
            Menumbuhkan <span style="background: linear-gradient(to right, var(--primary), var(--secondary)); -webkit-background-clip: text; background-clip: text; color: transparent;">Udara Bersih</span><br>
            di Daerah Anda
          </h1>
          
          <p class="hero-subtitle">
            GREENOVA AI menghadirkan robot pintar yang menggabungkan teknologi AI, IoT, dan computer vision 
            untuk menciptakan lingkungan yang lebih bersih dan sehat melalui pertanian urban yang berkelanjutan.
          </p>
          
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" onclick="navigateToPage('air-quality')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
              </svg>
              Lihat Kualitas Udara Sekitar
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
            <button class="btn btn-outline btn-lg" onclick="window.open('https://www.youtube.com/watch?v=placeholder-video-id', '_blank')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="11" height="10" rx="2" ry="2"></rect>
                <circle cx="12" cy="5" r="2"></circle>
                <path d="M12 7v4M8 21l-2-2M16 21l2-2"></path>
              </svg>
              Demo Robot
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
              </svg>
            </div>
            <div class="stat-number">40%</div>
            <p class="stat-label">Pengurangan Polutan</p>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <div class="stat-number">60%</div>
            <p class="stat-label">Penghematan Air</p>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div class="stat-number" id="plants-monitored">150+</div>
            <p class="stat-label">Tanaman Terpantau</p>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div class="stat-number" id="robots-online">2</div>
            <p class="stat-label">Robot Online</p>
          </div>
        </div>
      </section>

      <!-- Air Quality Real-time Section -->
      <section id="air-quality-real-time" class="space-y-6">
        <div class="card air-quality-card" id="air-quality-card">
          <div class="card-content">
            <div class="grid grid-cols-1" style="grid-template-columns: 1fr auto;">
              <div>
                <div style="display: flex; align-items: flex-start; gap: 1rem;">
                  <div class="stat-icon" style="width: 48px; height: 48px; margin: 0;" id="air-quality-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <div style="flex: 1;">
                    <div>
                      <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;">Kualitas Udara Real-time</h3>
                      <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; color: var(--muted-foreground);">
                        <span id="last-update">Update: --:--</span>
                        <span>•</span>
                        <span>Kota Surabaya</span>
                      </div>
                    </div>
                    
                    <div class="air-quality-data" id="air-quality-data">
                      <div class="data-item">
                        <div class="data-value" id="pm25-value">--</div>
                        <div class="data-label">PM2.5</div>
                      </div>
                      <div class="data-item">
                        <div class="data-value" id="gas-value">--</div>
                        <div class="data-label">Gas</div>
                      </div>
                      <div class="data-item">
                        <div class="data-value" id="temp-value">--</div>
                        <div class="data-label">Suhu</div>
                      </div>
                      <div class="data-item">
                        <div class="data-value" id="humidity-value">--</div>
                        <div class="data-label">Kelembaban</div>
                      </div>
                    </div>

                    <div class="alert alert-info" id="ai-recommendation">
                      <div class="alert-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="3" y="11" width="11" height="10" rx="2" ry="2"></rect>
                          <circle cx="12" cy="5" r="2"></circle>
                          <path d="M12 7v4M8 21l-2-2M16 21l2-2"></path>
                        </svg>
                      </div>
                      <div class="alert-content">
                        <strong>AI GREENOVA Merekomendasikan:</strong>
                        <span id="recommendation-text">Memuat rekomendasi...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="aqi-display">
                <div class="aqi-number" id="aqi-value" style="color: var(--primary);">--</div>
                <div class="aqi-label">AQI</div>
                <div style="margin-top: 1rem;">
                  <div style="font-size: 1.125rem; font-weight: 600;" id="aqi-status">Status</div>
                  <div class="aqi-label">Status</div>
                </div>
              </div>
            </div>

            <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
              <div class="card" style="padding: 1rem; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 3v5h5M3.05 13A9 9 0 1 0 6 5.3L3 8"></path>
                  </svg>
                  <span style="font-weight: 500; font-size: 0.875rem;">Prediksi AQI 1 jam ke depan:</span>
                </div>
                <div>
                  <span style="font-size: 1.125rem; font-weight: 700;" id="predicted-aqi">--</span>
                </div>
              </div>

              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button class="btn btn-primary btn-sm" onclick="navigateToPage('air-quality')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                  Lihat Detail Analisis
                </button>
                <button class="btn btn-outline btn-sm" onclick="openChatModal()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="11" height="10" rx="2" ry="2"></rect>
                    <circle cx="12" cy="5" r="2"></circle>
                    <path d="M12 7v4M8 21l-2-2M16 21l2-2"></path>
                  </svg>
                  Tanya AI untuk Saran
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Important Section -->
      <section class="space-y-8">
        <div class="text-center space-y-4">
          <h2>Why this is important for us?</h2>
          <p style="color: var(--muted-foreground); max-width: 600px; margin: 0 auto;">
            Indonesia menghadapi tantangan lingkungan yang serius. Teknologi GREENOVA AI hadir sebagai solusi inovatif 
            untuk menciptakan masa depan yang lebih berkelanjutan.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-8">
          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div class="stat-icon" style="background: var(--destructive); margin: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                  </svg>
                </div>
                <div>
                  <h3 style="margin-bottom: 0.5rem;">Polusi Udara Meningkat</h3>
                  <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                    Kualitas udara di kota-kota besar Indonesia semakin memburuk akibat emisi kendaraan dan industri. 
                    PM2.5 mencapai level berbahaya bagi kesehatan.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div class="stat-icon" style="background: var(--destructive); margin: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div>
                  <h3 style="margin-bottom: 0.5rem;">Ruang Hijau Berkurang</h3>
                  <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                    Urbanisasi yang cepat mengurangi ruang hijau kota. Kita perlu solusi cerdas untuk menciptakan 
                    oasis hijau di tengah kota.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div class="stat-icon" style="background: var(--destructive); margin: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <h3 style="margin-bottom: 0.5rem;">Konsumsi Air Berlebihan</h3>
                  <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                    Sistem irigasi konvensional membuang 40% air. Teknologi pintar dapat mengoptimalkan 
                    penggunaan air untuk pertanian urban.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div class="stat-icon" style="background: var(--destructive); margin: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div>
                  <h3 style="margin-bottom: 0.5rem;">Kurangnya Monitoring Real-time</h3>
                  <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                    Pemantauan lingkungan masih manual dan tidak real-time, sehingga sulit mengambil 
                    tindakan pencegahan yang tepat waktu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,

  'air-quality': `
    <div class="space-y-6">
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <h1>Analisis Kualitas Udara</h1>
          <p style="color: var(--muted-foreground);">
            Monitoring real-time dan analisis tren kualitas udara
          </p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-outline btn-sm" onclick="location.reload()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M3 21v-5h5"></path>
            </svg>
            Refresh
          </button>
          <button class="btn btn-outline btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7,10 12,15 17,10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export
          </button>
        </div>
      </div>

      <!-- Current Status Cards -->
      <div class="grid grid-cols-3 gap-6">
        <div class="card">
          <div class="card-content">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>
                <p style="color: var(--muted-foreground); margin-bottom: 0.5rem;">Air Quality Index</p>
                <p style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.75rem;" id="current-aqi">--</p>
                <div class="badge badge-default" id="aqi-status-badge">Status</div>
              </div>
              <div class="stat-icon" id="aqi-status-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
              </div>
            </div>
            <div style="margin-top: 1rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v5h5M3.05 13A9 9 0 1 0 6 5.3L3 8"></path>
              </svg>
              <span id="aqi-trend">+0% dari kemarin</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-content">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>
                <p style="color: var(--muted-foreground); margin-bottom: 0.5rem;">PM2.5</p>
                <p style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.75rem;" id="current-pm25">--</p>
                <div class="badge badge-default" id="pm25-status-badge">Status</div>
              </div>
              <div class="stat-icon" id="pm25-status-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 12h8"></path>
                </svg>
              </div>
            </div>
            <div style="margin-top: 1rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v5h5M3.05 13A9 9 0 1 0 6 5.3L3 8"></path>
              </svg>
              <span id="pm25-trend">+0% dari kemarin</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-content">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>
                <p style="color: var(--muted-foreground); margin-bottom: 0.5rem;">Gas PPM</p>
                <p style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.75rem;" id="current-gas">--</p>
                <div class="badge badge-default" id="gas-status-badge">Status</div>
              </div>
              <div class="stat-icon" id="gas-status-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                </svg>
              </div>
            </div>
            <div style="margin-top: 1rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v5h5M3.05 13A9 9 0 1 0 6 5.3L3 8"></path>
              </svg>
              <span id="gas-trend">+0% dari kemarin</span>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Recommendations -->
      <div class="card">
        <div class="card-content">
          <div style="display: flex; align-items: flex-start; gap: 1rem;">
            <div class="stat-icon" style="background: var(--primary); margin: 0;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="11" height="10" rx="2" ry="2"></rect>
                <circle cx="12" cy="5" r="2"></circle>
                <path d="M12 7v4M8 21l-2-2M16 21l2-2"></path>
              </svg>
            </div>
            <div>
              <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Rekomendasi AI GREENOVA</h3>
              <p style="color: var(--muted-foreground);" id="detailed-recommendation">
                Memuat rekomendasi berdasarkan data kualitas udara terkini...
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="space-y-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Grafik 24 Jam Terakhir</h3>
          </div>
          <div class="card-content">
            <div class="chart-container">
              <canvas id="hourly-chart"></canvas>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Tren 7 Hari</h3>
          </div>
          <div class="card-content">
            <div class="chart-container">
              <canvas id="daily-chart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Historical Data Table -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Data Historis (20 Terbaru)</h3>
        </div>
        <div class="card-content">
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>AQI</th>
                  <th>PM2.5</th>
                  <th>Gas PPM</th>
                  <th>Suhu</th>
                  <th>Kelembaban</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="historical-data-table">
                <tr>
                  <td colspan="7" style="text-align: center; padding: 2rem;">Memuat data...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,

  about: `
    <div class="space-y-12">
      <!-- Hero Section -->
      <section class="text-center space-y-6">
        <h1>Tentang GREENOVA AI</h1>
        <p style="font-size: 1.25rem; color: var(--muted-foreground); max-width: 800px; margin: 0 auto;">
          Kami adalah tim inovator yang berdedikasi untuk menciptakan solusi teknologi hijau yang berkelanjutan 
          untuk masa depan yang lebih bersih dan sehat.
        </p>
      </section>

      <!-- Mission & Vision -->
      <section class="grid grid-cols-2 gap-8">
        <div class="card">
          <div class="card-content text-center">
            <div class="stat-icon" style="margin: 0 auto 1.5rem;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h3 style="margin-bottom: 1rem;">Misi Kami</h3>
            <p style="color: var(--muted-foreground);">
              Mengembangkan teknologi AI dan IoT untuk menciptakan sistem monitoring lingkungan yang cerdas, 
              efektif, dan dapat diakses oleh semua kalangan untuk mendukung kehidupan yang berkelanjutan.
            </p>
          </div>
        </div>

        <div class="card">
          <div class="card-content text-center">
            <div class="stat-icon" style="margin: 0 auto 1.5rem;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <h3 style="margin-bottom: 1rem;">Visi Kami</h3>
            <p style="color: var(--muted-foreground);">
              Menjadi pelopor dalam teknologi lingkungan cerdas di Indonesia dan berkontribusi untuk menciptakan 
              kota-kota hijau yang berkelanjutan dengan kualitas udara yang sehat untuk semua.
            </p>
          </div>
        </div>
      </section>

      <!-- Team Section -->
      <section class="space-y-8">
        <div class="text-center">
          <h2>Tim GREENOVA AI</h2>
          <p style="color: var(--muted-foreground); max-width: 600px; margin: 0 auto;">
            Bertemu dengan tim ahli yang berdedikasi untuk mengembangkan solusi teknologi hijau inovatif.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-8">
          <div class="team-member-card">
            <div class="member-avatar">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="member-name">Dr. Ahmad Santoso</div>
            <div class="member-role">Lead AI Engineer</div>
            <p class="member-bio">
              Spesialis dalam machine learning dan computer vision dengan pengalaman 10+ tahun 
              dalam pengembangan sistem AI untuk monitoring lingkungan.
            </p>
          </div>

          <div class="team-member-card">
            <div class="member-avatar">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="member-name">Sari Wijaya, M.Eng</div>
            <div class="member-role">IoT Systems Architect</div>
            <p class="member-bio">
              Ahli dalam desain dan implementasi sistem IoT untuk aplikasi industri dan lingkungan. 
              Berpengalaman dalam integrasi sensor dan komunikasi wireless.
            </p>
          </div>

          <div class="team-member-card">
            <div class="member-avatar">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="member-name">Budi Pratama</div>
            <div class="member-role">Environmental Scientist</div>
            <p class="member-bio">
              Peneliti lingkungan dengan fokus pada kualitas udara dan dampak polusi. 
              Membantu merancang algoritma untuk interpretasi data lingkungan.
            </p>
          </div>

          <div class="team-member-card">
            <div class="member-avatar">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="member-name">Lisa Chen</div>
            <div class="member-role">UX/UI Designer</div>
            <p class="member-bio">
              Desainer berpengalaman dalam menciptakan interface yang intuitif dan user-friendly 
              untuk aplikasi teknologi kompleks.
            </p>
          </div>

          <div class="team-member-card">
            <div class="member-avatar">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="member-name">Reza Firmansyah</div>
            <div class="member-role">Hardware Engineer</div>
            <p class="member-bio">
              Spesialis dalam pengembangan hardware robot dan sistem embedded. 
              Bertanggung jawab atas desain fisik robot GREENOVA.
            </p>
          </div>

          <div class="team-member-card">
            <div class="member-avatar">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="member-name">Maya Sari</div>
            <div class="member-role">Data Scientist</div>
            <p class="member-bio">
              Ahli analisis data dengan keahlian dalam pengolahan big data dan prediksi berbasis AI 
              untuk aplikasi monitoring lingkungan.
            </p>
          </div>
        </div>
      </section>

      <!-- Values Section -->
      <section class="space-y-8">
        <div class="text-center">
          <h2>Nilai-Nilai Kami</h2>
          <p style="color: var(--muted-foreground);">Prinsip yang memandu setiap langkah perjalanan kami</p>
        </div>

        <div class="grid grid-cols-2 gap-8">
          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div class="stat-icon" style="background: var(--success); margin: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.216-6.894m0 0L8.35 4.207m5.908 1.042.347-1.97m0 0c-1.457-.362-2.917-.58-4.657-.58"></path>
                  </svg>
                </div>
                <div>
                  <h4 style="margin-bottom: 0.5rem;">Berkelanjutan</h4>
                  <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                    Setiap solusi yang kami kembangkan mempertimbangkan dampak jangka panjang 
                    terhadap lingkungan dan masyarakat.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div class="stat-icon" style="background: var(--primary); margin: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <div>
                  <h4 style="margin-bottom: 0.5rem;">Inovatif</h4>
                  <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                    Kami terus mengeksplorasi teknologi terdepan untuk menciptakan solusi yang 
                    belum pernah ada sebelumnya.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div class="stat-icon" style="background: var(--secondary); margin: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <h4 style="margin-bottom: 0.5rem;">Kolaboratif</h4>
                  <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                    Kami percaya bahwa masalah lingkungan hanya dapat diselesaikan melalui 
                    kerja sama semua pihak.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div class="stat-icon" style="background: var(--warning); margin: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div>
                  <h4 style="margin-bottom: 0.5rem;">Transparan</h4>
                  <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                    Kami berkomitmen untuk menyediakan data dan informasi yang akurat, 
                    dapat diverifikasi, dan mudah dipahami.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact-section" class="card">
        <div class="card-content text-center space-y-6">
          <h2>Hubungi Kami</h2>
          <p style="color: var(--muted-foreground);">
            Ingin tahu lebih lanjut tentang GREENOVA AI atau berkolaborasi dengan kami?
          </p>
          
          <div class="grid grid-cols-3 gap-6">
            <div class="text-center">
              <div class="stat-icon" style="margin: 0 auto 1rem;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h4>Email</h4>
              <p style="color: var(--muted-foreground); font-size: 0.875rem;">contact@greenova.ai</p>
            </div>
            
            <div class="text-center">
              <div class="stat-icon" style="margin: 0 auto 1rem;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h4>Telepon</h4>
              <p style="color: var(--muted-foreground); font-size: 0.875rem;">+62 21 1234 5678</p>
            </div>
            
            <div class="text-center">
              <div class="stat-icon" style="margin: 0 auto 1rem;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h4>Alamat</h4>
              <p style="color: var(--muted-foreground); font-size: 0.875rem;">Surabaya, Indonesia</p>
            </div>
          </div>
          
          <div style="padding-top: 1.5rem; border-top: 1px solid var(--border);">
            <button class="btn btn-primary btn-lg" onclick="navigateToPage('support')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Mulai Diskusi
            </button>
          </div>
        </div>
      </section>
    </div>
  `,

  'how-it-works': `
    <div class="space-y-12">
      <!-- Hero Section -->
      <section class="text-center space-y-6">
        <h1>Cara Kerja GREENOVA AI</h1>
        <p style="font-size: 1.25rem; color: var(--muted-foreground); max-width: 800px; margin: 0 auto;">
          Teknologi canggih yang menggabungkan AI, IoT, dan Computer Vision untuk monitoring lingkungan real-time
        </p>
      </section>

      <!-- Process Flow -->
      <section class="space-y-8">
        <div class="text-center">
          <h2>Alur Kerja Sistem</h2>
          <p style="color: var(--muted-foreground);">Dari pengumpulan data hingga tindakan otomatis</p>
        </div>

        <div class="grid grid-cols-1 gap-8">
          <!-- Step 1 -->
          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: center; gap: 2rem;">
                <div style="background: var(--primary); color: var(--primary-foreground); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; flex-shrink: 0;">
                  1
                </div>
                <div style="flex: 1;">
                  <h3 style="margin-bottom: 0.5rem;">Pengumpulan Data Sensor</h3>
                  <p style="color: var(--muted-foreground);">
                    Robot GREENOVA dilengkapi dengan berbagai sensor untuk mengukur kualitas udara (PM2.5, PM10, gas berbahaya), 
                    suhu, kelembaban, dan kondisi lingkungan lainnya secara real-time.
                  </p>
                </div>
                <div class="stat-icon" style="margin: 0;">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2a10 10 0 1 0 10 10c0-5.523-4.477-10-10-10z"></path>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: center; gap: 2rem;">
                <div style="background: var(--secondary); color: var(--secondary-foreground); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; flex-shrink: 0;">
                  2
                </div>
                <div style="flex: 1;">
                  <h3 style="margin-bottom: 0.5rem;">Computer Vision & AI Analysis</h3>
                  <p style="color: var(--muted-foreground);">
                    ESP32-CAM dan Teachable Machine menganalisis kondisi visual tanaman dan lingkungan. 
                    AI mengidentifikasi penyakit tanaman, tingkat pertumbuhan, dan kebutuhan perawatan.
                  </p>
                </div>
                <div class="stat-icon" style="margin: 0;">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: center; gap: 2rem;">
                <div style="background: var(--success); color: var(--success-foreground); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; flex-shrink: 0;">
                  3
                </div>
                <div style="flex: 1;">
                  <h3 style="margin-bottom: 0.5rem;">Transmisi Data IoT</h3>
                  <p style="color: var(--muted-foreground);">
                    Data dari semua sensor dan analisis AI dikirim secara real-time ke cloud database menggunakan 
                    koneksi WiFi. Sistem backup memastikan tidak ada data yang hilang.
                  </p>
                </div>
                <div class="stat-icon" style="margin: 0;">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                    <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                    <line x1="12" y1="20" x2="12.01" y2="20"></line>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: center; gap: 2rem;">
                <div style="background: var(--warning); color: var(--warning-foreground); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; flex-shrink: 0;">
                  4
                </div>
                <div style="flex: 1;">
                  <h3 style="margin-bottom: 0.5rem;">AI Processing & Prediction</h3>
                  <p style="color: var(--muted-foreground);">
                    Sistem AI menganalisis pola data historis dan real-time untuk membuat prediksi kualitas udara, 
                    memberikan rekomendasi, dan mengoptimalkan tindakan perawatan lingkungan.
                  </p>
                </div>
                <div class="stat-icon" style="margin: 0;">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="11" height="10" rx="2" ry="2"></rect>
                    <circle cx="12" cy="5" r="2"></circle>
                    <path d="M12 7v4M8 21l-2-2M16 21l2-2"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 5 -->
          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: center; gap: 2rem;">
                <div style="background: var(--primary); color: var(--primary-foreground); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; flex-shrink: 0;">
                  5
                </div>
                <div style="flex: 1;">
                  <h3 style="margin-bottom: 0.5rem;">Automated Action & Response</h3>
                  <p style="color: var(--muted-foreground);">
                    Robot secara otomatis melakukan tindakan seperti penyiraman tanaman, aktivasi sistem pembersih udara, 
                    atau mengirim notifikasi kepada pengguna untuk tindakan manual yang diperlukan.
                  </p>
                </div>
                <div class="stat-icon" style="margin: 0;">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Technology Stack -->
      <section class="space-y-8">
        <div class="text-center">
          <h2>Teknologi yang Digunakan</h2>
          <p style="color: var(--muted-foreground);">Komponen teknologi canggih dalam sistem GREENOVA AI</p>
        </div>

        <div class="grid grid-cols-2 gap-8">
          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div class="stat-icon" style="background: var(--chart-1); margin: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="11" height="10" rx="2" ry="2"></rect>
                    <circle cx="12" cy="5" r="2"></circle>
                    <path d="M12 7v4M8 21l-2-2M16 21l2-2"></path>
                  </svg>
                </div>
                <div>
                  <h4 style="margin-bottom: 0.5rem;">Artificial Intelligence</h4>
                  <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                    Machine Learning, Computer Vision, dan Natural Language Processing untuk analisis data dan prediksi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div class="stat-icon" style="background: var(--chart-2); margin: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                    <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                    <line x1="12" y1="20" x2="12.01" y2="20"></line>
                  </svg>
                </div>
                <div>
                  <h4 style="margin-bottom: 0.5rem;">Internet of Things (IoT)</h4>
                  <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                    ESP32, sensor network, dan komunikasi wireless untuk konektivitas perangkat yang seamless.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div class="stat-icon" style="background: var(--chart-3); margin: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <h4 style="margin-bottom: 0.5rem;">Computer Vision</h4>
                  <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                    ESP32-CAM dan Teachable Machine untuk analisis visual kondisi tanaman dan lingkungan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div class="stat-icon" style="background: var(--chart-4); margin: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div>
                  <h4 style="margin-bottom: 0.5rem;">Advanced Sensors</h4>
                  <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                    Sensor PM2.5, gas detector, temperature/humidity sensor untuk monitoring lingkungan akurat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Benefits -->
      <section class="card">
        <div class="card-content">
          <div style="text-align: center; margin-bottom: 2rem;">
            <h2>Keunggulan GREENOVA AI</h2>
            <p style="color: var(--muted-foreground);">Manfaat yang Anda dapatkan dari sistem kami</p>
          </div>

          <div class="grid grid-cols-3 gap-6">
            <div class="text-center">
              <div class="stat-icon" style="margin: 0 auto 1rem;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2a10 10 0 1 0 10 10c0-5.523-4.477-10-10-10z"></path>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </div>
              <h4 style="margin-bottom: 0.5rem;">Real-time Monitoring</h4>
              <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                Pemantauan 24/7 dengan update data setiap menit untuk respons cepat terhadap perubahan kondisi.
              </p>
            </div>

            <div class="text-center">
              <div class="stat-icon" style="margin: 0 auto 1rem;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <h4 style="margin-bottom: 0.5rem;">Automated Response</h4>
              <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                Tindakan otomatis berdasarkan kondisi yang terdeteksi, mengurangi kebutuhan intervensi manual.
              </p>
            </div>

            <div class="text-center">
              <div class="stat-icon" style="margin: 0 auto 1rem;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 3v5h5M3.05 13A9 9 0 1 0 6 5.3L3 8"></path>
                  <path d="M12 7v5l4 2"></path>
                </svg>
              </div>
              <h4 style="margin-bottom: 0.5rem;">Predictive Analytics</h4>
              <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                Prediksi kondisi masa depan memungkinkan tindakan pencegahan sebelum masalah terjadi.
              </p>
            </div>

            <div class="text-center">
              <div class="stat-icon" style="margin: 0 auto 1rem;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h4 style="margin-bottom: 0.5rem;">Easy Monitoring</h4>
              <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                Dashboard intuitif memungkinkan monitoring dan kontrol sistem dari mana saja melalui web atau mobile.
              </p>
            </div>

            <div class="text-center">
              <div class="stat-icon" style="margin: 0 auto 1rem;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.216-6.894m0 0L8.35 4.207m5.908 1.042.347-1.97m0 0c-1.457-.362-2.917-.58-4.657-.58"></path>
                </svg>
              </div>
              <h4 style="margin-bottom: 0.5rem;">Eco-Friendly</h4>
              <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                Mengurangi penggunaan air hingga 60% dan meningkatkan efisiensi energi melalui optimasi otomatis.
              </p>
            </div>

            <div class="text-center">
              <div class="stat-icon" style="margin: 0 auto 1rem;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h4 style="margin-bottom: 0.5rem;">Scalable System</h4>
              <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                Sistem dapat diperluas untuk menangani area yang lebih luas dengan penambahan robot dan sensor.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,

  support: `
    <div class="space-y-12">
      <!-- Hero Section -->
      <section class="text-center space-y-6">
        <h1>Support & Kolaborasi</h1>
        <p style="font-size: 1.25rem; color: var(--muted-foreground); max-width: 800px; margin: 0 auto;">
          Bersama-sama membangun masa depan yang lebih hijau dan berkelanjutan untuk Indonesia
        </p>
      </section>

      <!-- Support Options -->
      <section class="grid grid-cols-3 gap-8">
        <div class="card">
          <div class="card-content text-center">
            <div class="stat-icon" style="margin: 0 auto 1.5rem;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <h3 style="margin-bottom: 1rem;">Technical Support</h3>
            <p style="color: var(--muted-foreground); margin-bottom: 1.5rem;">
              Bantuan teknis 24/7 untuk implementasi dan maintenance sistem GREENOVA AI
            </p>
            <button class="btn btn-primary" onclick="openChatModal()">
              Hubungi Support
            </button>
          </div>
        </div>

        <div class="card">
          <div class="card-content text-center">
            <div class="stat-icon" style="margin: 0 auto 1.5rem;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 style="margin-bottom: 1rem;">Partnership</h3>
            <p style="color: var(--muted-foreground); margin-bottom: 1.5rem;">
              Kemitraan strategis dengan pemerintah, NGO, dan institusi untuk implementasi skala besar
            </p>
            <button class="btn btn-secondary">
              Jadwal Meeting
            </button>
          </div>
        </div>

        <div class="card">
          <div class="card-content text-center">
            <div class="stat-icon" style="margin: 0 auto 1.5rem;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h3 style="margin-bottom: 1rem;">Research Collaboration</h3>
            <p style="color: var(--muted-foreground); margin-bottom: 1.5rem;">
              Kolaborasi penelitian dengan universitas dan lembaga riset untuk pengembangan teknologi
            </p>
            <button class="btn btn-outline">
              Join Research
            </button>
          </div>
        </div>
      </section>

      <!-- Donation Section -->
      <section class="card" style="background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white;">
        <div class="card-content text-center space-y-6">
          <h2 style="color: white;">Dukung Misi Kami</h2>
          <p style="opacity: 0.9; max-width: 600px; margin: 0 auto;">
            Kontribusi Anda membantu kami mengembangkan teknologi yang lebih baik dan menjangkau lebih banyak 
            komunitas yang membutuhkan solusi lingkungan berkelanjutan.
          </p>

          <div class="grid grid-cols-4 gap-4" style="max-width: 600px; margin: 0 auto;">
            <button class="btn btn-outline" style="background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.3); color: white;">
              Rp 50.000
            </button>
            <button class="btn btn-outline" style="background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.3); color: white;">
              Rp 100.000
            </button>
            <button class="btn btn-outline" style="background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.3); color: white;">
              Rp 250.000
            </button>
            <button class="btn btn-outline" style="background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.3); color: white;">
              Custom
            </button>
          </div>

          <button class="btn" style="background: white; color: var(--primary); font-weight: 600;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            Donasi Sekarang
          </button>
        </div>
      </section>

      <!-- Collaboration Programs -->
      <section class="space-y-8">
        <div class="text-center">
          <h2>Program Kolaborasi</h2>
          <p style="color: var(--muted-foreground);">Bergabunglah dengan berbagai program kolaborasi kami</p>
        </div>

        <div class="grid grid-cols-2 gap-8">
          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div class="stat-icon" style="background: var(--success); margin: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                  </svg>
                </div>
                <div>
                  <h4 style="margin-bottom: 0.5rem;">Green Campus Initiative</h4>
                  <p style="color: var(--muted-foreground); font-size: 0.875rem; margin-bottom: 1rem;">
                    Program implementasi GREENOVA AI di kampus-kampus untuk edukasi dan research hands-on 
                    tentang teknologi lingkungan berkelanjutan.
                  </p>
                  <div class="badge badge-success">Tersedia</div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div class="stat-icon" style="background: var(--primary); margin: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <h4 style="margin-bottom: 0.5rem;">Community Air Quality Program</h4>
                  <p style="color: var(--muted-foreground); font-size: 0.875rem; margin-bottom: 1rem;">
                    Deployment gratis sistem monitoring kualitas udara di area publik dengan tingkat polusi tinggi 
                    untuk edukasi masyarakat.
                  </p>
                  <div class="badge badge-warning">Coming Soon</div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div class="stat-icon" style="background: var(--secondary); margin: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <div>
                  <h4 style="margin-bottom: 0.5rem;">Smart City Integration</h4>
                  <p style="color: var(--muted-foreground); font-size: 0.875rem; margin-bottom: 1rem;">
                    Integrasi dengan sistem smart city untuk monitoring lingkungan real-time di tingkat kota 
                    dengan dashboard terpusat.
                  </p>
                  <div class="badge badge-outline">Pilot Program</div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-content">
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div class="stat-icon" style="background: var(--chart-5); margin: 0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div>
                  <h4 style="margin-bottom: 0.5rem;">Corporate CSR Partnership</h4>
                  <p style="color: var(--muted-foreground); font-size: 0.875rem; margin-bottom: 1rem;">
                    Kemitraan dengan perusahaan untuk program CSR berbasis teknologi lingkungan dan sustainability reporting.
                  </p>
                  <div class="badge badge-secondary">Open</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Form -->
      <section class="card">
        <div class="card-content">
          <div style="text-align: center; margin-bottom: 2rem;">
            <h2>Mari Berkolaborasi</h2>
            <p style="color: var(--muted-foreground);">
              Hubungi kami untuk diskusi lebih lanjut tentang peluang kolaborasi
            </p>
          </div>

          <form class="space-y-6" style="max-width: 600px; margin: 0 auto;">
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label for="contact-name">Nama Lengkap</label>
                <input type="text" id="contact-name" name="name" required>
              </div>
              <div class="form-group">
                <label for="contact-email">Email</label>
                <input type="email" id="contact-email" name="email" required>
              </div>
            </div>

            <div class="form-group">
              <label for="contact-organization">Organisasi/Perusahaan</label>
              <input type="text" id="contact-organization" name="organization">
            </div>

            <div class="form-group">
              <label for="contact-type">Jenis Kolaborasi</label>
              <select id="contact-type" name="collaboration-type" required>
                <option value="">Pilih jenis kolaborasi</option>
                <option value="partnership">Partnership Strategis</option>
                <option value="research">Research Collaboration</option>
                <option value="implementation">Implementation Project</option>
                <option value="funding">Funding/Investment</option>
                <option value="technical">Technical Support</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            <div class="form-group">
              <label for="contact-message">Pesan</label>
              <textarea id="contact-message" name="message" rows="4" placeholder="Ceritakan tentang proyek atau ide kolaborasi Anda..." required></textarea>
            </div>

            <div style="text-align: center;">
              <button type="submit" class="btn btn-primary btn-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"></path>
                </svg>
                Kirim Pesan
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="space-y-6">
        <div class="text-center">
          <h2>Frequently Asked Questions</h2>
          <p style="color: var(--muted-foreground);">Jawaban untuk pertanyaan yang sering ditanyakan</p>
        </div>

        <div class="space-y-4">
          <div class="card">
            <div class="card-content">
              <h4 style="margin-bottom: 0.5rem;">Bagaimana cara memulai kolaborasi dengan GREENOVA AI?</h4>
              <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                Anda dapat memulai dengan mengisi form kontak di atas atau menghubungi kami langsung melalui email. 
                Tim kami akan segera merespons dan menjadwalkan diskusi untuk memahami kebutuhan Anda.
              </p>
            </div>
          </div>

          <div class="card">
            <div class="card-content">
              <h4 style="margin-bottom: 0.5rem;">Apakah sistem GREENOVA AI bisa diimplementasikan di area kecil?</h4>
              <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                Ya, sistem kami sangat scalable. Kami bisa mulai dari implementasi pilot di area kecil seperti taman kota, 
                sekolah, atau kompleks perumahan, kemudian diperluas sesuai kebutuhan.
              </p>
            </div>
          </div>

          <div class="card">
            <div class="card-content">
              <h4 style="margin-bottom: 0.5rem;">Berapa lama waktu implementasi sistem?</h4>
              <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                Waktu implementasi bervariasi tergantung skala proyek. Untuk implementasi pilot (1-2 robot), 
                biasanya memerlukan 2-4 minggu. Untuk proyek skala besar, bisa memerlukan 2-6 bulan.
              </p>
            </div>
          </div>

          <div class="card">
            <div class="card-content">
              <h4 style="margin-bottom: 0.5rem;">Apakah ada program khusus untuk institusi pendidikan?</h4>
              <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                Ya, kami memiliki program Green Campus Initiative dengan harga khusus untuk universitas dan sekolah. 
                Program ini juga mencakup workshop dan training untuk mahasiswa dan staff.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
};

// UI Manager - Handles all UI interactions
const UIManager = {
  init() {
    this.bindEvents();
    this.initTheme();
    this.showScrollNotification();
  },

  bindEvents() {
    // Navigation
    document.addEventListener('click', this.handleNavigation.bind(this));
    
    // Mobile menu
    document.getElementById('mobile-menu-btn')?.addEventListener('click', this.toggleMobileMenu.bind(this));
    
    // Theme toggle
    document.getElementById('theme-toggle')?.addEventListener('click', this.toggleTheme.bind(this));
    
    // Login
    document.getElementById('login-btn')?.addEventListener('click', () => this.openModal('login-modal'));
    document.getElementById('mobile-login-btn')?.addEventListener('click', () => this.openModal('login-modal'));
    
    // Modal controls
    document.querySelectorAll('[id$="-modal"] .modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        this.closeModal(modal.id);
      });
    });
    
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        this.closeModal(modal.id);
      });
    });
    
    // Login form
    document.getElementById('login-form')?.addEventListener('submit', this.handleLogin.bind(this));
    
    // Chat
    document.getElementById('floating-robot-btn')?.addEventListener('click', () => this.openModal('chat-modal'));
    document.getElementById('send-message')?.addEventListener('click', this.sendChatMessage.bind(this));
    document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendChatMessage();
    });
    
    // Suggestion buttons
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const question = e.target.textContent;
        document.getElementById('chat-input').value = question;
        this.sendChatMessage();
      });
    });
    
    // Scroll notification
    document.getElementById('close-scroll-notification')?.addEventListener('click', this.hideScrollNotification.bind(this));
    window.addEventListener('scroll', this.handleScroll.bind(this));
    
    // Admin logout
    document.getElementById('logout-btn')?.addEventListener('click', this.handleLogout.bind(this));
    document.getElementById('sidebar-close')?.addEventListener('click', this.hideAdminSidebar.bind(this));
    
    // Contact form
    document.querySelector('#page-content form')?.addEventListener('submit', this.handleContactForm.bind(this));
  },

  handleNavigation(e) {
    const target = e.target.closest('[data-page]');
    if (target) {
      e.preventDefault();
      const page = target.dataset.page;
      this.navigateToPage(page);
    }
  },

  navigateToPage(page) {
    AppState.currentPage = page;
    
    // Update URL without page reload
    window.history.pushState({ page }, '', `#${page}`);
    
    // Update navigation
    this.updateNavigation(page);
    
    // Show/hide admin sidebar
    if (page.startsWith('admin-')) {
      this.showAdminSidebar();
      this.hideBackButton();
    } else {
      this.hideAdminSidebar();
      if (page !== 'home') {
        this.showBackButton();
      } else {
        this.hideBackButton();
      }
    }
    
    // Load page content
    this.loadPageContent(page);
    
    // Close mobile menu if open
    this.closeMobileMenu();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  updateNavigation(page) {
    // Update main nav
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === page) {
        link.classList.add('active');
      }
    });
    
    // Update mobile nav
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === page) {
        link.classList.add('active');
      }
    });
    
    // Update admin nav
    document.querySelectorAll('.sidebar-nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === page) {
        link.classList.add('active');
      }
    });
  },

  loadPageContent(page) {
    const contentContainer = document.getElementById('page-content');
    
    if (page.startsWith('admin-') && !AppState.isAuthenticated) {
      this.navigateToPage('home');
      return;
    }
    
    if (PageTemplates[page]) {
      contentContainer.innerHTML = PageTemplates[page];
      this.initPageSpecificHandlers(page);
    } else {
      contentContainer.innerHTML = PageTemplates.home;
      this.initPageSpecificHandlers('home');
    }
  },

  initPageSpecificHandlers(page) {
    switch (page) {
      case 'home':
        this.updateHomePageData();
        break;
      case 'air-quality':
        this.initAirQualityPage();
        break;
      case 'support':
        this.initSupportPage();
        break;
    }
  },

  updateHomePageData() {
    const latestReading = AppState.airReadings[0];
    if (!latestReading) return;
    
    const pm25 = latestReading.dust_pm25 || 0;
    const gas = latestReading.gas_ppm || 0;
    const temp = latestReading.temperature || 0;
    const humidity = latestReading.humidity || 0;
    const aqi = Math.round((pm25 * 2.5) + (gas * 0.5));
    
    // Update displays
    document.getElementById('pm25-value').textContent = pm25 > 0 ? `${pm25.toFixed(1)} μg/m³` : 'N/A';
    document.getElementById('gas-value').textContent = gas > 0 ? `${gas.toFixed(1)} ppm` : 'N/A';
    document.getElementById('temp-value').textContent = temp > 0 ? `${temp}°C` : 'N/A';
    document.getElementById('humidity-value').textContent = humidity > 0 ? `${humidity}%` : 'N/A';
    document.getElementById('aqi-value').textContent = aqi || 'N/A';
    
    // Update status
    const status = this.getAQIStatus(aqi);
    document.getElementById('aqi-status').textContent = status.level;
    document.getElementById('aqi-status').style.color = status.color;
    
    // Update last update time
    if (latestReading.timestamp) {
      const lastUpdate = new Date(latestReading.timestamp.seconds * 1000);
      document.getElementById('last-update').textContent = 
        `Update: ${lastUpdate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Update stats
    document.getElementById('plants-monitored').textContent = `${Math.floor(pm25 * 2)}+`;
    document.getElementById('robots-online').textContent = AppState.robots.length;
    
    // Generate AI recommendation
    this.generateAIRecommendation(aqi, pm25, gas, temp, humidity);
  },

  async generateAIRecommendation(aqi, pm25, gas, temp, humidity) {
    const recommendationElement = document.getElementById('recommendation-text');
    
    try {
      recommendationElement.textContent = 'Menganalisis kondisi udara...';
      
      const prompt = `Kondisi udara: AQI ${aqi}, PM2.5: ${pm25} μg/m³, Gas: ${gas} ppm, Suhu: ${temp}°C, Kelembaban: ${humidity}%. Berikan rekomendasi singkat dalam bahasa Indonesia.`;
      const recommendation = await GeminiAIService.generateResponse(prompt);
      
      recommendationElement.textContent = recommendation;
    } catch (error) {
      recommendationElement.textContent = 'Pantau terus kualitas udara dan gunakan masker jika diperlukan.';
    }
  },

  initAirQualityPage() {
    const latestReading = AppState.airReadings[0];
    if (!latestReading) return;
    
    const pm25 = latestReading.dust_pm25 || 0;
    const gas = latestReading.gas_ppm || 0;
    const aqi = Math.round((pm25 * 2.5) + (gas * 0.5));
    
    // Update current values
    document.getElementById('current-aqi').textContent = aqi || 'N/A';
    document.getElementById('current-pm25').textContent = pm25 > 0 ? pm25.toFixed(1) : 'N/A';
    document.getElementById('current-gas').textContent = gas > 0 ? gas.toFixed(1) : 'N/A';
    
    // Update status badges
    const aqiStatus = this.getAQIStatus(aqi);
    const pm25Status = this.getPMStatus(pm25, 'PM2.5');
    const gasStatus = this.getPMStatus(gas, 'Gas');
    
    this.updateStatusBadge('aqi-status-badge', aqiStatus);
    this.updateStatusBadge('pm25-status-badge', pm25Status);
    this.updateStatusBadge('gas-status-badge', gasStatus);
    
    // Generate detailed recommendation
    this.generateDetailedRecommendation(aqi, pm25, gas);
    
    // Initialize charts
    this.initCharts();
    
    // Update historical data table
    this.updateHistoricalDataTable();
  },

  async generateDetailedRecommendation(aqi, pm25, gas) {
    const element = document.getElementById('detailed-recommendation');
    
    try {
      element.textContent = 'Menganalisis data untuk rekomendasi detail...';
      
      const prompt = `Analisis detail kualitas udara: AQI ${aqi}, PM2.5: ${pm25} μg/m³, Gas: ${gas} ppm. Berikan rekomendasi lengkap untuk memperbaiki kondisi udara dalam bahasa Indonesia.`;
      const recommendation = await GeminiAIService.generateResponse(prompt);
      
      element.textContent = recommendation;
    } catch (error) {
      element.textContent = 'Berdasarkan data kualitas udara saat ini, disarankan untuk meningkatkan ventilasi, menggunakan tanaman pembersih udara, dan mengurangi sumber polusi dalam ruangan.';
    }
  },

  updateStatusBadge(elementId, status) {
    const badge = document.getElementById(elementId);
    if (badge) {
      badge.textContent = status.level;
      badge.className = `badge ${status.badgeClass}`;
    }
  },

  initCharts() {
    // Hourly chart
    const hourlyCtx = document.getElementById('hourly-chart');
    if (hourlyCtx) {
      const hourlyData = AppState.airReadings.slice(0, 24).reverse();
      
      new Chart(hourlyCtx, {
        type: 'line',
        data: {
          labels: hourlyData.map(reading => {
            const date = new Date(reading.timestamp.seconds * 1000);
            return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
          }),
          datasets: [
            {
              label: 'AQI',
              data: hourlyData.map(reading => Math.round(((reading.dust_pm25 || 0) * 2.5) + ((reading.gas_ppm || 0) * 0.5))),
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.1
            },
            {
              label: 'PM2.5',
              data: hourlyData.map(reading => reading.dust_pm25 || 0),
              borderColor: 'rgb(245, 158, 11)',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              tension: 0.1
            },
            {
              label: 'Gas PPM',
              data: hourlyData.map(reading => reading.gas_ppm || 0),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
    
    // Daily chart
    const dailyCtx = document.getElementById('daily-chart');
    if (dailyCtx) {
      // Group data by day
      const dailyData = this.groupDataByDay(AppState.airReadings);
      
      new Chart(dailyCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(dailyData),
          datasets: [
            {
              label: 'Avg AQI',
              data: Object.values(dailyData).map(day => Math.round(day.avgAqi)),
              backgroundColor: 'rgba(239, 68, 68, 0.8)'
            },
            {
              label: 'Avg PM2.5',
              data: Object.values(dailyData).map(day => day.avgPm25.toFixed(1)),
              backgroundColor: 'rgba(245, 158, 11, 0.8)'
            },
            {
              label: 'Avg Gas PPM',
              data: Object.values(dailyData).map(day => day.avgGas.toFixed(1)),
              backgroundColor: 'rgba(59, 130, 246, 0.8)'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  },

  groupDataByDay(readings) {
    const grouped = {};
    
    readings.forEach(reading => {
      const date = new Date(reading.timestamp.seconds * 1000);
      const dayKey = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      
      if (!grouped[dayKey]) {
        grouped[dayKey] = [];
      }
      grouped[dayKey].push(reading);
    });
    
    // Calculate averages
    const result = {};
    Object.entries(grouped).slice(-7).forEach(([day, data]) => {
      const avgPm25 = data.reduce((sum, item) => sum + (item.dust_pm25 || 0), 0) / data.length;
      const avgGas = data.reduce((sum, item) => sum + (item.gas_ppm || 0), 0) / data.length;
      const avgAqi = (avgPm25 * 2.5) + (avgGas * 0.5);
      
      result[day] = {
        avgPm25,
        avgGas,
        avgAqi
      };
    });
    
    return result;
  },

  updateHistoricalDataTable() {
    const tbody = document.getElementById('historical-data-table');
    if (!tbody) return;
    
    const latestReadings = AppState.airReadings.slice(0, 20);
    
    tbody.innerHTML = latestReadings.map(reading => {
      const date = new Date(reading.timestamp.seconds * 1000);
      const formattedTime = date.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short' 
      }) + ', ' + date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      const pm25 = reading.dust_pm25 || 0;
      const gas = reading.gas_ppm || 0;
      const aqi = Math.round((pm25 * 2.5) + (gas * 0.5));
      const status = this.getAQIStatus(aqi);
      
      return `
        <tr>
          <td>${formattedTime}</td>
          <td>${aqi || 'N/A'}</td>
          <td>${pm25 > 0 ? pm25.toFixed(1) : 'N/A'}</td>
          <td>${gas > 0 ? gas.toFixed(1) : 'N/A'}</td>
          <td>${reading.temperature || 'N/A'}°C</td>
          <td>${reading.humidity || 'N/A'}%</td>
          <td><span class="badge ${status.badgeClass}" style="background: ${status.bgColor}; color: ${status.textColor};">${status.level}</span></td>
        </tr>
      `;
    }).join('');
  },

  initSupportPage() {
    // Add form submission handler for support page
    const form = document.querySelector('#page-content form');
    if (form) {
      form.addEventListener('submit', this.handleContactForm.bind(this));
    }
  },

  handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Mock form submission
    this.showToast('Pesan Anda telah dikirim! Tim kami akan segera menghubungi Anda.', 'success');
    e.target.reset();
  },

  getAQIStatus(aqi) {
    if (aqi <= 50) {
      return {
        level: 'Baik',
        color: 'var(--success)',
        bgColor: '#10b981',
        textColor: '#ffffff',
        badgeClass: 'badge-success'
      };
    }
    if (aqi <= 100) {
      return {
        level: 'Sedang',
        color: 'var(--warning)',
        bgColor: '#f59e0b',
        textColor: '#ffffff',
        badgeClass: 'badge-warning'
      };
    }
    if (aqi <= 150) {
      return {
        level: 'Tidak Sehat untuk Sensitif',
        color: 'var(--destructive)',
        bgColor: '#f97316',
        textColor: '#ffffff',
        badgeClass: 'badge-destructive'
      };
    }
    return {
      level: 'Tidak Sehat',
      color: 'var(--destructive)',
      bgColor: '#ef4444',
      textColor: '#ffffff',
      badgeClass: 'badge-destructive'
    };
  },

  getPMStatus(value, type) {
    const limits = type === 'PM2.5' ? [35, 75, 115] : [300, 500, 700];
    
    if (value <= limits[0]) {
      return {
        level: 'Baik',
        badgeClass: 'badge-success'
      };
    }
    if (value <= limits[1]) {
      return {
        level: 'Sedang',
        badgeClass: 'badge-warning'
      };
    }
    if (value <= limits[2]) {
      return {
        level: 'Tidak Sehat',
        badgeClass: 'badge-destructive'
      };
    }
    return {
      level: 'Berbahaya',
      badgeClass: 'badge-destructive'
    };
  },

  showBackButton() {
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.classList.remove('hidden');
      backBtn.onclick = () => this.navigateToPage('home');
    }
  },

  hideBackButton() {
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.classList.add('hidden');
    }
  },

  showAdminSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    const header = document.getElementById('main-header');
    const floatingBtn = document.getElementById('floating-robot-btn');
    
    if (sidebar) sidebar.classList.add('show');
    if (header) header.style.display = 'none';
    if (floatingBtn) floatingBtn.style.display = 'none';
  },

  hideAdminSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    const header = document.getElementById('main-header');
    const floatingBtn = document.getElementById('floating-robot-btn');
    
    if (sidebar) sidebar.classList.remove('show');
    if (header) header.style.display = 'block';
    if (floatingBtn) floatingBtn.style.display = 'flex';
  },

  toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.toggle('hidden');
    }
  },

  closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.add('hidden');
    }
  },

  initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  },

  toggleTheme() {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  },

  setTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    
    // Update theme toggle icon
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (theme === 'dark') {
      sunIcon?.classList.add('hidden');
      moonIcon?.classList.remove('hidden');
    } else {
      sunIcon?.classList.remove('hidden');
      moonIcon?.classList.add('hidden');
    }
  },

  showScrollNotification() {
    setTimeout(() => {
      const notification = document.getElementById('scroll-notification');
      if (notification && window.scrollY < 100) {
        notification.classList.remove('hidden');
      }
    }, 2000);
  },

  hideScrollNotification() {
    const notification = document.getElementById('scroll-notification');
    if (notification) {
      notification.classList.add('hidden');
    }
  },

  handleScroll() {
    const notification = document.getElementById('scroll-notification');
    if (notification && !notification.classList.contains('hidden')) {
      if (window.scrollY > 100) {
        this.hideScrollNotification();
      }
    }
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      
      // Generate captcha for login modal
      if (modalId === 'login-modal') {
        this.generateCaptcha();
      }
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
    }
  },

  generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const question = document.getElementById('captcha-question');
    
    if (question) {
      question.textContent = `${num1} + ${num2} = ?`;
      question.dataset.answer = (num1 + num2).toString();
    }
  },

  handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    const captchaAnswer = formData.get('captcha-answer');
    const correctAnswer = document.getElementById('captcha-question').dataset.answer;
    
    // Simple validation
    if (captchaAnswer !== correctAnswer) {
      this.showToast('Captcha salah!', 'error');
      this.generateCaptcha();
      return;
    }
    
    if (username === 'admin' && password === 'greenova123') {
      AppState.isAuthenticated = true;
      AppState.userInfo = {
        username: 'Admin GREENOVA',
        email: 'admin@greenova.ai'
      };
      
      // Update admin info
      document.getElementById('admin-username').textContent = AppState.userInfo.username;
      document.getElementById('admin-email').textContent = AppState.userInfo.email;
      
      this.closeModal('login-modal');
      this.navigateToPage('admin-dashboard');
      this.showToast('Login berhasil!', 'success');
    } else {
      this.showToast('Username atau password salah!', 'error');
      this.generateCaptcha();
    }
  },

  handleLogout() {
    AppState.isAuthenticated = false;
    AppState.userInfo = null;
    this.navigateToPage('home');
    this.showToast('Logout berhasil!', 'success');
  },

  async sendChatMessage() {
    const input = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');
    
    if (!input.value.trim()) return;
    
    const userMessage = input.value.trim();
    input.value = '';
    
    // Add user message
    this.addChatMessage(userMessage, 'user');
    
    // Add typing indicator
    const typingId = this.addTypingIndicator();
    
    try {
      const response = await GeminiAIService.generateResponse(userMessage);
      this.removeChatMessage(typingId);
      this.addChatMessage(response, 'bot');
    } catch (error) {
      this.removeChatMessage(typingId);
      this.addChatMessage('Maaf, saya sedang mengalami gangguan. Silakan coba lagi nanti.', 'bot');
    }
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  },

  addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    messageDiv.id = `message-${Date.now()}`;
    
    const avatarIcon = sender === 'bot' 
      ? '<rect x="3" y="11" width="11" height="10" rx="2" ry="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4M8 21l-2-2M16 21l2-2"></path>'
      : '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>';
    
    messageDiv.innerHTML = `
      <div class="message-avatar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${avatarIcon}
        </svg>
      </div>
      <div class="message-content">
        <p>${message}</p>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    return messageDiv.id;
  },

  addTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    const typingId = `typing-${Date.now()}`;
    typingDiv.className = 'chat-message bot-message';
    typingDiv.id = typingId;
    
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="11" height="10" rx="2" ry="2"></rect>
          <circle cx="12" cy="5" r="2"></circle>
          <path d="M12 7v4M8 21l-2-2M16 21l2-2"></path>
        </svg>
      </div>
      <div class="message-content">
        <p>Sedang mengetik...</p>
      </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return typingId;
  },

  removeChatMessage(messageId) {
    const message = document.getElementById(messageId);
    if (message) {
      message.remove();
    }
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div style="flex: 1;">${message}</div>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 18L6 6M6 18L18 6"></path>
          </svg>
        </button>
      </div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  },

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
  }
};

// Global functions for inline event handlers
window.navigateToPage = (page) => UIManager.navigateToPage(page);
window.openChatModal = () => UIManager.openModal('chat-modal');

// Application initialization
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize UI
  UIManager.init();
  
  // Initialize Firebase and load data
  await FirebaseService.initialize();
  
  // Load initial page
  const initialPage = window.location.hash.substring(1) || 'home';
  UIManager.navigateToPage(initialPage);
  
  // Handle browser back/forward
  window.addEventListener('popstate', (e) => {
    const page = e.state?.page || 'home';
    UIManager.navigateToPage(page);
  });
  
  console.log('GREENOVA AI Dashboard initialized successfully!');
});

// Handle unhandled errors
window.addEventListener('error', (e) => {
  console.error('Application error:', e.error);
  UIManager.showToast('Terjadi kesalahan pada aplikasi. Silakan refresh halaman.', 'error');
});

// Export for debugging
window.AppState = AppState;
window.FirebaseService = FirebaseService;
window.UIManager = UIManager;