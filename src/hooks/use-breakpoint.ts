import { useEffect, useState } from "react";

const PresetBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type PresetBreakpoint = keyof typeof PresetBreakpoints;
export type BreakpointCalculator = () => boolean;
export function useBreakpoint(calculator: BreakpointCalculator | PresetBreakpoint) {
  const [isBreakpoint, setIsBreakpoint] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const newResult = typeof calculator === "string" 
        ? window.innerWidth < PresetBreakpoints[calculator] 
        : calculator();
      if (newResult !== isBreakpoint) {
        setIsBreakpoint(newResult);
      }
    };

    // Initial check
    handleResize();

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [calculator, isBreakpoint, setIsBreakpoint]);

  return isBreakpoint;
}