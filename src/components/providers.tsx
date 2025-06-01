import * as React from "react";

export function Provider({ children, components }:  React.PropsWithChildren<{
  components: React.FC<React.PropsWithChildren>[];
}>) {
  return (
    <React.Fragment>
      {components.map((Component, index) => (
        <Component key={index}>
          {children}
        </Component>
      ))}
    </React.Fragment>
  );
}
