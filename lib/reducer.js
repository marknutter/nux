import {fromJS, Iterable} from 'immutable';

export function reducer(appReducer, initialUI = {}, opts = {}) {

  const initialState = fromJS({ui: initialUI}, function (key, value) {
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
        nextState = appReducer(state, action);
        break;
    }
    if (opts.logActions) {
      storeAndLogState(action, nextState, state);
    }
    return nextState;
  }
}


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



