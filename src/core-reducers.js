import h from 'virtual-dom/h';
import {initialUI} from './ui';
import {List, Map, fromJS, Seq} from 'immutable';
import ui from './ui';
import {todoFactory} from './factories';

const todosPathArray = ['ui', 'div#app', 'children', 'div#todos', 'children', 'div#todo-container', 'children'];

export function submitTodo(state) {
  const todos = state.getIn(todosPathArray);
  const tag = `div#${todos.size}`;

  const titleInputPathArray = ['ui', 'div#app', 'children', 'div#todos', 'children', 'form#new-todo-form', 'children', 'input']
  const title = state.getIn(titleInputPathArray.concat(['props', 'value']));

  let newTodo = todoFactory(title, tag);
  const newTodos = todos.set(tag, newTodo);
  const sortedTodos = newTodos.sortBy((val, key) => {
                        return parseInt(key.split("#")[1]);
                      }, (keyA, keyB) => {
                        return keyA < keyB ? 1 : -1;
                      });
  return updateInputValue(state, '', titleInputPathArray).setIn(todosPathArray, sortedTodos);
}

export function toggleTodo(state, tag) {
  const checked = state.getIn(todosPathArray.concat([tag, 'children', 'input', 'props', 'checked']));
  if (checked === undefined) {
    const newState = state.setIn(todosPathArray.concat([tag, 'children', 'input', 'props', 'checked']), 'checked');
    return newState.setIn(todosPathArray.concat([tag, 'children', 'span.title', 'props', 'style', 'textDecoration']), 'line-through');
  } else {
    const newState = state.deleteIn(todosPathArray.concat([tag, 'children', 'input', 'props', 'checked']));
    return newState.deleteIn(todosPathArray.concat([tag, 'children', 'span.title', 'props', 'style', 'textDecoration']));
  }
}

export function loadInitialUI(state) {
  const ui = fromJS(initialUI());
  return state.set('ui', ui);
}

export function updateInputValue(state, val, pathArray) {
  return state.setIn(pathArray.concat(['props', 'value']), val);
}

// (e) => {
//   e.preventDefault();
//   const title = e.target.querySelector('input').value;
//   e.target.querySelector('input').value = '';
//   getStore().dispatch({
//     type: 'CREATE_TODO',
//     title: title
//   });
// }
