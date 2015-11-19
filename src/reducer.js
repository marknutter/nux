import {fromJS, Map} from 'immutable';
import {initialUI} from './ui';
import {createTodo, loadInitialUI, toggleTodo} from './core-reducers';

window.appStates = [];


export default function reducer(state = Map(), action) {
  let nextState;
  switch (action.type) {
  case 'CREATE_TODO':
    return storeAndLogState(action, createTodo(state, action.title), state);
  case 'LOAD_INITIAL_UI':
    return storeAndLogState(action, loadInitialUI(state), state);
  case 'COMPLETE_TODO':
    return storeAndLogState(action, toggleTodo(state, action.tag, true), state);
  case 'UNCOMPLETE_TODO':
    return storeAndLogState(action, toggleTodo(state, action.tag, false), state);
  }
  return state;
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
  window.appStates.push(nextStateJS);
  return nextState;
}
