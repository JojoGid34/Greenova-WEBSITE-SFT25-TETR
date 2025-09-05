import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock class-variance-authority
export function cva(base: string, config?: { variants?: any; defaultVariants?: any }) {
  return (props: any = {}) => {
    let classes = base;
    
    if (config?.variants) {
      Object.entries(props).forEach(([key, value]) => {
        if (config.variants[key] && config.variants[key][value as string]) {
          classes += " " + config.variants[key][value as string];
        }
      });
    }
    
    if (config?.defaultVariants) {
      Object.entries(config.defaultVariants).forEach(([key, value]) => {
        if (!props[key] && config.variants?.[key]?.[value as string]) {
          classes += " " + config.variants[key][value as string];
        }
      });
    }
    
    return classes;
  };
}

export type VariantProps<T> = T extends (...args: any) => any ? Parameters<T>[0] : never;

// Mock clsx function if not available
declare global {
  function clsx(...inputs: any[]): string;
}

if (typeof clsx === 'undefined') {
  (globalThis as any).clsx = (...inputs: any[]): string => {
    return inputs
      .flat()
      .filter((x: any) => typeof x === "string")
      .join(" ")
      .trim();
  };
}

// Mock twMerge function if not available  
if (typeof twMerge === 'undefined') {
  (globalThis as any).twMerge = (str: string): string => str;
}