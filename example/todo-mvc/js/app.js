import {addTodo, toggleTodo} from './todo-mvc-reducers';
import {init} from './../../../lib/index';
import {todoMvcUi} from './todo-mvc-ui'

init((state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return addTodo(state, action.event);
    case 'TOGGLE_TODO':
      return toggleTodo(state, action.tag);
  }
  return state;
}, todoMvcUi, {localStorage: false, logActions: true});
