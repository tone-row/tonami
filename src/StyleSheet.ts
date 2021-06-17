import { DEFAULT_STYLE_TAG_ID, IS_BROWSER } from "./constants";

const matchSets = /\/\* ~~~[\w\d]+~~~ \*\/\n.*$/gm;
const matchSingleStyle = /\/\* ~~~(?<id>[\w\d]+)~~~ \*\/\n(?<style>.*)$/gm;

class StyleSheet {
  styles: Record<string, string>;
  tag: null | HTMLStyleElement;

  constructor() {
    let styles = {};

    // On the client we initialize style using the server-rendered tag
    if (IS_BROWSER) {
      const style = document.getElementById(DEFAULT_STYLE_TAG_ID)?.innerHTML;
      if (style) {
        const sets = [...style.matchAll(matchSets)];
        for (const set of sets) {
          const setString = set[0];
          const match = matchSingleStyle.exec(setString);
          if (match?.groups) {
            styles[match.groups.id] = match.groups.style;
          }
        }
      }
    }
    this.styles = styles;
    this.createTag();
  }

  setStyle(id: string, CSS: string) {
    if (!(id in this.styles) || this.styles[id] !== CSS) {
      this.styles[id] = CSS;
      // Update styles everytime a style is set
      this.writeStyles();
    }
  }

  removeStyle(id: string) {
    delete this.styles[id];
    this.writeStyles();
  }

  // Make style tag
  createTag() {
    if (
      IS_BROWSER &&
      !this.tag &&
      !document.getElementById(DEFAULT_STYLE_TAG_ID)
    ) {
      const style = document.createElement("style");
      style.setAttribute("id", DEFAULT_STYLE_TAG_ID);
      style.setAttribute("data-testid", DEFAULT_STYLE_TAG_ID);
      document.head.appendChild(style);
      this.tag = style;
      return style;
    } else if (
      IS_BROWSER &&
      !this.tag &&
      document.getElementById(DEFAULT_STYLE_TAG_ID)
    ) {
      this.tag = document.getElementById(
        DEFAULT_STYLE_TAG_ID
      ) as HTMLStyleElement;
    }
    return null;
  }

  // Get the style tag
  getTag() {
    return this.tag || this.createTag();
  }

  // Return string of styles
  getStyleString() {
    let css = [];
    for (let id in this.styles) {
      css.push(`/* ~~~${id}~~~ */`);
      css.push(this.styles[id]);
    }
    return css.join("\n");
  }

  // Write styles to tag
  writeStyles() {
    let tag = this.getTag();
    if (tag) {
      tag.innerHTML = this.getStyleString();
    }
  }
}
const mainSheet = new StyleSheet();
export function useStyleSheet() {
  return mainSheet;
}
