'use strict';

var assertion_properties = [
  'Promise',
  'fulfilled',
  'fulfilledWith',
  'rejected',
  'rejectedWith',
  'finally',
  'eventually'
];

function isPromiseAssertionProperty(property) {
  var name = property && (property.name || property.value);
  return name && assertion_properties.indexOf(name) !== -1;
}

function ancestorReturns(parents) {
  for (var i = parents.length - 1; i >= 0; i--) {
    var parent = parents[i];
    var type = parent.type;
    if (type === 'ReturnStatement' || type === 'YieldExpression') {
      return true;
    }
    if (type === 'ArrowFunctionExpression' && parent.body.type === 'CallExpression') {
      return true;
    }
    if (type === 'FunctionExpression') {
      return false;
    }
  }
  return false;
}


module.exports = function(context) {
  return {
    MemberExpression: function(node) {
      if (!isPromiseAssertionProperty(node.property)) {
        return;
      }

      if (ancestorReturns(context.getAncestors(node))) {
        return;
      }

      context.report(node.property, 'Promise assertion must return or await.');
    }
  };
};
