import React from "react";
import { ComponentPropsWithRef, ElementType } from "react";
import domElements from "./lib/domElements";
import { rulesets } from "./rulesets";
import { Ruleset } from "./lib/types";

function create<C extends ElementType>(Element: C) {
  return function createComponent<I>(...rules: Ruleset<I>[]) {
    const useRulesets = rulesets<I>(...rules);
    return (props: I & Omit<ComponentPropsWithRef<C>, keyof I>) => {
      const atts = useRulesets(props);
      return <Element {...atts} />;
    };
  };
}

type BaseCreate = typeof create;

const enhancedCreate = create as BaseCreate &
  {
    [key in typeof domElements[number]]: ReturnType<BaseCreate>;
  };

// Shorthands for all valid HTML Elements
domElements.forEach((domElement) => {
  enhancedCreate[domElement] = create(domElement);
});

export default enhancedCreate;
