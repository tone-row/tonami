import {
  DEFAULT_STYLE_TAG_ID,
  IS_BROWSER,
  SSR_STYLE_TAG_ID,
} from "./lib/constants";
import { getSheet } from "./lib/getSheet";

class StyleSheet {
  rules: string[];
  tag: null | HTMLStyleElement;
  sheet: null | CSSStyleSheet;

  constructor() {
    this.rules = [];
    this.tag = this.findOrCreateTag();
    this.sheet = this.getSheet();
  }

  // Make style tag
  findOrCreateTag() {
    if (this.tag) return this.tag;

    if (IS_BROWSER) {
      const documentTag = document.getElementById(DEFAULT_STYLE_TAG_ID);

      if (documentTag) return documentTag as HTMLStyleElement;

      const tag = document.createElement("style");
      tag.setAttribute("id", DEFAULT_STYLE_TAG_ID);
      tag.setAttribute("data-testid", DEFAULT_STYLE_TAG_ID);
      document.head.appendChild(tag);

      // Add rules from SSR
      this.insertRules(this.rules);

      // Delete SSR Tag
      document.getElementById(SSR_STYLE_TAG_ID)?.remove();

      return tag;
    }
    return null;
  }

  getSheet() {
    return this.tag ? getSheet(this.tag) : null;
  }

  insertRules(rules: string[], isStatic = false) {
    const ruleIndexes: number[] = [];

    let i = 0;
    while (rules.length) {
      if (isStatic) {
        const exists = this.rules.indexOf(rules[0]);
        if (exists > -1) {
          rules.shift();
          ruleIndexes.push(exists);
          continue;
        }
      }

      if (!this.rules[i]) {
        this.rules[i] = rules.shift() as string;
        this.sheet && this.sheet.insertRule(this.rules[i], i);
        ruleIndexes.push(i);
      }
      i++;
    }

    return ruleIndexes;
  }

  removeRules(indexes: number[]) {
    for (let index of indexes) {
      this.rules[index] = "";
      // removeRules only called on the client so we know sheet exists
      (this.sheet as CSSStyleSheet).deleteRule(index);
    }
  }

  getStyleString() {
    return this.rules.join("\n");
  }

  reset() {
    this.rules = [];
    if (this.tag) this.tag.remove();
    this.tag = null;
    this.tag = this.findOrCreateTag();
    this.sheet = this.getSheet();
  }
}
export const sheet = new StyleSheet();
