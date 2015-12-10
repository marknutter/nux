import {submitTodo, toggleTodo} from './todo-reducers';
import {init} from './../../lib/index';
import {todoUi} from './todo-ui'

init((state, action) => {
  switch (action.type) {
    case 'SUBMIT_TODO':
      return submitTodo(state, action.title);
    case 'TOGGLE_TODO':
      return toggleTodo(state, action.tag);
  }
  return state;
}, todoUi, {localStorage: true, logActions: true});
