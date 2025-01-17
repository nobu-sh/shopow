import { DependencyList, useEffect, useState } from "react";

export function useRenderInterval(interval: number, deps: DependencyList = []) {
  const [, setFlipFlop] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFlipFlop((prev) => !prev);
    }, interval);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}