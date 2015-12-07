import {addTodo, toggleTodo, toggleAllTodos, showTodos, clearCompletedTodos, deleteTodo, showEditTodo, editTodo} from './todo-mvc-reducers';
import {init} from './../../../lib/index';
import {todoMvcUi} from './todo-mvc-ui'

let store = init((state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return addTodo(state, action.event);
    case 'TOGGLE_TODO':
      return toggleTodo(state, action.tag);
    case 'SHOW_EDIT_TODO':
      return showEditTodo(state, action.tag);
    case 'EDIT_TODO':
      return editTodo(state, action.tag);
    case 'DELETE_TODO':
      return deleteTodo(state, action.tag);
    case 'TOGGLE_ALL_TODOS':
      return toggleAllTodos(state);
    case 'SHOW_TODOS':
      return showTodos(state, action.view);
    case 'CLEAR_COMPLETED_TODOS':
      return clearCompletedTodos(state);
  }
  return state;
}, todoMvcUi, {localStorage: true, logActions: true});

let currentView = window.location.hash.split("#/")[1] || 'all';

store.dispatch({
  type: 'SHOW_TODOS',
  view: currentView
})