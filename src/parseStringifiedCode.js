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
 * @providesModule parseStringifiedCode
 * @flow
 */

const babel = require('babel-core');
const flowcheckParser = require('./babel-plugin');
const es2015 = require('babel-preset-es2015');
const stripFlow = require('babel-plugin-transform-flow-strip-types');
const syntaxFlow = require('babel-plugin-syntax-flow');


module.exports = function parseStringifiedCode(code) {
  return babel.transform(code, {
    presets: [
      es2015,
    ],
    plugins: [
      syntaxFlow,
      flowcheckParser,
      stripFlow,
    ],
  }).code;
};
