import * as React from "react";

// Mock AspectRatio component
const AspectRatio = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { ratio?: number }
>(({ ratio = 1, className, style, ...props }, ref) => (
  <div
    ref={ref}
    style={{
      position: "relative",
      width: "100%",
      paddingBottom: `${100 / ratio}%`,
      ...style,
    }}
    className={className}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
      }}
      {...props}
    />
  </div>
));
AspectRatio.displayName = "AspectRatio";

export { AspectRatio };