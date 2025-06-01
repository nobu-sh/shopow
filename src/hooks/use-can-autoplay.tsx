import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import TinyTestVideo from "../assets/tiny.mp4?inline";

const InteractionEvents = ["click", "touchstart", "keydown", "mousedown", "pointerdown"] as const;

export interface CanAutoplay {
  result: boolean | null;
}

const CanAutoplayContext = createContext<CanAutoplay | null>(null);
export const useAutoplayContext = () => useContext(CanAutoplayContext)!;

export const CanAutoplayProvider = ({ children }: PropsWithChildren) => {
  const [canAutoplay, setCanAutoplay] = useState<boolean | null>(null);

  useEffect(() => {
    const onInteract = () => {
      console.debug("[CanAutoplayProvider] user interaction detected, testing autoplay with audio.");
      InteractionEvents.forEach(event => document.removeEventListener(event, onInteract));
      setCanAutoplay(true);
    };

    const video = document.createElement("video");
    video.muted = false;
    video.playsInline = true;
    video.src = TinyTestVideo;

    video.play()
      .then(() => {
        console.debug("[CanAutoplayProvider] current context can autoplay with audio.");
        setCanAutoplay(true);
      })
      .catch(() => {
        console.debug("[CanAutoplayProvider] current context cannot autoplay with audio, waiting for user interaction.");
        setCanAutoplay(false);
        InteractionEvents.forEach(event => document.addEventListener(event, onInteract, { once: true }));
      });    
  }, [])

  return (
    <CanAutoplayContext.Provider value={{ result: canAutoplay }}>
      {children}
    </CanAutoplayContext.Provider>
  )
}

export type CanAutoplayCallback = (canAutoplay: boolean) => void;
export function useCanAutoplay(callback?: CanAutoplayCallback, deps: React.DependencyList = []) {
  const { result } = useAutoplayContext();

  useEffect(() => {
    if (result === null) return;

    callback?.(result);
  }, [result, callback, ...deps]);

  return result;
}
