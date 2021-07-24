import { useEffect, useRef } from "react";
import { sheet } from "./sheet";

function arraysEqual(array1: string[], array2: string[]) {
  return JSON.stringify(array1.sort()) === JSON.stringify(array2.sort());
}

export function useRules(rules: string[]) {
  const prevRules = useRef([] as string[]);
  const ruleIds = useRef([] as number[]);
  if (!arraysEqual(rules, prevRules.current)) {
    if (ruleIds.current.length) {
      sheet.removeRules(ruleIds.current);
    }
    ruleIds.current = sheet.insertDynamicRules(rules);
    prevRules.current = rules;
  }
  useEffect(() => {
    return () => {
      if (ruleIds.current.length) {
        sheet.removeRules(ruleIds.current);
      }
    };
  }, []);
}
