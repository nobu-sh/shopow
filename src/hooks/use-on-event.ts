import * as React from "react";

export type EventCallback<K extends keyof GlobalEventHandlersEventMap> = (
  cb: (ev: GlobalEventHandlersEventMap[K]) => void,
  deps?: React.DependencyList
) => void;

export const useOn = new Proxy({}, {
  get(_, event: string) {
    return (cb: EventListener, deps: React.DependencyList = []) => {
      React.useEffect(() => {
        document.addEventListener(event, cb);

        return () => {
          document.removeEventListener(event, cb);
        };
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [event, cb, ...deps])
    };
  }
}) as { [K in keyof GlobalEventHandlersEventMap]: EventCallback<K> };
