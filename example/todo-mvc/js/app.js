import {submitTodo, toggleTodo} from './todo-mvc-reducers';
import {init} from './../../.lib/index';
import {todoMvcUi} from './todo-mvc-ui'

init((state, action) => {
  switch (action.type) {
    case 'SUBMIT_TODO':
      return submitTodo(state, action.title);
    case 'TOGGLE_TODO':
      return toggleTodo(state, action.tag);
  }
  return state;
}, todoMvcUi, {localStorage: true, logActions: true});
