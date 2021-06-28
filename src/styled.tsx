import React from "react";
import { ComponentPropsWithRef, ElementType } from "react";
import domElements from "./lib/domElements";
import { rulesets } from "./rulesets";
import { Ruleset } from "./lib/types";

function styled<C extends ElementType>(Element: C) {
  return function styledComponent<I>(...rules: Ruleset<I>[]) {
    const useRulesets = rulesets<I>(...rules);
    return (props: I & Omit<ComponentPropsWithRef<C>, keyof I>) => {
      const atts = useRulesets(props);
      return <Element {...atts} />;
    };
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

export default enhancedStyled;