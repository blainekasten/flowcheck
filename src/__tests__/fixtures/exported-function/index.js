/*
 * Functions that have an export before them hit the parser
 * differently. This is a very expected work-flow, so it is a
 * MUST_WORK.
 */

/*
 * @testcheck(bar) {
 *   return foo(bar) === bar;
 * }
 */
export function foo(bar:number) {
  return bar;
}