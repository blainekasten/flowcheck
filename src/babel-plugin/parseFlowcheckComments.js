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
 * @providesModule parseFlowcheckComment
 * @flow
 */

"use strict";

module.exports = function parseFlowcheckComment(comment) {
  let value = comment.value;
  const FLOWCHECK_DIRECTIVE = 'check(';

  const flowcheckDirectiveStartIndex = value.indexOf(FLOWCHECK_DIRECTIVE);

  // trim off any comments prior to flowcheck directive
  value = value.substring(flowcheckDirectiveStartIndex, value.length);

  /*
   * This is for comments of the /* style
   *
   * This order is important. We need to trim in the following order:
   * 1. Leading
   * 2. Trailing
   * 3. Middle
   */
  value = value.replace(/\/\*/g, ''); // leading `/*`
  value = value.replace(/\*\//g, ''); // trailing `*/`
  value = value.replace(/\*\s?/g, ''); // middle `* `

  // this is for this style of comments
  //or this
  value = value.replace(/\/\/\s?/g, '');

  const fn = value.replace(FLOWCHECK_DIRECTIVE, 'function flowcheck(');

  // make sure code is good, throw if not
  // some parsing error occured
  try {
    eval(fn); // eslint-disable-line no-eval
  } catch(e) {
    throw new Error(
      'Flowcheck parsing error\n' +
      '  Parsing the @flowcheck comments encountered an error.'
    );
  }

  return fn;
};
