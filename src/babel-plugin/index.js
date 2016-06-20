"use strict";

const addTestcheckCall = require('./addTestcheckCall');
const decypherParamTypes = require('./decypherParamTypes');
const parseFlowcheckComments = require('./parseFlowcheckComments');
const t = require('babel-types');

module.exports = function flowParser() {
  // I want the directive look up to be @flowcheck
  // but `babel-plugin-transform-flow-strip` removes the @flow part
  // of the directive before I get it..
  // Maybe we can submit a PR to them to only get @flow\n
  const FLOWCHECK_DIRECTIVE = 'check\(';

  return {
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
            if (comment.value.indexOf(FLOWCHECK_DIRECTIVE) >= 0) {
              state.set('wantsTestcheck', true);
              state.set('parsedCommentBlock', parseFlowcheckComments(comment));
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

      'ExportNamedDeclaration|ExportDefaultDeclaration'(path) {
        const comments = path.node.leadingComments;
        if (!comments) return;


        comments.forEach(function checkForDirective(comment) {
          if (comment.value.indexOf(FLOWCHECK_DIRECTIVE) >= 0) {
            throw new Error(
              'Flowcheck: Unsupported syntax. Flowcheck does not currently support comments on exported functions'
            );
          }
        });
      },
    },
  };
};


