import {Map, fromJS, Iterable} from 'immutable';

export function reducer(appReducer, opts = {}) {

  return function(state = Map(), action) {
    let nextState;
    switch (action.type) {
      case '_LOAD_INITIAL_UI':
        const ui = fromJS(action.ui, function (key, value) {
          var isIndexed = Iterable.isIndexed(value);
          return isIndexed ? value.toList() : value.toOrderedMap();
        });
        nextState = state.set('ui', ui);
        break;
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



