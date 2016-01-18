'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducer = reducer;

var _immutable = require('immutable');

/**
 * Create a reducer using a provided reducer combined with Nux's internal reducer. An initial vDOM UI object
 * can be passed in to initialize the store with, as well as any options to further configure the reducer.
 * The reducer returned is intended for use with a Redux store.
 *
 * @author Mark Nutter <marknutter@gmail.com>
 * @summary Generate a Nux reducer function given a custom reducer function.
 *
 * @param {Object}    [initialUI] The initial UI vDOM object which will become the first state to be rendered.
 * @return {Function} The core reducer function to be used to initialize a Redux store
 */
function reducer(initialUI) {

  var initialState = (0, _immutable.fromJS)(initialUI, function (key, value) {
    var isIndexed = _immutable.Iterable.isIndexed(value);
    return isIndexed ? value.toList() : value.toOrderedMap();
  });

  return function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments[1];

    var nextState = undefined;
    switch (action.type) {
      case '_UPDATE_INPUT_VALUE':
        nextState = state.setIn(action.pathArray.concat(['props', 'value']), action.val);
        break;
      default:
        nextState = state;
        break;
    }
    return nextState;
  };
} /** @module reducer */

/**
 * An Immutable Map.
 * @typedef {Object} Map
 */