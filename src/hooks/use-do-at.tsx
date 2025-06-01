import React from "react";

export function useDoAt(seconds: number | undefined | null, callback: React.EffectCallback, deps: React.DependencyList = []) {
  React.useEffect(() => {
    if (typeof seconds !== "number" || seconds < 0) {
      return;
    }

    const timer = setTimeout(() => {
      callback();
    }, seconds * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [seconds, callback, ...deps]);
}