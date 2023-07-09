# @tscircuit/routing

This library has deterministic routing algorithms for PCB autorouting inside
of [tscircuit](https://tscircuit.com)

## Usage

```
npm add @tscircuit/routing
```

```ts
import { findRoute } from "@tscircuit/routing"

findRoute({
  // ...
})
```

## Testing

Run `npm run storybook` to test the routing algorithms inside of storybook. You
can use the storybook to reproduce errors or edge cases.
