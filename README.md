<div align="center">

# Tonami

Minimal CSS-in-JS library that promotes CSS best-practices and strongly-typed design systems.

[![version][version-badge]][package]
![downloads per month][downloads]
![gzipped size][size]

</div>

> 🚨 **Warning**
>
> Until we reach v1.0.0 the API still may change.
>
> Use at your own risk!

## Getting Started

```bash
yarn add tonami
```

## Styled

### Basic Usage

The **styled** function works similarly to [emotion](https://github.com/emotion-js/emotion) or [styled-components](https://github.com/styled-components/styled-components). However, tonami uses javascript objects instead of template literals (more like [JSS](https://github.com/cssinjs/jss)).

```tsx
import { styled } from "tonami";

const DaBaDeeDaBaDi = styled.div({
  color: "blue",
});

function App() {
  return <DaBaDeeDaBaDi>I'm blue</DaBaDeeDaBaDi>;
}
```

[View example on Stackblitz](https://stackblitz.com/edit/react-ts-bkgefl?file=index.tsx)

### Polymorphism

We also support polymorphism (changing the DOM element) via the `as` prop

```tsx
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

[View example on Stackblitz](https://stackblitz.com/edit/react-ts-jxvq3j?file=index.tsx)

### Dynamic Styles

Use a function to dynamically set a property value. In Typescript, a generic can be passed for type-safety & intellisense.

```tsx
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

### Transient Props

You may have noticed in the earlier example that we named the prop underscore `_color` instead of just `color`. Tonami uses the starting character to identify props that should **not** be added to the DOM element.

This is a problem that all CSS-in-JS libraries that have a component factory have to deal with (see [styled-components](https://styled-components.com/docs/api#transient-props), [goober](https://github.com/cristianbote/goober#shouldforwardprop), [emotion](https://emotion.sh/docs/styled#customizing-prop-forwarding)) so we decided to make `_` the default. But you can easily change this.

<!-- prettier-ignore-start -->
[version-badge]: https://img.shields.io/npm/v/tonami?style=flat-square
[package]: https://www.npmjs.com/package/tonami
[downloads]: https://img.shields.io/npm/dm/tonami?style=flat-square
[size]: https://img.shields.io/bundlephobia/minzip/tonami?style=flat-square
<!-- prettier-ignore-end -->
