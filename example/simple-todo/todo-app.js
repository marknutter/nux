import {submitTodo, toggleTodo} from './todo-reducers';
import {init} from './../../src/index';
import {todoUi} from './todo-ui'

let todoApp = init((state, action) => {
  switch (action.type) {
    case 'SUBMIT_TODO':
      return submitTodo(state, action.title);
    case 'TOGGLE_TODO':
      return toggleTodo(state, action.tag);
  }
  return state;
}, {logActions: true, localStorage: 'nuxSimpleTodo'});

todoApp(todoUi);
