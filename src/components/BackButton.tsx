import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="mb-4 hover:bg-muted/80"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Home
    </Button>
  );
}