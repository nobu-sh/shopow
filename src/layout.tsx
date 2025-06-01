import * as React from "react";
import { Navbar } from "./components/navbar";
import { InteractiveExperienceOverlay } from "./components/interactive-experience";
import { CanAutoplayProvider } from "./hooks/use-can-autoplay";
import { Provider } from "./components/providers";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <Provider components={[CanAutoplayProvider]}>
      <InteractiveExperienceOverlay />
      <main className="size-full">
        <Navbar />
        {children}
      </main>
    </Provider>
  );
}