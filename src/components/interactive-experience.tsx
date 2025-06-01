import * as React from "react";
import { cn, withRef } from "@udecode/cn";
import { useCanAutoplay } from "../hooks/use-can-autoplay";
import { MouseIcon } from "lucide-react";
import { useBreakpoint } from "../hooks/use-breakpoint";
import { useLocation } from "react-router-dom";

export const InteractiveExperienceOverlay = withRef<"div">(({ className, ...props }, reference) => {
  const small = useBreakpoint("sm");
  const canAutoplay = useCanAutoplay();
  const location = useLocation();

  const hide = React.useMemo(() =>
    small || canAutoplay !== false || location.hash.length > 0, 
  [small, canAutoplay, location]);

  React.useEffect(() => {
    if (!document.body.parentElement) return;
    document.body.parentElement.style.overflow = hide ? "auto" : "hidden";
  }, [hide]);

  return (
    <div
      {...props}
      ref={reference}
      className={cn(
        "fixed top-0 left-0 w-screen h-screen z-50 select-none cursor-pointer bg-[#000d04f5] backdrop-blur-md transition-opacity duration-500 flex flex-col justify-center items-center",
        hide && "opacity-0 pointer-events-none",
        className
      )}
    >
      <div className="flex flex-col gap-1 items-center ">
        <MouseIcon className="w-16 h-16 mb-4 animate-pulse text-[#fde1af]" />
        <p className="text-xl animate-pulse text-[#fde1af]">Interactive Experience</p>
        <p className="sepia animate-pulse text-[#968161]">Please click to Continue!</p>
      </div>
    </div>
  );
});
