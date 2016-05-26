"use strict";
const nameFunction = require('babel-helper-function-name');

module.exports = function flowParser(babel) {
  const t = babel.types;
  const TESTCHECK_DIRECTIVE = '@testcheck';

  return {
    inherits: require('babel-plugin-syntax-flow'),
    visitor: {
      Program: {
        enter(path, state) {
          state.file.set('hasTestcheck', false);
        },

        exit(path, state) {
          if (!state.file.get('hasTestcheck') || path.scope.hasBinding('testcheck')) return;

          // put testcheck import at the top of file
          const testcheckImportDeclaration = t.importDeclaration([
            t.importDefaultSpecifier(t.identifier('testcheck')),
          ], t.stringLiteral('testcheck'));

          const globalGenDeclaration = t.expressionk
          
          path.node.body.unshift(testcheckImportDeclaration);
        },
      },

      Function: {
        enter(path, state) {
          let wantsTestCheck = false;
          const comments = path.node.leadingComments;
          if (!comments) return;

          comments.forEach(function checkForDirective(comment) {
            if (comment.value.search(TESTCHECK_DIRECTIVE) !== -1) {
              wantsTestCheck = true;
            }
          });

          if (wantsTestCheck) {
            state.file.set('hasTestcheck', true);
            path.traverse(flowTagEvaluator, buildFunctionArgumentState(path));
          }
        },

        exit(path, state) {
          if (!state.file.get('hasTestcheck')) return;

          if (path.parent.scope) {
            path.parent.scope.push({
              id: t.identifier('__gen'),
              init: t.identifier('_testcheck2.gen'), // bug needs to get from path
            });
          }
        },
      },
    },
  };
};

function buildFunctionArgumentState(path) {
  const args = path.node.params.map(
    param => ({[param.name]: undefined})
  );

  return {
    args,
    nextIndex: 0,
  };
};

const flowTagEvaluator = {
  Flow(path, state) {
    if (path.node.type === 'TypeAnnotation') return;

    const argumentObject = state.args[state.nextIndex];

    if (!argumentObject) {
      return;
    }

    const argumentName = Object.keys(argumentObject)[0];

    argumentObject[argumentName] = path.node.type;
    state.nextIndex++;
  },
}
