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

## API

### Styed

#### Basic Usage

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

#### Polymorphism

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

#### Dynamic Properties with CSS Variables

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

When rendered, this uses CSS Custom Properties to apply the color dynamically rather than dyanmically update the CSS at runtime.

#### Transient Props

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

#### Dynamic Styles

So far we've only passed one argument to the styled function. This represents one [ruleset](https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax#css_rulesets) for which a class is generated and applied to the DOM Element. However, you can define multiple rulesets! 🎉 The `condition` property tells tonami whether to apply the class at runtime.

```tsx
interface Props {
  $color: string;
  $isWacky: boolean;
}

const Text = styled.div<Props>(
  {
    color: ({ $color }) => $color
  },
  {
    // <-- Passing a second argument/ruleset
    fontFamily: 'cursive',
    textShadow: '2px 2px 10px',
    condition: props => props.$isWacky // <-- when to apply this class
  }
);

function App() {
  return (
    <div>
      <Text $color="blue">Not so wacky</Text>
      <Text $color="orangered" $isWacky={true}>
        Pretty wacky
      </Text>
    </div>
  );
}
```

[View example on Stackblitz](https://stackblitz.com/edit/react-ts-lm55b7?file=index.tsx)

In line with the benefits of using CSS custom properties for dynamic values, generating static classes which are then toggled at runtime saves on client compute power and is ultimately faster.

#### Nested Selectors

In traditional CSS-in-JS libs it's important to have a way to style elements inside your root element. In tonami, you pass an object to `selectors`, and each key in your object must include `&` and `{}`. This is slightly different syntax than other libs so an example will probably illustrate better.

```tsx
interface Props {
  $size: number;
}

const Text = styled.div<Props>({
  fontSize: ({ $size }) => $size * 6 + 'px',
  selectors: {
    '&:hover {}': {
      color: 'blue'
    },
    '@media(min-width: 600px) { & {} }': {
      fontSize: ({ $size }) => $size * 8 + 'px'
    }
  }
});

function App() {
  return <Text $size={5}>Large Text</Text>;
}
```

[View Example on Stackblitz](https://stackblitz.com/edit/react-ts-dcsepx?file=index.tsx)

In this example we defined a different color on hover, and also a larger font size (still based on our props) on screens wider than 600px.


<!-- prettier-ignore-start -->
[version-badge]: https://img.shields.io/npm/v/tonami?style=flat-square
[package]: https://www.npmjs.com/package/tonami
[downloads]: https://img.shields.io/npm/dm/tonami?style=flat-square
[size]: https://img.shields.io/bundlephobia/minzip/tonami?style=flat-square
[coverage]: https://img.shields.io/codecov/c/github/tone-row/tonami?style=flat-square
<!-- prettier-ignore-end -->
