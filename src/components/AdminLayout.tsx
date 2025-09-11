import { ReactNode, useState } from 'react';
import { 
  Bot,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  User,
  BarChart3,
  ChevronDown,
  Droplets
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { useTheme } from './ui/use-theme';
import { UserProfileModal } from './UserProfileModal';
import { useFirebaseData } from '../hooks/useFirebaseData';

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
  userInfo: {
    username: string;
    email: string;
  };
  onUserUpdate: (userInfo: { username: string; email: string }) => void;
  selectedRobotId: string;
  onRobotSelect: (robotId: string) => void;
  selectedStationId: string;
  onStationSelect: (stationId: string) => void;
}

const adminNavigation = [
  { id: 'admin-dashboard', icon: Bot, label: 'Robot Dashboard' },
  { id: 'admin-station-dashboard', icon: Droplets, label: 'Station Dashboard' },
];

export function AdminLayout({ 
  children, 
  currentPage, 
  onPageChange, 
  onLogout, 
  userInfo, 
  onUserUpdate,
  selectedRobotId,
  onRobotSelect,
  selectedStationId,
  onStationSelect
}: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'robot' | 'station'>('robot');
  const { theme, toggleTheme } = useTheme();
  
  // Get data from Firebase Realtime Database
  const { robotData, tamanData, loading, formatDateTime } = useFirebaseData();

  // Show loading state if data isn't ready yet
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Bot className="h-8 w-8 animate-pulse mx-auto mb-2" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Status indicators
  const robotStatus = {
    online: robotData?.isOnline ? 1 : 0,
    offline: robotData?.isOnline ? 0 : 1,
    total: 1
  };

  const stationStatus = {
    active: tamanData?.healthyPlants || 0,
    inactive: tamanData ? tamanData.totalPlants - tamanData.healthyPlants : 0,
    total: tamanData?.totalPlants || 0
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 bg-card border-r border-border transform transition-transform duration-300 ease-in-out overflow-y-auto
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo & Header */}
          <div className="flex items-center gap-3 p-6 border-b border-border">
            <div className="p-2 bg-primary rounded-lg">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-primary">GREENOVA</h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>

          {/* Device Tabs */}
          <div className="p-4 border-b border-border">
            <div className="flex border rounded-lg overflow-hidden">
              <button
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === 'robot' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
                onClick={() => setActiveTab('robot')}
              >
                <div className="flex items-center justify-center gap-2">
                  <Bot className="h-3 w-3" />
                  <span>Robot ({robotStatus.total})</span>
                </div>
              </button>
              <button
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === 'station' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
                onClick={() => setActiveTab('station')}
              >
                <div className="flex items-center justify-center gap-2">
                  <Droplets className="h-3 w-3" />
                  <span>Station ({stationStatus.total})</span>
                </div>
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-medium mb-3">
              {activeTab === 'robot' ? 'Robot Status' : 'Station Status'}
            </h3>
            {activeTab === 'robot' ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Online: {robotStatus.online}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Offline: {robotStatus.offline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Total: {robotStatus.total}</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Healthy: {stationStatus.active}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Unhealthy: {stationStatus.inactive}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Total: {stationStatus.total}</span>
                </div>
              </div>
            )}
          </div>

          {/* Device Status */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {activeTab === 'robot' ? (
                <>
                  <h3 className="text-sm font-medium mb-3">Robot Status</h3>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Bot className="h-5 w-5" />
                          <div className={`absolute -top-1 -right-1 w-3 h-3 ${
                            robotData?.isOnline ? 'bg-green-500' : 'bg-red-500'
                          } rounded-full animate-pulse`}></div>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">GREENOVA Robot</span>
                            <Badge variant={robotData?.isOnline ? "default" : "destructive"}>
                              {robotData?.isOnline ? 'Online' : 'Offline'}
                            </Badge>
                          </div>
                          {robotData && (
                            <>
                              <p className="text-xs opacity-60 mt-1">
                                Last: {formatDateTime(robotData.terakhir_update)}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs">
                                <span>🌡️ {robotData.suhu}°C</span>
                                <span>💧 {robotData.kelembaban}%</span>
                                <span>AQI: {robotData.aqi_lokal}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-medium mb-3">Station Status</h3>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Droplets className="h-5 w-5" />
                          <div className={`absolute -top-1 -right-1 w-3 h-3 ${
                            tamanData?.healthyPlants === tamanData?.totalPlants ? 'bg-green-500' : 'bg-yellow-500'
                          } rounded-full animate-pulse`}></div>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">GREENOVA Station</span>
                            <Badge variant={
                              tamanData?.healthyPlants === tamanData?.totalPlants ? "default" : "secondary"
                            }>
                              {tamanData?.healthyPlants}/{tamanData?.totalPlants} Healthy
                            </Badge>
                          </div>
                          {tamanData && (
                            <>
                              <p className="text-xs opacity-60 mt-1">
                                Last: {formatDateTime(tamanData.lastUpdate)}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs">
                                <span>🌱 {tamanData.totalPlants} Plants</span>
                                <span>✅ {tamanData.healthyPlants} Healthy</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4 border-t border-border">
            <nav className="space-y-2">
              {adminNavigation.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={() => {
                      onPageChange(item.id);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              {adminNavigation.find(nav => nav.id === currentPage)?.label || 'Dashboard'}
            </h2>
            {activeTab === 'robot' && robotData && (
              <Badge variant="outline" className="text-xs">
                Robot Status: {robotData.isOnline ? 'Online' : 'Offline'}
              </Badge>
            )}
            {activeTab === 'station' && tamanData && (
              <Badge variant="outline" className="text-xs">
                Plants: {tamanData.healthyPlants}/{tamanData.totalPlants} Healthy
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* User Profile */}
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-9 px-3"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">
                  {userInfo.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm">{userInfo.username}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>

            {/* Logout */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userInfo={userInfo}
        onUserUpdate={onUserUpdate}
      />
    </div>
  );
}