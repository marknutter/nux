import {fromJS, Map, List, Iterable} from 'immutable';
import {selector} from './../../../lib/utils';
import {todoComponent} from './todo-mvc-todo-component';

const todoListPath = 'div#todoapp section.todoapp section.main ui.todo-list';
const todoInputPath = 'div#todoapp section.todoapp header.header input.new-todo props value';
const toggleAllCheckedPath = 'div#todoapp section.todoapp section.main input.toggle-all props checked';

export function addTodo(state, event) {
  const title = state.getIn(selector(todoInputPath));
  if (title) {
    const todos = state.getIn(selector(todoListPath + ' children'));
    const tag = `li#todo-${todos.size}`;
    let newTodo = todoComponent(title.trim(), tag);
    const newTodos = todos.set(tag, newTodo);
    const sortedTodos = newTodos.sortBy((val, key) => {
                          return parseInt(key.split("#todo-")[1]);
                        }, (keyA, keyB) => {
                          return keyA < keyB ? 1 : -1;
                        });
    return setItemsLeft(state.setIn(selector(todoInputPath), '')
                             .setIn(selector(todoListPath + ' children'), sortedTodos)
                             .deleteIn(selector('div#todoapp section.todoapp section.main props style display')));
  } else {
    state.setIn(selector(todoInputPath), '');
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

export function showEditTodo(state, tag) {
  setTimeout(() => {
    document.querySelector(`${tag} input.edit`).focus()
  },0);
  const currentTitle = state.getIn(selector(`${todoListPath} ${tag} div.view label $text`));
  return state.setIn(selector(`${todoListPath} ${tag} input.edit props value`), currentTitle)
              .setIn(selector(`${todoListPath} ${tag} props className`), 'editing');
}



export function editTodo(state, tag) {
  const newTitle = state.getIn(selector(`${todoListPath} ${tag} input.edit props value`));
  if (newTitle) {
    return state.setIn(selector(`${todoListPath} ${tag} div.view label $text`), newTitle)
                .deleteIn(selector(`${todoListPath} ${tag} props className`));
  } else {
    return deleteTodo(state.deleteIn(selector(`${todoListPath} ${tag} props className`)), tag);
  }
  return state;
}

export function cancelEditTodo(state, tag) {
  return state.deleteIn(selector(`${todoListPath} ${tag} props className`));
}

export function deleteTodo(state, tag) {
  return setItemsLeft(state.deleteIn(selector(`${todoListPath} ${tag}`)));
}

export function toggleAllTodos(state) {

  const checked = state.getIn(selector(toggleAllCheckedPath));
  const newState = checked === undefined ? state.setIn(selector(toggleAllCheckedPath), 'checked') : state.deleteIn(selector(toggleAllCheckedPath));
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

export function showTodos(state, view) {
  window.location = `#/${view}`;
  const todos = state.getIn(selector(`${todoListPath} children`)).map((todo) => {
    const checkboxSelector = ['children'].concat(selector(`div.view input.toggle props checked`, false));
    if (todo.getIn(checkboxSelector) && view === 'active' ||
        !todo.getIn(checkboxSelector) && view === 'completed') {
      return todo.setIn(['props', 'style', 'display'], 'none');
    } else {
      return todo.deleteIn(['props', 'style', 'display']);
    }
  });
  const filters = state.getIn(selector(`div#todoapp section.todoapp footer.footer ul.filters children`)).map((filter, key) => {
    return filter.setIn(['children', 'a', 'props', 'className'], key.indexOf(view) !== -1 ? 'selected' : '');
  });
  return state.setIn(selector(`${todoListPath} children`), todos)
              .setIn(selector(`div#todoapp section.todoapp footer.footer ul.filters children`), filters);
}

export function clearCompletedTodos(state) {
  const activeTodos = getTodos(state, 'active');
  return setItemsLeft(state.setIn(selector(`${todoListPath} children`), activeTodos));
}

function setItemsLeft(state) {
  const todoCountPath = 'div#todoapp section.todoapp footer.footer span.todo-count';
  const activeCount = getTodos(state, 'active').size;
  const newState =  state.setIn(selector(`${todoCountPath} strong $text`), activeCount)
                         .setIn(selector(`${todoCountPath} span $text`), activeCount === 0 ? ' item left' : ' items left');
  const newState2 = activeCount === 0 ? newState.setIn(selector(toggleAllCheckedPath), 'checked') : newState.deleteIn(selector(toggleAllCheckedPath))
  return toggleMainAndFooter(newState2, getTodos(state).size > 0);
}

function getTodos(state, view = 'all') {
  return state.getIn(selector(`${todoListPath} children`))
              .filter((todo) => {
                const checked = todo.getIn(['children'].concat(selector(`div.view input.toggle props checked`, false)));
                return checked === undefined && view === 'active' || checked && view === 'completed' ||view === 'all';
              });
}


function toggleMainAndFooter(state, isVisible) {
  if (isVisible) {
    return state.deleteIn(selector('div#todoapp section.todoapp section.main props style display'))
                   .deleteIn(selector('div#todoapp section.todoapp footer.footer props style display'));
  } else {
    return state.setIn(selector('div#todoapp section.todoapp section.main props style display'), 'none')
                   .setIn(selector('div#todoapp section.todoapp footer.footer props style display'), 'none');
  }
}
