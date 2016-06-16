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
 * @providesModule flowTagEvaluator
 * @flow
 */

"use strict";

module.exports = {
  Flow(path, state) {
    console.log('wtf')
    if (path.node.type === 'TypeAnnotation') return;
    const args = state.get('args');

    const argumentObject = args.args[args.nextIndex];

    if (!argumentObject) {
      return;
    }

    const argumentName = Object.keys(argumentObject)[0];

    argumentObject[argumentName] = path.node.type;
    args.nextIndex++;
    state.set('args', args);
  },
};
