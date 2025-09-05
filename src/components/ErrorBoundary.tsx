import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  error?: Error | null;
}

export function ErrorBoundary({ children, error }: ErrorBoundaryProps) {
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <div className="w-6 h-6 bg-red-500 rounded-full"></div>
          </div>
          <h1 className="text-xl font-semibold text-red-600">Terjadi Error</h1>
          <p className="text-muted-foreground">Maaf, terjadi kesalahan saat memuat aplikasi.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}