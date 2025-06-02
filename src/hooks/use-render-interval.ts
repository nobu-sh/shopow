import * as React from "react";

export function useRenderInterval(interval: number, deps: React.DependencyList = []) {
  const [, setFlipFlop] = React.useState(false);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setFlipFlop((prev) => !prev);
    }, interval);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useInterval<T>(interval: number, effect: () => T, deps: React.DependencyList = []) {
  const [state, setState] = React.useState<T>(effect);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setState(effect());
    }, interval);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
