## Motivation

I wanted a way to add a sprinkle of dynamic styles to a javascript application that didn't involve too much overhead. By overhead I mean things like, extracting css files, or varying syntax to support certain css features.

I am a huge fan of other CSS-in-JS solutions styled-components, jss, goober. They all have their place. I think the best way I can explain the different approach of this library is that, this is not a library for writing CSS. It's a library for adding dynamic CSS using custom properties, and doing so from the component's perspective.

Having used lots of css-in-js libraries, I don't always enjoy "writing" css in js. Rather, what I want is access to my theme variables when I need them, and a little bit of JS runtime (as needed) to generate values at build time or compile as-needed.

If all of that sounds like something worth trying. Give this package a spin!
