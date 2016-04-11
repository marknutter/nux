import {addTodo, toggleTodo, toggleAllTodos, showTodos, clearCompletedTodos, deleteTodo, showEditTodo, editTodo, cancelEditTodo} from './todo-mvc-reducers';
import {init} from './../../../src/index';
import {todoMvcUi} from './todo-mvc-ui'


let todoMvc = init((state = todoMvcUi, action) => {
  const todoapp = state.getIn(['ui','div#todoapp','section.todoapp']);
  return {
    ui: {
      'div#todoapp': {
        'section.todoapp': {
          'header.header': header(todoapp.getIn('header.header'), action),
          'section.main': mainSection(todoapp.getIn('section.main'), action),
          'footer.footer': footer(todoapp.getIn('footer.footer'), action)
        },
        'footer.info': {
          props: {
            style: {
              display: 'none'
            }
          },
          'p': {
            '$text': 'Double-click to edit a todo'
          }
        }
      }
    }
  };


  switch (action.type) {
    case 'ADD_TODO':
      return addTodo(state, action.event);
    case 'TOGGLE_TODO':
      return toggleTodo(state, action.tag);
    case 'SHOW_EDIT_TODO':
      return showEditTodo(state, action.tag);
    case 'EDIT_TODO':
      return editTodo(state, action.tag);
    case 'CANCEL_EDIT_TODO':
      return cancelEditTodo(state, action.tag);
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
}, {logActions: true, localStorage: 'nuxTodoMVC'});

let store = todoMvc(todoMvcUi);


store.subscribe()