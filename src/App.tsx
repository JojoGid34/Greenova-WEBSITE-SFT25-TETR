import React, { useState } from "react";
import { Layout } from "./components/Layout";
import { LoginPage } from "./components/LoginPage";
import { AdminLayout } from "./components/AdminLayout";
import { Dashboard } from "./components/Dashboard";
import { AskGreenova } from "./components/AskGreenova";
import { AirQualityAnalysis } from "./components/AirQualityAnalysis";

import { HowItWorks } from "./components/HowItWorks";
import { History } from "./components/History";
import { Education } from "./components/Education";
import { About } from "./components/About";
import { Support } from "./components/Support";
import { Settings } from "./components/Settings";
import { BackButton } from "./components/BackButton";
import { FloatingRobotButton } from "./components/FloatingRobotButton";
import { LoadingScreen } from "./components/LoadingScreen";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PlantsQuality } from "./components/PlantsQuality";
import { StationDashboard } from "./components/StationDashboard";
import { HomePage } from "./components/HomePage";
import { useFirebaseData } from './hooks/useFirebaseData';

interface UserInfo {
  username: string;
  email: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Ambil data dari Firebase
  const { robots, stations, airReadings, plantReadings, loading } = useFirebaseData();
  
  // Atur ID default setelah data dimuat
  const [selectedRobotId, setSelectedRobotId] = useState<string>('');
  const [selectedStationId, setSelectedStationId] = useState<string>('');

  React.useEffect(() => {
    if (!loading) {
      setIsLoading(false);
      // Atur ID default jika data tersedia
      if (robots.length > 0 && !selectedRobotId) {
        setSelectedRobotId(robots[0].robot_id);
      }
      if (stations.length > 0 && !selectedStationId) {
        setSelectedStationId(stations[0].station_id);
      }
    }
  }, [loading, robots, stations]);

  const handleNavigate = (page: string) => {
    try {
      setCurrentPage(page);
    } catch (err) {
      setError(err as Error);
    }
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
  };

  const handleAskGreenova = (autoMessage?: string) => {
    setCurrentPage("ask-greenova");
    // Jika ada pesan otomatis, akan dikirim ke AskGreenova component
    if (autoMessage) {
      // Store message untuk dikirim otomatis
      sessionStorage.setItem('autoMessage', autoMessage);
    }
  };

  const handleLogin = (userData: UserInfo) => {
    setIsAuthenticated(true);
    setUserInfo(userData);
    setCurrentPage("admin-dashboard");
  };

  const handleUserUpdate = (newUserInfo: UserInfo) => {
    setUserInfo(newUserInfo);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
    setCurrentPage("home");
  };

  const handleShowLogin = () => {
    setCurrentPage("login");
  };

  const handleRobotSelect = (robotId: string) => {
    setSelectedRobotId(robotId);
  };

  const handleStationSelect = (stationId: string) => {
    setSelectedStationId(stationId);
  };

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Render admin pages with admin layout
  const renderAdminPage = () => {
    if (!isAuthenticated || !userInfo) return null;
    
    let adminContent;
    switch (currentPage) {
      case "admin-dashboard":
        adminContent = selectedRobotId ? <Dashboard selectedRobotId={selectedRobotId} onRobotSelect={handleRobotSelect} /> : null;
        break;
      case "admin-station-dashboard":
        adminContent = selectedStationId ? <StationDashboard selectedStationId={selectedStationId} onStationSelect={handleStationSelect} /> : null;
        break;
      case "admin-history":
        adminContent = selectedRobotId ? <History selectedRobotId={selectedRobotId} onRobotSelect={handleRobotSelect} /> : null;
        break;
      case "admin-settings":
        adminContent = selectedRobotId ? <Settings selectedRobotId={selectedRobotId} onRobotSelect={handleRobotSelect} /> : null;
        break;
      default:
        adminContent = selectedRobotId ? <Dashboard selectedRobotId={selectedRobotId} onRobotSelect={handleRobotSelect} /> : null;
        break;
    }

    return (
      <AdminLayout
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
        userInfo={userInfo}
        onUserUpdate={handleUserUpdate}
        selectedRobotId={selectedRobotId}
        onRobotSelect={handleRobotSelect}
        selectedStationId={selectedStationId}
        onStationSelect={handleStationSelect}
      >
        {adminContent}
      </AdminLayout>
    );
  };

  const renderCurrentPage = () => {
    try {
      // Show login page
      if (currentPage === "login") {
        return (
          <LoginPage
            onLogin={handleLogin}
            onBack={handleBackToHome}
            onNavigate={handleNavigate}
          />
        );
      }

      // Show admin pages if authenticated
      if (isAuthenticated && currentPage.startsWith("admin-")) {
        return renderAdminPage();
      }

      // Public pages
      switch (currentPage) {
        case "home":
          return <HomePage onNavigate={handleNavigate} />;
        case "ask-greenova":
          return (
            <div className="space-y-4">
              <BackButton onClick={handleBackToHome} />
              <AskGreenova />
            </div>
          );
        case "air-quality":
          return (
            <div className="space-y-4">
              <BackButton onClick={handleBackToHome} />
              <AirQualityAnalysis />
            </div>
          );

        case "plants-quality":
          return (
            <div className="space-y-4">
              <BackButton onClick={handleBackToHome} />
              <PlantsQuality />
            </div>
          );
        case "how-it-works":
          return (
            <div className="space-y-4">
              <BackButton onClick={handleBackToHome} />
              <HowItWorks />
            </div>
          );
        case "education":
          return (
            <div className="space-y-4">
              <BackButton onClick={handleBackToHome} />
              <Education />
            </div>
          );
        case "about":
          return (
            <div className="space-y-4">
              <BackButton onClick={handleBackToHome} />
              <About onNavigate={handleNavigate} />
            </div>
          );
        case "support":
          return (
            <div className="space-y-4">
              <BackButton onClick={handleBackToHome} />
              <Support />
            </div>
          );
        default:
          return <HomePage onNavigate={handleNavigate} />;
      }
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  return (
    <ErrorBoundary error={error}>
      <div className="min-h-screen bg-background text-foreground">
        {currentPage === "login" || (isAuthenticated && currentPage.startsWith("admin-")) ? (
          renderCurrentPage()
        ) : (
          <>
            <Layout
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onLogin={handleShowLogin}
            >
              {renderCurrentPage()}
            </Layout>
            
            <FloatingRobotButton onClick={handleAskGreenova} />
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}
