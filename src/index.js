/* eslint-disable no-use-before-define */
"use strict";

module.exports = function flowParser(babel) {
  const t = babel.types;
  const TESTCHECK_DIRECTIVE = '@testcheck';

  return {
    inherits: require('babel-plugin-syntax-flow'),
    visitor: {
      Program: {
        enter(path, state) {
          state.file.set('hasTestcheck', false);
          state.file.set('hasTestcheckGenVar', false);
        },

        exit(path, state) {
          if (!state.file.get('hasTestcheck') || path.scope.hasBinding('testcheck')) return;

          // put testcheck import at the top of file
          const testcheckImportDeclaration = t.importDeclaration(
            [ t.importDefaultSpecifier(t.identifier('testcheck')) ],
            t.stringLiteral('testcheck')
          );

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
          if (!state.file.get('hasTestcheckGenVar')) {
            addTestcheckGenVariable(path, t);
            state.file.set('hasTestcheckGenVar', true);
          }

          addTestcheck(path, t, state);
        },
      },
    },
  };
};

function addTestcheck(path, t, state) {
  const checkCall = t.memberExpression(
    t.identifier('testcheck'),
    t.identifier('check')
  );

  const propertyCall = t.memberExpression(
    t.identifier('testcheck'),
    t.identifier('property')
  );

  const testcheckArgs = [];

  console.log(state.args)


  const fn = t.callExpression(checkCall, [
    t.callExpression(propertyCall, [
      t.arrayExpression(testcheckArgs),
      t.identifier(path.node.id.name),
    ]),
  ]);
  path.insertAfter(fn);
}

// adds testcheck to the module definition
function addTestcheckGenVariable(path, t) {
  // right side of `var gen =``
  const gen = t.memberExpression(
    t.identifier('testcheck'),
    t.identifier('gen')
  );

  // finds top-most path
  const childOfProgramPath = path.find(
    _path => _path.parentPath.isProgram()
  );

  // create a unique variable in that path
  const uid = childOfProgramPath.scope.generateUidIdentifier('gen');

  // create the variable declaration
  const genVar = t.variableDeclaration('var', [
    t.variableDeclarator(uid, gen),
  ]);

  // add variable to code
  childOfProgramPath.insertBefore(genVar);
}

function buildFunctionArgumentState(path) {
  const args = path.node.params.map(
    param => ({[param.name]: undefined})
  );

  return {
    args,
    nextIndex: 0,
  };
}

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
