# @tscircuit/routing

[![npm version](https://badge.fury.io/js/@tscircuit%2Frouting.svg)](https://badge.fury.io/js/@tscircuit%2Frouting)

[Examples](https://routing-tsc.vercel.app/) &middot; [TSCircuit](https://tscircuit.com) &middot; [Open in CodeSandbox](https://codesandbox.io/p/github/tscircuit/routing)

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
