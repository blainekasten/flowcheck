# flow-typecheck

This is very much a WIP.

But the goal is to make using testcheck super easy in JS without requiring much work
or writing of tests.

It heavily depends on proper flow tags.

The idea is this:

```js
/*
 * @typecheck(base, expression) {
 *   pow(base, expression) === Math.pow(base, expression)
 * }
 */
 function pow(b:number, e:number) {
  ...
 }
```

This is saying that this function should be testcheck'd with 2 random numbers and the specified comment property should be true.

If you want to contribute, please do. Lots of work to do here.
