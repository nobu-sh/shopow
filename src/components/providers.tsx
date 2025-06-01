import { FC, PropsWithChildren } from "react";

export function Provider({ children, components }: PropsWithChildren<{
  components: FC<PropsWithChildren>[];
}>) {
  return (
    <>
      {components.map((Component, index) => (
        <Component key={index}>
          {children}
        </Component>
      ))}
    </>
  );
}
