const babel = require('babel-core');
const flowParser = require('./src/index.js');
const es2015 = require('babel-preset-es2015');
const stripFlow = require('babel-plugin-transform-flow-strip-types');

// this is the code that will get parsed
const code = `
/*
 * @testcheck(base, exponent) {
 *   return pow(base, exponent) === Math.pow(base, exponent)
 * }
 */
function pow(base, exponent) {
  var result = 1;
  while (--exponent > 0) {
    result *= base;
  }
  return result;
}
`;


const parsed = babel.transform(code, {
  presets: [es2015],
  plugins: [
    flowParser,
    stripFlow,
  ],
});

console.log(parsed.code); // eslint-disable-line no-console
//const result = eval(parsed.code);
//console.log(result);










/*
This is roughly what the output code should look like:
*/

/*
  const testcheck = require('testcheck');
  const gen = testcheck.gen;

  function pow(base, exponent) {
    var result = 1;
    while (--exponent > 0) {
      result *= base;
    }
    return result;
  }

  console.log(testcheck.check(
    testcheck.property(
      [gen.int, gen.int],
      (arg1, arg2) => pow(arg1, arg2) === Math.pow(arg1, arg2)
    )
  ));
*/
