Another CSS in JS library. Coming soon!

The pattern that I had to do to accomplish the highlighting of specific line numbers is awful

It looks like

```
const [className] = useState(getUniqueClassName());
  useCss({
    [highlightRangeTsx
      ? `.${className} code span:nth-child(n+${highlightRangeTsx[0]}):nth-child(-n+${highlightRangeTsx[1]})`
      : `.${className}`]: highlightRangeTsx
      ? { css: { backgroundColor: "#ffffff1f" } }
      : {},
  });
```

This was in order to style specific instances of something differently using selectors. In other words I need a custom class to reference the instance. This could be done I think with a dynamic version of `makeClasses`, that would also remove it's styles on unmount (or lookup to see if it's styles are laying around somewhere and return the right class...)
