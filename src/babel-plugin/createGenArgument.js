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
 * @providesModule createGenArgument
 * @flow
 */

"use strict";
const t = require('babel-types');

module.exports = function createGenArgument(type, optional) {
  const testcheckGen = t.memberExpression(
    t.identifier('testcheck'),
    t.identifier('gen')
  );

  const typeIdentifier = t.memberExpression(
    testcheckGen,
    t.identifier(type)
  );

  //if (!optional) {
    //const notEmptyIdentifier = t.memberExpression(
      //testcheckGen,
      //t.identifier('notEmpty')
    //);

    //return t.callExpression(
      //notEmptyIdentifier,
      //[typeIdentifier]
    //);
  //}

  return typeIdentifier;
};
