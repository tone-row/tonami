<div align="center">

# Tonami

CSS-in-JS library with a familir API that uses CSS custom properties under the hood

[![version][version-badge]][package]
![downloads per month][downloads]
![gzipped size][size]
![test coverage][coverage]

</div>

> 🚨 **Warning**
>
> Until we reach v1.0.0 the API still may change.

## Get Started

```bash
yarn add tonami
```

## Documentation

https://tonami.dev

## Example

```jsx
import { createTokens, styled, createGlobalStyle } from "tonami";

const theme = createTokens({
  fontFamily: "Helvetica",
  borderRadius: "3px",
});

const Global = createGlobalStyle({
  html: {
    fontFamily: theme.fontFamily,
  },
});

const Banner = styled.div({
  borderRadius: theme.borderRadius,
  backgroundColor: ({ $color }) => $color,
});

const { Tokens } = theme;

function App() {
  return (
    <>
      <Tokens />
      <Global />
      <Banner $color="lightgreen">Welcome!</Banner>
    </>
  );
}
```

## Issues

Please file an issue for bugs or unexpected behavior.

## Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding a 👍.

## License

MIT

<!-- prettier-ignore-start -->
[version-badge]: https://img.shields.io/npm/v/tonami?style=flat-square
[package]: https://www.npmjs.com/package/tonami
[downloads]: https://img.shields.io/npm/dm/tonami?style=flat-square
[size]: https://img.shields.io/bundlephobia/minzip/tonami?style=flat-square
[coverage]: https://img.shields.io/codecov/c/github/tone-row/tonami?style=flat-square
<!-- prettier-ignore-end -->
