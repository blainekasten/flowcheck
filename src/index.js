/* eslint-disable no-console */

require('colors');

console.log('@flow-testcheck engaged!'.rainbow);

const parseStringifiedCode = require('./parseStringifiedCode');
const logResults = require('./logResults');
const findFiles = require('./findFiles');

// 1: Find files
findFiles(fileSet => {
  fileSet.forEach(file => {
    // 2: Parse
    const parsedCode = parseStringifiedCode(file.code);

    // 3: Evaluate
    const results = eval(parsedCode); // eslint-disable-line no-eval

    // 4: Report
    logResults(results);
  });
});

