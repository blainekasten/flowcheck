/* eslint-disable no-console */
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
 * @providesModule findFiles
 * @flow
 */

"use strict";

const glob = require('glob');
const fs = require('fs');

module.exports = function findFiles(cb) {
  console.log('  searching for @flowcheck\'s...'.yellow);

  let globPath = '**/*.js';
  globPath = '**/fixture.js'; // only for now until we actually build the cli

  glob(globPath, { ignore: ['**node_modules/**/*.js'] }, (err, files) => {
    if (err) {
      throw new Error(err);
    }

    const codeAndPath = files.map(file => {
      return {
        path: file,
        code: fs.readFileSync(file).toString('utf8'),
      };
    });

    const filteredForMatches = codeAndPath.filter(
      o => o.code.search(/\@flowcheck\(/) !== -1
    );

    console.log(`  Found ${filteredForMatches.length} file with @flowcheck directives`.yellow);

    cb(filteredForMatches);
  });
};
