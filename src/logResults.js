/*
 * Copyright 2016
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule logResults
 * @flow
 */

module.exports = function logResults(results) {
  results.sort(r => !r.results.result);


  results.forEach(result => {
    const didPass = result.results.result;
    if (didPass) {
      logSuccess(result.name);
    } else {
      logFailure(result);
    }
  })
};

function logSuccess(name) {
  console.log(`\nSuccess: Function "${name}" passed the flowcheck!`.green);
}

function logFailure(result) {
  const resultData = result.results;
  console.log(`\nFailure: Function "${result.name}" failed the flowcheck!`.red);
  console.log('  Arguments that triggered Failure:'.cyan, resultData.fail + ''.yellow);
  console.log(`\n  - FailingSize: ${resultData['failing-size']}`.cyan);
  console.log(`  - NumberOfTests: ${resultData['num-tests']}`.cyan);
}
