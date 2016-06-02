/*
 * @testcheck(bar) {
 *   return foo(bar) === bar;
 * }
 */
function foo(bar:number) {
  return bar;
}


let nonPureCounter = 0;
/*
 * @testcheck(arg1) {
 *   return baz(arg1) === baz(arg1);
 * }
 */
function baz(arg1:number) {
  nonPureCounter++;
  return arg1 + nonPureCounter;
}
