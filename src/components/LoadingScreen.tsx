export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto animate-pulse">
          <div className="w-6 h-6 bg-white rounded-full"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">GREENOVA AI</h3>
          <p className="text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    </div>
  );
}