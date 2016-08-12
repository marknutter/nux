import header from './components/header';
import mainSection from './components/main-section';
import footer from './components/footer';
import {init} from './../../../src/index';
import {todoMvcUi} from './todo-mvc-ui'


let todoMvc = init(combineReducers({
    'header.header': header
    'section.main': mainSection,
    'footer.footer': footer
  }), {logActions: true, localStorage: 'nuxTodoMVC'});

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