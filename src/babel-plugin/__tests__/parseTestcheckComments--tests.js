const _parse = require.requireActual('../parseFlowcheckComments');

function parseflowcheckComments(value) {
  return _parse({
    value,
  });
}

const expectation =
  'function flowcheck() {' +
  '}';

describe('parsing comments', () => {
  it('removes the and /* style comments */', () => {
    const comments =
      '/*' +
       '* @flowcheck() {' +
       '* }' +
       '*/';

    const parsed = parseflowcheckComments(comments);

    expect(parsed).toBe(expectation);
  });

  it('removes the /*style*/ with bad spacing', () => {
    const comments =
      '/*' +
       '*@flowcheck() {' +
       '*}' +
       '*/';

    const parsed = parseflowcheckComments(comments);

    expect(parsed).toBe(expectation);
  });

  it('removes the // style comments', () => {
    const comments =
      '// @flowcheck() {' +
      '// }';

    const parsed = parseflowcheckComments(comments);

    expect(parsed).toBe(expectation);
  });

  it('removes the // with bad spacing', () => {
    const comments =
      '//@flowcheck() {' +
      '//}';

    const parsed = parseflowcheckComments(comments);

    expect(parsed).toBe(expectation);
  });


  it('ignores the extra comments leading the flowcheck directive', () => {
    const comments =
      '/*' +
       '* lorem ipsum bull shit' +
       '* @flowcheck() {' +
       '* }' +
       '*/';

    const parsed = parseflowcheckComments(comments);

    expect(parsed).toBe(expectation);
  });


  it('throws if there are extra comments trailing the flowcheck directive', () => {
    const comments =
      '/*' +
       '* @flowcheck() {' +
       '* }' +
       '* lorem ipsum bull shit' +
       '*/';

    expect(
      () => parseflowcheckComments(comments)
    ).toThrow();
  });
});
