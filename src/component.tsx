import React, { ElementType, ComponentPropsWithRef } from "react";
import { Options } from "./types";

/**
 * Polymorphic Component with "as" prop
 */
export function PolymorphicComponent<C extends ElementType>({
  as,
  ...props
}: {
  as?: C;
} & Omit<ComponentPropsWithRef<C>, "as">) {
  const Component = as ?? "div";
  return <Component {...props} />;
}

export function createComponent<T>(...styles: Options<T>[]) {
  return <C extends ElementType>({
    as,
    ...props
  }: {
    as?: C;
  } & T &
    Omit<ComponentPropsWithRef<C>, "as" | keyof T>) => {
    return <PolymorphicComponent {...props} />;
  };
}
