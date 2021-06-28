<div align="center">

# Tonami

Minimal CSS-in-JS library that promotes CSS best-practices and strongly-typed design systems.

[![version][version-badge]][package]
![downloads per month][downloads]
![gzipped size][size]

</div>

## Getting Started

```bash
yarn add tonami
```

## Create

The **create** export is for writing components.

```tsx
import { create } from "tonami";

const DaBaDeeDaBaDi = create.div({
  color: "blue",
});

export function Hits() {
  return <DaBaDeeDaBaDi>I'm blue</DaBaDeeDaBaDi>;
}
```

[View example on Stackblitz](https://stackblitz.com/edit/react-ts-tgriyn?file=index.tsx)

You can use generics to declare the props your component should accept, and then reference those props in functions.

```tsx
import { create } from "tonami";

const Al = create.div<{ _color: string }>({
  color: ({ _color }) => _color,
});

export function Hits() {
  return <Al _color="green">Let's get married</Al>;
}
```

[View example on Stackblitz](https://stackblitz.com/edit/react-ts-b5hib9?file=index.tsx)

Where tonami diverges from many other CSS-in-JS solutions is that the code produced uses [custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) to create dynamic styles.

```html
<html>
  <head>
    <style>
      .a {
        color: var(--x);
      }
    </style>
  </head>
  <body>
    <div class="a" style="--x: green;">Let's get married</div>
  </body>
</html>
```

The benefit of this is that React is really good at writing changes to elements within the react tree, like our `<div>`. On the other hand, in order to write changes to things outside the react tree, like the `<style>` tag in the document's head, we have to go around react and do it ourselves.

Although there's nothing wrong with that approach, we end up doing **more** work only to solve a problem using javascript that the browser's rendering engine is already built to solve with CSS custom properties.

<!-- prettier-ignore-start -->
[version-badge]: https://img.shields.io/npm/v/tonami?style=flat-square
[package]: https://www.npmjs.com/package/tonami
[downloads]: https://img.shields.io/npm/dm/tonami?style=flat-square
[size]: https://img.shields.io/bundlephobia/minzip/tonami?style=flat-square
<!-- prettier-ignore-end -->
