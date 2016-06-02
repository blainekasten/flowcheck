"use strict";

const addTestcheckCall = require('./addTestcheckCall');
const decypherParamTypes = require('./decypherParamTypes');
const parseTestcheckComments = require('./parseTestcheckComments');
const t = require('babel-types');

module.exports = function flowParser() {
  const TESTCHECK_DIRECTIVE = '@testcheck';

  return {
    inherits: require('babel-plugin-syntax-flow'),
    visitor: {
      Program: {
        exit(path) {
          if (path.scope.hasBinding('testcheck')) return;

          // put testcheck import at the top of file
          const testcheckImportDeclaration = t.importDeclaration(
            [ t.importDefaultSpecifier(t.identifier('testcheck')) ],
            t.stringLiteral('testcheck')
          );

          path.node.body.unshift(testcheckImportDeclaration);

          path.scope.push({
            id: t.identifier('testcheckResults'),
            init: t.arrayExpression(),
          });

          // make the end of the file return the array
          path.node.body.push(t.identifier('testcheckResults'));
        },
      },

      Function: {
        enter(path, state) {
          state.set('wantsTestcheck', false);
          const comments = path.node.leadingComments;
          if (!comments) return;

          comments.forEach(function checkForDirective(comment) {
            if (comment.value.search(TESTCHECK_DIRECTIVE) !== -1) {
              state.set('wantsTestcheck', true);
              state.set('parsedCommentBlock', parseTestcheckComments(comment));
            }
          });

          if (state.get('wantsTestcheck')) {
            state.file.set('hasTestcheck', true);
            state.set('paramTypes', decypherParamTypes(path.node.params));
          }
        },

        exit(path, state) {
          if (!state.get('wantsTestcheck')) return;

          addTestcheckCall(path, state, state.get('parsedCommentBlock'));
        },
      },
    },
  };
};


