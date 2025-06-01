import * as React from "react";
import TinyTestVideo from "../assets/tiny.mp4?inline";

const InteractionEvents = ["click", "touchstart", "keydown", "mousedown", "pointerdown"] as const;

export interface CanAutoplay {
  result: boolean | null;
}

const CanAutoplayContext = React.createContext<CanAutoplay | null>(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useAutoplayContext = () => React.useContext(CanAutoplayContext)!;

export const CanAutoplayProvider = ({ children }: React.PropsWithChildren) => {
  const [canAutoplay, setCanAutoplay] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let timeout: number | null = null;
    const tryPlay = () => {
      timeout = null;
      const video = document.createElement("video");
      video.src = TinyTestVideo;
      video.muted = false;
      video.playsInline = true;
      video.play()
        .then(() => {
          console.debug("[CanAutoplayProvider] autoplay now allowed!");
          setCanAutoplay(true);
          cleanup();
        })
        .catch(() => {
          console.debug("[CanAutoplayProvider] autoplay not allowed! waiting for user interaction.");
          setCanAutoplay(false);
        });
    }

  
    const onInteract = () => {
      console.debug("[CanAutoplayProvider] user interaction detected, testing autoplay with audio.");
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(tryPlay, 25);
    }

    const cleanup = () => {
      InteractionEvents.forEach(event =>
        document.removeEventListener(event, onInteract)
      );
    };

    tryPlay();
    InteractionEvents.forEach(event => 
      document.addEventListener(event, onInteract)
    );

    return cleanup;
  }, []);

  return (
    <CanAutoplayContext.Provider value={{ result: canAutoplay }}>
      {children}
    </CanAutoplayContext.Provider>
  );
}

export type CanAutoplayCallback = (canAutoplay: boolean) => void;
// eslint-disable-next-line react-refresh/only-export-components
export function useCanAutoplay(callback?: CanAutoplayCallback, deps: React.DependencyList = []) {
  const { result } = useAutoplayContext();

  React.useEffect(() => {
    if (result === null) return;

    callback?.(result);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, callback, ...deps]);

  return result;
}
