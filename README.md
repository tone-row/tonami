<div align="center">

# Tonami

Minimal CSS-in-JS library that promotes CSS best-practices and strongly-typed design systems.

[![version][version-badge]][package]
![downloads per month][downloads]
![gzipped size][size]
![test coverage][coverage]

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
  $color: string;
}

const SibylleBaier = styled.div<Props>({
  color: ({ $color }) => $color,
  textShadow: ({ $color }) => `2px 2px 2px ${$color}`,
});

function App() {
  return (
    <SibylleBaier $color="green">
      Tonight, when I got home from work. 🐈
    </SibylleBaier>
  );
}
```

[View example on Stackblitz](https://stackblitz.com/edit/react-ts-cv7pqy?file=index.tsx)

### Transient Props

By default, Tonami prevents props beginning with `$` from being added to the DOM element. You can customize this by replacing the function `options.shouldForwardProp` with your own.

```tsx
import { styled, options } from "tonami";

// Write your own function here
options.shouldForwardProp = (key, value) => !(key[0] === "_");

interface Props {
  _p: number;
}

const Box = styled.div<Props>({
  padding: ({ _p }) => _p + "px",
});

function App() {
  return <Box _p={100}>Much padding wow</Box>;
}
```

[View example on Stackblitz](https://stackblitz.com/edit/react-ts-12d91v?file=index.tsx)

In this example we prevent all props beginning with an underscore from be passed to the DOM element.

<!-- prettier-ignore-start -->
[version-badge]: https://img.shields.io/npm/v/tonami?style=flat-square
[package]: https://www.npmjs.com/package/tonami
[downloads]: https://img.shields.io/npm/dm/tonami?style=flat-square
[size]: https://img.shields.io/bundlephobia/minzip/tonami?style=flat-square
[coverage]: https://img.shields.io/codecov/c/github/tone-row/tonami?style=flat-square
<!-- prettier-ignore-end -->
