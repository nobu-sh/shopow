import React from "react";

export function useDoOnce(test: boolean | undefined | null, callback: React.EffectCallback, deps: React.DependencyList = []) {
  const didRun = React.useRef(false);

  React.useEffect(() => {
    if (test === true && !didRun.current) {
      callback();
      didRun.current = true;
    }
  }, [test, callback, ...deps]);
}