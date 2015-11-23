import {Map, fromJS, Iterable} from 'immutable';

export default function reducer(appReducer) {

  return function(state = Map(), action) {
    let nextState;
    switch (action.type) {
      case 'LOAD_INITIAL_UI':
        const ui = fromJS(action.ui, function (key, value) {
          var isIndexed = Iterable.isIndexed(value);
          return isIndexed ? value.toList() : value.toOrderedMap();
        });
        nextState = state.set('ui', ui);
        break;
      case 'UPDATE_INPUT_VALUE':
        nextState = state.setIn(action.pathArray.concat(['props', 'value']), action.val);
        break;
      default:
        nextState = appReducer(state, action);
        break;
    }
    storeAndLogState(action, nextState, state);
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



