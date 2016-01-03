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
 * @param {Function} appReducer The provided reducer function.
 * @param {Object} [initialUI] The initial UI vDOM object which will become the first state to be rendered.
 * @param {Object} [options] Options to configure the generated reducer.
 * @param {Boolean} [options.logActions=false] Enable advanced logging of all actions fired.
 * @return {Function} Reducer function to be used to initialize a Redux store
 */
function reducer(appReducer) {
  var initialUI = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var initialState = (0, _immutable.fromJS)({ ui: initialUI }, function (key, value) {
    var isIndexed = _immutable.Iterable.isIndexed(value);
    return isIndexed ? value.toList() : value.toOrderedMap();
  }).merge(options.routes ? (0, _immutable.fromJS)({ routes: options.routes }) : {});

  return function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments[1];

    var nextState = undefined;
    switch (action.type) {
      case '_UPDATE_INPUT_VALUE':
        nextState = state.setIn(action.pathArray.concat(['props', 'value']), action.val);
        break;
      default:
        nextState = appReducer(state, action);
        break;
    }
    return nextState;
  };
} /** @module reducer */

/**
 * An Immutable Map.
 * @typedef {Object} Map
 */