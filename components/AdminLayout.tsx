import { ReactNode, useState } from 'react';
import { 
  Settings,
  Bot,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  User,
  Bell,
  Search,
  BarChart3,
  History,
  Activity,
  Wifi,
  WifiOff,
  Wrench,
  ChevronDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { useTheme } from './ui/use-theme';
import { UserProfileModal } from './UserProfileModal';
import { NotificationPanel } from './NotificationPanel';
import { ROBOT_DATA, Robot } from '../data/robotData';

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
}

const adminNavigation = [
  { id: 'admin-dashboard', icon: BarChart3, label: 'Dashboard' },
  { id: 'admin-history', icon: History, label: 'Riwayat' },
  { id: 'admin-settings', icon: Settings, label: 'Pengaturan' },
];

export function AdminLayout({ 
  children, 
  currentPage, 
  onPageChange, 
  onLogout, 
  userInfo, 
  onUserUpdate,
  selectedRobotId,
  onRobotSelect
}: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [robotSearchQuery, setRobotSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();

  // Filter robots based on search query
  const filteredRobots = ROBOT_DATA.filter(robot =>
    robot.name.toLowerCase().includes(robotSearchQuery.toLowerCase()) ||
    robot.id.toLowerCase().includes(robotSearchQuery.toLowerCase()) ||
    robot.location.address.toLowerCase().includes(robotSearchQuery.toLowerCase())
  );

  const getStatusIcon = (status: Robot['status']) => {
    switch (status) {
      case 'online':
        return <Wifi className="h-3 w-3 text-green-500" />;
      case 'offline':
        return <WifiOff className="h-3 w-3 text-red-500" />;
      case 'maintenance':
        return <Wrench className="h-3 w-3 text-yellow-500" />;
      default:
        return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Robot['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Count robots by status
  const robotStats = {
    online: ROBOT_DATA.filter(r => r.status === 'online').length,
    offline: ROBOT_DATA.filter(r => r.status === 'offline').length,
    maintenance: ROBOT_DATA.filter(r => r.status === 'maintenance').length,
    total: ROBOT_DATA.length
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

          {/* Robot Statistics */}
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-medium mb-3">Robot Status</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Online: {robotStats.online}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Offline: {robotStats.offline}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Maintenance: {robotStats.maintenance}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Total: {robotStats.total}</span>
              </div>
            </div>
          </div>

          {/* Robot Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari robot..."
                value={robotSearchQuery}
                onChange={(e) => setRobotSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Robot List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium mb-3">Daftar Robot ({filteredRobots.length})</h3>
              <div className="space-y-2">
                {filteredRobots.map((robot) => (
                  <Button
                    key={robot.id}
                    variant={selectedRobotId === robot.id ? "default" : "ghost"}
                    className={`w-full justify-start p-3 h-auto ${
                      selectedRobotId === robot.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={() => {
                      onRobotSelect(robot.id);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="relative">
                        <Bot className="h-5 w-5" />
                        <div className={`absolute -top-1 -right-1 w-3 h-3 ${getStatusColor(robot.status)} rounded-full animate-pulse`}></div>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{robot.name}</span>
                          {getStatusIcon(robot.status)}
                        </div>
                        <p className="text-xs opacity-75">{robot.id}</p>
                        <p className="text-xs opacity-60 mt-1">{robot.location.address}</p>
                        {robot.status === 'online' && (
                          <div className="flex items-center gap-3 mt-2 text-xs">
                            <span>🔋 {robot.battery}%</span>
                            <span>📶 {robot.signal}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
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
            {selectedRobotId && (
              <Badge variant="outline" className="text-xs">
                {ROBOT_DATA.find(r => r.id === selectedRobotId)?.name}
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

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationPanelOpen(true)}
              className="relative h-9 w-9"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
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
              className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
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

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
      />
    </div>
  );
}