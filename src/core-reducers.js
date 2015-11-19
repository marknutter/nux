import h from 'virtual-dom/h';
import {initialUI} from './ui';
import {List, Map, fromJS, Seq} from 'immutable';
import ui from './ui';
import {todoFactory} from './factories';

const todosPathArray = ['ui', 'div#app', 'children', 'div#todos', 'children', 'div#todo-container', 'children'];

export function createTodo(state, title) {
  const todos = state.getIn(todosPathArray);
  const tag = `div#${todos.size}`;
  let newTodo = todoFactory(title, tag);
  const newTodos = todos.set(tag, newTodo);
  const sortedTodos = newTodos.sortBy((val, key) => {
                        return parseInt(key.split("#")[1]);
                      }, (keyA, keyB) => {
                        return keyA < keyB ? 1 : -1;
                      });
  return state.setIn(todosPathArray, sortedTodos);
}

export function toggleTodo(state, tag, checked) {
  if (checked) {
    return state.setIn(todosPathArray.concat([tag, 'children', 'input', 'props', 'checked']), 'checked');
  } else {
    return state.deleteIn(todosPathArray.concat([tag, 'children', 'input', 'props', 'checked']));
  }
}

export function loadInitialUI(state) {
  const ui = fromJS(initialUI());
  return state.set('ui', ui);
}
