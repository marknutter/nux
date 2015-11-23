import h from 'virtual-dom/h';
import {List, Map, fromJS, Seq, Iterable} from 'immutable';
import {todoFactory} from './todo-factories';

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

export function loadInitialUI(state, ui) {

  const ui = fromJS(ui, function (key, value) {
    var isIndexed = Iterable.isIndexed(value);
    return isIndexed ? value.toList() : value.toOrderedMap();
  });
  return state.set('ui', ui);
}

export function updateInputValue(state, val, pathArray) {
  return state.setIn(pathArray.concat(['props', 'value']), val);
}

