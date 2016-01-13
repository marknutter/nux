import {todoComponent} from './todo-component';
import {selector} from './../../src/utils';
const todosPath = 'ui div#app div#todos div#todo-container'
const todoFormInputPath = 'ui div#app div#todos form#new-todo-form input';

export function submitTodo(state) {
  const todos = state.$(todosPath).children();
  const tag = `div#${todos.size}`;
  const title = state.$(todoFormInputPath).props('value');

  let newTodo = todoComponent(title, tag);
  const newTodos = todos.set(tag, newTodo);
  const sortedTodos = newTodos.sortBy((val, key) => {
                        return parseInt(key.split("#")[1]);
                      }, (keyA, keyB) => {
                        return keyA < keyB ? 1 : -1;
                      });
  return state.$(todoFormInputPath).props('value', '')
              .$(todosPath).children(sortedTodos);
}

export function toggleTodo(state, tag) {
  const todoPath = `${todosPath} ${tag}`;
  const checked = state.$(`${todoPath} input`).props('checked');
  if (checked === undefined) {
    const newState = state.$(`${todoPath} input`).props('checked', 'checked');
    return newState.$(`${todoPath} span.title`).style('textDecoration', 'line-through');
  } else {
    const newState = state.$(`${todoPath} input`).props('checked', null);
    return newState.$(`${todoPath} span.title`).style('textDecoration', null);
  }
}
