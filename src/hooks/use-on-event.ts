import * as React from "react";

export type EventCallback<K extends keyof GlobalEventHandlersEventMap> = (
  target: Document | Window | HTMLElement | React.Ref<HTMLElement>,
  cb: (ev: GlobalEventHandlersEventMap[K]) => void,
  deps?: React.DependencyList
) => void;

export const useOn = new Proxy({}, {
  get(_, event: string) {
    return (
      target: Document | Window | HTMLElement | React.RefObject<HTMLElement>,
      effect: EventListener,
      deps: React.DependencyList = []
    ) => {
      // We will call callback artifically if deps change an a last event is available.
      const lastEventRef = React.useRef<Event | null>(null);

      React.useEffect(() => {
        function wrappedEffect(ev: Event) {
          lastEventRef.current = ev;
          effect(ev);
        }

        let emitter = "current" in target ? target.current : target;
        if (emitter) {
          emitter.addEventListener(event, wrappedEffect);
          return () => emitter?.removeEventListener(event, wrappedEffect);
        }

        // If ref is null, wait for it to become available
        if ("current" in target) {
          let frame: number;
          const check = () => {
            emitter = target.current;
            if (emitter) {
              emitter.addEventListener(event, wrappedEffect);
            } else {
              frame = requestAnimationFrame(check);
            }
          };
          frame = requestAnimationFrame(check);
          return () => {
            if (frame) cancelAnimationFrame(frame);
            emitter?.removeEventListener(event, wrappedEffect);
          };
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [event, ...deps]);

      // If deps change, call the last event if available
      React.useEffect(() => {
        if (lastEventRef.current) {
          effect(lastEventRef.current);
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, deps);
    };
  }
}) as { [K in keyof GlobalEventHandlersEventMap]: EventCallback<K> };
