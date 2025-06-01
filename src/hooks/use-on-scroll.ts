import * as React from "react";

export function useOnScroll(effect: React.EffectCallback, deps: React.DependencyList = []) {
  React.useEffect(() => {
    const handleScroll = () => {
      effect();
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
