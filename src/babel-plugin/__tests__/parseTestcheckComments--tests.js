const _parse = require.requireActual('../parseTestcheckComments');

function parseTestcheckComments(value) {
  return _parse({
    value,
  });
}

const expectation =
  'function testcheck() {' +
  '}';

describe('parsing comments', () => {
  it('removes the and /* style comments */', () => {
    const comments =
      '/*' +
       '* @testcheck() {' +
       '* }' +
       '*/';

    const parsed = parseTestcheckComments(comments);

    expect(parsed).toBe(expectation);
  });

  it('removes the /*style*/ with bad spacing', () => {
    const comments =
      '/*' +
       '*@testcheck() {' +
       '*}' +
       '*/';

    const parsed = parseTestcheckComments(comments);

    expect(parsed).toBe(expectation);
  });

  it('removes the // style comments', () => {
    const comments =
      '// @testcheck() {' +
      '// }';

    const parsed = parseTestcheckComments(comments);

    expect(parsed).toBe(expectation);
  });

  it('removes the // with bad spacing', () => {
    const comments =
      '//@testcheck() {' +
      '//}';

    const parsed = parseTestcheckComments(comments);

    expect(parsed).toBe(expectation);
  });


  it('ignores the extra comments leading the testcheck directive', () => {
    const comments =
      '/*' +
       '* lorem ipsum bull shit' +
       '* @testcheck() {' +
       '* }' +
       '*/';

    const parsed = parseTestcheckComments(comments);

    expect(parsed).toBe(expectation);
  });


  it('throws if there are extra comments trailing the testcheck directive', () => {
    const comments =
      '/*' +
       '* @testcheck() {' +
       '* }' +
       '* lorem ipsum bull shit' +
       '*/';

    expect(
      () => parseTestcheckComments(comments)
    ).toThrow();
  });
});
