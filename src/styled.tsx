import React from "react";
import { ComponentPropsWithRef, ElementType, memo } from "react";
import domElements from "./lib/domElements";
import { rulesets } from "./rulesets";
import { Ruleset } from "./lib/types";

function styled<C extends ElementType>(baseElement: C) {
  return function styledComponent<I>(...rules: Ruleset<I>[]) {
    const getComponentProps = rulesets<I>(...rules);
    return memo(function C<D extends ElementType | undefined>(
      props: I & { as?: D } & Omit<
          ComponentPropsWithRef<D extends undefined ? C : D>,
          keyof I
        >
    ) {
      /* Accounts for ~15ms per render */
      const Element = props.as ?? baseElement;
      const cProps = getComponentProps(props);
      return <Element {...cProps} />;
    });
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
