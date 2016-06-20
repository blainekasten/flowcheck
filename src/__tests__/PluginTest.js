'use strict';

jest.autoMockOff();
const transformCode = require.requireActual('../parseStringifiedCode');
const fs = require('fs');

const fixturePath = __dirname + '/fixtures';
const folders = fs.readdirSync(fixturePath);

const results = folders.map(folder => {
  const folderPath = fixturePath + '/' + folder;

  const filePath = folderPath + '/index.js';

  const actualPretransform = fs.readFileSync(filePath, 'utf8');
  const shouldThrow = actualPretransform.search('@NOT_SUPPORTED') !== -1;
  let parsedCode;
  let didThrow = false;

  if (shouldThrow) {
    try {
      parsedCode = transformCode(actualPretransform);
    } catch(e) {
      didThrow = true;
    }
  } else {
    parsedCode = transformCode(actualPretransform);
  }

  const _results = eval(parsedCode); // eslint-disable-line no-eval

  return {
    testType: folder,
    results: _results,
    didThrow,
    parsedCode,
    shouldThrow,
  };
});


describe('transform', () => {
  results.forEach(result => {
    it(`works for ${result.testType}`, () => {
      if (result.shouldThrow) {
        expect(result.didThrow).toBeTruthy();
      } else {
        expect(result.results[0]).toBeDefined();
      }
    });
  });
});
