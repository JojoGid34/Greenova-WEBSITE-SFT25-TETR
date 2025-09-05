import * as React from "react";
import { cn } from "./utils";

// Mock Popover components
const Popover = ({ children, ...props }: any) => <div {...props}>{children}</div>;
const PopoverTrigger = ({ children, ...props }: any) => <div {...props}>{children}</div>;

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    align?: "center" | "start" | "end"; 
    sideOffset?: number; 
  }
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
      className
    )}
    {...props}
  />
));
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };