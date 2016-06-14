jest.autoMockOff();
const transformCode = require.requireActual('../parseStringifiedCode');
const fs = require('fs');

const fixturePath = __dirname + '/fixtures';
const folders = fs.readdirSync(fixturePath);

const results = folders.map(folder => {
  const folderPath = fixturePath + '/' + folder;

  const filePath = folderPath + '/index.js';

  const actualPretransform = fs.readFileSync(filePath, 'utf8');

  const parsedCode = transformCode(actualPretransform);

  const flowcheckResults = eval(parsedCode); // eslint-disable-line no-eval

  return {
    testType: folder,
    results: flowcheckResults,
  };
});


describe('transform', () => {
  results.forEach(result => {
    it(`works for ${result.testType}`, () => {
      expect(result.results[0]).toBeDefined();
    });
  });
});
