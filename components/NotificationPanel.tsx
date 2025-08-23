import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Bell, 
  X, 
  Check, 
  AlertTriangle, 
  Info, 
  CheckCircle2,
  Battery,
  Wifi,
  Bot,
  Droplets,
  Thermometer,
  Clock
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  robotId?: string;
  isRead: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Battery Low - GRN-001',
    message: 'Robot GREENOVA Alpha battery level is at 15%. Charging recommended.',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    robotId: 'GRN-001',
    isRead: false
  },
  {
    id: '2',
    type: 'error', 
    title: 'Sensor Malfunction - GRN-002',
    message: 'Soil moisture sensor not responding. Manual check required.',
    timestamp: new Date(Date.now() - 900000), // 15 minutes ago
    robotId: 'GRN-002',
    isRead: false
  },
  {
    id: '3',
    type: 'success',
    title: 'Watering Completed',
    message: 'Successfully watered 12 plants in Zone A. All plants optimal.',
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    robotId: 'GRN-001',
    isRead: false
  },
  {
    id: '4',
    type: 'info',
    title: 'Air Quality Alert',
    message: 'PM2.5 levels increased to 85 μg/m³. Activating enhanced filtration.',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    isRead: true
  },
  {
    id: '5',
    type: 'warning',
    title: 'Weather Warning',
    message: 'Heavy rain predicted in 2 hours. Robots returning to shelter.',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    isRead: true
  }
];

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return AlertTriangle;
      case 'error':
        return X;
      case 'success':
        return CheckCircle2;
      case 'info':
        return Info;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      case 'success':
        return 'text-green-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
      <div className="fixed top-16 right-4 w-96 max-w-[calc(100vw-2rem)]">
        <Card className="shadow-2xl border-2">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {notifications.length > 0 && (
              <div className="flex gap-2 mt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearAll}
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          <ScrollArea className="max-h-96">
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => {
                    const Icon = getIcon(notification.type);
                    const iconColor = getIconColor(notification.type);
                    
                    return (
                      <div 
                        key={notification.id}
                        className={`p-4 hover:bg-muted/50 transition-colors ${
                          !notification.isRead ? 'bg-muted/30' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`mt-0.5 ${iconColor}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h4 className={`text-sm font-medium ${
                                  !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {formatTimeAgo(notification.timestamp)}
                                  </div>
                                  {notification.robotId && (
                                    <Badge variant="outline" className="text-xs">
                                      <Bot className="h-2 w-2 mr-1" />
                                      {notification.robotId}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {!notification.isRead && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => dismissNotification(notification.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="p-4 border-t border-border">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Battery className="h-3 w-3 text-yellow-500" />
                <span>2 Alerts</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Wifi className="h-3 w-3 text-green-500" />
                <span>All Online</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Bot className="h-3 w-3 text-blue-500" />
                <span>3 Robots</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}