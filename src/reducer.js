/** @module reducer */


/**
 * An Immutable Map.
 * @typedef {Object} Map
 */


import {fromJS, Iterable, Map} from 'immutable';


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
export function reducer(initialUI) {

  const initialState = fromJS(initialUI, function (key, value) {
    var isIndexed = Iterable.isIndexed(value);
    return isIndexed ? value.toList() : value.toOrderedMap();
  });

  return function(state = initialState, action) {
    let nextState;
    switch (action.type) {
      case '_UPDATE_INPUT_VALUE':
        nextState = state.setIn(action.pathArray.concat(['props', 'value']), action.val);
        break;
      default:
        nextState = state;
        break;
    }
    return nextState;
  }
}



