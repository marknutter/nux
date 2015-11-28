
import {Map} from 'immutable';
import {submitTodo, loadInitialUI, toggleTodo, updateInputValue} from './todo-reducers';
import {init} from './../lib/index';

import {todoUi} from './todo-ui'

init((state, action) => {
  let nextState;
  switch (action.type) {
    case 'SUBMIT_TODO':
      nextState = submitTodo(state, action.title);
      break;
    case 'TOGGLE_TODO':
      nextState = toggleTodo(state, action.tag);
      break;
    default:
      nextState = state;
      break;
  }
  return nextState;
}, todoUi, {localStorage: true, logActions: true});
