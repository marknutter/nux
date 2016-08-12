import {todoComponent} from './todo-mvc-todo-component';
import {fromJS, Map, List, Iterable} from 'immutable';
import todoList from './todo-list'

const mainSectionComponent = {
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
  'ui.todo-list': todoList
}


export default mainSection(state = mainSectionComponent, action) {
  switch (action.type) {
    case 'ADD_TODO': 
      return addTodo(state, action.title);
    case 'SET_TODO_LIST_VISIBILITY':
      return setTodoListVisibility(state, action.todoCount);
    default:
      return state;
  }
}





function setTodoListVisibility(state, todoCount) {
  const toggleAllPath = 'ui div#todoapp section.todoapp section.main input.toggle-all';
  const todoCountPath = 'ui div#todoapp section.todoapp footer.footer span.todo-count';
  const activeCount = getTodos(state, 'active').size;
  return  state.style('display', todoCount > 0 ? null : 'none');
}