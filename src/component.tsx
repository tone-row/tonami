import React, { ElementType, ComponentPropsWithRef } from "react";

/*
These files are just being left here to help with adding
polymorphism to the "styled" api
*/

/**
 * Polymorphic Component with "as" prop
 */
function PolymorphicComponent<C extends ElementType>({
  as,
  ...props
}: {
  as?: C;
} & Omit<ComponentPropsWithRef<C>, "as">) {
  const Component = as ?? "div";
  return <Component {...props} />;
}

export function createComponent<T>() {
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
