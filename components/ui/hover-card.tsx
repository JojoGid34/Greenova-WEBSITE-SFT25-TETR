import * as React from "react";
import { cn } from "./utils";

// Mock HoverCard components
const HoverCard = ({ children, ...props }: any) => <div {...props}>{children}</div>;
const HoverCardTrigger = ({ children, ...props }: any) => <div {...props}>{children}</div>;

const HoverCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    align?: "center" | "start" | "end"; 
    sideOffset?: number; 
  }
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
      className
    )}
    {...props}
  />
));
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardTrigger, HoverCardContent };