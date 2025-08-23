import * as React from "react";
import { cn } from "./utils";

// Mock Tooltip components
const TooltipProvider = ({ children, delayDuration, ...props }: any) => (
  <div {...props}>{children}</div>
);

const Tooltip = ({ children, ...props }: any) => <div {...props}>{children}</div>;
const TooltipTrigger = ({ children, asChild, ...props }: any) => {
  if (asChild) return <>{children}</>;
  return <div {...props}>{children}</div>;
};

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    sideOffset?: number; 
    side?: "top" | "right" | "bottom" | "left";
    align?: "center" | "start" | "end";
  }
>(({ className, sideOffset = 4, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };