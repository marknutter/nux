import {todoComponent} from './todo-mvc-todo-component';

export const mainSectionComponent = {
  props: {
    style: {
      display: 'none'
    }
  },
  'input.toggle-all': {
    props: {
      type: 'checkbox',
      events: {
        'ev-change': {
          dispatch: {
            type: 'TOGGLE_ALL_TODOS'
          }
        }
      }
    }
  },
  'label': {
    props: {
      htmlFor: 'toggle-all'
    },
    '$text': 'Mark all as complete'
  },
  'ui.todo-list': {

  }
}


export function addTodo(state, title) {
  if (title) {
    const todos = state.get('ui.todo-list') //state.getIn(selector(todoListPath + ' children'));

    const tag = `li#todo-${todos.size}`;
    const newTodo = todoComponent(title.trim(), tag);
    const newTodos = todos.set(tag, newTodo);
    const sortedTodos = newTodos.sortBy((val, key) => {
                          return parseInt(key.split("#todo-")[1]);
                        }, (keyA, keyB) => {
                          return keyA < keyB ? 1 : -1;
                        });
    return state.style('display', null);
  } else {
    state.$(todoInputPath).props('value', '');
  }
  return state;
}


function setTodoListVisibility(state, todoCount) {
  const toggleAllPath = 'ui div#todoapp section.todoapp section.main input.toggle-all';
  const todoCountPath = 'ui div#todoapp section.todoapp footer.footer span.todo-count';
  const activeCount = getTodos(state, 'active').size;
  return  state.style('display', todoCount > 0 ? null : 'none');
}