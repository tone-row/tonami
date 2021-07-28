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
  // A static reference to moving rules
  // Used for global style unmount
  dynamicIndexes: number[];

  constructor() {
    this.rules = [];
    this.tag = this.findOrCreateTag();
    this.sheet = this.getSheet();
    this.dynamicIndexes = [];
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

      // Not necessary because components will rehydrate? :\
      // this.insertRules(this.rules);

      // Delete SSR Tag
      document.getElementById(SSR_STYLE_TAG_ID)?.remove();

      return tag;
    }
    return null;
  }

  getSheet() {
    return this.tag ? getSheet(this.tag) : null;
  }

  insertStaticRules(rules: string[]) {
    let index: number;
    for (let rule of rules) {
      if (this.rules.indexOf(rule) > -1) continue;

      index = this.rules.length;
      this.rules[index] = rule;
      this.sheet && this.sheet.insertRule(rule, index);
    }
  }

  insertDynamicRules(rules: string[]) {
    const curDynamicIndexes: number[] = [];
    let index: number;
    let dynamicIndex: number;
    for (let rule of rules) {
      index = this.rules.length;
      dynamicIndex = this.dynamicIndexes.length;
      this.rules[index] = rule;
      this.sheet && this.sheet.insertRule(this.rules[index], index);
      this.dynamicIndexes[dynamicIndex] = index;
      curDynamicIndexes.push(dynamicIndex);
    }

    // Always return rules in reverse order so that we don't end up with indexes out of range
    return curDynamicIndexes.sort((a, b) => b - a);
  }

  // Called with static index - NOT rule index
  removeRules(dynamicIndexes: number[]) {
    let ruleIndex: number;
    for (let dynamicIndex of dynamicIndexes) {
      ruleIndex = this.dynamicIndexes[dynamicIndex];
      this.rules.splice(ruleIndex, 1);
      try {
        // removeRules only called on the client so we know sheet exists
        (this.sheet as CSSStyleSheet).deleteRule(ruleIndex);
        this.dynamicIndexes[dynamicIndex] = -1; // no longer used

        // decrement higher indexes
        for (let i = 0; i < this.dynamicIndexes.length; i++) {
          let value = this.dynamicIndexes[i];
          if (value > ruleIndex) this.dynamicIndexes[i] = value - 1;
        }
      } catch (e) {
        console.log(e.message);
      }
    }
  }

  getStyleString() {
    return this.rules.join("\n");
  }

  reset() {
    this.rules = [];
    this.dynamicIndexes = [];
    if (this.tag) this.tag.remove();
    this.tag = null;
    this.tag = this.findOrCreateTag();
    this.sheet = this.getSheet();
  }
}
export const sheet = new StyleSheet();
