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
 * @providesModule addTestcheckCall
 * @flow
 */

"use strict";

const createGenArgument = require('./createGenArgument');
const t = require('babel-types');

module.exports = function addTestcheck(path, state, fnString) {
  const params = state.get('paramTypes'); // set by decypherParamTypes.js

  // creates `testcheck.check`
  const check = t.memberExpression(
    t.identifier('testcheck'),
    t.identifier('check')
  );

  // creates `testcheck.property`
  const property = t.memberExpression(
    t.identifier('testcheck'),
    t.identifier('property')
  );

  // creates `testcheckResults.push`
  const resultsPush = t.memberExpression(
    t.identifier('testcheckResults'),
    t.identifier('push')
  );

  const testcheckArgs = params.map(p => createGenArgument(p.type));

  // creates
  // ```js
  // testcheck.check(
  //   testcheck.property(
  //     [args],
  //     function() { ... }
  //   )
  // );
  // ```
  const fn = t.callExpression(check, [
    t.callExpression(property, [
      t.arrayExpression(testcheckArgs),
      t.identifier(fnString),
    ]),
  ]);

  // creates
  // ```js
  // {
  //   name: '',
  //   results: fn()
  // }
  const resultObject = t.objectExpression(
    [t.objectProperty(
      t.identifier('name'),
      t.stringLiteral(path.node.id.name)
    ), t.objectProperty(
      t.identifier('results'),
      fn
    )]
  );

  const allTogetherNow = t.callExpression(
    resultsPush,
    [resultObject]
  );

  path.insertAfter(allTogetherNow);
};
