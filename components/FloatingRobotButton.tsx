import { Button } from './ui/button';
import { Bot } from 'lucide-react';

interface FloatingRobotButtonProps {
  onClick: () => void;
}

export function FloatingRobotButton({ onClick }: FloatingRobotButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 bg-gradient-to-r from-primary to-secondary hover:scale-105"
      size="icon"
    >
      <Bot className="h-6 w-6 text-white" />
    </Button>
  );
}