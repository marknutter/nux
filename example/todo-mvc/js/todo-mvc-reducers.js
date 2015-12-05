import {selector} from './../../../lib/utils';
import {todoComponent} from './todo-mvc-todo-component';

const todoListSelector = 'div#todoapp section.todoapp section.main ui.todo-list';
const todoInputSelector = 'div#todoapp section.todoapp header.header input.new-todo props value';

export function addTodo(state, event) {
  if(event.keyCode == 13){
    const todos = state.getIn(selector(todoListSelector + ' children'));
    const tag = `li#${todos.size}`;
    const title = state.getIn(selector(todoInputSelector));

    let newTodo = todoComponent(title, tag);
    const newTodos = todos.set(tag, newTodo);
    const sortedTodos = newTodos.sortBy((val, key) => {
                          return parseInt(key.split("#")[1]);
                        }, (keyA, keyB) => {
                          return keyA < keyB ? 1 : -1;
                        });
    return state.setIn(selector(todoInputSelector), '')
                .setIn(selector(todoListSelector + ' children'), sortedTodos);
  }
  return state
}

export function toggleTodo(state, tag) {
  const checked = state.getIn(selector(`${todoListSelector} ${tag} div.view input.toggle props checked`));
  if (checked === undefined) {
    const newState = state.setIn(selector(`${todoListSelector} ${tag} div.view input.toggle props checked`), 'checked');
    return newState.setIn(selector(`${todoListSelector} ${tag} props className`), 'completed');
  } else {
    const newState = state.deleteIn(selector(`${todoListSelector} ${tag} div.view input.toggle props checked`));
    return newState.deleteIn(selector(`${todoListSelector} ${tag} props className`));
  }
}
