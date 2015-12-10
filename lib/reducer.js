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
 * @param {Function} appReducer The provided reducer function.
 * @param {Object} [initialUI] The initial UI vDOM object which will become the first state to be rendered.
 * @param {Object} [options] Options to configure the generated reducer.
 * @param {Boolean} [options.logActions=false] Enable advanced logging of all actions fired.
 * @return {Function} Reducer function to be used to initialize a Redux store
 */
export function reducer(appReducer, initialUI = {}, options = {}) {

  const initialState = fromJS({ui: initialUI}, function (key, value) {
    var isIndexed = Iterable.isIndexed(value);
    return isIndexed ? value.toList() : value.toOrderedMap();
  }).merge(options.routes ? Map({routes: options.routes}) : Map());

  return function(state = initialState, action) {
    let nextState;
    switch (action.type) {
      case '_UPDATE_INPUT_VALUE':
        nextState = state.setIn(action.pathArray.concat(['props', 'value']), action.val);
        break;
      default:
        nextState = appReducer(state, action);
        break;
    }
    if (options.logActions) {
      storeAndLogState(action, nextState, state);
    }
    return nextState;
  }
}

/**
 * Log the previous state, an action, and the new state that resulted from that action
 *
 * @author Mark Nutter <marknutter@gmail.com>
 * @summary Advance state change logging.
 *
 * @param {Object} action The redux action object.
 * @param {Object} action.type The redux action type.
 * @param {Map} nextState The state resulting from having performed the given action
 * @param {Map} prevState The state as it was before the given action was performed
 */
function storeAndLogState(action, nextState, prevState) {
  const nextStateJS = nextState.toJS();
  console.log(`
----------------------------------------------------------------
ACTION TAKEN   `, action, `
NEW STATE      `, nextStateJS, `
PREVIOUS STATE `, prevState.toJS(), `
----------------------------------------------------------------`
  );
}



