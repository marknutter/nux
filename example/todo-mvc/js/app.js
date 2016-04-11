import {addTodo, toggleTodo, toggleAllTodos, showTodos, clearCompletedTodos, deleteTodo, showEditTodo, editTodo, cancelEditTodo} from './todo-mvc-reducers';
import {init} from './../../../src/index';
import {todoMvcUi} from './todo-mvc-ui'


let todoMvc = init((state = todoMvcUi, action) => {
  const todoapp = state.getIn(['ui','div#todoapp','section.todoapp']);
  return state.setIn(['ui', 'div#todoapp', 'section.todoapp'], Map({
    'header.header': header(todoapp.getIn('header.header'), action))
    'section.main': mainSection(todoapp.getIn('section.main'), action),
    'footer.footer': footer(todoapp.getIn('footer.footer'), action)
  });
}, {logActions: true, localStorage: 'nuxTodoMVC'});

let store = todoMvc(todoMvcUi);


store.subscribeToChange('ui .div#todoapp section.todoapp section.main ui.todo-list', (todos) => {
  const activeTodos = todos.filter((val, key) => {
    return val.getIn([key, 'div.view', 'input.toggle', 'checked') === undefined;
  });
  store.dispatch({
    type: 'SET_ACTIVE_TODO_COUNT',
    activeTodos
  });
});