import {fromJS, Map, List, Iterable} from 'immutable';
import {selector} from './../../../lib/utils';
import {todoComponent} from './todo-mvc-todo-component';

const todoListPath = 'ui div#todoapp section.todoapp section.main ui.todo-list';
const todoInputPath = 'ui div#todoapp section.todoapp header.header input.new-todo';
const toggleAllPath = 'ui div#todoapp section.todoapp section.main input.toggle-all';
const mainPath = 'ui div#todoapp section.todoapp section.main';
const footerPath = 'ui div#todoapp section.todoapp footer.footer';

export function addTodo(state, event) {
  const title = state.$(todoInputPath).props('value'); //state.getIn(selector(todoInputPath));
  if (title) {
    const todos = state.$(todoListPath).children() //state.getIn(selector(todoListPath + ' children'));

    const tag = `li#todo-${todos.size}`;
    let newTodo = todoComponent(title.trim(), tag);
    const newTodos = todos.set(tag, newTodo);
    const sortedTodos = newTodos.sortBy((val, key) => {
                          return parseInt(key.split("#todo-")[1]);
                        }, (keyA, keyB) => {
                          return keyA < keyB ? 1 : -1;
                        });
    return setItemsLeft(state.$(todoInputPath).props('value', '')
                             .$(todoListPath).children(sortedTodos)
                             .$('ui div#todoapp section.todoapp section.main').style('display', null));
  } else {
    state.$(todoInputPath).props('value', '');
  }
  return state;
}

export function toggleTodo(state, tag) {
  const todoPath = `${todoListPath} ${tag}`;
  const checked = state.$(`${todoPath} div.view input.toggle`).props('checked');
  if (checked === undefined) {
    const newState = state.$(`${todoPath} div.view input.toggle`).props('checked', 'checked');
    return setItemsLeft(newState.$(todoPath).props('className', 'completed'));
  } else {
    const newState = state.$(`${todoPath} div.view input.toggle`).props('checked', null);
    return setItemsLeft(newState.$(todoPath).props('className', null));
  }
}

export function showEditTodo(state, tag) {
  const todoPath = `${todoListPath} ${tag}`;
  // need to come up with a better solution than this. There should be no dependency on the DOM
  setTimeout(() => {
    document.querySelector(`${tag} input.edit`).focus()
  },0);
  const currentTitle = state.$(`${todoPath} div.view label`).children('$text');
  return state.$(`${todoPath} input.edit`).props('value', currentTitle)
              .$(todoPath).props('className', state.$(todoPath).props('className') + ' editing');
}



export function editTodo(state, tag) {
  const todoPath = `${todoListPath} ${tag}`;
  const newTitle = state.$(`${todoPath} input.edit`).props('value');
  if (newTitle) {
    return cancelEditTodo(state, tag).$(`${todoPath} div.view label`).children('$text', newTitle);
  } else {
    return deleteTodo(state.$(todoPath).props('className', null), tag);
  }
  return state;
}

export function cancelEditTodo(state, tag) {
  let className = state.$(`${todoListPath} ${tag}`).props('className');
  return state.$(`${todoListPath} ${tag}`).props('className', className.replace(' editing', ''));
}

export function deleteTodo(state, tag) {
  return setItemsLeft(state.$(todoListPath).children(tag, null));
}

export function toggleAllTodos(state) {

  const checked = state.$(toggleAllPath).props('checked') === undefined ? 'checked' : null;
  const completed = checked && 'completed';
  const newState = state.$(toggleAllPath).props('checked', checked);
  const todos = newState.$(todoListPath).children().map((val, key) => {
    const todo = val.toNode(key);
    return todo.props('className', completed)
                .$(`${key} div.view input.toggle`)
                .props('checked', checked).get(key);
  });
  return setItemsLeft(newState.$(todoListPath).children(todos));
}

export function showTodos(state, view) {
  const filtersPath = 'ui div#todoapp section.todoapp footer.footer ul.filters';
  window.location = `#/${view}`;
  const todos = state.$(todoListPath).children().map((val, key) => {
    const todo = val.toNode(key);
    const checked = todo.$(`${key} div.view input.toggle`).props('checked');
    if (checked && view === 'active' || !checked && view === 'completed') {
      return todo.style('display', 'none').get(key);
    } else {
      return todo.style('display', null).get(key);
    }
  });
  const filters = state.$(filtersPath).children().map((val, key) => {
    const filter = val.toNode(key);
    return filter.$(`${key} a`).props('className', key.indexOf(view) !== -1 ? 'selected' : '').get(key);
  });
  return state.$(todoListPath).children(todos).$(filtersPath).children(filters);
}

export function clearCompletedTodos(state) {
  const activeTodos = getTodos(state, 'active');
  return setItemsLeft(state.$(todoListPath).children(activeTodos));
}

function setItemsLeft(state) {
  const toggleAllPath = 'ui div#todoapp section.todoapp section.main input.toggle-all';
  const todoCountPath = 'ui div#todoapp section.todoapp footer.footer span.todo-count';
  const activeCount = getTodos(state, 'active').size;
  return  state.$(`${todoCountPath} strong`).children('$text', activeCount)
               .$(`${todoCountPath} span`).children('$text', activeCount === 0 ? ' item left' : ' items left')
               .$(toggleAllPath).props('checked', activeCount === 0 ? 'checked' : null)
               .$(`${mainPath}`).style('display', getTodos(state).size > 0 ? null : 'none')
               .$(`${footerPath}`).style('display', getTodos(state).size > 0 ? null : 'none');
}

function getTodos(state, view = 'all') {
  return state.$(todoListPath).children()
              .filter((val, key) => {
                const todo = val.toNode(key);
                const checked = todo.children().$('div.view input.toggle').props('checked');
                return checked === undefined && view === 'active' || checked && view === 'completed' ||view === 'all';
              });
}
