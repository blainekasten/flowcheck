/*
 * Early on, there was a parsing bug where we would interpret
 * all comments as the flowcheck declaration, and try and make it
 * into real code. This test prevents that regression as it 
 * effectively makes flowcheck unusable.
 */

/*
 * Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
 * @testcheck(bar) {
 *   return foo(bar) === bar;
 * }
 */
function foo(bar:number) {
  return bar;
}
