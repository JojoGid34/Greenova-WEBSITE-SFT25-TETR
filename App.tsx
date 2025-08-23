import React, { useState } from "react";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { LoginPage } from "./components/LoginPage";
import { AdminLayout } from "./components/AdminLayout";
import { Dashboard } from "./components/Dashboard";
import { AskGreenova } from "./components/AskGreenova";
import { AirQualityAnalysis } from "./components/AirQualityAnalysis";
import { LiveMap } from "./components/LiveMap";
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
import { ROBOT_DATA } from "./data/robotData";

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
  const [selectedRobotId, setSelectedRobotId] = useState<string>(ROBOT_DATA[0].id);

  // Simulate initial loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  const handleAskGreenova = () => {
    setCurrentPage("ask-greenova");
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
        adminContent = <Dashboard selectedRobotId={selectedRobotId} onRobotSelect={handleRobotSelect} />;
        break;
      case "admin-history":
        adminContent = <History selectedRobotId={selectedRobotId} onRobotSelect={handleRobotSelect} />;
        break;
      case "admin-settings":
        adminContent = <Settings selectedRobotId={selectedRobotId} onRobotSelect={handleRobotSelect} />;
        break;
      default:
        adminContent = <Dashboard selectedRobotId={selectedRobotId} onRobotSelect={handleRobotSelect} />;
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
        case "live-map":
          return (
            <div className="space-y-4">
              <BackButton onClick={handleBackToHome} />
              <LiveMap />
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
              <About />
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
        {/* Login page or admin pages without main layout */}
        {currentPage === "login" || (isAuthenticated && currentPage.startsWith("admin-")) ? (
          renderCurrentPage()
        ) : (
          /* Main application with layout */
          <>
            <Layout
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onLogin={handleShowLogin}
            >
              {renderCurrentPage()}
            </Layout>
            
            {/* Floating Robot Button - visible on public pages only */}
            <FloatingRobotButton onClick={handleAskGreenova} />
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}