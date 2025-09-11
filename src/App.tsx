import React, { useState } from "react";
import { Layout } from "./components/Layout";
import { AskGreenova } from "./components/AskGreenova";
import { AirQualityAnalysis } from "./components/AirQualityAnalysis";
import { HowItWorks } from "./components/HowItWorks";
import { Education } from "./components/Education";
import { About } from "./components/About";
import { Support } from "./components/Support";
import { BackButton } from "./components/BackButton";
import { FloatingRobotButton } from "./components/FloatingRobotButton";
import { LoadingScreen } from "./components/LoadingScreen";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PlantsQuality } from "./components/PlantsQuality";
import { HomePage } from "./components/HomePage";
import { DatabaseDebugger } from "./components/DatabaseDebugger";
import { LocationSettings } from "./components/LocationSettings";
import { useFirebaseData } from './hooks/useFirebaseData';

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Ambil data dari Firebase Realtime Database
  const { robotData, tamanData, loading, error: firebaseError } = useFirebaseData();

  React.useEffect(() => {
    if (!loading) {
      setIsLoading(false);
      if (firebaseError) {
        console.warn('Firebase connection issue, but app will continue with mock data:', firebaseError);
        // Don't set as critical error since we have fallback data
      }
    }
  }, [loading, firebaseError]);

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

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  const renderCurrentPage = () => {
    try {
      // Public pages
      switch (currentPage) {
        case "home":
          return <HomePage onNavigate={handleNavigate} onAskGreenova={handleAskGreenova} />;
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
        case "location-settings":
          return (
            <div className="space-y-4">
              <BackButton onClick={handleBackToHome} />
              <LocationSettings />
            </div>
          );
        default:
          return <HomePage onNavigate={handleNavigate} onAskGreenova={handleAskGreenova} />;
      }
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  return (
    <ErrorBoundary error={error}>
      <div className="min-h-screen bg-background text-foreground">
        <Layout
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        >
          {renderCurrentPage()}
        </Layout>
        
        <FloatingRobotButton onClick={handleAskGreenova} />
        <DatabaseDebugger />
      </div>
    </ErrorBoundary>
  );
}