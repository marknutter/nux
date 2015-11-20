import {Map} from 'immutable';
import {submitTodo, loadInitialUI, toggleTodo, updateInputValue} from './core-reducers';


export default function reducer(state = Map(), action) {
  let nextState;
  switch (action.type) {
    case 'SUBMIT_TODO':
      nextState = submitTodo(state, action.title);
      break;
    case 'LOAD_INITIAL_UI':
      nextState = loadInitialUI(state, action.ui);
      break;
    case 'TOGGLE_TODO':
      nextState = toggleTodo(state, action.tag);
      break;
    case 'UPDATE_INPUT_VALUE':
      nextState = updateInputValue(state, action.val, action.pathArray);
      break;
    default:
      nextState = state;
      break;
  }
  storeAndLogState(action, nextState, state);
  return nextState;
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
