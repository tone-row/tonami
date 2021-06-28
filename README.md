<div align="center">

# Tonami

Minimal CSS-in-JS library that promotes CSS best-practices and strongly-typed design systems.

[![version][version-badge]][package]
![downloads per month][downloads]
![gzipped size][size]

</div>

> 🚨 **Warning**
>
> This API is still an experimental state. Until we reach 1.0.0 the API is subject to change.
>
> Use at your own risk!

## Getting Started

```bash
yarn add tonami
```

## Usage

The **styled** function works similarly to emotion or styled-components. However, tonami uses javascript objects instead of template literals, more like JSS.

```tsx
import { styled } from "tonami";

const DaBaDeeDaBaDi = styled.div({
  color: "blue",
});

export function Hits() {
  return <DaBaDeeDaBaDi>I'm blue</DaBaDeeDaBaDi>;
}
```

[View example on Stackblitz](https://stackblitz.com/edit/react-ts-bkgefl?file=index.tsx)

### Polymorphism with **as** prop

```tsx
import { styled } from "tonami";

const Text = styled.span({
  fontFamily: "cursive",
});

export function App() {
  return (
    <div>
      <Text as="h1">I'm an h1</Text>
      <Text as="h2">I'm an h2</Text>
      <Text as="button">I'm a button</Text>
    </div>
  );
}
```

### Dynamic Styles

You can use generics to declare the props your component should accept, and then reference those props in functions.

```tsx
import { styled } from "tonami";

interface Props {
  _color: string;
}

const Al = styled.div<Props>({
  color: ({ _color }) => _color,
});

export function Hits() {
  return <Al _color="green">Let's get married</Al>;
}
```

[View example on Stackblitz](https://stackblitz.com/edit/react-ts-b5hib9?file=index.tsx)

Where tonami diverges from many other CSS-in-JS solutions is that the code produced uses [custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) to create dynamic styles.

```html
/* Something like... */
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

Although there's nothing wrong with that approach, we must do extra work to solve a problem with javascript that the browser rendering engine is built to solve with CSS.

### Transient Props

You may have noticed in the earlier example that we named the prop underscore `_color` instead of just `color`. Tonami uses the starting character to identify props that should **not** be added to the DOM element.

This is a problem that all CSS-in-JS libraries that have a component factory have to deal with (see [styled-components](https://styled-components.com/docs/api#transient-props), [goober](https://github.com/cristianbote/goober#shouldforwardprop), [emotion](https://emotion.sh/docs/styled#customizing-prop-forwarding)) so we decided to make `_` the default. But you can easily change this.

<!-- prettier-ignore-start -->
[version-badge]: https://img.shields.io/npm/v/tonami?style=flat-square
[package]: https://www.npmjs.com/package/tonami
[downloads]: https://img.shields.io/npm/dm/tonami?style=flat-square
[size]: https://img.shields.io/bundlephobia/minzip/tonami?style=flat-square
<!-- prettier-ignore-end -->
