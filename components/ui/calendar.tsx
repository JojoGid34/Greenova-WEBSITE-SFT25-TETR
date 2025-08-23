import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "./utils";
import { buttonVariants } from "./button";

// Mock DayPicker component and types
interface DayPickerProps {
  showOutsideDays?: boolean;
  className?: string;
  classNames?: Record<string, string>;
  [key: string]: any;
}

const DayPicker = ({ 
  showOutsideDays = true, 
  className, 
  classNames,
  ...props 
}: DayPickerProps) => (
  <div className={cn("p-3", className)} {...props}>
    <div className="flex justify-center pt-1 relative items-center">
      <div className="text-sm font-medium">Mock Calendar</div>
      <button className="absolute left-1 h-7 w-7">
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button className="absolute right-1 h-7 w-7">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
    {/* Mock calendar grid */}
    <div className="mt-4">
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-9 w-9 flex items-center justify-center text-sm">
            {i > 6 && i < 28 ? i - 6 : ''}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export type CalendarProps = DayPickerProps;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };