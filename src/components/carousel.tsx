"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType
} from "embla-carousel-react";
// import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@udecode/cn";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

interface CarouselProps {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    reference
  ) => {
    const [carouselReference, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y"
      },
      plugins
    );
    const [canScrollPrevious, setCanScrollPrevious] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrevious(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrevious = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrevious();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrevious, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef: carouselReference,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev: scrollPrevious,
          scrollNext,
          canScrollPrev: canScrollPrevious,
          canScrollNext
        }}
      >
        <div
          aria-roledescription="carousel"
          className={cn("relative", className)}
          ref={reference}
          role="region"
          onKeyDownCapture={handleKeyDown}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, reference) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div className="overflow-hidden" ref={carouselRef}>
      <div
        ref={reference}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, reference) => {
  const { orientation } = useCarousel();

  return (
    <div
      aria-roledescription="slide"
      ref={reference}
      role="group"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

// const CarouselPrevious = React.forwardRef<
//   HTMLButtonElement,
//   React.ComponentProps<typeof Button>
// >(({ className, variant = "none", size = "none", ...props }, reference) => {
//   const { orientation, scrollPrev, canScrollPrev } = useCarousel();

//   return (
//     <Button
//       disabled={!canScrollPrev}
//       ref={reference}
//       size={size}
//       variant={variant}
//       className={cn(
//         "absolute disabled:opacity-0 border-none rounded-none from-transparent to-neutral-950 opacity-50 hover:opacity-100 transition-all",
//         orientation === "horizontal"
//           ? "h-full w-12 left-0 top-0 bg-gradient-to-l"
//           : "h-12 w-full left-0 top-0 bg-gradient-to-t",
//         className
//       )}
//       onClick={scrollPrev}
//       {...props}
//     >
//       <ArrowLeft
//         className={cn("size-4", orientation === "vertical" && "rotate-90")}
//       />
//       <span className="sr-only">Previous slide</span>
//     </Button>
//   );
// });
// CarouselPrevious.displayName = "CarouselPrevious";

// const CarouselNext = React.forwardRef<
//   HTMLButtonElement,
//   React.ComponentProps<typeof Button>
// >(({ className, variant = "none", size = "none", ...props }, reference) => {
//   const { orientation, scrollNext, canScrollNext } = useCarousel();

//   return (
//     <Button
//       disabled={!canScrollNext}
//       ref={reference}
//       size={size}
//       variant={variant}
//       className={cn(
//         "absolute disabled:opacity-0 border-none rounded-none from-transparent to-neutral-950 opacity-50 hover:opacity-100 transition-all",
//         orientation === "horizontal"
//           ? "h-full w-12 right-0 top-0 bg-gradient-to-r"
//           : "h-12 w-full bottom-0 left-0 bg-gradient-to-b",
//         className
//       )}
//       onClick={scrollNext}
//       {...props}
//     >
//       <ArrowRight
//         className={cn("size-4", orientation === "vertical" && "rotate-90")}
//       />
//       <span className="sr-only">Next slide</span>
//     </Button>
//   );
// });
//CarouselNext.displayName = "CarouselNext";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselPrevious,
  // CarouselNext
};