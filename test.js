const babel = require('babel-core');
const flowParser = require('./src/index.js');
const es2015 = require('babel-preset-es2015');
const stripFlow = require('babel-plugin-transform-flow-strip-types');

const code = `
/*
* @testcheck(base, exponent) {
*   pow(base, exponent) === Math.pow(base, exponent)
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

//var gen = testcheck.gen;
// export the results of the test
/*console.log(testcheck.check(
  testcheck.property(
    [gen.int, gen.int],
  )
));
*/

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


// property check = boolean response
