import React, { ComponentPropsWithRef, ElementType, memo } from "react";
import domElements from "./lib/domElements";
import { rulesets } from "./rulesets";
import { Ruleset } from "./lib/types";

type ComponentProps<
  I,
  D extends ElementType | undefined,
  C extends ElementType
> = I & { as?: D } & Omit<
    ComponentPropsWithRef<D extends undefined ? C : D>,
    keyof I
  >;

function styled<C extends ElementType>(baseElement: C) {
  return function styledComponent<I>(...rules: Ruleset<I>[]) {
    const getRulesets = rulesets<I>(...rules);
    const getComponentProps =
      // @ts-ignore
      baseElement.isStyledComponent
        ? // @ts-ignore
          baseElement.getComponentProps.concat(getRulesets)
        : [getRulesets];

    const C = memo(function C<D extends ElementType | undefined>(
      props: ComponentProps<I, D, C>
    ) {
      /* Accounts for ~15ms per render */
      const Element = props.as ?? baseElement;
      const cProps = (
        getComponentProps as Array<(p: any) => ComponentProps<I, D, C>>
      ).reduce((_props, fn) => {
        return fn(_props as any);
      }, props);
      return <Element {...(cProps as any)} />;
    });

    Object.assign(C, {
      isStyledComponent: true,
      getComponentProps,
    });

    return C;
  };
}

type BaseStyled = typeof styled;

const enhancedStyled = styled as BaseStyled &
  {
    [key in typeof domElements[number]]: ReturnType<BaseStyled>;
  };

// Shorthands for all valid HTML Elements
domElements.forEach((domElement) => {
  enhancedStyled[domElement] = styled(domElement);
});

export { enhancedStyled as styled };
