import {fromJS, Map, List, Iterable} from 'immutable';
import {selector} from './../../../lib/utils';
import {todoComponent} from './todo-mvc-todo-component';

const todoListPath = 'div#todoapp section.todoapp section.main ui.todo-list';
const todoInputPath = 'div#todoapp section.todoapp header.header input.new-todo props value';
const ENTER_KEY = 13;

export function addTodo(state, event) {
  if(event.keyCode === ENTER_KEY){
    const todos = state.getIn(selector(todoListPath + ' children'));
    const tag = `li#${todos.size}`;
    const title = state.getIn(selector(todoInputPath));

    let newTodo = todoComponent(title, tag);
    const newTodos = todos.set(tag, newTodo);
    const sortedTodos = newTodos.sortBy((val, key) => {
                          return parseInt(key.split("#")[1]);
                        }, (keyA, keyB) => {
                          return keyA < keyB ? 1 : -1;
                        });
    return setItemsLeft(state.setIn(selector(todoInputPath), '')
                             .setIn(selector(todoListPath + ' children'), sortedTodos)
                             .deleteIn(selector('div#todoapp section.todoapp section.main props style display')));
  }
  return state;
}

export function toggleTodo(state, tag) {
  const checked = state.getIn(selector(`${todoListPath} ${tag} div.view input.toggle props checked`));
  if (checked === undefined) {
    const newState = state.setIn(selector(`${todoListPath} ${tag} div.view input.toggle props checked`), 'checked');
    return setItemsLeft(newState.setIn(selector(`${todoListPath} ${tag} props className`), 'completed'));
  } else {
    const newState = state.deleteIn(selector(`${todoListPath} ${tag} div.view input.toggle props checked`));
    return setItemsLeft(newState.deleteIn(selector(`${todoListPath} ${tag} props className`)));
  }
}

export function toggleAllTodos(state) {
  const toggleAllCheckedSelector = selector('div#todoapp section.todoapp section.main input.toggle-all props checked');
  const checked = state.getIn(toggleAllCheckedSelector);
  const newState = checked === undefined ? state.setIn(toggleAllCheckedSelector, 'checked') : state.deleteIn(toggleAllCheckedSelector);
  const todos = newState.getIn(selector(`${todoListPath} children`)).map((todo) => {
    const checkboxSelector = ['children'].concat(selector(`div.view input.toggle props checked`, false));
    if (checked === undefined) {
      return todo.setIn(['props', 'className'], 'completed')
                 .setIn(checkboxSelector, 'checked');
    } else {
      return todo.deleteIn(['props', 'className'])
                 .deleteIn(checkboxSelector);
    }
  });
  return setItemsLeft(newState.setIn(selector(`${todoListPath} children`), todos));
}

function setItemsLeft(state) {
  const todoCountPath = 'div#todoapp section.todoapp footer.footer span.todo-count';
  const itemCount = state.getIn(selector(`${todoListPath} children`))
                         .filter((todo) => {
                           return todo.getIn(['children'].concat(selector(`div.view input.toggle props checked`, false))) === undefined;
                         }).size;
  return state.setIn(selector(`${todoCountPath} strong $text`), itemCount)
              .setIn(selector(`${todoCountPath} span $text`), itemCount === 0 ? ' item left' : ' items left');
}
