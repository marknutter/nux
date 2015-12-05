import {todoComponent} from './todo-component';
import {selector} from './../../lib/utils';

const todosPathArray = ['div#app div#todos div#todo-container children'];

export function submitTodo(state) {
  const todos = state.getIn(selector('div#app div#todos div#todo-container children'));
  const tag = `div#${todos.size}`;
  const title = state.getIn(selector('div#app div#todos form#new-todo-form input props value'));

  let newTodo = todoComponent(title, tag);
  const newTodos = todos.set(tag, newTodo);
  const sortedTodos = newTodos.sortBy((val, key) => {
                        return parseInt(key.split("#")[1]);
                      }, (keyA, keyB) => {
                        return keyA < keyB ? 1 : -1;
                      });
  return state.setIn(selector('div#app div#todos form#new-todo-form input props value'), '')
              .setIn(selector('div#app div#todos div#todo-container children'), sortedTodos);
}

export function toggleTodo(state, tag) {
  const checked = state.getIn(selector(`div#app div#todos div#todo-container ${tag} input props checked`));
  if (checked === undefined) {
    const newState = state.setIn(selector(`div#app div#todos div#todo-container ${tag} input props checked`), 'checked');
    return newState.setIn(selector(`div#app div#todos div#todo-container ${tag} span.title props style textDecoration`), 'line-through');
  } else {
    const newState = state.deleteIn(selector(`div#app div#todos div#todo-container ${tag} input props checked`));
    return newState.deleteIn(selector(`div#app div#todos div#todo-container ${tag} span.title props style textDecoration`));
  }
}
