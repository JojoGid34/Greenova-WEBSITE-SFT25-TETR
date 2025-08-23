import * as React from "react";
import { cn } from "./utils";

// Mock useTheme hook
const useTheme = () => ({ theme: "light" });

// Mock Toaster component
interface ToasterProps {
  theme?: "light" | "dark" | "system";
  className?: string;
  toastOptions?: {
    classNames?: {
      toast?: string;
      description?: string;
      actionButton?: string;
      cancelButton?: string;
    };
  };
}

const Toaster = ({ theme = "light", className, toastOptions, ...props }: ToasterProps) => {
  return (
    <div
      className={cn("toaster group", className)}
      data-theme={theme}
      {...props}
    >
      {/* Mock toaster container */}
    </div>
  );
};

export { Toaster };
export type { ToasterProps };