import React, { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Bot } from 'lucide-react';

interface FloatingRobotButtonProps {
  onClick: () => void;
}

export function FloatingRobotButton({ onClick }: FloatingRobotButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLButtonElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startMousePos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (dragRef.current) {
      setIsDragging(true);
      startPos.current = { x: position.x, y: position.y };
      startMousePos.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && dragRef.current) {
      const deltaX = e.clientX - startMousePos.current.x;
      const deltaY = e.clientY - startMousePos.current.y;
      
      // Calculate new position
      let newX = startPos.current.x + deltaX;
      let newY = startPos.current.y + deltaY;
      
      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const buttonSize = 56; // 14 * 4 (w-14 h-14)
      
      // Constrain to bottom-right quadrant with some padding
      const minX = Math.max(-200, viewportWidth / 2 - viewportWidth + 24); // Allow some movement to left
      const maxX = 0; // Stay within right edge
      const minY = Math.max(-200, viewportHeight / 2 - viewportHeight + 24); // Allow some movement up
      const maxY = 0; // Stay within bottom edge
      
      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));
      
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setIsDragging(false);
      
      // Check if it was a click (minimal movement)
      const deltaX = e.clientX - startMousePos.current.x;
      const deltaY = e.clientY - startMousePos.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // If movement was minimal, treat as click
      if (distance < 5) {
        onClick();
      }
    }
  }, [isDragging, onClick]);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleClick = () => {
    if (!isDragging) {
      onClick();
    }
  };

  return (
    <Button
      ref={dragRef}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className={`fixed w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 bg-gradient-to-r from-primary to-secondary hover:scale-105 ${
        isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab'
      }`}
      style={{
        bottom: `${24 - position.y}px`,
        right: `${24 - position.x}px`,
        transform: isDragging ? 'rotate(5deg)' : 'none',
      }}
      size="icon"
    >
      <Bot className="h-6 w-6 text-white" />
    </Button>
  );
}