# Tonami

Minimal CSS-in-JS library that promotes CSS best-practices and strongly-typed design systems.

## Get Started

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

<small>[Edit on Stackblitz](https://stackblitz.com/edit/react-ts-tgriyn?file=index.tsx)</small>

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

<small>[Edit on Stackblitz](https://stackblitz.com/edit/react-ts-b5hib9?file=index.tsx)</small>

Where tonami diverges from many other CSS-in-JS solutions is that the code produced uses [custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) to create dynamic styles.
