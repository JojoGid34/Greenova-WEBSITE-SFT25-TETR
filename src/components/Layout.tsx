import { ReactNode, useState } from 'react';
import { 
  Home,
  BookOpen, 
  Bot,
  Menu,
  X,
  Sun,
  Moon,
  Info,
  Heart,
  Cog,
  Wind,
  MapPin,
  MessageCircle,
  LogIn
} from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './ui/use-theme';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogin?: () => void;
}

const navigationItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'ask-greenova', icon: MessageCircle, label: 'Ask GREENOVA' },
  { id: 'air-quality', icon: Wind, label: 'Air Quality' },
  { id: 'how-it-works', icon: Cog, label: 'How It Works' },
  { id: 'education', icon: BookOpen, label: 'Edukasi' },
  { id: 'about', icon: Info, label: 'About' },
  { id: 'support', icon: Heart, label: 'Support' },
];

export function Layout({ children, currentPage, onPageChange, onLogin }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
        fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-border">
            <div className="p-2 bg-primary rounded-lg">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-primary">GREENOVA</h1>
              <p className="text-xs text-muted-foreground">Robot Monitoring</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <li key={item.id}>
                    <Button
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
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Login Button */}
          <div className="p-4 border-t border-border space-y-3">
            <Button 
              onClick={onLogin}
              className="w-full"
              variant="outline"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login Admin
            </Button>
            
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tema</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-8 w-8"
              >
                {theme === 'dark' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Robot Status */}
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">Robot Aktif</span>
            </div>
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
        <main className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}